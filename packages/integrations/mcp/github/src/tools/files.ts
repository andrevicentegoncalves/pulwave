/**
 * File Tools
 *
 * Tools for querying GitHub repository files and content.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { GitHubProvider } from '../provider';

export function createFileTools(provider: GitHubProvider) {
    const getFileContent = defineReadOnlyTool({
        name: 'get_file_content',
        description: 'Get the content of a file from a repository.',
        inputSchema: z.object({
            path: z.string().describe('File path within the repository'),
            ref: z.string().optional().describe('Branch, tag, or commit SHA'),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ path, ref, owner, repo }) => {
            return provider.getFileContent(path, { ref }, owner, repo);
        },
    });

    const listFiles = defineReadOnlyTool({
        name: 'list_directory',
        description: 'List files and directories in a repository path.',
        inputSchema: z.object({
            path: z.string().default('').describe('Directory path (empty for root)'),
            ref: z.string().optional().describe('Branch, tag, or commit SHA'),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ path, ref, owner, repo }) => {
            return provider.listFiles(path, { ref }, owner, repo);
        },
    });

    const searchCode = defineReadOnlyTool({
        name: 'search_code',
        description: 'Search for code within a repository.',
        inputSchema: z.object({
            query: z.string().describe('Search query'),
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(30),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ query, page, pageSize, owner, repo }) => {
            const results = await provider.searchCode(
                query,
                { perPage: pageSize, page },
                owner,
                repo
            );

            return {
                items: results,
                page,
                pageSize,
            };
        },
    });

    const getTree = defineReadOnlyTool({
        name: 'get_tree',
        description: 'Get the entire file tree for a repository at a specific ref.',
        inputSchema: z.object({
            treeSha: z.string().describe('SHA of the tree (use branch name or commit SHA)'),
            recursive: z.boolean().default(true).describe('Get tree recursively'),
            owner: z.string().optional(),
            repo: z.string().optional(),
        }),
        handler: async ({ treeSha, recursive, owner, repo }) => {
            const client = provider.getClient();
            const o = owner ?? '';
            const r = repo ?? '';

            const { data } = await client.git.getTree({
                owner: o,
                repo: r,
                tree_sha: treeSha,
                recursive: recursive ? 'true' : undefined,
            });

            return {
                sha: data.sha,
                truncated: data.truncated,
                tree: data.tree.map((item) => ({
                    path: item.path,
                    mode: item.mode,
                    type: item.type,
                    sha: item.sha,
                    size: item.size,
                })),
            };
        },
    });

    return [getFileContent, listFiles, searchCode, getTree];
}
