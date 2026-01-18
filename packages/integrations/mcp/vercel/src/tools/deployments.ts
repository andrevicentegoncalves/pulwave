/**
 * Deployment Tools
 *
 * Tools for querying Vercel deployments.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { VercelProvider } from '../provider';

export function createDeploymentTools(provider: VercelProvider) {
    const listDeployments = defineReadOnlyTool({
        name: 'list_vercel_deployments',
        description: 'List Vercel deployments with optional filtering.',
        inputSchema: z.object({
            projectId: z.string().optional().describe('Filter by project ID'),
            target: z.enum(['production', 'preview']).optional(),
            state: z.enum(['READY', 'ERROR', 'BUILDING', 'QUEUED', 'CANCELED', 'INITIALIZING']).optional(),
            limit: z.number().int().min(1).max(100).default(20),
        }),
        handler: async ({ projectId, target, state, limit }) => {
            return provider.listDeployments({ projectId, target, state, limit });
        },
    });

    const getDeployment = defineReadOnlyTool({
        name: 'get_vercel_deployment',
        description: 'Get detailed information about a specific deployment.',
        inputSchema: z.object({
            deploymentId: z.string().describe('Deployment ID or URL'),
        }),
        handler: async ({ deploymentId }) => {
            return provider.getDeployment(deploymentId);
        },
    });

    const getDeploymentLogs = defineReadOnlyTool({
        name: 'get_vercel_deployment_logs',
        description: 'Get build/runtime logs for a deployment.',
        inputSchema: z.object({
            deploymentId: z.string().describe('Deployment ID'),
            limit: z.number().int().min(1).max(1000).default(100),
        }),
        handler: async ({ deploymentId, limit }) => {
            return provider.getDeploymentLogs(deploymentId, { limit });
        },
    });

    return [listDeployments, getDeployment, getDeploymentLogs];
}
