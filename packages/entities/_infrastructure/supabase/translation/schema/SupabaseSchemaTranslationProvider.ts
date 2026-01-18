/**
 * Supabase Schema Translation Provider
 * Database schema translations.
 */
import type { DbTable, SchemaTranslation, TranslationParams } from '@pulwave/entity-translation';

import { getSupabase } from '../../client';

interface SchemaTranslationRow {
    id: string;
    table_name: string;
    column_name: string;
    locale_code: string;
    translation: string;
    is_active: boolean;
}

function mapRowToSchemaTranslation(row: SchemaTranslationRow): SchemaTranslation {
    return {
        id: row.id,
        table_name: row.table_name,
        column_name: row.column_name,
        locale: row.locale_code,
        translation: row.translation,
        is_active: row.is_active,
    };
}

export const SupabaseSchemaTranslationProvider = {
    async getSchemaTableList(_params?: TranslationParams): Promise<DbTable[]> {
        const { data, error } = await getSupabase().rpc('get_translatable_tables');
        if (error) throw error;
        return (data || []) as DbTable[];
    },

    async getSchemaTableTranslations(tableName: string, _options?: TranslationParams): Promise<SchemaTranslation[]> {
        const { data, error } = await getSupabase().from('schema_translations').select('*').eq('table_name', tableName);
        if (error) throw error;
        return (data || []).map((row) => mapRowToSchemaTranslation(row as SchemaTranslationRow));
    },

    async getSchemaTranslations(params: { tableName?: string }): Promise<SchemaTranslation[]> {
        let query = getSupabase().from('schema_translations').select('id, table_name, column_name, locale_code, translation, is_active');
        if (params.tableName) query = query.eq('table_name', params.tableName);
        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map((row) => mapRowToSchemaTranslation(row as SchemaTranslationRow));
    },

    async saveSchemaTranslation(translation: Partial<SchemaTranslation>): Promise<SchemaTranslation> {
        const mapped = {
            id: translation.id,
            table_name: translation.table_name,
            column_name: translation.column_name,
            locale_code: translation.locale,
            translation: translation.translation,
            is_active: translation.is_active,
        };
        const { data, error } = await getSupabase().from('schema_translations').upsert(mapped).select().single();
        if (error) throw error;
        return mapRowToSchemaTranslation(data as SchemaTranslationRow);
    },
};

