/**
 * Environment Variable Tools
 *
 * Tools for querying Vercel environment variables.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { VercelProvider } from '../provider';

export function createEnvTools(provider: VercelProvider) {
    const listEnvVars = defineReadOnlyTool({
        name: 'list_vercel_env_vars',
        description: 'List environment variables for a project (values are masked).',
        inputSchema: z.object({
            projectId: z.string().describe('Project ID'),
        }),
        handler: async ({ projectId }) => {
            const envVars = await provider.listEnvVars(projectId);
            // Mask values for security
            return envVars.map((env) => ({
                ...env,
                value: env.type === 'secret' ? '********' : env.value.slice(0, 4) + '****',
            }));
        },
    });

    const getEnvVar = defineReadOnlyTool({
        name: 'get_vercel_env_var',
        description: 'Get a specific environment variable (value is masked).',
        inputSchema: z.object({
            projectId: z.string().describe('Project ID'),
            envId: z.string().describe('Environment variable ID'),
        }),
        handler: async ({ projectId, envId }) => {
            const envVar = await provider.getEnvVar(projectId, envId);
            return {
                ...envVar,
                value: envVar.type === 'secret' ? '********' : envVar.value.slice(0, 4) + '****',
            };
        },
    });

    return [listEnvVars, getEnvVar];
}
