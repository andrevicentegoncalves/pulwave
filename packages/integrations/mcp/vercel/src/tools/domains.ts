/**
 * Domain Tools
 *
 * Tools for querying Vercel domains.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { VercelProvider } from '../provider';

export function createDomainTools(provider: VercelProvider) {
    const listDomains = defineReadOnlyTool({
        name: 'list_vercel_domains',
        description: 'List domains configured for a project.',
        inputSchema: z.object({
            projectId: z.string().optional().describe('Project ID (uses default if not provided)'),
        }),
        handler: async ({ projectId }) => {
            return provider.listDomains(projectId);
        },
    });

    const getDomain = defineReadOnlyTool({
        name: 'get_vercel_domain',
        description: 'Get information about a specific domain.',
        inputSchema: z.object({
            domain: z.string().describe('Domain name'),
        }),
        handler: async ({ domain }) => {
            return provider.getDomain(domain);
        },
    });

    return [listDomains, getDomain];
}
