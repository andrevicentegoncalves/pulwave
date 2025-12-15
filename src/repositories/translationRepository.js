import { supabase } from '../lib/supabaseClient';
import { DATABASE_TABLES, TABLE_COLUMNS, TABLE_LABELS } from '../constants/schema';

/**
 * Translation Repository
 * Data access layer for translation management.
 */
export const translationRepository = {
    // ==================== UI TRANSLATIONS ====================
    async getUITranslations({ page = 1, limit = 50, locale = '', search = '', key = '', source_type = '', category = '' }) {
        // Base query
        let query;

        // OPTIMIZATION: If viewing "All" (no locale/search), paginate by Distinct Keys
        if (!locale && !search) {
            query = supabase
                .from('distinct_ui_translations')
                .select('translation_key', { count: 'exact' });

            if (key) query = query.eq('translation_key', key);
            if (source_type) query = query.eq('source_type', source_type);
            if (category) query = query.eq('category', category);

            query = query
                .order('translation_key', { ascending: true })
                .range((page - 1) * limit, page * limit - 1);

            const { data: keys, error: keyError, count } = await query;
            if (keyError) throw keyError;
            if (!keys || keys.length === 0) return { data: [], count: 0 };

            // Fetch details for these keys
            const keyList = keys.map(k => k.translation_key);
            const { data, error } = await supabase
                .from('ui_translations')
                .select('*')
                .in('translation_key', keyList)
                .eq('is_active', true)
                .order('translation_key')
                .order('locale_code');

            if (error) throw error;
            return { data, count };
        }

        // Fallback: Standard Filtered Query (Raw Rows)
        query = supabase
            .from('ui_translations')
            .select('*', { count: 'exact' })
            .eq('is_active', true);

        // Filters
        if (locale) query = query.eq('locale_code', locale);
        if (key) query = query.eq('translation_key', key);
        if (search) query = query.ilike('translation_key', `%${search}%`);
        if (source_type) query = query.eq('source_type', source_type);
        if (category) query = query.eq('category', category);

        // Pagination & Ordering
        query = query
            .order('translation_key', { ascending: true })
            .order('locale_code', { ascending: true })
            .range((page - 1) * limit, page * limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;
        return { data, count };
    },

    async saveUITranslation(translation) {
        const { id, ...data } = translation;
        const { data: result, error } = await supabase
            .from('ui_translations')
            .upsert({
                ...data,
                id: id || undefined,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        if (error) throw error;
        return result;
    },

    async upsertBatchUITranslations(translations) {
        if (!translations || translations.length === 0) return [];

        const updates = translations.map(t => ({
            ...t,
            updated_at: new Date().toISOString()
        }));

        const { data, error } = await supabase
            .from('ui_translations')
            .upsert(updates, { onConflict: 'translation_key, locale_code' })
            .select();

        if (error) throw error;
        return data;
    },

    async deleteUITranslation(id) {
        const { data, error } = await supabase
            .from('ui_translations')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // ==================== SCHEMA TRANSLATIONS ====================
    async getSchemaTranslations({ page = 1, limit = 50, locale = '', search = '', table = '', column = '' }) {
        // OPTIMIZATION: If viewing "All" (no specific column/search), paginate by Distinct Tables
        if (!locale && !search && !column) {
            let query = supabase
                .from('distinct_schema_tables')
                .select('table_name', { count: 'exact' });

            if (table) query = query.eq('table_name', table);

            query = query
                .order('table_name', { ascending: true })
                .range((page - 1) * limit, page * limit - 1);

            const { data: tables, error: tableError, count } = await query;
            if (tableError) throw tableError;
            if (!tables || tables.length === 0) return { data: [], count: 0 };

            const tableList = tables.map(t => t.table_name);
            const { data, error } = await supabase
                .from('schema_translations')
                .select('*')
                .in('table_name', tableList)
                .eq('is_active', true)
                .order('table_name')
                .order('column_name')
                .order('locale_code');

            if (error) throw error;
            return { data, count };
        }

        let query = supabase
            .from('schema_translations')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .eq('schema_exists', true); // Only show currently existing schema items

        if (locale) query = query.eq('locale_code', locale);
        if (table) query = query.eq('table_name', table);
        if (column) query = query.eq('column_name', column);
        if (search) {
            query = query.or(`table_name.ilike.%${search}%,column_name.ilike.%${search}%,translated_label.ilike.%${search}%`);
        }

        query = query
            .order('table_name', { ascending: true })
            .order('column_name', { ascending: true, nullsFirst: true }) // Table labels first
            .order('locale_code', { ascending: true })
            .range((page - 1) * limit, page * limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;
        return { data, count };
    },

    async saveSchemaTranslation(translation) {
        const { id, ...data } = translation;
        const { data: result, error } = await supabase
            .from('schema_translations')
            .upsert({
                ...data,
                id: id || undefined,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        if (error) throw error;
        return result;
    },

    // ==================== CONTENT TRANSLATIONS ====================
    async getContentTranslations({ page = 1, limit = 50, locale = '', search = '', table = '' }) {
        if (!locale && !search) {
            let query = supabase
                .from('distinct_content_records')
                .select('table_name, record_id', { count: 'exact' });

            if (table) query = query.eq('table_name', table);

            query = query
                .order('table_name', { ascending: true })
                .range((page - 1) * limit, page * limit - 1);

            const { data: records, error: recError, count } = await query;
            if (recError) throw recError;
            if (!records || records.length === 0) return { data: [], count: 0 };

            // Fetch translations for these records
            // Need "OR" condition on (table, record) pairs? 
            // Supabase doesn't support generic tuple IN.
            // But usually we filter by table anyway. If mixed tables, we fetch all by record_id?
            // Record IDs might collide across tables? Yes.
            // So we must fetch where (table=A and record=X) OR (table=B and record=Y).
            // Supabase `or` syntax: `and(table_name.eq.A,record_id.eq.X),and(...)`

            // Construct OR string
            const orConditions = records.map(r => `and(table_name.eq.${r.table_name},record_id.eq.${r.record_id})`).join(',');
            const { data, error } = await supabase
                .from('content_translations')
                .select('*')
                .or(orConditions)
                .order('table_name')
                .order('locale_code');

            if (error) throw error;
            return { data, count };
        }

        let query = supabase
            .from('content_translations')
            .select('*', { count: 'exact' });

        if (locale) query = query.eq('locale_code', locale);
        if (table) query = query.eq('table_name', table);
        if (search) {
            // Assumes table_name, column_name, translated_text exist
            query = query.or(`table_name.ilike.%${search}%,column_name.ilike.%${search}%,translated_text.ilike.%${search}%`);
        }

        query = query
            .order('table_name', { ascending: true })
            .order('locale_code', { ascending: true })
            .range((page - 1) * limit, page * limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;
        return { data, count };
    },

    async saveContentTranslation(translation) {
        const { id, ...data } = translation;
        const { data: result, error } = await supabase
            .from('content_translations')
            .upsert({
                ...data,
                id: id || undefined,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        if (error) throw error;
        return result;
    },

    // ==================== ENUM TRANSLATIONS ====================
    async getEnumTranslations({ page = 1, limit = 50, locale = '', search = '', enumName = '' }) {
        if (!locale && !search) {
            let query = supabase
                .from('distinct_enum_names')
                .select('enum_name', { count: 'exact' });

            if (enumName) query = query.eq('enum_name', enumName);

            query = query
                .order('enum_name', { ascending: true })
                .range((page - 1) * limit, page * limit - 1);

            const { data: enums, error: enumError, count } = await query;
            if (enumError) throw enumError;
            if (!enums || enums.length === 0) return { data: [], count: 0 };

            const nameList = enums.map(e => e.enum_name);
            const { data, error } = await supabase
                .from('enum_translations')
                .select('*')
                .in('enum_name', nameList)
                .order('enum_name')
                .order('enum_value')
                .order('locale');

            if (error) throw error;
            return { data, count };
        }

        let query = supabase
            .from('enum_translations')
            .select('*', { count: 'exact' });

        if (locale) query = query.eq('locale', locale);
        if (enumName) query = query.eq('enum_name', enumName);
        if (search) {
            query = query.or(`enum_name.ilike.%${search}%,enum_value.ilike.%${search}%,translated_label.ilike.%${search}%`);
        }

        query = query
            .order('enum_name', { ascending: true })
            .order('enum_value', { ascending: true })
            .order('locale', { ascending: true })
            .range((page - 1) * limit, page * limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;
        return { data, count };
    },

    async saveEnumTranslation(translation) {
        const { id, ...data } = translation;
        const { data: result, error } = await supabase
            .from('enum_translations')
            .upsert({
                ...data,
                id: id || undefined,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        if (error) throw error;
        return result;
    },

    // ==================== MASTER DATA TRANSLATIONS ====================
    async getMasterDataTranslations({ page = 1, limit = 50, locale = '', search = '' }) {
        let query = supabase
            .from('master_data_translations')
            .select('*', { count: 'exact' })
            .eq('is_active', true);

        if (locale) query = query.eq('locale_code', locale);
        if (search) {
            query = query.or(`translated_label.ilike.%${search}%,translated_description.ilike.%${search}%`);
        }

        query = query
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;

        return { data: data || [], count };
    },

    async saveMasterDataTranslation(translation) {
        const { id, ...data } = translation;
        const { data: result, error } = await supabase
            .from('master_data_translations')
            .upsert({
                ...data,
                id: id || undefined,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        if (error) throw error;
        return result;
    },

    // ==================== SUPPORTED LOCALES ====================
    async getSupportedLocales() {
        console.log('[translationRepository] Fetching locales from locales table...');

        // Fetch from locales table
        const { data, error } = await supabase
            .from('locales')
            .select('*')
            .eq('is_active', true)
            .order('code');

        if (error) {
            console.error('[translationRepository] ❌ ERROR fetching locales:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint,
                fullError: error
            });
            throw error;
        }

        console.log(`[translationRepository] ✅ Successfully fetched ${data?.length || 0} locales`);
        return data || [];
    },

    // ==================== TRANSLATION BUNDLES ====================
    async generateTranslationBundles(locale) {
        const { data, error } = await supabase
            .rpc('generate_all_translation_bundles', { p_locale: locale });

        if (error) throw error;
        return data;
    },

    async getTranslationBundles(locale) {
        let query = supabase
            .from('translation_bundles')
            .select('id, locale_code, bundle_type, translation_count, generated_at, content_hash')
            .eq('is_active', true)
            .order('locale_code')
            .order('bundle_type');

        if (locale) query = query.eq('locale_code', locale);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // ==================== SCHEMA INTROSPECTION (LEGACY & UTILS) ====================
    /**
     * Get ALL database tables for selection dropdowns
     * Now primarily used for reference or seeding schema_translations
     */
    async getAllDatabaseTables() {
        // Query ALL public tables via RPC function (bypasses RLS, queries information_schema)
        const { data, error } = await supabase.rpc('get_all_public_tables');

        if (!error && data) {
            return data.map(t => ({
                table_name: t.table_name,
                label: TABLE_LABELS[t.table_name] || t.table_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            })).sort((a, b) => a.table_name.localeCompare(b.table_name));
        }

        // Fallback: try schema_translations if RPC not available
        const { data: schemaData, error: schemaError } = await supabase
            .from('schema_translations')
            .select('table_name')
            .eq('is_active', true);

        if (!schemaError && schemaData) {
            const unique = [...new Set(schemaData.map(d => d.table_name))];
            return unique.map(t => ({
                table_name: t,
                label: TABLE_LABELS[t] || t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            })).sort((a, b) => a.table_name.localeCompare(b.table_name));
        }

        return [];
    },

    async getAllTableColumns(tableName) {
        return TABLE_COLUMNS[tableName] || [];
    },

    /**
     * Get ALL enum types and their values from the database.
     * Returns array of { enum_name, enum_value } objects for dropdown building.
     * The get_database_enums RPC function should return rows with enum_name and enum_value columns.
     */
    async getDatabaseEnums() {
        const { data, error } = await supabase.rpc('get_database_enums');
        if (error) throw error;

        // The RPC may return just enum names or name+value pairs.
        // Normalize to return objects with enum_name and optionally enum_value.
        if (!data || data.length === 0) return [];

        // Check if the first row has enum_value (full data) or just enum_name
        const firstRow = data[0];
        if (firstRow.enum_value !== undefined) {
            // Full format with values: { enum_name: 'user_type', enum_value: 'personal' }
            return data;
        } else if (firstRow.enum_name !== undefined) {
            // Only enum names: { enum_name: 'user_type' }
            return data;
        } else if (typeof firstRow === 'string') {
            // Plain strings: 'user_type'
            return data.map(name => ({ enum_name: name, enum_value: null }));
        }

        // Fallback: assume it has an 'enum_name' key accessible
        return data.map(row => ({
            enum_name: row.enum_name || row,
            enum_value: row.enum_value || null
        }));
    },

    // ==================== GENERIC TABLE DATA (For Selectors) ====================
    async getTableRecords(tableName, { limit = 100 } = {}) {
        // Validation: Ensure we don't query system tables or secrets if unauthorized
        // Ideally RLS handles this, but we can verify it's a basic public view access
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(limit);

        if (error) throw error;
        return data || [];
    },
};

export default translationRepository;
