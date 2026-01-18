/**
 * Product Tools
 *
 * Tools for querying Stripe products and prices.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { StripeProvider } from '../provider';

export function createProductTools(provider: StripeProvider) {
    const listProducts = defineReadOnlyTool({
        name: 'list_stripe_products',
        description: 'List Stripe products.',
        inputSchema: z.object({
            active: z.boolean().optional().describe('Filter by active status'),
            limit: z.number().int().min(1).max(100).default(20),
            startingAfter: z.string().optional(),
        }),
        handler: async ({ active, limit, startingAfter }) => {
            return provider.listProducts({ active, limit, startingAfter });
        },
    });

    const getProduct = defineReadOnlyTool({
        name: 'get_stripe_product',
        description: 'Get detailed information about a Stripe product.',
        inputSchema: z.object({
            productId: z.string().describe('Product ID (prod_xxx)'),
        }),
        handler: async ({ productId }) => {
            return provider.getProduct(productId);
        },
    });

    const listPrices = defineReadOnlyTool({
        name: 'list_stripe_prices',
        description: 'List Stripe prices with optional filtering.',
        inputSchema: z.object({
            productId: z.string().optional().describe('Filter by product ID'),
            active: z.boolean().optional().describe('Filter by active status'),
            type: z.enum(['one_time', 'recurring']).optional(),
            limit: z.number().int().min(1).max(100).default(20),
            startingAfter: z.string().optional(),
        }),
        handler: async ({ productId, active, type, limit, startingAfter }) => {
            return provider.listPrices({ productId, active, type, limit, startingAfter });
        },
    });

    const getPrice = defineReadOnlyTool({
        name: 'get_stripe_price',
        description: 'Get detailed information about a Stripe price.',
        inputSchema: z.object({
            priceId: z.string().describe('Price ID (price_xxx)'),
        }),
        handler: async ({ priceId }) => {
            return provider.getPrice(priceId);
        },
    });

    return [listProducts, getProduct, listPrices, getPrice];
}
