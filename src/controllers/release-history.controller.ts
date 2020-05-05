// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {param, post} from '@loopback/rest';
import {graphql} from "@octokit/graphql";

const graphqlWithAuth = graphql.defaults({
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  }
});

export class ReleaseHistoryController {
  constructor() {}
  @post('/releases/{owner}/{repo}')
  async getReleases(
    @param.path.string('owner') owner: string,
    @param.path.string('repo') repo: string,
  ) {

    const resp: any = await graphqlWithAuth(`
    query ($owner: String!, $repo: String!) {
        repository(owner:$owner, name:$repo) {
          id
          releases(last: 10) {
            nodes {
              name
              createdAt
              url
              releaseAssets(last: 100) {
                nodes {
                  id
                  name
                  downloadCount
                }
              }
            }
          }
        }
      }
    `, {
      owner,
      repo,
    });

    // const x = await octokit.repos.listReleases({
    //   owner,
    //   repo,
    // });
    console.log(resp);
    return {
      hello: "world",
      owner,
      repo,
      releases: resp.repository,
    };
  }
}
