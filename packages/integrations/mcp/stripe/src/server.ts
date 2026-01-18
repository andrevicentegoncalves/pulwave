/**
 * Pulwave Stripe MCP Server
 *
 * MCP server for interacting with Stripe payments.
 * This is a shell implementation - ready for when Stripe is configured.
 */

import { BaseMcpServer } from '@pulwave/mcp-core';
import { StripeProvider, type StripeConfig } from './provider';
import {
    createCustomerTools,
    createSubscriptionTools,
    createInvoiceTools,
    createPaymentTools,
    createProductTools,
} from './tools';

/**
 * Pulwave Stripe MCP Server
 */
export class PulwaveStripeMcpServer extends BaseMcpServer {
    private stripeProvider: StripeProvider;

    constructor(config: StripeConfig) {
        super({
            name: 'pulwave-stripe',
            version: '0.0.1',
            description: 'MCP server for Stripe payments (shell)',
        });

        this.stripeProvider = new StripeProvider(config);
        this.setProvider(this.stripeProvider);
    }

    protected registerTools(): void {
        // Customer tools
        for (const tool of createCustomerTools(this.stripeProvider)) {
            this.registerTool(tool);
        }

        // Subscription tools
        for (const tool of createSubscriptionTools(this.stripeProvider)) {
            this.registerTool(tool);
        }

        // Invoice tools
        for (const tool of createInvoiceTools(this.stripeProvider)) {
            this.registerTool(tool);
        }

        // Payment tools
        for (const tool of createPaymentTools(this.stripeProvider)) {
            this.registerTool(tool);
        }

        // Product tools
        for (const tool of createProductTools(this.stripeProvider)) {
            this.registerTool(tool);
        }
    }

    /**
     * Get the Stripe provider for direct access
     */
    getProvider(): StripeProvider {
        return this.stripeProvider;
    }
}

/**
 * Create and configure the server
 */
export function createServer(config?: Partial<StripeConfig>): PulwaveStripeMcpServer {
    const finalConfig: StripeConfig = {
        secretKey: config?.secretKey ?? process.env.STRIPE_SECRET_KEY ?? '',
        publishableKey: config?.publishableKey ?? process.env.STRIPE_PUBLISHABLE_KEY,
        apiVersion: config?.apiVersion ?? process.env.STRIPE_API_VERSION,
    };

    if (!finalConfig.secretKey) {
        console.warn(
            'Warning: Stripe secret key not configured. Set STRIPE_SECRET_KEY environment variable.'
        );
    }

    return new PulwaveStripeMcpServer(finalConfig);
}
