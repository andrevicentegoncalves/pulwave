/**
 * Translation Service
 * Supabase integration layer for the translation system
 */
import { supabase } from '../lib/supabaseClient';

/**
 * @typedef {Object} Bundle
 * @property {string} bundle_type - Type of bundle (ui, schema, enum)
 * @property {Object} bundle_data - The translation data as JSONB
 * @property {string} content_hash - Hash for cache validation
 */

/**
 * @typedef {Object} Locale
 * @property {string} code - Locale code (e.g., 'en-US')
 * @property {string} language_code - Language code (e.g., 'en')
 * @property {string} country_code - Country code (e.g., 'US')
 * @property {string} name - English name
 * @property {string} native_name - Native name
 * @property {boolean} is_rtl - Right-to-left flag
 * @property {boolean} is_active - Active status
 */

/**
 * Fetch translation bundles for a locale
 * Fetches ui, schema, and enum bundles from the translation_bundles table
 *
 * @param {string} locale - Locale code (e.g., 'en-US')
 * @param {string|null} orgId - Organization ID for org-specific translations (null for global)
 * @returns {Promise<Object>} - Object with ui, schema, enum bundles and their hashes
 */
export async function fetchBundles(locale, orgId = null) {
    try {
        // Build query - fetch global bundles or org-specific
        let query = supabase
            .from('translation_bundles')
            .select('bundle_type, bundle_data, content_hash')
            .eq('locale_code', locale)
            .eq('is_active', true);

        // Filter by organization - null for global bundles
        if (orgId) {
            // Get both global and org-specific, org takes precedence
            query = query.or(`organization_id.is.null,organization_id.eq.${orgId}`);
        } else {
            query = query.is('organization_id', null);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        // Organize bundles by type
        const bundles = {
            ui: {},
            schema: {},
            enum: {}
        };

        const hashes = {
            ui: null,
            schema: null,
            enum: null
        };

        // Process results - org-specific overrides global
        const processedTypes = new Set();
        const orgBundles = data?.filter(b => b.organization_id) || [];
        const globalBundles = data?.filter(b => !b.organization_id) || [];

        // Process org-specific first (higher priority)
        [...orgBundles, ...globalBundles].forEach(bundle => {
            const type = bundle.bundle_type;
            if (!processedTypes.has(type)) {
                bundles[type] = bundle.bundle_data || {};
                hashes[type] = bundle.content_hash;
                processedTypes.add(type);
            }
        });

        return { bundles, hashes };
    } catch (error) {
        console.error('Failed to fetch translation bundles:', error);
        throw error;
    }
}

/**
 * Fetch only content hashes for cache validation
 * More efficient than fetching full bundles
 *
 * @param {string} locale - Locale code
 * @param {string|null} orgId - Organization ID
 * @returns {Promise<Object>} - Object with hashes { ui, schema, enum }
 */
export async function fetchBundleHashes(locale, orgId = null) {
    try {
        let query = supabase
            .from('translation_bundles')
            .select('bundle_type, content_hash')
            .eq('locale_code', locale)
            .eq('is_active', true);

        if (orgId) {
            query = query.or(`organization_id.is.null,organization_id.eq.${orgId}`);
        } else {
            query = query.is('organization_id', null);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        const hashes = {
            ui: null,
            schema: null,
            enum: null
        };

        data?.forEach(bundle => {
            if (!hashes[bundle.bundle_type]) {
                hashes[bundle.bundle_type] = bundle.content_hash;
            }
        });

        return hashes;
    } catch (error) {
        console.error('Failed to fetch bundle hashes:', error);
        throw error;
    }
}

/**
 * Update user's preferred locale in user_preferences
 *
 * @param {string} profileId - Profile ID
 * @param {string} locale - New locale code
 * @returns {Promise<Object>} - Updated preferences data
 */
export async function updateUserLocale(profileId, locale) {
    try {
        // First check if preferences exist
        const { data: existing } = await supabase
            .from('user_preferences')
            .select('id')
            .eq('profile_id', profileId)
            .maybeSingle();

        if (existing) {
            // Update existing
            const { data, error } = await supabase
                .from('user_preferences')
                .update({
                    locale: locale,
                    updated_at: new Date().toISOString()
                })
                .eq('profile_id', profileId)
                .select('id, locale')
                .single();

            if (error) throw error;
            return data;
        } else {
            // Insert new preferences
            const { data, error } = await supabase
                .from('user_preferences')
                .insert({
                    profile_id: profileId,
                    locale: locale
                })
                .select('id, locale')
                .single();

            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Failed to update user locale:', error);
        throw error;
    }
}

/**
 * Get available (active) locales from the database
 * Returns only locales that are marked as active
 *
 * @returns {Promise<Locale[]>} - Array of active locale objects
 */
export async function getAvailableLocales() {
    try {
        const { data, error } = await supabase
            .from('locales')
            .select('code, language_code, country_code, name, native_name, is_rtl')
            .eq('is_active', true)
            .order('name');

        if (error) {
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch available locales:', error);
        throw error;
    }
}

/**
 * Get all locales (including inactive) for admin purposes
 *
 * @returns {Promise<Locale[]>} - Array of all locale objects
 */
export async function getAllLocales() {
    try {
        const { data, error } = await supabase
            .from('locales')
            .select('*')
            .order('name');

        if (error) {
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch all locales:', error);
        throw error;
    }
}

/**
 * Get locale details by code
 *
 * @param {string} localeCode - Locale code (e.g., 'en-US')
 * @returns {Promise<Locale|null>} - Locale object or null
 */
export async function getLocaleByCode(localeCode) {
    try {
        const { data, error } = await supabase
            .from('locales')
            .select('code, language_code, country_code, name, native_name, is_rtl, is_active')
            .eq('code', localeCode)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch locale:', error);
        return null;
    }
}

/**
 * Get content translation for dynamic content
 * Used for translating user-generated content that's stored in content_translations
 *
 * @param {string} entityType - Type of entity (e.g., 'product', 'category')
 * @param {string} entityId - UUID of the entity
 * @param {string} field - Field name to get translation for
 * @param {string} locale - Target locale
 * @returns {Promise<string|null>} - Translated content or null
 */
export async function getContentTranslation(entityType, entityId, field, locale) {
    try {
        const { data, error } = await supabase
            .from('content_translations')
            .select('translated_content')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .eq('field_name', field)
            .eq('locale_code', locale)
            .eq('is_active', true)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data?.translated_content || null;
    } catch (error) {
        console.error('Failed to fetch content translation:', error);
        return null;
    }
}

/**
 * Get multiple content translations for an entity
 *
 * @param {string} entityType - Type of entity
 * @param {string} entityId - UUID of the entity
 * @param {string} locale - Target locale
 * @returns {Promise<Object>} - Object mapping field names to translations
 */
export async function getEntityTranslations(entityType, entityId, locale) {
    try {
        const { data, error } = await supabase
            .from('content_translations')
            .select('field_name, translated_content')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .eq('locale_code', locale)
            .eq('is_active', true);

        if (error) {
            throw error;
        }

        // Convert array to object keyed by field_name
        const translations = {};
        data?.forEach(item => {
            translations[item.field_name] = item.translated_content;
        });

        return translations;
    } catch (error) {
        console.error('Failed to fetch entity translations:', error);
        return {};
    }
}

/**
 * Get user's locale from user_preferences
 *
 * @param {string} authUserId - Auth user ID
 * @returns {Promise<string>} - User's locale or 'en-US' as default
 */
export async function getUserLocale(authUserId) {
    try {
        // First get profile ID
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('auth_user_id', authUserId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
        }

        if (!profile) return 'en-US';

        // Get preferences
        const { data: prefs, error: prefsError } = await supabase
            .from('user_preferences')
            .select('locale')
            .eq('profile_id', profile.id)
            .maybeSingle();

        if (prefsError && prefsError.code !== 'PGRST116') {
            throw prefsError;
        }

        return prefs?.locale || 'en-US';
    } catch (error) {
        console.error('Failed to fetch user locale:', error);
        return 'en-US';
    }
}

/**
 * Get user's profile ID and locale
 *
 * @param {string} authUserId - Auth user ID
 * @returns {Promise<Object>} - { profileId, locale }
 */
export async function getUserProfileAndLocale(authUserId) {
    try {
        // Get profile with preferences in one query
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('auth_user_id', authUserId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
        }

        if (!profile) {
            return { profileId: null, locale: 'en-US' };
        }

        // Get preferences
        const { data: prefs } = await supabase
            .from('user_preferences')
            .select('locale')
            .eq('profile_id', profile.id)
            .maybeSingle();

        return {
            profileId: profile.id,
            locale: prefs?.locale || 'en-US'
        };
    } catch (error) {
        console.error('Failed to fetch user profile and locale:', error);
        return { profileId: null, locale: 'en-US' };
    }
}

/**
 * Translation service object for convenient imports
 */
export const translationService = {
    fetchBundles,
    fetchBundleHashes,
    updateUserLocale,
    getAvailableLocales,
    getAllLocales,
    getLocaleByCode,
    getContentTranslation,
    getEntityTranslations,
    getUserLocale,
    getUserProfileAndLocale
};

export default translationService;
