/**
 * Stripe Provider
 *
 * Provider-agnostic wrapper for Stripe API operations.
 * This is a shell implementation - methods throw NotImplemented until configured.
 */

import type { DataProvider } from '@pulwave/mcp-core';

export interface StripeConfig {
    /** Stripe secret key */
    secretKey: string;
    /** Stripe publishable key (for reference) */
    publishableKey?: string;
    /** API version */
    apiVersion?: string;
}

// Domain types - ready for when Stripe is configured

export interface Customer {
    id: string;
    email: string | null;
    name: string | null;
    phone: string | null;
    description: string | null;
    created: number;
    currency: string | null;
    balance: number;
    delinquent: boolean;
    metadata: Record<string, string>;
}

export interface Subscription {
    id: string;
    customerId: string;
    status: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused';
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
    canceledAt: number | null;
    trialStart: number | null;
    trialEnd: number | null;
    items: SubscriptionItem[];
    metadata: Record<string, string>;
}

export interface SubscriptionItem {
    id: string;
    priceId: string;
    productId: string;
    quantity: number;
}

export interface Invoice {
    id: string;
    customerId: string;
    subscriptionId: string | null;
    status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
    amountDue: number;
    amountPaid: number;
    amountRemaining: number;
    currency: string;
    created: number;
    dueDate: number | null;
    paidAt: number | null;
    hostedInvoiceUrl: string | null;
    invoicePdf: string | null;
}

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
    customerId: string | null;
    created: number;
    description: string | null;
    metadata: Record<string, string>;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
    created: number;
    images: string[];
    metadata: Record<string, string>;
}

export interface Price {
    id: string;
    productId: string;
    active: boolean;
    currency: string;
    unitAmount: number | null;
    type: 'one_time' | 'recurring';
    recurring: {
        interval: 'day' | 'week' | 'month' | 'year';
        intervalCount: number;
    } | null;
    metadata: Record<string, string>;
}

export interface PaymentMethod {
    id: string;
    customerId: string | null;
    type: string;
    created: number;
    card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    };
}

/**
 * Stripe data provider (shell implementation)
 */
export class StripeProvider implements DataProvider {
    name = 'stripe';
    private config: StripeConfig;
    private connected = false;

    constructor(config: StripeConfig) {
        this.config = config;
    }

    async isConnected(): Promise<boolean> {
        return this.connected && !!this.config.secretKey;
    }

    async connect(): Promise<void> {
        if (!this.config.secretKey) {
            throw new Error('Stripe secret key not configured');
        }
        this.connected = true;
    }

    async disconnect(): Promise<void> {
        this.connected = false;
    }

    // Customer operations

    async listCustomers(_options?: {
        email?: string;
        limit?: number;
        startingAfter?: string;
    }): Promise<Customer[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    async getCustomer(_customerId: string): Promise<Customer> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    async searchCustomers(_query: string): Promise<Customer[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    // Subscription operations

    async listSubscriptions(_options?: {
        customerId?: string;
        status?: Subscription['status'];
        priceId?: string;
        limit?: number;
        startingAfter?: string;
    }): Promise<Subscription[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    async getSubscription(_subscriptionId: string): Promise<Subscription> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    // Invoice operations

    async listInvoices(_options?: {
        customerId?: string;
        subscriptionId?: string;
        status?: Invoice['status'];
        limit?: number;
        startingAfter?: string;
    }): Promise<Invoice[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    async getInvoice(_invoiceId: string): Promise<Invoice> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    // Payment Intent operations

    async listPaymentIntents(_options?: {
        customerId?: string;
        limit?: number;
        startingAfter?: string;
    }): Promise<PaymentIntent[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    async getPaymentIntent(_paymentIntentId: string): Promise<PaymentIntent> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    // Product/Price operations

    async listProducts(_options?: {
        active?: boolean;
        limit?: number;
        startingAfter?: string;
    }): Promise<Product[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    async getProduct(_productId: string): Promise<Product> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    async listPrices(_options?: {
        productId?: string;
        active?: boolean;
        type?: Price['type'];
        limit?: number;
        startingAfter?: string;
    }): Promise<Price[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    async getPrice(_priceId: string): Promise<Price> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    // Payment Method operations

    async listPaymentMethods(_customerId: string, _type?: string): Promise<PaymentMethod[]> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    async getPaymentMethod(_paymentMethodId: string): Promise<PaymentMethod> {
        this.ensureConnected();
        throw new Error('Not implemented: Stripe integration not yet configured');
    }

    // Helper methods

    private ensureConnected(): void {
        if (!this.connected) {
            throw new Error('Provider not connected. Call connect() first.');
        }
    }

    getConfig(): StripeConfig {
        return this.config;
    }
}
