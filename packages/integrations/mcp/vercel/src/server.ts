/**
 * Pulwave Vercel MCP Server
 *
 * MCP server for interacting with Vercel deployments.
 * This is a shell implementation - ready for when Vercel is configured.
 */

import { BaseMcpServer } from '@pulwave/mcp-core';
import { VercelProvider, type VercelConfig } from './provider';
import {
    createProjectTools,
    createDeploymentTools,
    createDomainTools,
    createEnvTools,
} from './tools';

/**
 * Pulwave Vercel MCP Server
 */
export class PulwaveVercelMcpServer extends BaseMcpServer {
    private vercelProvider: VercelProvider;

    constructor(config: VercelConfig) {
        super({
            name: 'pulwave-vercel',
            version: '0.0.1',
            description: 'MCP server for Vercel deployments (shell)',
        });

        this.vercelProvider = new VercelProvider(config);
        this.setProvider(this.vercelProvider);
    }

    protected registerTools(): void {
        // Project tools
        for (const tool of createProjectTools(this.vercelProvider)) {
            this.registerTool(tool);
        }

        // Deployment tools
        for (const tool of createDeploymentTools(this.vercelProvider)) {
            this.registerTool(tool);
        }

        // Domain tools
        for (const tool of createDomainTools(this.vercelProvider)) {
            this.registerTool(tool);
        }

        // Environment variable tools
        for (const tool of createEnvTools(this.vercelProvider)) {
            this.registerTool(tool);
        }
    }

    /**
     * Get the Vercel provider for direct access
     */
    getProvider(): VercelProvider {
        return this.vercelProvider;
    }
}

/**
 * Create and configure the server
 */
export function createServer(config?: Partial<VercelConfig>): PulwaveVercelMcpServer {
    const finalConfig: VercelConfig = {
        token: config?.token ?? process.env.VERCEL_TOKEN ?? '',
        teamId: config?.teamId ?? process.env.VERCEL_TEAM_ID,
        defaultProjectId: config?.defaultProjectId ?? process.env.VERCEL_PROJECT_ID,
    };

    if (!finalConfig.token) {
        console.warn(
            'Warning: Vercel token not configured. Set VERCEL_TOKEN environment variable.'
        );
    }

    return new PulwaveVercelMcpServer(finalConfig);
}
