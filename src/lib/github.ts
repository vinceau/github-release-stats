import {graphql} from "@octokit/graphql";

const graphqlWithAuth = graphql.defaults({
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  }
});

export interface Release {
  id: string;
  name: string;
  createdAt: string;
  url: string;
  releaseAssets: {
    nodes: Array<{
      id: string;
      name: string;
      downloadCount: number;
    }>;
  }
}

export interface AssetResponse {
  repository: {
    id: string;
    releases: {
      nodes: Array<Release>;
    }
  }
}

export const fetchReleases = async (owner: string, repo: string): Promise<Release[]> => {
  const resp = await graphqlWithAuth(`
    query ($owner: String!, $repo: String!) {
        repository(owner:$owner, name:$repo) {
          id
          releases(last: 10) {
            nodes {
              id
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
  if (!resp) {
    throw new Error("Failed to fetch data from Github");
  }
  return (resp as AssetResponse).repository.releases.nodes;
}
