/**
 * Property Tools (Real Estate Domain)
 *
 * Tools for querying properties, buildings, and leases.
 */

import { z, defineReadOnlyTool, paginatedResult } from '@pulwave/mcp-core';
import type { SupabaseProvider } from '../provider.js';

export function createPropertyTools(provider: SupabaseProvider) {
    const listProperties = defineReadOnlyTool({
        name: 'list_properties',
        description: 'List real estate properties with filtering options. Returns property details including type, status, and address.',
        inputSchema: z.object({
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(20),
            propertyType: z.enum(['residential', 'commercial', 'industrial', 'land']).optional(),
            status: z.enum(['active', 'inactive', 'pending', 'sold']).optional(),
            ownerId: z.string().uuid().optional().describe('Filter by owner profile ID'),
            search: z.string().optional().describe('Search by name or address'),
        }),
        handler: async ({ page, pageSize, propertyType, status, ownerId, search }) => {
            let query = provider.getClient()
                .from('properties')
                .select('*, addresses(*)', { count: 'exact' });

            if (propertyType) query = query.eq('property_type', propertyType);
            if (status) query = query.eq('status', status);
            if (ownerId) query = query.eq('owner_id', ownerId);
            if (search) {
                query = query.or(`name.ilike.%${search}%`);
            }

            query = query
                .order('created_at', { ascending: false })
                .range((page - 1) * pageSize, page * pageSize - 1);

            const { data, count, error } = await query;

            if (error) throw new Error(error.message);

            return paginatedResult(data ?? [], count ?? 0, { page, pageSize });
        },
    });

    const getProperty = defineReadOnlyTool({
        name: 'get_property',
        description: 'Get detailed property information by ID, including units, leases, and related data.',
        inputSchema: z.object({
            id: z.string().uuid().describe('Property UUID'),
        }),
        handler: async ({ id }) => {
            const property = await provider.getById('properties', id, `
                *,
                addresses(*),
                units(*),
                owner:profiles!owner_id(id, first_name, last_name, email)
            `);

            if (!property) {
                throw new Error(`Property not found: ${id}`);
            }

            return property;
        },
    });

    const listBuildings = defineReadOnlyTool({
        name: 'list_buildings',
        description: 'List buildings with optional filtering. Returns building info including units count and occupancy.',
        inputSchema: z.object({
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(20),
            propertyId: z.string().uuid().optional().describe('Filter by parent property'),
            search: z.string().optional(),
        }),
        handler: async ({ page, pageSize, propertyId, search }) => {
            let query = provider.getClient()
                .from('buildings')
                .select('*, property:properties(name), addresses(*)', { count: 'exact' });

            if (propertyId) query = query.eq('property_id', propertyId);
            if (search) query = query.ilike('name', `%${search}%`);

            query = query
                .order('name', { ascending: true })
                .range((page - 1) * pageSize, page * pageSize - 1);

            const { data, count, error } = await query;

            if (error) throw new Error(error.message);

            return paginatedResult(data ?? [], count ?? 0, { page, pageSize });
        },
    });

    const listLeases = defineReadOnlyTool({
        name: 'list_leases',
        description: 'List leases with filtering options. Returns lease details including tenant, unit, and payment status.',
        inputSchema: z.object({
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(20),
            status: z.enum(['active', 'expired', 'terminated', 'pending']).optional(),
            propertyId: z.string().uuid().optional(),
            tenantId: z.string().uuid().optional(),
            expiringWithinDays: z.number().int().min(1).optional().describe('Find leases expiring within N days'),
        }),
        handler: async ({ page, pageSize, status, propertyId, tenantId, expiringWithinDays }) => {
            let query = provider.getClient()
                .from('leases')
                .select(`
                    *,
                    unit:units(id, name, property:properties(id, name)),
                    tenant:profiles(id, first_name, last_name, email)
                `, { count: 'exact' });

            if (status) query = query.eq('status', status);
            if (propertyId) query = query.eq('units.property_id', propertyId);
            if (tenantId) query = query.eq('tenant_id', tenantId);

            if (expiringWithinDays) {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + expiringWithinDays);
                query = query
                    .gte('end_date', new Date().toISOString())
                    .lte('end_date', futureDate.toISOString());
            }

            query = query
                .order('end_date', { ascending: true })
                .range((page - 1) * pageSize, page * pageSize - 1);

            const { data, count, error } = await query;

            if (error) throw new Error(error.message);

            return paginatedResult(data ?? [], count ?? 0, { page, pageSize });
        },
    });

    const getPropertyStats = defineReadOnlyTool({
        name: 'get_property_stats',
        description: 'Get aggregate statistics about properties, buildings, and leases.',
        inputSchema: z.object({
            ownerId: z.string().uuid().optional().describe('Filter stats by owner'),
        }),
        handler: async ({ ownerId }) => {
            const client = provider.getClient();

            // Get property counts
            let propertyQuery = client.from('properties').select('id, status', { count: 'exact' });
            if (ownerId) propertyQuery = propertyQuery.eq('owner_id', ownerId);
            const { count: propertyCount } = await propertyQuery;

            // Get building count
            const { count: buildingCount } = await client.from('buildings').select('id', { count: 'exact' });

            // Get unit count
            const { count: unitCount } = await client.from('units').select('id', { count: 'exact' });

            // Get lease stats
            const { data: leases } = await client.from('leases').select('status');
            const leaseStats = {
                total: leases?.length ?? 0,
                active: leases?.filter(l => l.status === 'active').length ?? 0,
                expired: leases?.filter(l => l.status === 'expired').length ?? 0,
            };

            return {
                properties: propertyCount ?? 0,
                buildings: buildingCount ?? 0,
                units: unitCount ?? 0,
                leases: leaseStats,
            };
        },
    });

    return [listProperties, getProperty, listBuildings, listLeases, getPropertyStats];
}
