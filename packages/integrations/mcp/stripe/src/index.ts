/**
 * @pulwave/mcp-stripe
 *
 * MCP server for Stripe payments.
 * This is a shell implementation - ready for when Stripe is configured.
 *
 * ## Tools Available (shell - not yet implemented)
 *
 * ### Customers
 * - `list_stripe_customers` - List customers
 * - `get_stripe_customer` - Get customer details
 * - `search_stripe_customers` - Search customers
 *
 * ### Subscriptions
 * - `list_stripe_subscriptions` - List subscriptions
 * - `get_stripe_subscription` - Get subscription details
 *
 * ### Invoices
 * - `list_stripe_invoices` - List invoices
 * - `get_stripe_invoice` - Get invoice details
 *
 * ### Payments
 * - `list_stripe_payment_intents` - List payment intents
 * - `get_stripe_payment_intent` - Get payment intent details
 * - `list_stripe_payment_methods` - List payment methods
 * - `get_stripe_payment_method` - Get payment method details
 *
 * ### Products
 * - `list_stripe_products` - List products
 * - `get_stripe_product` - Get product details
 * - `list_stripe_prices` - List prices
 * - `get_stripe_price` - Get price details
 *
 * @example
 * ```typescript
 * import { createServer } from '@pulwave/mcp-stripe';
 *
 * const server = createServer({
 *   secretKey: process.env.STRIPE_SECRET_KEY,
 * });
 *
 * await server.start();
 * ```
 */

export { PulwaveStripeMcpServer, createServer } from './server';
export { StripeProvider, type StripeConfig } from './provider';
export * from './tools';
