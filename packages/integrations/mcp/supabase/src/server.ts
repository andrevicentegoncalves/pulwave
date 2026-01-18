/**
 * Pulwave Supabase MCP Server
 *
 * MCP server for interacting with Pulwave's Supabase database.
 */

import { BaseMcpServer } from '@pulwave/mcp-core';
import { SupabaseProvider, type SupabaseConfig } from './provider.js';
import {
    createProfileTools,
    createTranslationTools,
    createPropertyTools,
    createAdminTools,
    createSchemaTools,
} from './tools/index.js';

/**
 * Pulwave Supabase MCP Server
 */
export class PulwaveSupabaseMcpServer extends BaseMcpServer {
    private supabaseProvider: SupabaseProvider;

    constructor(config: SupabaseConfig) {
        super({
            name: 'pulwave-supabase',
            version: '0.0.1',
            description: 'MCP server for Pulwave Supabase database',
        });

        this.supabaseProvider = new SupabaseProvider(config);
        this.setProvider(this.supabaseProvider);
    }

    protected registerTools(): void {
        // Profile tools
        for (const tool of createProfileTools(this.supabaseProvider)) {
            this.registerTool(tool);
        }

        // Translation tools
        for (const tool of createTranslationTools(this.supabaseProvider)) {
            this.registerTool(tool);
        }

        // Property tools (real estate domain)
        for (const tool of createPropertyTools(this.supabaseProvider)) {
            this.registerTool(tool);
        }

        // Admin tools
        for (const tool of createAdminTools(this.supabaseProvider)) {
            this.registerTool(tool);
        }

        // Schema tools
        for (const tool of createSchemaTools(this.supabaseProvider)) {
            this.registerTool(tool);
        }
    }

    /**
     * Get the Supabase provider for direct access
     */
    getProvider(): SupabaseProvider {
        return this.supabaseProvider;
    }
}

/**
 * Create and configure the server
 */
export function createServer(config?: Partial<SupabaseConfig>): PulwaveSupabaseMcpServer {
    const finalConfig: SupabaseConfig = {
        url: config?.url ?? process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '',
        anonKey: config?.anonKey ?? process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? '',
        serviceRoleKey: config?.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    if (!finalConfig.url || !finalConfig.anonKey) {
        throw new Error(
            'Supabase configuration required. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
        );
    }

    return new PulwaveSupabaseMcpServer(finalConfig);
}
