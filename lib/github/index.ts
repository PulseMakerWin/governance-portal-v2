/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { Octokit } from '@octokit/core';
import { GraphQlQueryResponseData } from '@octokit/graphql';
import { config } from 'lib/config';
import { RepositoryInfo } from 'modules/delegates/api/getDelegatesRepositoryInfo';

// Handle errors of configuration by disabling oktokit

const token1 = config.GITHUB_TOKEN;
const token2 = config.GITHUB_TOKEN_2 ? config.GITHUB_TOKEN_2 : config.GITHUB_TOKEN;
const token3 = config.GITHUB_TOKEN_3 ? config.GITHUB_TOKEN_3 : config.GITHUB_TOKEN;

let kitIndex = 0;

const octokits: Octokit[] = [
  new Octokit({ auth: token1 }),
  new Octokit({ auth: token2 }),
  new Octokit({ auth: token3 }),
];

// Function to get the next token and handle rate limits
const getNextToken = async () => {
  for (let i = 0; i < octokits.length; i++) {
    const octokit = octokits[kitIndex];
    try {
      const response = await octokit.request('GET /rate_limit');
      const remaining = response.data.rate.limit - response.data.rate.used;
      const resetTime = response.data.rate.reset;

      if (remaining > 0) {
        return octokit;
      } else {
        console.warn(
          `Token ${kitIndex + 1} rate limit exceeded, switching to the next token. Reset at ${new Date(resetTime * 1000)}`
        );
        kitIndex = (kitIndex + 1) % octokits.length;
      }
    } catch (error) {
      console.error(`Error fetching rate limit for token ${kitIndex + 1}:`, error);
    }
  }
  throw new Error('All tokens have exceeded their rate limits');
};

export async function fetchGitHubPage(owner: string, repo: string, path: string): Promise<GithubPage[]> {
  const octokit = getNextToken();
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    mediaType: {
      format: 'raw'
    },
    owner,
    repo,
    path
  });

  return data as GithubPage[];
}

export async function fetchGithubGraphQL(
  { owner, repo, page }: RepositoryInfo,
  query: string
): Promise<GraphQlQueryResponseData> {
  const octokit = await getNextToken();
  const data = await octokit.graphql(query, { owner, name: repo, expression: `master:${page}` });

  return data as GraphQlQueryResponseData;
}
