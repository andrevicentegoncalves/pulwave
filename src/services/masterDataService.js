import { supabase } from '../lib/supabaseClient';
import { lookupService } from './lookupService';

/**
 * Master Data Service
 * Handles automatic creation and management of hierarchical master data
 * (Administrative Divisions for Districts/Municipalities and Localities for Parishes)
 */
export const masterDataService = {

    /**
     * Ensure the full location hierarchy exists for a given address
     * @param {Object} nominatimData - Raw data from Nominatim API
     * @param {string} countryId - UUID of the country
     * @returns {Promise<Object>} Object containing verified IDs { regionId, municipalityId, localityId, parishId }
     */
    async ensureLocationHierarchy(nominatimData, countryId) {
        if (!nominatimData || !nominatimData.address || !countryId) {
            return {
                regionId: null,
                municipalityId: null,
                localityId: null,
                parishId: null
            };
        }

        const addr = nominatimData.address;

        // --- 1. Identify Level 1 (District/Region) ---
        // In Portugal, 'county' often maps to District in Nominatim for some reason, or 'state'
        // We look for 'state', 'region', or 'county' (if it matches a known district pattern)
        // For Portugal specifically:
        // county: "Évora" -> District
        // city: "Évora" -> Municipality

        let districtName = addr.state || addr.region || addr.county;
        if (!districtName && addr['ISO3166-2-lvl6']) {
            // Use config or mapping if needed, but name is best for now
        }

        let districtId = null;
        if (districtName) {
            districtId = await this.findOrCreateDivision(
                districtName,
                'district',
                countryId,
                null
            );
        }

        // --- 2. Identify Level 2 (Municipality/City) ---
        let municipalityName = addr.city || addr.town || addr.municipality;

        // If city equals district (common in PT capitals), ensure we treat them as separate levels
        let municipalityId = null;
        if (municipalityName && districtId) {
            municipalityId = await this.findOrCreateDivision(
                municipalityName,
                'municipality',
                countryId,
                districtId
            );
        }

        // --- 3. Identify Level 3/4 (Locality/Parish) ---
        // In Nominatim, 'city_district', 'suburb', 'neighbourhood', or sometimes 'village'
        let localityName = addr.city_district || addr.suburb || addr.neighbourhood || addr.village || addr.hamlet;

        let localityId = null;
        if (localityName && municipalityId) {
            localityId = await this.findOrCreateLocality(
                localityName,
                'parish', // Default to parish for PT
                municipalityId,
                countryId,
                addr.postcode
            );
        }

        return {
            regionId: districtId, // Mapped to region_division_id
            municipalityId: municipalityId, // Mapped to municipality_division_id
            localityId: localityId, // Mapped to locality_id
            parishId: localityId // For explicit parish field if needed
        };
    },

    /**
     * Find or create an administrative division
     */
    async findOrCreateDivision(name, type, countryId, parentId = null) {
        if (!name) return null;

        // 1. Try to find existing
        let query = supabase
            .from('administrative_divisions')
            .select('id')
            .eq('country_id', countryId)
            .ilike('name', name) // Case insensitive match
            .eq('type', type);

        if (parentId) {
            query = query.eq('parent_division_id', parentId);
        }

        const { data: existing, error } = await query.maybeSingle();

        if (existing) return existing.id;

        // 2. Create if not found
        const payload = {
            name: name,
            type: type,
            country_id: countryId,
            parent_division_id: parentId,
            is_active: true
        };

        const { data: created, error: createError } = await supabase
            .from('administrative_divisions')
            .insert(payload)
            .select('id')
            .single();

        if (createError) {
            // Handle race condition (if created in parallel)
            if (createError.code === '23505') { // Unique violation
                const { data: retry } = await query.maybeSingle();
                return retry?.id || null;
            }
            console.error(`Error creating division ${name}:`, createError);
            return null;
        }

        // Clear cache so UI updates immediately
        lookupService.clearLookupCache();

        return created.id;
    },

    /**
     * Find or create a locality
     */
    async findOrCreateLocality(name, type, divisionId, countryId, postalCode = null) {
        if (!name) return null;

        // 1. Try to find existing
        const { data: existing, error } = await supabase
            .from('localities')
            .select('id')
            .eq('division_id', divisionId) // Start using the new standard column name if available, or administrative_division_id
            // Note: Schema audit showed 'division_id' in localities in Step 997, 
            // but previous code used 'administrative_division_id'. 
            // Schema audit Step 997 -> 'administrative_division_id' was NOT in the list, but 'division_id' WAS.
            // Wait, looking at Step 997 provided by User... 
            // table: 'localities', column: 'division_id' IS present.
            // table: 'localities', column: 'administrative_division_id' IS NOT present in that list.
            // So we must use 'division_id'.
            .eq('division_id', divisionId)
            .ilike('name', name)
            .maybeSingle();

        if (existing) return existing.id;

        // 2. Create if not found
        const payload = {
            name: name,
            place_type: type, // Correct column from schema audit
            division_id: divisionId,
            country_id: countryId,
            postal_code: postalCode,
            is_active: true
        };

        const { data: created, error: createError } = await supabase
            .from('localities')
            .insert(payload)
            .select('id')
            .single();

        if (createError) {
            // Handle race condition
            if (createError.code === '23505') {
                const { data: retry } = await supabase
                    .from('localities')
                    .select('id')
                    .eq('division_id', divisionId)
                    .ilike('name', name)
                    .maybeSingle();
                return retry?.id || null;
            }
            console.error(`Error creating locality ${name}:`, createError);
            return null;
        }

        lookupService.clearLookupCache();

        return created.id;
    }
};

export default masterDataService;
