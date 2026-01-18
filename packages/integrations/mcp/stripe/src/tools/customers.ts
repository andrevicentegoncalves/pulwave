/**
 * Customer Tools
 *
 * Tools for querying Stripe customers.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { StripeProvider } from '../provider';

export function createCustomerTools(provider: StripeProvider) {
    const listCustomers = defineReadOnlyTool({
        name: 'list_stripe_customers',
        description: 'List Stripe customers with optional filtering.',
        inputSchema: z.object({
            email: z.string().email().optional().describe('Filter by email'),
            limit: z.number().int().min(1).max(100).default(20),
            startingAfter: z.string().optional().describe('Cursor for pagination'),
        }),
        handler: async ({ email, limit, startingAfter }) => {
            return provider.listCustomers({ email, limit, startingAfter });
        },
    });

    const getCustomer = defineReadOnlyTool({
        name: 'get_stripe_customer',
        description: 'Get detailed information about a Stripe customer.',
        inputSchema: z.object({
            customerId: z.string().describe('Customer ID (cus_xxx)'),
        }),
        handler: async ({ customerId }) => {
            return provider.getCustomer(customerId);
        },
    });

    const searchCustomers = defineReadOnlyTool({
        name: 'search_stripe_customers',
        description: 'Search customers using Stripe search syntax.',
        inputSchema: z.object({
            query: z.string().describe('Search query (e.g., email:"john@example.com")'),
        }),
        handler: async ({ query }) => {
            return provider.searchCustomers(query);
        },
    });

    return [listCustomers, getCustomer, searchCustomers];
}
