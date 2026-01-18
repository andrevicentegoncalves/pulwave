/**
 * Repository Tools
 *
 * Tools for querying GitHub repositories.
 */

import { z, defineReadOnlyTool, paginatedResult } from '@pulwave/mcp-core';
import type { GitHubProvider } from '../provider';

export function createRepositoryTools(provider: GitHubProvider) {
    const listRepositories = defineReadOnlyTool({
        name: 'list_repositories',
        description: 'List GitHub repositories for the authenticated user. Returns repository info including stars, forks, and language.',
        inputSchema: z.object({
            type: z.enum(['all', 'owner', 'public', 'private', 'member']).default('all'),
            sort: z.enum(['created', 'updated', 'pushed', 'full_name']).default('updated'),
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(30),
        }),
        handler: async ({ type, sort, page, pageSize }) => {
            const repos = await provider.listRepositories({
                type,
                sort,
                perPage: pageSize,
                page,
            });

            return {
                items: repos,
                page,
                pageSize,
                total: repos.length, // GitHub doesn't return total count easily
            };
        },
    });

    const getRepository = defineReadOnlyTool({
        name: 'get_repository',
        description: 'Get detailed information about a specific repository.',
        inputSchema: z.object({
            owner: z.string().optional().describe('Repository owner (uses default if not provided)'),
            repo: z.string().optional().describe('Repository name (uses default if not provided)'),
        }),
        handler: async ({ owner, repo }) => {
            return provider.getRepository(owner, repo);
        },
    });

    const listBranches = defineReadOnlyTool({
        name: 'list_branches',
        description: 'List branches in a repository.',
        inputSchema: z.object({
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ owner, repo }) => {
            return provider.listBranches(owner, repo);
        },
    });

    const getBranch = defineReadOnlyTool({
        name: 'get_branch',
        description: 'Get information about a specific branch.',
        inputSchema: z.object({
            branch: z.string().describe('Branch name'),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ branch, owner, repo }) => {
            return provider.getBranch(branch, owner, repo);
        },
    });

    const listCommits = defineReadOnlyTool({
        name: 'list_commits',
        description: 'List commits in a repository. Can filter by branch, path, author, or date range.',
        inputSchema: z.object({
            sha: z.string().optional().describe('SHA or branch to start listing commits from'),
            path: z.string().optional().describe('Only commits containing this file path'),
            author: z.string().optional().describe('GitHub username or email'),
            since: z.string().optional().describe('ISO 8601 date string'),
            until: z.string().optional().describe('ISO 8601 date string'),
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(30),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ sha, path, author, since, until, page, pageSize, owner, repo }) => {
            const commits = await provider.listCommits(
                { sha, path, author, since, until, perPage: pageSize, page },
                owner,
                repo
            );

            return {
                items: commits,
                page,
                pageSize,
            };
        },
    });

    return [listRepositories, getRepository, listBranches, getBranch, listCommits];
}
