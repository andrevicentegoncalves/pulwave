/**
 * Supabase Content Translation Provider
 * Dynamic content translations.
 */
import type { ContentTranslation } from '@pulwave/entity-translation';

import { getSupabase } from '../../client';

export const SupabaseContentTranslationProvider = {
    async getContentTranslations(params: any): Promise<ContentTranslation[]> {
        let query = getSupabase().from('content_translations').select('id, entity_type, entity_id, field_name, locale_code, translated_content, is_active');
        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map((t: any) => ({
            id: t.id,
            entity_type: t.entity_type,
            entity_id: t.entity_id,
            field_name: t.field_name,
            locale: t.locale_code,
            translated_content: t.translated_content,
            is_active: t.is_active
        })) as ContentTranslation[];
    },

    async saveContentTranslation(translation: Partial<ContentTranslation>): Promise<ContentTranslation> {
        const mapped = {
            id: translation.id,
            entity_type: translation.entity_type,
            entity_id: translation.entity_id,
            field_name: translation.field_name,
            locale_code: translation.locale,
            translated_content: translation.translated_content,
            is_active: translation.is_active
        };
        const { data, error } = await getSupabase().from('content_translations').upsert(mapped).select().single();
        if (error) throw error;
        return {
            id: data.id,
            entity_type: data.entity_type,
            entity_id: data.entity_id,
            field_name: data.field_name,
            locale: data.locale_code,
            translated_content: data.translated_content,
            is_active: data.is_active
        } as ContentTranslation;
    },

    async getEntityTranslations(entityType: string, entityId: string, locale: string): Promise<Record<string, string>> {
        const { data, error } = await getSupabase()
            .from('content_translations')
            .select('field_name, translated_content')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .eq('locale_code', locale)
            .eq('is_active', true);

        if (error) throw error;
        const translations: Record<string, string> = {};
        data?.forEach((item: any) => {
            translations[item.field_name] = item.translated_content;
        });
        return translations;
    },
};

