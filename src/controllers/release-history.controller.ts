// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import { repository } from "@loopback/repository";
import { param, post } from "@loopback/rest";
import { fetchReleases, Release } from "../lib/github";
import { secondsElapsed } from "../lib/utils";
import { DownloadCount } from "../models";
import { DownloadCountRepository } from "../repositories";

const MAX_FETCH_LIMIT = 10;

export class ReleaseHistoryController {
  constructor(
    @repository(DownloadCountRepository)
    public downloadCountRepository: DownloadCountRepository
  ) {}

  @post("/releases/{owner}/{repo}")
  async getReleases(
    @param.path.string("owner") owner: string,
    @param.path.string("repo") repo: string,
    @param.query.integer("limit") limit: number
  ) {
    const before = new Date();
    const parsedLimit = limit ? Math.min(limit, MAX_FETCH_LIMIT) : undefined;
    console.log(`Got this limit: ${limit} and this parsed limit: ${parsedLimit}`);
    const releases = await fetchReleases(owner, repo, parsedLimit);
    console.log(`[${owner}/${repo}]: fetched Github releases in ${secondsElapsed(before)} seconds`);
    const after = new Date();
    const newReleases = await Promise.all(releases.map(async (release) => this.withDownloadCounts(release)));
    console.log(`[${owner}/${repo}]: updated download counts in ${secondsElapsed(after)} seconds`);
    return newReleases;
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
  private async fetchAndUpdateDownloadCounts(
    releaseId: string,
    assetId: string,
    newDownloads: number
  ): Promise<DownloadCount[]> {
    // New updated timestamp
    const tstz = new Date();
    // Fetch the download history of the asset
    const allDownloadCounts = await this.downloadCountRepository.find({
      where: {
        and: [{ releaseId }, { assetId }],
      },
      order: ["tstz ASC"],
    });
    const numCounts = allDownloadCounts.length;
    if (numCounts >= 2) {
      // We have at least two download records
      const latestDownload = allDownloadCounts[numCounts - 1];
      const secondLatestDownload = allDownloadCounts[numCounts - 2];
      if (newDownloads === latestDownload.downloads && latestDownload.downloads === secondLatestDownload.downloads) {
        // We want to patch the latest download count to simply be the latest date
        await this.downloadCountRepository.updateById(latestDownload.id, {
          ...latestDownload,
          tstz,
        });

        // Patch the latest timestamp before returning
        latestDownload.tstz = tstz;
        return allDownloadCounts;
      }
    }

    const count = new DownloadCount({
      assetId,
      releaseId,
      downloads: newDownloads,
      tstz,
    });
    await this.downloadCountRepository.create(count);
    allDownloadCounts.push(count);
    return allDownloadCounts;
  }

  /**
   * Updates a release's assets with the download history.
   *
   * @private
   * @param {Release} release The Github release object
   * @returns {Promise<Release>}
   * @memberof ReleaseHistoryController
   */
  private async withDownloadCounts(release: Release): Promise<Release> {
    // Generate the promises that will resolve to the new nodes
    const newNodes = release.releaseAssets.nodes.map(async (asset) => {
      // Fetch the existing download counts
      const downloadCountHistory = await this.fetchAndUpdateDownloadCounts(release.id, asset.id, asset.downloadCount);

      // Prepend the initial creation date with zero download count
      downloadCountHistory.unshift(
        new DownloadCount({
          assetId: asset.id,
          releaseId: release.id,
          downloads: 0,
          tstz: new Date(release.createdAt),
        })
      );

      // Patch the asset object with the download counts
      return {
        ...asset,
        downloadCountHistory,
      };
    });
    // Actually wait for the promises to resolve
    const nodes = await Promise.all(newNodes);
    return {
      ...release,
      releaseAssets: {
        ...release.releaseAssets,
        nodes,
      },
    };
  }
}
