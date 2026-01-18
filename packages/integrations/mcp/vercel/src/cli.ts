#!/usr/bin/env node
/**
 * Pulwave Vercel MCP Server CLI
 *
 * Usage:
 *   npx pulwave-mcp-vercel
 *   node dist/cli.js
 *
 * Environment variables:
 *   VERCEL_TOKEN - Vercel API token
 *   VERCEL_TEAM_ID - (Optional) Team ID for team deployments
 *   VERCEL_PROJECT_ID - (Optional) Default project ID
 */

import { createServer } from './server';

async function main() {
    try {
        const server = createServer();
        await server.start();

        // Handle shutdown gracefully
        process.on('SIGINT', async () => {
            await server.stop();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await server.stop();
            process.exit(0);
        });
    } catch (error) {
        console.error('Failed to start MCP server:', error);
        process.exit(1);
    }
}

main();
