/**
 * Supabase Enum Translation Provider
 * Enumeration translations.
 */
import type { DbEnum, EnumTranslation, TranslationParams } from '@pulwave/entity-translation';

import { getSupabase } from '../../client';

interface EnumTranslationRow {
    id: string;
    enum_name: string;
    enum_value: string;
    locale_code: string;
    translation: string;
    is_active: boolean;
}

function mapRowToEnumTranslation(row: EnumTranslationRow): EnumTranslation {
    return {
        id: row.id,
        enum_name: row.enum_name,
        enum_value: row.enum_value,
        locale: row.locale_code,
        translation: row.translation,
        is_active: row.is_active,
    };
}

export const SupabaseEnumTranslationProvider = {
    async getEnumList(_params?: TranslationParams): Promise<DbEnum[]> {
        const { data, error } = await getSupabase().rpc('get_translatable_enums');
        if (error) throw error;
        return (data || []) as DbEnum[];
    },

    async getEnumTranslationsByName(enumName: string, _options?: TranslationParams): Promise<EnumTranslation[]> {
        const { data, error } = await getSupabase()
            .from('enum_translations')
            .select('id, enum_name, enum_value, locale_code, translation, is_active')
            .eq('enum_name', enumName);
        if (error) throw error;
        return (data || []).map((row) => mapRowToEnumTranslation(row as EnumTranslationRow));
    },

    async getEnumTranslations(_params?: TranslationParams): Promise<EnumTranslation[]> {
        const query = getSupabase().from('enum_translations').select('id, enum_name, enum_value, locale_code, translation, is_active');
        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map((row) => mapRowToEnumTranslation(row as EnumTranslationRow));
    },

    async saveEnumTranslation(translation: Partial<EnumTranslation>): Promise<EnumTranslation> {
        const mapped = {
            id: translation.id,
            enum_name: translation.enum_name,
            enum_value: translation.enum_value,
            locale_code: translation.locale,
            translation: translation.translation,
            is_active: translation.is_active,
        };
        const { data, error } = await getSupabase().from('enum_translations').upsert(mapped).select().single();
        if (error) throw error;
        return mapRowToEnumTranslation(data as EnumTranslationRow);
    },
};

