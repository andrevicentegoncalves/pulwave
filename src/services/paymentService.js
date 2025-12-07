// src/services/paymentService.js
import { paymentRepository } from '../repositories';
import { getCardExpiryStatus } from '../utils/dateHelpers';

/**
 * Payment Service
 * Business logic layer for payment method operations.
 * Uses paymentRepository for data access (provider-agnostic).
 */
export const paymentService = {
    /**
     * Get all active subscription plans
     * @returns {Promise<Array>} List of subscription plans
     */
    async getSubscriptionPlans() {
        return paymentRepository.findSubscriptionPlans();
    },

    /**
     * Get all payment methods for an organization with enriched data
     * @param {string} organizationId - Organization UUID
     * @returns {Promise<Array>} Array of payment methods with computed fields
     */
    async getPaymentMethods(organizationId) {
        const methods = await paymentRepository.findAll(organizationId);

        // Enrich with computed expiry status
        return methods.map(method => {
            const expiryStatus = getCardExpiryStatus(method.expiry_month, method.expiry_year);
            return {
                ...method,
                isExpired: expiryStatus?.isExpired ?? false,
                isExpiringSoon: expiryStatus?.isExpiringSoon ?? false,
                daysUntilExpiry: expiryStatus?.daysRemaining ?? null,
            };
        });
    },

    /**
     * Get a single payment method by ID
     * @param {string} id - Payment method UUID
     * @returns {Promise<Object>} Payment method data
     */
    async getPaymentMethodById(id) {
        return paymentRepository.findById(id);
    },

    /**
     * Create a new payment method
     * @param {Object} paymentData - Payment method data
     * @returns {Promise<Object>} Created payment method
     */
    async createPaymentMethod(paymentData) {
        return paymentRepository.create(paymentData);
    },

    /**
     * Update an existing payment method
     * @param {string} id - Payment method UUID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated payment method
     */
    async updatePaymentMethod(id, updates) {
        return paymentRepository.update(id, updates);
    },

    /**
     * Soft delete a payment method
     * @param {string} id - Payment method UUID
     * @returns {Promise<void>}
     */
    async deletePaymentMethod(id) {
        return paymentRepository.softDelete(id);
    },

    /**
     * Set a payment method as the default
     * @param {string} id - Payment method UUID
     * @param {string} organizationId - Organization UUID
     * @returns {Promise<void>}
     */
    async setDefaultPaymentMethod(id, organizationId) {
        // Unset all defaults first
        await paymentRepository.unsetAllDefaults(organizationId);
        // Set new default
        await paymentRepository.update(id, { is_default: true });
    },

    /**
     * Retry verification for a payment method
     * @param {string} id - Payment method UUID
     * @returns {Promise<Object>} Updated payment method
     */
    async retryVerification(id) {
        return paymentRepository.update(id, {
            verification_status: 'pending',
            failure_count: 0,
            last_failure_reason: null,
            last_failure_at: null,
        });
    },

    /**
     * Get billing history
     * @param {string} organizationId 
     * @returns {Promise<Array>}
     */
    async getBillingHistory(organizationId) {
        return paymentRepository.findSubscriptionInvoices(organizationId);
    },

    /**
     * Get payment method icons from the database
     * @returns {Promise<Array>} Array of available payment method icons
     */
    async getPaymentMethodIcons() {
        return paymentRepository.getIcons();
    }
};

export default paymentService;
