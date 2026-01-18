/**
 * Supabase Provider
 *
 * Handles connection and operations with Supabase.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { DataProvider } from '@pulwave/mcp-core';

export interface SupabaseConfig {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
}

/**
 * Supabase data provider implementation
 */
export class SupabaseProvider implements DataProvider {
    name = 'supabase';
    private client: SupabaseClient | null = null;
    private adminClient: SupabaseClient | null = null;
    private config: SupabaseConfig;

    constructor(config: SupabaseConfig) {
        this.config = config;
    }

    async isConnected(): Promise<boolean> {
        if (!this.client) return false;
        try {
            await this.client.from('profiles').select('id').limit(1);
            return true;
        } catch {
            return false;
        }
    }

    async connect(): Promise<void> {
        this.client = createClient(this.config.url, this.config.anonKey);

        if (this.config.serviceRoleKey) {
            this.adminClient = createClient(this.config.url, this.config.serviceRoleKey, {
                auth: { autoRefreshToken: false, persistSession: false },
            });
        }
    }

    async disconnect(): Promise<void> {
        this.client = null;
        this.adminClient = null;
    }

    /**
     * Get the Supabase client
     */
    getClient(): SupabaseClient {
        if (!this.client) {
            throw new Error('Supabase not connected. Call connect() first.');
        }
        return this.client;
    }

    /**
     * Get the admin client (requires service role key)
     */
    getAdminClient(): SupabaseClient {
        if (!this.adminClient) {
            throw new Error('Admin client not available. Provide serviceRoleKey in config.');
        }
        return this.adminClient;
    }

    /**
     * Execute a read-only query
     */
    async query<T = unknown>(
        table: string,
        options?: {
            select?: string;
            filters?: Record<string, unknown>;
            orderBy?: string;
            orderDirection?: 'asc' | 'desc';
            limit?: number;
            offset?: number;
        }
    ): Promise<{ data: T[]; count: number }> {
        const client = this.getClient();
        let query = client
            .from(table)
            .select(options?.select ?? '*', { count: 'exact' });

        // Apply filters
        if (options?.filters) {
            for (const [key, value] of Object.entries(options.filters)) {
                if (value !== undefined && value !== null) {
                    query = query.eq(key, value);
                }
            }
        }

        // Apply ordering
        if (options?.orderBy) {
            query = query.order(options.orderBy, {
                ascending: options.orderDirection !== 'desc',
            });
        }

        // Apply pagination
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        if (options?.offset) {
            query = query.range(options.offset, options.offset + (options.limit ?? 20) - 1);
        }

        const { data, error, count } = await query;

        if (error) {
            throw new Error(`Query failed: ${error.message}`);
        }

        return { data: (data ?? []) as T[], count: count ?? 0 };
    }

    /**
     * Get a single record by ID
     */
    async getById<T = unknown>(table: string, id: string, select?: string): Promise<T | null> {
        const client = this.getClient();
        const { data, error } = await client
            .from(table)
            .select(select ?? '*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw new Error(`Get by ID failed: ${error.message}`);
        }

        return data as T;
    }

    /**
     * Search with text matching
     */
    async search<T = unknown>(
        table: string,
        column: string,
        query: string,
        options?: { select?: string; limit?: number }
    ): Promise<T[]> {
        const client = this.getClient();
        const { data, error } = await client
            .from(table)
            .select(options?.select ?? '*')
            .ilike(column, `%${query}%`)
            .limit(options?.limit ?? 20);

        if (error) {
            throw new Error(`Search failed: ${error.message}`);
        }

        return (data ?? []) as T[];
    }

    /**
     * Get database schema information
     */
    async getSchema(): Promise<{ tables: string[]; views: string[] }> {
        const client = this.getClient();

        // Get tables
        const { data: tables } = await client.rpc('get_tables').select('*');

        // Get views
        const { data: views } = await client.rpc('get_views').select('*');

        return {
            tables: tables?.map((t: { table_name: string }) => t.table_name) ?? [],
            views: views?.map((v: { view_name: string }) => v.view_name) ?? [],
        };
    }

    /**
     * Execute raw SQL (read-only, requires admin)
     */
    async executeReadOnlySql<T = unknown>(sql: string): Promise<T[]> {
        // Validate SQL is read-only
        const normalizedSql = sql.trim().toUpperCase();
        if (!normalizedSql.startsWith('SELECT') && !normalizedSql.startsWith('WITH')) {
            throw new Error('Only SELECT queries are allowed');
        }

        const adminClient = this.getAdminClient();
        const { data, error } = await adminClient.rpc('execute_sql', { query: sql });

        if (error) {
            throw new Error(`SQL execution failed: ${error.message}`);
        }

        return (data ?? []) as T[];
    }
}
