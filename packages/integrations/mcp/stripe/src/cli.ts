#!/usr/bin/env node
/**
 * Pulwave Stripe MCP Server CLI
 *
 * Usage:
 *   npx pulwave-mcp-stripe
 *   node dist/cli.js
 *
 * Environment variables:
 *   STRIPE_SECRET_KEY - Stripe secret key
 *   STRIPE_PUBLISHABLE_KEY - (Optional) Stripe publishable key
 *   STRIPE_API_VERSION - (Optional) Stripe API version
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
