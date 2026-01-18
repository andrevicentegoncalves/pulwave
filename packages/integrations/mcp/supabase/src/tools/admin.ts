/**
 * Admin Tools
 *
 * Administrative tools for system management.
 */

import { z, defineReadOnlyTool, paginatedResult, type ToolDefinition } from '@pulwave/mcp-core';
import type { SupabaseProvider } from '../provider.js';

export function createAdminTools(provider: SupabaseProvider): ReadonlyArray<ToolDefinition<any, any>> {
    const listMasterData = defineReadOnlyTool({
        name: 'list_master_data',
        description: 'List master data types and values. Master data includes enums, reference data, and system configurations.',
        inputSchema: z.object({
            typeKey: z.string().optional().describe('Filter by master data type key'),
            includeValues: z.boolean().default(true).describe('Include values for each type'),
        }),
        handler: async ({ typeKey, includeValues }) => {
            const client = provider.getClient();

            let query = client.from('master_data_types').select(
                includeValues ? '*, values:master_data_values(*)' : '*'
            );

            if (typeKey) query = query.eq('key', typeKey);

            const { data, error } = await query.order('key');

            if (error) throw new Error(error.message);

            return data ?? [];
        },
    });

    const listFeatureFlags = defineReadOnlyTool({
        name: 'list_feature_flags',
        description: 'List feature flags and their current states.',
        inputSchema: z.object({
            enabledOnly: z.boolean().default(false),
        }),
        handler: async ({ enabledOnly }) => {
            let query = provider.getClient()
                .from('feature_flags')
                .select('*');

            if (enabledOnly) query = query.eq('enabled', true);

            const { data, error } = await query.order('name');

            if (error) throw new Error(error.message);

            return data ?? [];
        },
    });

    const listAuditLogs = defineReadOnlyTool({
        name: 'list_audit_logs',
        description: 'Query audit logs for system activity tracking. Useful for debugging and compliance.',
        inputSchema: z.object({
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(50),
            userId: z.string().uuid().optional().describe('Filter by user who performed action'),
            action: z.string().optional().describe('Filter by action type'),
            tableName: z.string().optional().describe('Filter by affected table'),
            fromDate: z.string().datetime().optional(),
            toDate: z.string().datetime().optional(),
        }),
        handler: async ({ page, pageSize, userId, action, tableName, fromDate, toDate }) => {
            let query = provider.getClient()
                .from('audit_logs')
                .select('*, user:profiles(id, first_name, last_name)', { count: 'exact' });

            if (userId) query = query.eq('user_id', userId);
            if (action) query = query.eq('action', action);
            if (tableName) query = query.eq('table_name', tableName);
            if (fromDate) query = query.gte('created_at', fromDate);
            if (toDate) query = query.lte('created_at', toDate);

            query = query
                .order('created_at', { ascending: false })
                .range((page - 1) * pageSize, page * pageSize - 1);

            const { data, count, error } = await query;

            if (error) throw new Error(error.message);

            return paginatedResult(data ?? [], count ?? 0, { page, pageSize });
        },
    });

    const getSystemConfig = defineReadOnlyTool({
        name: 'get_system_config',
        description: 'Get system configuration values.',
        inputSchema: z.object({
            category: z.string().optional().describe('Filter by config category'),
        }),
        handler: async ({ category }) => {
            let query = provider.getClient()
                .from('system_config')
                .select('*');

            if (category) query = query.eq('category', category);

            const { data, error } = await query.order('key');

            if (error) throw new Error(error.message);

            return data ?? [];
        },
    });

    const listLocales = defineReadOnlyTool({
        name: 'list_locales',
        description: 'List supported locales/languages in the system.',
        inputSchema: z.object({
            enabledOnly: z.boolean().default(true),
        }),
        handler: async ({ enabledOnly }) => {
            let query = provider.getClient()
                .from('locales')
                .select('*');

            if (enabledOnly) query = query.eq('enabled', true);

            const { data, error } = await query.order('name');

            if (error) throw new Error(error.message);

            return data ?? [];
        },
    });

    return [listMasterData, listFeatureFlags, listAuditLogs, getSystemConfig, listLocales];
}
