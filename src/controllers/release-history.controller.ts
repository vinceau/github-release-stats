// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {repository} from '@loopback/repository';
import {get, param, post} from '@loopback/rest';
import {fetchReleases, Release} from '../lib/github';
import {DownloadCount} from '../models';
import {DownloadCountRepository} from '../repositories';

export class ReleaseHistoryController {
  constructor(
    @repository(DownloadCountRepository)
    public downloadCountRepository: DownloadCountRepository,
  ) {}

  @get('/downloads/{owner}/{repo}')
  async getDownloadCounts(
    @param.path.string('owner') owner: string,
    @param.path.string('repo') repo: string,
  ) {
    const newReleases: Release[] = [];
    const releases = await fetchReleases(owner, repo);
    for (const release of releases) {
      const newAssets: Array<{
        id: string;
        name: string;
        downloadCount: number;
        downloadCounts: Array<DownloadCount>;
      }> = [];
      for (const asset of release.releaseAssets.nodes) {
        // Fetch the download history of the asset
        const downloadCounts = await this.downloadCountRepository.find({
          where: {
            and: [{releaseId: release.id}, {assetId: asset.id}],
          },
          order: ['tstz ASC'],
          fields: {downloads: true, tstz: true},
        });

        newAssets.push({
          ...asset,
          downloadCounts,
        });
      }
      const newRelease = {
        ...release,
      };
      newRelease.releaseAssets.nodes = newAssets;
      newReleases.push(newRelease);
    }
    return newReleases;
  }

  @post('/releases/{owner}/{repo}')
  async getReleases(
    @param.path.string('owner') owner: string,
    @param.path.string('repo') repo: string,
  ) {
    const releases = await fetchReleases(owner, repo);
    for (const release of releases) {
      const releaseId = release.id;
      for (const asset of release.releaseAssets.nodes) {
        await this.updateDownloadCount(
          releaseId,
          asset.id,
          asset.downloadCount,
        );
      }
    }
    return {
      hello: 'world',
      owner,
      repo,
      releases,
    };
  }

  /**
   * Updates the database with the new download count, or patches the most
   * latest download count with the latest timestamp if unchanged.
   *
   * @private
   * @param {string} releaseId
   * @param {string} assetId
   * @param {number} newDownloads
   * @memberof ReleaseHistoryController
   */
  private async updateDownloadCount(
    releaseId: string,
    assetId: string,
    newDownloads: number,
  ) {
    // New updated timestamp
    const tstz = new Date();
    // Fetch the download history of the asset
    const downloadCounts = await this.downloadCountRepository.find({
      where: {
        and: [{releaseId}, {assetId}],
      },
      order: ['tstz DESC'],
      limit: 2,
    });
    if (downloadCounts.length === 2) {
      // we have at least download records
      const latestDownload = downloadCounts[0];
      const secondLatestDownload = downloadCounts[1];
      if (
        newDownloads === latestDownload.downloads &&
        latestDownload.downloads === secondLatestDownload.downloads
      ) {
        // We want to patch the latest download count to simply be the latest date
        return this.downloadCountRepository.updateById(latestDownload.id, {
          ...latestDownload,
          tstz,
        });
      }
    }

    const count = new DownloadCount({
      assetId,
      releaseId,
      downloads: newDownloads,
      tstz,
    });
    return this.downloadCountRepository.create(count);
  }
}
