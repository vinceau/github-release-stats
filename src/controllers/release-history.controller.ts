// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {param, post} from '@loopback/rest';
import {fetchAssets} from '../lib/github';

export class ReleaseHistoryController {
  constructor() {}
  @post('/releases/{owner}/{repo}')
  async getReleases(
    @param.path.string('owner') owner: string,
    @param.path.string('repo') repo: string,
  ) {
    const resp = await fetchAssets(owner, repo);
    console.log(resp);
    return {
      hello: "world",
      owner,
      repo,
      releases: resp,
    };
  }
}
