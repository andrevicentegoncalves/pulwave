/**
 * Invoice Tools
 *
 * Tools for querying Stripe invoices.
 */

import { z, defineReadOnlyTool } from '@pulwave/mcp-core';
import type { StripeProvider } from '../provider';

export function createInvoiceTools(provider: StripeProvider) {
    const listInvoices = defineReadOnlyTool({
        name: 'list_stripe_invoices',
        description: 'List Stripe invoices with optional filtering.',
        inputSchema: z.object({
            customerId: z.string().optional().describe('Filter by customer ID'),
            subscriptionId: z.string().optional().describe('Filter by subscription ID'),
            status: z.enum(['draft', 'open', 'paid', 'uncollectible', 'void']).optional(),
            limit: z.number().int().min(1).max(100).default(20),
            startingAfter: z.string().optional(),
        }),
        handler: async ({ customerId, subscriptionId, status, limit, startingAfter }) => {
            return provider.listInvoices({ customerId, subscriptionId, status, limit, startingAfter });
        },
    });

    const getInvoice = defineReadOnlyTool({
        name: 'get_stripe_invoice',
        description: 'Get detailed information about a Stripe invoice.',
        inputSchema: z.object({
            invoiceId: z.string().describe('Invoice ID (in_xxx)'),
        }),
        handler: async ({ invoiceId }) => {
            return provider.getInvoice(invoiceId);
        },
    });

    return [listInvoices, getInvoice];
}
