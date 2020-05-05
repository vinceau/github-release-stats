// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {param, post} from '@loopback/rest';
import {Octokit} from "@octokit/rest";


const octokit = new Octokit();

export class ReleaseHistoryController {
  constructor() {}
  @post('/releases/{owner}/{repo}')
  async getReleases(
    @param.path.string('owner') owner: string,
    @param.path.string('repo') repo: string,
  ) {
    const x = await octokit.repos.listReleases({
      owner,
      repo,
    });
    console.log(x);
    return {
      hello: "world",
      owner,
      repo,
      releases: x,
    };
  }
}
