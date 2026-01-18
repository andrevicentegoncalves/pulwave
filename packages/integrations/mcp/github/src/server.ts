/**
 * Pulwave GitHub MCP Server
 *
 * MCP server for interacting with GitHub repositories.
 */

import { BaseMcpServer } from '@pulwave/mcp-core';
import { GitHubProvider, type GitHubConfig } from './provider';
import {
    createRepositoryTools,
    createPullRequestTools,
    createIssueTools,
    createFileTools,
} from './tools';

/**
 * Pulwave GitHub MCP Server
 */
export class PulwaveGitHubMcpServer extends BaseMcpServer {
    private githubProvider: GitHubProvider;

    constructor(config: GitHubConfig) {
        super({
            name: 'pulwave-github',
            version: '0.0.1',
            description: 'MCP server for GitHub operations',
        });

        this.githubProvider = new GitHubProvider(config);
        this.setProvider(this.githubProvider);
    }

    protected registerTools(): void {
        // Repository tools
        for (const tool of createRepositoryTools(this.githubProvider)) {
            this.registerTool(tool);
        }

        // Pull request tools
        for (const tool of createPullRequestTools(this.githubProvider)) {
            this.registerTool(tool);
        }

        // Issue tools
        for (const tool of createIssueTools(this.githubProvider)) {
            this.registerTool(tool);
        }

        // File tools
        for (const tool of createFileTools(this.githubProvider)) {
            this.registerTool(tool);
        }
    }

    /**
     * Get the GitHub provider for direct access
     */
    getProvider(): GitHubProvider {
        return this.githubProvider;
    }
}

/**
 * Create and configure the server
 */
export function createServer(config?: Partial<GitHubConfig>): PulwaveGitHubMcpServer {
    const finalConfig: GitHubConfig = {
        token: config?.token ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '',
        defaultOwner: config?.defaultOwner ?? process.env.GITHUB_OWNER,
        defaultRepo: config?.defaultRepo ?? process.env.GITHUB_REPO,
    };

    if (!finalConfig.token) {
        throw new Error(
            'GitHub token required. Set GITHUB_TOKEN or GH_TOKEN environment variable.'
        );
    }

    return new PulwaveGitHubMcpServer(finalConfig);
}
