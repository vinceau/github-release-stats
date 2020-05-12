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

  @get('/asset/{releaseId}/{assetId}')
  async getAssetDownloadCounts(
    @param.path.string('releaseId') releaseId: string,
    @param.path.string('assetId') assetId: string,
  ) {
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
      if (latestDownload.downloads === secondLatestDownload.downloads) {
        // We want to patch the latest download count to simply be the latest date
        await this.downloadCountRepository.updateById(latestDownload.id, {
          ...latestDownload,
          tstz: new Date(),
        });
      }
    }
    console.log(downloadCounts);
    return downloadCounts;
  }

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
    const allDownloads: DownloadCount[] = [];

    const tstz = new Date(); //.toISOString();
    const releases = await fetchReleases(owner, repo);
    releases.forEach(release => {
      const releaseId = release.id;
      const downloads = release.releaseAssets.nodes.map(asset => {
        return new DownloadCount({
          assetId: asset.id,
          releaseId,
          downloads: asset.downloadCount,
          tstz: tstz,
        });
      });
      // Add them to the list
      allDownloads.push(...downloads);
    });
    // this.downloadCountRepository.findAll();
    await this.downloadCountRepository.createAll(allDownloads);

    return {
      hello: 'world',
      owner,
      repo,
      releases,
    };
  }
}
