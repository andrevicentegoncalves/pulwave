/**
 * Address Service
 * Centralized data access layer for address-related operations
 */
import { supabase } from '../lib/supabaseClient';

export const addressService = {
    /**
     * Get addresses by profile ID
     */
    async getByProfileId(profileId) {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('profile_id', profileId);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get address by type
     */
    async getByType(profileId, addressType) {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('profile_id', profileId)
            .eq('address_type', addressType)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Upsert address
     */
    async upsert(profileId, addressType, addressData) {
        const { data: existing } = await supabase
            .from('addresses')
            .select('id')
            .eq('profile_id', profileId)
            .eq('address_type', addressType)
            .maybeSingle();

        const payload = {
            profile_id: profileId,
            address_type: addressType,
            ...addressData,
        };

        if (existing) {
            const { data, error } = await supabase
                .from('addresses')
                .update(payload)
                .eq('id', existing.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabase
                .from('addresses')
                .insert([payload])
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },

    /**
     * Delete address
     */
    async delete(addressId) {
        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', addressId);

        if (error) throw error;
    },

    /**
     * Map a district name to a region (Portugal specific logic)
     * @param {string} districtName 
     * @returns {string|null}
     */
    getRegionFromDistrict(districtName) {
        if (!districtName) return null;

        const districtToRegion = {
            'Viana do Castelo': 'Norte', 'Braga': 'Norte', 'Porto': 'Norte', 'Vila Real': 'Norte', 'Bragança': 'Norte',
            'Aveiro': 'Centro', 'Viseu': 'Centro', 'Guarda': 'Centro', 'Coimbra': 'Centro', 'Castelo Branco': 'Centro', 'Leiria': 'Centro',
            'Lisboa': 'Lisboa', 'Santarém': 'Lisboa', 'Setúbal': 'Lisboa',
            'Portalegre': 'Alentejo', 'Évora': 'Alentejo', 'Beja': 'Alentejo',
            'Faro': 'Algarve',
            'Açores': 'Açores',
            'Madeira': 'Madeira',
            'Lisbon': 'Lisboa'
        };

        const displayDistrict = districtName === 'Lisbon' ? 'Lisboa' : districtName;
        const region = districtToRegion[displayDistrict] || districtToRegion[districtName];

        return region || null;
    }
};

export default addressService;
