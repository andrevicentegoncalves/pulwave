// src/repositories/paymentRepository.js
import { supabase } from '../lib/supabaseClient';

/**
 * Payment Repository
 * Data access layer for payment methods.
 * This is the ONLY file that should know about Supabase for payment operations.
 * 
 * If switching providers (Firebase, Prisma, REST API), only this file needs to change.
 */
export const paymentRepository = {
    /**
     * Find all active subscription plans
     * @returns {Promise<Array>} List of plans
     */
    async findSubscriptionPlans() {
        const { data, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Find all active payment methods for an organization
     * @param {string} organizationId - Organization UUID
     * @returns {Promise<Array>} Raw payment methods data
     */
    async findAll(organizationId) {
        const { data, error } = await supabase
            .from('v_payment_methods_with_icons')
            .select('*')
            .eq('organization_id', organizationId)
            .eq('is_active', true)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Find a single payment method by ID
     * @param {string} id - Payment method UUID
     * @returns {Promise<Object|null>} Payment method or null
     */
    async findById(id) {
        const { data, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Create a new payment method
     * @param {Object} data - Payment method data
     * @returns {Promise<Object>} Created record
     */
    async create(data) {
        const { data: created, error } = await supabase
            .from('payment_methods')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return created;
    },

    /**
     * Update a payment method
     * @param {string} id - Payment method UUID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated record
     */
    async update(id, updates) {
        const { data, error } = await supabase
            .from('payment_methods')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Soft delete a payment method
     * @param {string} id - Payment method UUID
     * @returns {Promise<void>}
     */
    async softDelete(id) {
        const { error } = await supabase
            .from('payment_methods')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Unset all defaults for an organization
     * @param {string} organizationId - Organization UUID
     * @returns {Promise<void>}
     */
    async unsetAllDefaults(organizationId) {
        const { error } = await supabase
            .from('payment_methods')
            .update({ is_default: false })
            .eq('organization_id', organizationId)
            .eq('is_active', true);

        if (error) throw error;
    },

    /**
     * Get billing history (invoices)
     * @param {string} organizationId 
     * @returns {Promise<Array>}
     */
    async findSubscriptionInvoices(organizationId) {
        const { data, error } = await supabase
            .from('subscription_invoices')
            .select('*')
            .eq('organization_id', organizationId)
            .eq('is_active', true)
            .order('invoice_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get payment method icons
     * @returns {Promise<Array>} Array of icon records
     */
    async getIcons() {
        const { data, error } = await supabase
            .from('payment_method_icons')
            .select('*')
            .order('display_order');

        if (error) throw error;
        return data || [];
    }
};

export default paymentRepository;
