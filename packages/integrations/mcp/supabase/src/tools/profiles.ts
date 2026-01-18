/**
 * Profile Tools
 *
 * Tools for querying and managing user profiles.
 */

import { z, defineReadOnlyTool, commonSchemas, paginatedResult } from '@pulwave/mcp-core';
import type { SupabaseProvider } from '../provider.js';

export function createProfileTools(provider: SupabaseProvider) {
    const listProfiles = defineReadOnlyTool({
        name: 'list_profiles',
        description: 'List user profiles with optional filtering and pagination. Returns basic profile info including name, email, role, and status.',
        inputSchema: z.object({
            ...commonSchemas.pagination.shape,
            ...commonSchemas.sorting.shape,
            role: z.enum(['user', 'admin', 'super_admin']).optional(),
            status: z.enum(['active', 'inactive', 'pending']).optional(),
            search: z.string().optional().describe('Search by name or email'),
        }),
        handler: async (input) => {
            const { page, pageSize, orderBy, orderDirection, role, status, search } = input;

            let query = provider.getClient()
                .from('profiles')
                .select('id, first_name, last_name, email, role, status, created_at', { count: 'exact' });

            if (role) query = query.eq('role', role);
            if (status) query = query.eq('status', status);
            if (search) {
                query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
            }

            query = query
                .order(orderBy ?? 'created_at', { ascending: orderDirection !== 'desc' })
                .range((page - 1) * pageSize, page * pageSize - 1);

            const { data, count, error } = await query;

            if (error) throw new Error(error.message);

            return paginatedResult(data ?? [], count ?? 0, { page, pageSize });
        },
    });

    const getProfile = defineReadOnlyTool({
        name: 'get_profile',
        description: 'Get detailed profile information by ID. Includes personal info, professional details, addresses, and settings.',
        inputSchema: z.object({
            id: commonSchemas.uuid.describe('Profile UUID'),
        }),
        handler: async ({ id }) => {
            const profile = await provider.getById('profiles', id, `
                *,
                addresses(*),
                profile_settings(*)
            `);

            if (!profile) {
                throw new Error(`Profile not found: ${id}`);
            }

            return profile;
        },
    });

    const searchProfiles = defineReadOnlyTool({
        name: 'search_profiles',
        description: 'Search profiles by name, email, or other fields. Returns matching profiles with relevance.',
        inputSchema: z.object({
            query: z.string().min(2).describe('Search query'),
            limit: z.number().int().min(1).max(50).default(10),
        }),
        handler: async ({ query, limit }) => {
            const client = provider.getClient();

            const { data, error } = await client
                .from('profiles')
                .select('id, first_name, last_name, email, role, status')
                .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
                .limit(limit);

            if (error) throw new Error(error.message);

            return data ?? [];
        },
    });

    return [listProfiles, getProfile, searchProfiles];
}
