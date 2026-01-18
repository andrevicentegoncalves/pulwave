/**
 * Supabase UI Translation Provider
 * UI translations operations.
 */
import type { TranslationParams, UITranslation } from '@pulwave/entity-translation';

import { getSupabase } from '../../client';

export const SupabaseUITranslationProvider = {
    async getUITranslations(params: TranslationParams): Promise<UITranslation[]> {
        let query = getSupabase().from('ui_translations').select('id, locale, namespace, key, value, is_active, created_at, updated_at');
        if (params.locale) query = query.eq('locale', params.locale);
        if (params.namespace) query = query.eq('namespace', params.namespace);
        const { data, error } = await query;
        if (error) throw error;
        return (data || []) as UITranslation[];
    },

    async saveUITranslation(translation: Partial<UITranslation>): Promise<UITranslation> {
        const { data, error } = await getSupabase().from('ui_translations').upsert(translation).select().single();
        if (error) throw error;
        return data as UITranslation;
    },

    async upsertBatchUITranslations(translations: Partial<UITranslation>[]): Promise<UITranslation[]> {
        const { data, error } = await getSupabase().from('ui_translations').upsert(translations).select();
        if (error) throw error;
        return (data || []) as UITranslation[];
    },

    async deleteUITranslation(id: string): Promise<void> {
        const { error } = await getSupabase().from('ui_translations').delete().eq('id', id);
        if (error) throw error;
    },
};

