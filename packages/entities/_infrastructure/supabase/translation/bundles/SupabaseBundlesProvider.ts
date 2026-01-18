/**
 * Supabase Bundles Provider
 * Translation bundle generation and syncing.
 */
import type { Locale, TranslationBundle } from '@pulwave/entity-translation';

import { getSupabase } from '../../client';

export const SupabaseBundlesProvider = {
    async getSupportedLocales(): Promise<Locale[]> {
        // Query without is_enabled filter since the column may not exist in older schemas
        const { data, error } = await getSupabase().from('locales').select('*');
        if (error) throw error;
        return (data || []).map((l: any) => ({
            code: l.code,
            name: l.name,
            is_default: l.is_default || false,
            is_enabled: l.is_enabled ?? l.is_active ?? true, // Fallback to is_active or default to true
            flag_icon: l.flag_icon
        })) as Locale[];
    },

    async generateTranslationBundles(locale: string): Promise<void> {
        const { error } = await getSupabase().rpc('generate_translation_bundles', { p_locale: locale });
        if (error) throw error;
    },

    async syncAllTranslations(): Promise<void> {
        const { error } = await getSupabase().rpc('sync_all_translations');
        if (error) throw error;
    },

    async getTranslationBundles(locale: string): Promise<TranslationBundle[]> {
        // Try with created_at first, fall back without it if column doesn't exist
        let query = getSupabase()
            .from('translation_bundles')
            .select('id, locale_code, bundle_type, bundle_data, content_hash')
            .eq('locale_code', locale);

        const { data, error } = await query;

        if (error) throw error;

        return (data || []).map((b: any) => ({
            id: b.id,
            locale: b.locale_code,
            namespace: b.bundle_type,
            content: b.bundle_data || {},
            hash: b.content_hash,
            created_at: b.created_at || new Date().toISOString() // Fallback if column doesn't exist
        })) as TranslationBundle[];
    },
};

