/**
 * Schema Tools
 *
 * Tools for introspecting database schema.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { SupabaseProvider } from '../provider.js';

export function createSchemaTools(provider: SupabaseProvider) {
    const listTables = defineReadOnlyTool({
        name: 'list_tables',
        description: 'List all tables in the database with their basic info.',
        inputSchema: z.object({
            schema: z.string().default('public'),
        }),
        handler: async ({ schema }) => {
            const client = provider.getClient();

            // Use information_schema to get tables
            const { data, error } = await client
                .from('information_schema.tables' as 'profiles')
                .select('table_name, table_type')
                .eq('table_schema', schema)
                .order('table_name');

            if (error) {
                // Fallback to listing known tables
                return {
                    note: 'Schema introspection not available. Listing known tables.',
                    tables: [
                        'profiles', 'addresses', 'properties', 'buildings', 'units', 'leases',
                        'ui_translations', 'master_data_types', 'master_data_values',
                        'feature_flags', 'audit_logs', 'system_config', 'locales',
                    ],
                };
            }

            return data ?? [];
        },
    });

    const describeTable = defineReadOnlyTool({
        name: 'describe_table',
        description: 'Get column information for a specific table.',
        inputSchema: z.object({
            table: z.string().describe('Table name'),
            schema: z.string().default('public'),
        }),
        handler: async ({ table, schema }) => {
            const client = provider.getClient();

            // Try to get column info
            const { data, error } = await client
                .from('information_schema.columns' as 'profiles')
                .select('column_name, data_type, is_nullable, column_default')
                .eq('table_schema', schema)
                .eq('table_name', table)
                .order('ordinal_position');

            if (error) {
                // Fallback: fetch one row and infer columns
                const { data: sampleData, error: sampleError } = await client
                    .from(table)
                    .select('*')
                    .limit(1);

                if (sampleError) {
                    throw new Error(`Cannot describe table: ${sampleError.message}`);
                }

                if (sampleData && sampleData.length > 0) {
                    return {
                        table,
                        columns: Object.keys(sampleData[0]).map(col => ({
                            column_name: col,
                            inferred: true,
                        })),
                    };
                }

                return { table, columns: [], note: 'Table empty or inaccessible' };
            }

            return { table, columns: data ?? [] };
        },
    });

    const runQuery = defineReadOnlyTool({
        name: 'run_query',
        description: 'Execute a read-only SQL query. Only SELECT statements are allowed. Use for complex queries not covered by other tools.',
        inputSchema: z.object({
            sql: z.string().describe('SQL SELECT query to execute'),
            limit: z.number().int().min(1).max(1000).default(100),
        }),
        handler: async ({ sql, limit }) => {
            // Validate read-only
            const normalized = sql.trim().toUpperCase();
            if (!normalized.startsWith('SELECT') && !normalized.startsWith('WITH')) {
                throw new Error('Only SELECT queries are allowed. Use other tools for mutations.');
            }

            // Add limit if not present
            let finalSql = sql;
            if (!normalized.includes('LIMIT')) {
                finalSql = `${sql} LIMIT ${limit}`;
            }

            // Execute via RPC or direct query
            const client = provider.getClient();

            // Try to execute via a safe RPC function if available
            try {
                const { data, error } = await client.rpc('execute_readonly_sql', { query: finalSql });
                if (error) throw error;
                return { rows: data, rowCount: data?.length ?? 0 };
            } catch {
                return {
                    error: 'Direct SQL execution not available. Use specific query tools instead.',
                    suggestion: 'Try list_profiles, search_translations, or describe_table tools.',
                };
            }
        },
    });

    const getEnumValues = defineReadOnlyTool({
        name: 'get_enum_values',
        description: 'Get possible values for a database enum type.',
        inputSchema: z.object({
            enumName: z.string().describe('Name of the enum type'),
        }),
        handler: async ({ enumName }) => {
            const client = provider.getClient();

            // Check master_data_types first (our enum replacement)
            const { data: masterData } = await client
                .from('master_data_types')
                .select('*, values:master_data_values(key, name)')
                .eq('key', enumName)
                .single();

            if (masterData) {
                return {
                    enumName,
                    source: 'master_data',
                    values: masterData.values?.map((v: { key: string }) => v.key) ?? [],
                };
            }

            // Common enum values as fallback
            const commonEnums: Record<string, string[]> = {
                user_role: ['user', 'admin', 'super_admin'],
                status: ['active', 'inactive', 'pending'],
                property_type: ['residential', 'commercial', 'industrial', 'land'],
                lease_status: ['active', 'expired', 'terminated', 'pending'],
            };

            if (commonEnums[enumName]) {
                return {
                    enumName,
                    source: 'common',
                    values: commonEnums[enumName],
                };
            }

            return {
                enumName,
                error: 'Enum not found',
                suggestion: 'Use list_master_data to see available types.',
            };
        },
    });

    return [listTables, describeTable, runQuery, getEnumValues];
}
