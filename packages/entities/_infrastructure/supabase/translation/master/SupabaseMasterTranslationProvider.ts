/**
 * Supabase Master Data Translation Provider
 * Master data translations.
 */
import type { MasterDataTranslation, TranslationParams } from '@pulwave/entity-translation';

import { getSupabase } from '../../client';

interface MasterDataType {
    id: string;
    name: string;
    key: string;
}

interface MasterDataTranslationRow {
    id: string;
    value_id: string;
    locale_code: string;
    translation: string;
    is_active: boolean;
}

interface MasterDataTranslationWithJoin extends MasterDataTranslationRow {
    master_data_values: { type_id: string };
}

function mapRowToMasterDataTranslation(row: MasterDataTranslationRow): MasterDataTranslation {
    return {
        id: row.id,
        value_id: row.value_id,
        locale: row.locale_code,
        translation: row.translation,
        is_active: row.is_active,
    };
}

export const SupabaseMasterTranslationProvider = {
    async getMasterDataList(_params?: TranslationParams): Promise<MasterDataType[]> {
        const { data, error } = await getSupabase().from('master_data_types').select('id, name, key');
        if (error) throw error;
        return (data || []) as MasterDataType[];
    },

    async getMasterDataTranslationsByValue(valueId: string, _options?: TranslationParams): Promise<MasterDataTranslation[]> {
        const { data, error } = await getSupabase()
            .from('master_data_translations')
            .select('id, value_id, locale_code, translation, is_active')
            .eq('value_id', valueId);
        if (error) throw error;
        return (data || []).map((row) => mapRowToMasterDataTranslation(row as MasterDataTranslationRow));
    },

    async getMasterDataTranslationsByType(typeId: string): Promise<MasterDataTranslation[]> {
        const { data, error } = await getSupabase()
            .from('master_data_translations')
            .select('*, master_data_values!inner(type_id)')
            .eq('master_data_values.type_id', typeId);
        if (error) throw error;
        return (data || []).map((row) => mapRowToMasterDataTranslation(row as MasterDataTranslationWithJoin));
    },

    async getMasterDataTranslations(_params?: TranslationParams): Promise<MasterDataTranslation[]> {
        const query = getSupabase().from('master_data_translations').select('id, value_id, locale_code, translation, is_active');
        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map((row) => mapRowToMasterDataTranslation(row as MasterDataTranslationRow));
    },

    async saveMasterDataTranslation(translation: Partial<MasterDataTranslation>): Promise<MasterDataTranslation> {
        const mapped = {
            id: translation.id,
            value_id: translation.value_id,
            locale_code: translation.locale,
            translation: translation.translation,
            is_active: translation.is_active,
        };
        const { data, error } = await getSupabase().from('master_data_translations').upsert(mapped).select().single();
        if (error) throw error;
        return mapRowToMasterDataTranslation(data as MasterDataTranslationRow);
    },
};

