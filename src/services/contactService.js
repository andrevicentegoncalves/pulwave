/**
 * Contact Service
 * CRUD operations for the contacts table (phones, emergency contacts)
 */
import { supabase } from '../lib/supabaseClient';
import { upsertRecord } from './supabaseUtils';

export const contactService = {
    /**
     * Get all contacts for a profile
     */
    async getByProfileId(profileId) {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('profile_id', profileId)
            .eq('is_active', true)
            .order('is_primary', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get contacts by type
     */
    async getByType(profileId, contactType) {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('profile_id', profileId)
            .eq('contact_type', contactType)
            .eq('is_active', true)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Upsert a contact by type
     * Creates or updates based on (profile_id, contact_type)
     */
    async upsertContact(profileId, organizationId, contactType, data) {
        // Skip if no meaningful data
        if (!data.phone && !data.email && !data.contact_name) {
            return null;
        }

        const result = await upsertRecord(
            'contacts',
            { profile_id: profileId, contact_type: contactType },
            {
                organization_id: organizationId,
                contact_value: data.phone || data.email || null,
                country_code: data.phone_country_code || null,
                name: data.contact_name || null,
                relationship: data.relationship || null,
                is_primary: contactType === 'phone-primary',
                is_active: true,
            }
        );

        if (result.error) throw result.error;
        return result.data;
    },


    /**
     * Delete contact (soft delete)
     */
    async deleteContact(id) {
        const { error } = await supabase
            .from('contacts')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Helper: Extract contacts by type from contacts array
     */
    extractByType(contacts, type) {
        return contacts?.find(c => c.contact_type === type) || null;
    },

    /**
     * Helper: Map contacts array to form data fields
     */
    mapToFormData(contacts) {
        const primaryPhone = this.extractByType(contacts, 'phone-primary');
        const secondaryPhone = this.extractByType(contacts, 'phone-secondary');
        const emergencyContact = this.extractByType(contacts, 'phone-emergency');

        return {
            // Primary phone
            phone_code: primaryPhone?.country_code || '',
            phone_number: primaryPhone?.contact_value || '',
            // Secondary phone
            phone_secondary_code: secondaryPhone?.country_code || '',
            phone_secondary_number: secondaryPhone?.contact_value || '',
            // Emergency contact
            emergency_contact_name: emergencyContact?.name || '',
            emergency_contact_phone: emergencyContact?.contact_value || '',
            emergency_contact_relationship: emergencyContact?.relationship || '',
        };
    },
};

export default contactService;
