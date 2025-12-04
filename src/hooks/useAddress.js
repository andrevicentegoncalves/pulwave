import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Custom hook for managing address data
 * Handles CRUD operations for addresses with proper encapsulation
 * 
 * @param {string} profileId - The profile ID to associate addresses with
 * @returns {Object} Address management functions and state
 */
export const useAddress = (profileId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Create or update an address
     * @param {Object} addressData - Address data to save
     * @param {string} addressId - Existing address ID (for updates)
     * @returns {Promise<string>} The address ID
     */
    const saveAddress = useCallback(async (addressData, addressId = null) => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                country_id: addressData.country_id || null,
                region_id: addressData.region_id || null,
                locality_id: addressData.locality_id || null,
                city_name: addressData.city_name || '',
                street_name: addressData.street_name || '',
                number: addressData.number || '',
                floor: addressData.floor || '',
                postal_code: addressData.postal_code || '',
                address_type: addressData.type || 'physical',
                updated_at: new Date().toISOString(),
                // Include Nominatim data for trigger to auto-create region/locality
                nominatim_data: addressData.nominatim_data || null,
            };

            if (addressId) {
                // Update existing address
                const { error: updateError } = await supabase
                    .from('addresses')
                    .update(payload)
                    .eq('id', addressId);

                if (updateError) throw updateError;
                return addressId;
            } else {
                // Create new address
                payload.created_at = new Date().toISOString();

                const { data, error: insertError } = await supabase
                    .from('addresses')
                    .insert([payload])
                    .select()
                    .single();

                if (insertError) throw insertError;
                return data.id;
            }
        } catch (err) {
            console.error('Error saving address:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Load an address by ID
     * @param {string} addressId - Address ID to load
     * @returns {Promise<Object>} Address data
     */
    const loadAddress = useCallback(async (addressId) => {
        if (!addressId) return null;

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('addresses')
                .select('*')
                .eq('id', addressId)
                .single();

            if (fetchError) throw fetchError;
            return data;
        } catch (err) {
            console.error('Error loading address:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Delete an address
     * @param {string} addressId - Address ID to delete
     */
    const deleteAddress = useCallback(async (addressId) => {
        setLoading(true);
        setError(null);

        try {
            const { error: deleteError } = await supabase
                .from('addresses')
                .delete()
                .eq('id', addressId);

            if (deleteError) throw deleteError;
        } catch (err) {
            console.error('Error deleting address:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Ensure a region exists in the database
     * Creates it if it doesn't exist
     * @param {string} regionName - Region name
     * @param {string} countryId - Country ID
     * @returns {Promise<string>} Region ID
     */
    const ensureRegion = useCallback(async (regionName, countryId) => {
        if (!regionName || !countryId) return null;

        try {
            // Check if region exists
            const { data: existing } = await supabase
                .from('regions')
                .select('id')
                .eq('name', regionName)
                .eq('country_id', countryId)
                .maybeSingle();

            if (existing) {
                return existing.id;
            }

            // Create new region
            const { data: newRegion, error: insertError } = await supabase
                .from('regions')
                .insert([{
                    name: regionName,
                    country_id: countryId,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (insertError) throw insertError;
            return newRegion.id;
        } catch (err) {
            console.error('Error ensuring region:', err);
            return null;
        }
    }, []);

    return {
        saveAddress,
        loadAddress,
        deleteAddress,
        ensureRegion,
        loading,
        error,
    };
};
