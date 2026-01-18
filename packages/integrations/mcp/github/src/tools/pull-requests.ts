/**
 * Pull Request Tools
 *
 * Tools for querying GitHub pull requests.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { GitHubProvider } from '../provider';

export function createPullRequestTools(provider: GitHubProvider) {
    const listPullRequests = defineReadOnlyTool({
        name: 'list_pull_requests',
        description: 'List pull requests in a repository with optional filtering.',
        inputSchema: z.object({
            state: z.enum(['open', 'closed', 'all']).default('open'),
            head: z.string().optional().describe('Filter by head branch (format: user:ref-name)'),
            base: z.string().optional().describe('Filter by base branch'),
            sort: z.enum(['created', 'updated', 'popularity', 'long-running']).default('created'),
            direction: z.enum(['asc', 'desc']).default('desc'),
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(30),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ state, head, base, sort, direction, page, pageSize, owner, repo }) => {
            const prs = await provider.listPullRequests(
                { state, head, base, sort, direction, perPage: pageSize, page },
                owner,
                repo
            );

            return {
                items: prs,
                page,
                pageSize,
            };
        },
    });

    const getPullRequest = defineReadOnlyTool({
        name: 'get_pull_request',
        description: 'Get detailed information about a specific pull request.',
        inputSchema: z.object({
            number: z.number().int().describe('Pull request number'),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ number, owner, repo }) => {
            return provider.getPullRequest(number, owner, repo);
        },
    });

    const getPullRequestDiff = defineReadOnlyTool({
        name: 'get_pull_request_diff',
        description: 'Get the diff/changes for a pull request.',
        inputSchema: z.object({
            number: z.number().int().describe('Pull request number'),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ number, owner, repo }) => {
            const client = provider.getClient();
            const { owner: o, repo: r } = owner && repo
                ? { owner, repo }
                : { owner: owner ?? '', repo: repo ?? '' };

            const { data } = await client.pulls.get({
                owner: o,
                repo: r,
                pull_number: number,
                mediaType: { format: 'diff' },
            });

            return {
                number,
                diff: data as unknown as string,
            };
        },
    });

    const listPullRequestFiles = defineReadOnlyTool({
        name: 'list_pull_request_files',
        description: 'List files changed in a pull request.',
        inputSchema: z.object({
            number: z.number().int().describe('Pull request number'),
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(30),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ number, page, pageSize, owner, repo }) => {
            const client = provider.getClient();
            const o = owner ?? '';
            const r = repo ?? '';

            const { data } = await client.pulls.listFiles({
                owner: o,
                repo: r,
                pull_number: number,
                per_page: pageSize,
                page,
            });

            return {
                items: data.map((file) => ({
                    filename: file.filename,
                    status: file.status,
                    additions: file.additions,
                    deletions: file.deletions,
                    changes: file.changes,
                    patch: file.patch,
                })),
                page,
                pageSize,
            };
        },
    });

    const listPullRequestReviews = defineReadOnlyTool({
        name: 'list_pull_request_reviews',
        description: 'List reviews on a pull request.',
        inputSchema: z.object({
            number: z.number().int().describe('Pull request number'),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ number, owner, repo }) => {
            const client = provider.getClient();
            const o = owner ?? '';
            const r = repo ?? '';

            const { data } = await client.pulls.listReviews({
                owner: o,
                repo: r,
                pull_number: number,
            });

            return data.map((review) => ({
                id: review.id,
                user: review.user?.login ?? 'Unknown',
                state: review.state,
                body: review.body,
                submittedAt: review.submitted_at,
            }));
        },
    });

    return [
        listPullRequests,
        getPullRequest,
        getPullRequestDiff,
        listPullRequestFiles,
        listPullRequestReviews,
    ];
}
