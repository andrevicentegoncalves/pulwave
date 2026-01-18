/**
 * Issue Tools
 *
 * Tools for querying GitHub issues.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { GitHubProvider } from '../provider';

export function createIssueTools(provider: GitHubProvider) {
    const listIssues = defineReadOnlyTool({
        name: 'list_issues',
        description: 'List issues in a repository with optional filtering. Excludes pull requests.',
        inputSchema: z.object({
            state: z.enum(['open', 'closed', 'all']).default('open'),
            labels: z.string().optional().describe('Comma-separated list of label names'),
            assignee: z.string().optional().describe('Filter by assignee username, or "none" for unassigned'),
            sort: z.enum(['created', 'updated', 'comments']).default('created'),
            direction: z.enum(['asc', 'desc']).default('desc'),
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(30),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ state, labels, assignee, sort, direction, page, pageSize, owner, repo }) => {
            const issues = await provider.listIssues(
                { state, labels, assignee, sort, direction, perPage: pageSize, page },
                owner,
                repo
            );

            return {
                items: issues,
                page,
                pageSize,
            };
        },
    });

    const getIssue = defineReadOnlyTool({
        name: 'get_issue',
        description: 'Get detailed information about a specific issue.',
        inputSchema: z.object({
            number: z.number().int().describe('Issue number'),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ number, owner, repo }) => {
            return provider.getIssue(number, owner, repo);
        },
    });

    const listIssueComments = defineReadOnlyTool({
        name: 'list_issue_comments',
        description: 'List comments on an issue.',
        inputSchema: z.object({
            number: z.number().int().describe('Issue number'),
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(30),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ number, page, pageSize, owner, repo }) => {
            const client = provider.getClient();
            const o = owner ?? '';
            const r = repo ?? '';

            const { data } = await client.issues.listComments({
                owner: o,
                repo: r,
                issue_number: number,
                per_page: pageSize,
                page,
            });

            return {
                items: data.map((comment) => ({
                    id: comment.id,
                    user: comment.user?.login ?? 'Unknown',
                    body: comment.body,
                    createdAt: comment.created_at,
                    updatedAt: comment.updated_at,
                })),
                page,
                pageSize,
            };
        },
    });

    const searchIssues = defineReadOnlyTool({
        name: 'search_issues',
        description: 'Search issues and pull requests using GitHub search syntax.',
        inputSchema: z.object({
            query: z.string().describe('Search query (GitHub search syntax)'),
            sort: z.enum(['comments', 'reactions', 'reactions-+1', 'reactions--1', 'reactions-smile', 'reactions-thinking_face', 'reactions-heart', 'reactions-tada', 'interactions', 'created', 'updated']).optional(),
            order: z.enum(['asc', 'desc']).default('desc'),
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(30),
        }),
        handler: async ({ query, sort, order, page, pageSize }) => {
            const client = provider.getClient();

            const { data } = await client.search.issuesAndPullRequests({
                q: query,
                sort,
                order,
                per_page: pageSize,
                page,
            });

            return {
                totalCount: data.total_count,
                items: data.items.map((item) => ({
                    number: item.number,
                    title: item.title,
                    state: item.state,
                    isPullRequest: !!item.pull_request,
                    author: item.user?.login ?? 'Unknown',
                    createdAt: item.created_at,
                    labels: item.labels.map((l) => (typeof l === 'string' ? l : l.name ?? '')),
                    url: item.html_url,
                    repository: item.repository_url.split('/').slice(-2).join('/'),
                })),
                page,
                pageSize,
            };
        },
    });

    return [listIssues, getIssue, listIssueComments, searchIssues];
}
