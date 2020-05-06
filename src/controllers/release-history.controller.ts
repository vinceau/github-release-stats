// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {param, post} from '@loopback/rest';
import {fetchReleases} from '../lib/github';

export class ReleaseHistoryController {
  constructor() {}
  @post('/releases/{owner}/{repo}')
  async getReleases(
    @param.path.string('owner') owner: string,
    @param.path.string('repo') repo: string,
  ) {
    const releases = await fetchReleases(owner, repo);
    console.log(releases);
    return {
      hello: "world",
      owner,
      repo,
      releases,
    };
  }
}
