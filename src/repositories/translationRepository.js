import { supabase } from '../lib/supabaseClient';
import { TABLE_COLUMNS, DATABASE_TABLES, TABLE_LABELS } from '../constants/schema';

/**
 * Translation Repository
 * Data access layer for translation management.
 */
export const translationRepository = {
    // ==================== UI TRANSLATIONS ====================
    async getUITranslations({ page = 1, limit = 50, locale = '', search = '', key = '', source_type = '', category = '' }) {
        let query = supabase
            .from('ui_translations')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .order('translation_key', { ascending: true })
            .order('locale_code', { ascending: true })
            .range((page - 1) * limit, page * limit - 1);

        if (locale) query = query.eq('locale_code', locale);
        if (key) query = query.eq('translation_key', key);
        if (search) query = query.ilike('translation_key', `%${search}%`);
        if (source_type) query = query.eq('source_type', source_type);
        if (category) query = query.eq('category', category);

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

    async upsertUITranslation(translation) {
        const { data, error } = await supabase
            .from('ui_translations')
            .upsert(translation, { onConflict: 'translation_key,locale_code' })
            .select()
            .single();
        if (error) throw error;
        return data;
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

    // ==================== SUPPORTED LOCALES ====================
    async getSupportedLocales() {
        const { data, error } = await supabase
            .from('supported_locales')
            .select('*')
            .eq('is_active', true)
            .order('display_order');
        if (error) throw error;
        return data || [];
    },

    // ==================== TRANSLATABLE COLUMNS ====================
    async getTranslatableColumns(tableName = null) {
        let query = supabase
            .from('translatable_columns')
            .select('*')
            .eq('is_active', true)
            .order('table_name, column_name');

        if (tableName) query = query.eq('table_name', tableName);

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    async upsertTranslatableColumn(column) {
        const { data, error } = await supabase
            .from('translatable_columns')
            .upsert(column, { onConflict: 'table_name,column_name' })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteTranslatableColumn(id) {
        const { data, error } = await supabase
            .from('translatable_columns')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // ==================== SCHEMA INTROSPECTION ====================
    async getDatabaseTables() {
        try {
            const { data, error } = await supabase
                .from('translatable_columns')
                .select('table_name')
                .eq('is_active', true)
                .order('table_name');

            if (error) throw error;

            const uniqueTables = [...new Set(data.map(d => d.table_name))];

            return uniqueTables.map(t => ({
                table_name: t,
                label: TABLE_LABELS[t] || t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            }));
        } catch (err) {
            console.warn('translatable_columns table not found, using fallback:', err.message);
            return [
                { table_name: 'profiles', label: 'User Profiles' },
                { table_name: 'subscription_plans', label: 'Subscription Plans' },
                { table_name: 'countries', label: 'Countries' },
                { table_name: 'administrative_divisions', label: 'Regions/States' },
                { table_name: 'localities', label: 'Cities/Towns' },
            ];
        }
    },

    async getTableColumns(tableName) {
        try {
            const { data, error } = await supabase
                .from('translatable_columns')
                .select('column_name, column_label')
                .eq('table_name', tableName)
                .eq('is_active', true)
                .order('column_name');

            if (error) throw error;
            return data.map(d => d.column_name);
        } catch (err) {
            console.warn('translatable_columns query failed, using fallback:', err.message);
            const fallback = {
                profiles: ['first_name', 'last_name', 'bio', 'about_me', 'professional_title'],
                subscription_plans: ['name', 'description', 'features'],
                countries: ['name', 'official_name'],
                administrative_divisions: ['name'],
                localities: ['name'],
            };
            return fallback[tableName] || [];
        }
    },

    async getAllDatabaseTables() {
        return DATABASE_TABLES.map(t => ({
            table_name: t,
            label: t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }));
    },

    async getAllTableColumns(tableName) {
        return TABLE_COLUMNS[tableName] || [];
    },
};

export default translationRepository;
