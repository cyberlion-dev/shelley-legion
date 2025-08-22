import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'master';

export interface GitHubFile {
  name: string;
  path: string;
  content: any;
  sha?: string;
}

export class GitHubDataManager {
  async getFile(path: string): Promise<GitHubFile | null> {
    try {
      // Try to get the latest commit SHA for this file to bypass cache
      let latestSha;
      try {
        const commits = await octokit.rest.repos.listCommits({
          owner,
          repo,
          path,
          per_page: 1,
        });
        latestSha = commits.data[0]?.sha;
      } catch (e) {
        // Fallback to branch ref if commit lookup fails
      }

      const response = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: latestSha || branch,
        headers: {
          'If-None-Match': '',
          'Cache-Control': 'no-cache',
        },
      });

      if ('content' in response.data) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        const parsedContent = JSON.parse(content);

        return {
          name: response.data.name,
          path: response.data.path,
          content: parsedContent,
          sha: response.data.sha,
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching file ${path}:`, error);
      return null;
    }
  }

  async updateFile(path: string, content: any, message: string, sha?: string): Promise<boolean> {
    try {
      const contentString = JSON.stringify(content, null, 2);
      const encodedContent = Buffer.from(contentString).toString('base64');

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: encodedContent,
        branch,
        sha,
      });

      return true;
    } catch (error) {
      console.error(`Error updating file ${path}:`, error);
      return false;
    }
  }

  async listDataFiles(): Promise<string[]> {
    try {
      const response = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: 'shelley-legion/data',
        ref: branch,
      });

      if (Array.isArray(response.data)) {
        return response.data
          .filter(file => file.type === 'file' && file.name.endsWith('.json'))
          .map(file => file.name);
      }
      return [];
    } catch (error) {
      console.error('Error listing data files:', error);
      return [];
    }
  }
}

export const githubManager = new GitHubDataManager();