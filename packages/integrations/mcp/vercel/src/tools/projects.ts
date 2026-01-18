/**
 * Project Tools
 *
 * Tools for querying Vercel projects.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { VercelProvider } from '../provider';

export function createProjectTools(provider: VercelProvider) {
    const listProjects = defineReadOnlyTool({
        name: 'list_vercel_projects',
        description: 'List Vercel projects for the authenticated user/team.',
        inputSchema: z.object({
            limit: z.number().int().min(1).max(100).default(20),
        }),
        handler: async ({ limit }) => {
            return provider.listProjects({ limit });
        },
    });

    const getProject = defineReadOnlyTool({
        name: 'get_vercel_project',
        description: 'Get detailed information about a specific Vercel project.',
        inputSchema: z.object({
            projectId: z.string().describe('Project ID or name'),
        }),
        handler: async ({ projectId }) => {
            return provider.getProject(projectId);
        },
    });

    return [listProjects, getProject];
}
