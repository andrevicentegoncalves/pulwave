#!/usr/bin/env node
/**
 * Pulwave Supabase MCP Server CLI
 *
 * Usage:
 *   npx pulwave-mcp-supabase
 *   node dist/cli.js
 *
 * Environment variables:
 *   SUPABASE_URL - Supabase project URL
 *   SUPABASE_ANON_KEY - Supabase anon/public key
 *   SUPABASE_SERVICE_ROLE_KEY - (Optional) Service role key for admin operations
 */

import { createServer } from './server.js';

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
