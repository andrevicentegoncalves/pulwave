/**
 * Payment Tools
 *
 * Tools for querying Stripe payment intents and methods.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { StripeProvider } from '../provider';

export function createPaymentTools(provider: StripeProvider) {
    const listPaymentIntents = defineReadOnlyTool({
        name: 'list_stripe_payment_intents',
        description: 'List Stripe payment intents with optional filtering.',
        inputSchema: z.object({
            customerId: z.string().optional().describe('Filter by customer ID'),
            limit: z.number().int().min(1).max(100).default(20),
            startingAfter: z.string().optional(),
        }),
        handler: async ({ customerId, limit, startingAfter }) => {
            return provider.listPaymentIntents({ customerId, limit, startingAfter });
        },
    });

    const getPaymentIntent = defineReadOnlyTool({
        name: 'get_stripe_payment_intent',
        description: 'Get detailed information about a Stripe payment intent.',
        inputSchema: z.object({
            paymentIntentId: z.string().describe('Payment Intent ID (pi_xxx)'),
        }),
        handler: async ({ paymentIntentId }) => {
            return provider.getPaymentIntent(paymentIntentId);
        },
    });

    const listPaymentMethods = defineReadOnlyTool({
        name: 'list_stripe_payment_methods',
        description: 'List payment methods for a customer.',
        inputSchema: z.object({
            customerId: z.string().describe('Customer ID'),
            type: z.string().optional().describe('Payment method type (e.g., "card")'),
        }),
        handler: async ({ customerId, type }) => {
            return provider.listPaymentMethods(customerId, type);
        },
    });

    const getPaymentMethod = defineReadOnlyTool({
        name: 'get_stripe_payment_method',
        description: 'Get details about a specific payment method.',
        inputSchema: z.object({
            paymentMethodId: z.string().describe('Payment Method ID (pm_xxx)'),
        }),
        handler: async ({ paymentMethodId }) => {
            return provider.getPaymentMethod(paymentMethodId);
        },
    });

    return [listPaymentIntents, getPaymentIntent, listPaymentMethods, getPaymentMethod];
}
