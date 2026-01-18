/**
 * Subscription Tools
 *
 * Tools for querying Stripe subscriptions.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { StripeProvider } from '../provider';

export function createSubscriptionTools(provider: StripeProvider) {
    const listSubscriptions = defineReadOnlyTool({
        name: 'list_stripe_subscriptions',
        description: 'List Stripe subscriptions with optional filtering.',
        inputSchema: z.object({
            customerId: z.string().optional().describe('Filter by customer ID'),
            status: z.enum(['active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'paused']).optional(),
            priceId: z.string().optional().describe('Filter by price ID'),
            limit: z.number().int().min(1).max(100).default(20),
            startingAfter: z.string().optional(),
        }),
        handler: async ({ customerId, status, priceId, limit, startingAfter }) => {
            return provider.listSubscriptions({ customerId, status, priceId, limit, startingAfter });
        },
    });

    const getSubscription = defineReadOnlyTool({
        name: 'get_stripe_subscription',
        description: 'Get detailed information about a Stripe subscription.',
        inputSchema: z.object({
            subscriptionId: z.string().describe('Subscription ID (sub_xxx)'),
        }),
        handler: async ({ subscriptionId }) => {
            return provider.getSubscription(subscriptionId);
        },
    });

    return [listSubscriptions, getSubscription];
}
