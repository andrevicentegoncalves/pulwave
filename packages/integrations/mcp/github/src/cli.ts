#!/usr/bin/env node
/**
 * Pulwave GitHub MCP Server CLI
 *
 * Usage:
 *   npx pulwave-mcp-github
 *   node dist/cli.js
 *
 * Environment variables:
 *   GITHUB_TOKEN - GitHub personal access token (or GH_TOKEN)
 *   GITHUB_OWNER - (Optional) Default repository owner
 *   GITHUB_REPO - (Optional) Default repository name
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
