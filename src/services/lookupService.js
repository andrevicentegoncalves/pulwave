/**
 * Lookup Service
 * 
 * Fetches reference data from database tables instead of hardcoded constants.
 * This ensures single source of truth and automatic updates.
 */

import { supabase } from '../lib/supabaseClient';

// Cache for lookup data to avoid repeated fetches
const cache = {
    timezones: null,
    relationships: null,
    relationships: null,
    regions: null,
    countries: null,
    countriesWithPhone: null,
    countryById: {},
    lastFetch: {},
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Check if cache is still valid
 */
const isCacheValid = (key) => {
    const lastFetch = cache.lastFetch[key];
    return lastFetch && (Date.now() - lastFetch) < CACHE_TTL;
};

// =============================================================================
// TIMEZONES
// Fetches from: public.timezones table
// =============================================================================

/**
 * Fetch timezones from database
 * @returns {Promise<Array<{value: string, label: string, utcOffset: string}>>}
 */
export const fetchTimezones = async (forceRefresh = false) => {
    if (!forceRefresh && cache.timezones && isCacheValid('timezones')) {
        return cache.timezones;
    }

    try {
        const { data, error } = await supabase
            .from('timezones')
            .select('tz_identifier, display_name, utc_offset')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;

        // Transform to Select component format
        cache.timezones = data.map(tz => ({
            value: tz.tz_identifier,
            label: tz.display_name,
            utcOffset: tz.utc_offset,
        }));
        cache.lastFetch.timezones = Date.now();

        return cache.timezones;
    } catch (error) {
        console.error('Error fetching timezones:', error);
        // Return cached data if available, even if stale
        return cache.timezones || [];
    }
};

// =============================================================================
// RELATIONSHIPS (Emergency Contacts)
// Uses: emergency_relationship enum (to be renamed to 'relationship')
// =============================================================================

/**
 * Relationship options for emergency contacts
 * These map to the emergency_relationship enum in the database
 * Note: Labels are defined here since enums don't store display names
 */
export const RELATIONSHIP_OPTIONS = [
    { value: '', label: 'Select Relationship' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'partner', label: 'Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'aunt-uncle', label: 'Aunt/Uncle' },
    { value: 'niece-nephew', label: 'Niece/Nephew' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'neighbor', label: 'Neighbor' },
    { value: 'caregiver', label: 'Caregiver' },
    { value: 'legal-guardian', label: 'Legal Guardian' },
    { value: 'other', label: 'Other' },
];

/**
 * Get relationship options
 * For now returns static list (enum values need labels)
 * In future, could be loaded from a lookup table with translations
 */
export const getRelationshipOptions = () => RELATIONSHIP_OPTIONS;

// =============================================================================
// REGIONS / ADMINISTRATIVE DIVISIONS
// Fetches from: public.administrative_divisions table
// =============================================================================

/**
 * Fetch administrative divisions (regions, districts, etc.) for a country
 * @param {string} countryId - Country UUID
 * @param {string} divisionType - Type of division (region, district, municipality, parish)
 * @returns {Promise<Array<{value: string, label: string, parentId: string|null}>>}
 */
export const fetchAdministrativeDivisions = async (countryId, divisionType = null, forceRefresh = false) => {
    const cacheKey = `regions_${countryId}_${divisionType || 'all'}`;

    if (!forceRefresh && cache[cacheKey] && isCacheValid(cacheKey)) {
        return cache[cacheKey];
    }

    try {
        let query = supabase
            .from('administrative_divisions')
            .select('id, name, division_type, parent_division_id, code')
            .eq('country_id', countryId)
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (divisionType) {
            query = query.eq('division_type', divisionType);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform to Select component format
        cache[cacheKey] = data.map(div => ({
            value: div.id,
            label: div.name,
            code: div.code,
            type: div.division_type,
            parentId: div.parent_division_id,
        }));
        cache.lastFetch[cacheKey] = Date.now();

        return cache[cacheKey];
    } catch (error) {
        console.error('Error fetching administrative divisions:', error);
        return cache[cacheKey] || [];
    }
};

/**
 * Fetch districts for Portugal (convenience method)
 * @returns {Promise<Array>}
 */
export const fetchPortugalDistricts = async () => {
    // Portugal country ID - you may need to adjust this
    const PORTUGAL_COUNTRY_ID = await getPortugalCountryId();
    if (!PORTUGAL_COUNTRY_ID) return [];

    return fetchAdministrativeDivisions(PORTUGAL_COUNTRY_ID, 'district');
};

/**
 * Get Portugal country ID from countries table
 */
const getPortugalCountryId = async () => {
    try {
        const { data, error } = await supabase
            .from('countries')
            .select('id')
            .eq('code', 'PT')
            .single();

        if (error) throw error;
        return data?.id;
    } catch (error) {
        console.error('Error fetching Portugal country ID:', error);
        return null;
    }
};

// =============================================================================
// LOCALITIES
// Fetches from: public.localities table
// =============================================================================

/**
 * Fetch localities for a given administrative division
 * @param {string} divisionId - Administrative division UUID
 * @returns {Promise<Array<{value: string, label: string}>>}
 */
export const fetchLocalities = async (divisionId, forceRefresh = false) => {
    const cacheKey = `localities_${divisionId}`;

    if (!forceRefresh && cache[cacheKey] && isCacheValid(cacheKey)) {
        return cache[cacheKey];
    }

    try {
        const { data, error } = await supabase
            .from('localities')
            .select('id, name, postal_code')
            .eq('administrative_division_id', divisionId)
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) throw error;

        cache[cacheKey] = data.map(loc => ({
            value: loc.id,
            label: loc.postal_code ? `${loc.name} (${loc.postal_code})` : loc.name,
            name: loc.name,
            postalCode: loc.postal_code,
        }));
        cache.lastFetch[cacheKey] = Date.now();

        return cache[cacheKey];
    } catch (error) {
        console.error('Error fetching localities:', error);
        return cache[cacheKey] || [];
    }
};

// =============================================================================
// COUNTRIES
// Fetches from: public.countries table
// =============================================================================

/**
 * Fetch all countries
 * @returns {Promise<Array>}
 */
export const fetchCountries = async (forceRefresh = false) => {
    if (!forceRefresh && cache.countries && isCacheValid('countries')) {
        return cache.countries;
    }

    try {
        const { data, error } = await supabase
            .from('countries')
            .select('id, name, iso_code_2, phone_code')
            .order('name');

        if (error) throw error;

        cache.countries = data;
        cache.lastFetch.countries = Date.now();

        // Populate byId cache
        data.forEach(country => {
            cache.countryById[country.id] = country;
        });

        return data;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return cache.countries || [];
    }
};

/**
 * Get country by ID
 * @param {string} id - Country UUID
 * @returns {Promise<Object>}
 */
export const getCountryById = async (id) => {
    // Check if we have it in memory first
    if (cache.countryById && cache.countryById[id]) {
        return cache.countryById[id];
    }

    try {
        const { data, error } = await supabase
            .from('countries')
            .select('id, name, iso_code_2, phone_code')
            .eq('id', id)
            .single();

        if (error) throw error;

        cache.countryById[id] = data;
        return data;
    } catch (error) {
        console.error(`Error fetching country ${id}:`, error);
        return null;
    }
};

/**
 * Fetch countries that have phone codes
 * @returns {Promise<Array>}
 */
export const getCountriesWithPhoneCodes = async (forceRefresh = false) => {
    if (!forceRefresh && cache.countriesWithPhone && isCacheValid('countriesWithPhone')) {
        return cache.countriesWithPhone;
    }

    try {
        // If we already have all countries, we can filter them locally
        if (cache.countries && isCacheValid('countries')) {
            const filtered = cache.countries.filter(c => c.phone_code);
            cache.countriesWithPhone = filtered;
            return filtered;
        }

        const { data, error } = await supabase
            .from('countries')
            .select('id, name, iso_code_2, phone_code')
            .not('phone_code', 'is', null)
            .order('name');

        if (error) throw error;

        cache.countriesWithPhone = data;
        cache.lastFetch.countriesWithPhone = Date.now();
        return data;
    } catch (error) {
        console.error('Error fetching phone codes:', error);
        return cache.countriesWithPhone || [];
    }
};

// =============================================================================
// CACHE MANAGEMENT
// =============================================================================

/**
 * Clear all cached lookup data
 */
export const clearLookupCache = () => {
    cache.timezones = null;
    cache.relationships = null;
    cache.regions = null;
    cache.lastFetch = {};
    // Clear dynamic cache keys
    Object.keys(cache).forEach(key => {
        if (key.startsWith('regions_') || key.startsWith('localities_')) {
            delete cache[key];
        }
    });
    cache.countries = null;
    cache.countriesWithPhone = null;
    cache.countryById = {};
};

/**
 * Preload commonly used lookup data
 */
export const preloadLookups = async () => {
    await Promise.all([
        fetchTimezones(),
    ]);
};

export const lookupService = {
    fetchTimezones,
    getRelationshipOptions,
    fetchAdministrativeDivisions,
    fetchPortugalDistricts,
    fetchLocalities,
    clearLookupCache,
    preloadLookups,
    fetchLocalities,
    fetchCountries,
    getCountryById,
    getCountriesWithPhoneCodes,
    clearLookupCache,
    preloadLookups,
    RELATIONSHIP_OPTIONS,
};

export default lookupService;
