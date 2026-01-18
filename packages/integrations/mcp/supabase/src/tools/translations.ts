/**
 * Translation Tools
 *
 * Tools for querying and managing translations.
 */

import { z, defineReadOnlyTool, paginatedResult } from '@pulwave/mcp-core';
import type { SupabaseProvider } from '../provider.js';

export function createTranslationTools(provider: SupabaseProvider) {
    const listTranslations = defineReadOnlyTool({
        name: 'list_translations',
        description: 'List translations with optional filtering by locale, category, or key pattern.',
        inputSchema: z.object({
            locale: z.string().length(2).optional().describe('Locale code (e.g., "en", "pt")'),
            category: z.string().optional().describe('Translation category'),
            keyPattern: z.string().optional().describe('Key pattern to match (supports wildcards)'),
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(50),
        }),
        handler: async ({ locale, category, keyPattern, page, pageSize }) => {
            let query = provider.getClient()
                .from('ui_translations')
                .select('*', { count: 'exact' });

            if (locale) query = query.eq('locale', locale);
            if (category) query = query.eq('category', category);
            if (keyPattern) query = query.ilike('key', keyPattern.replace('*', '%'));

            query = query
                .order('key', { ascending: true })
                .range((page - 1) * pageSize, page * pageSize - 1);

            const { data, count, error } = await query;

            if (error) throw new Error(error.message);

            return paginatedResult(data ?? [], count ?? 0, { page, pageSize });
        },
    });

    const searchTranslations = defineReadOnlyTool({
        name: 'search_translations',
        description: 'Search translations by key or value content. Useful for finding specific text or patterns.',
        inputSchema: z.object({
            query: z.string().min(2).describe('Search query'),
            searchIn: z.enum(['key', 'value', 'both']).default('both'),
            locale: z.string().length(2).optional(),
            limit: z.number().int().min(1).max(100).default(20),
        }),
        handler: async ({ query, searchIn, locale, limit }) => {
            const client = provider.getClient();

            let dbQuery = client
                .from('ui_translations')
                .select('*');

            if (searchIn === 'key') {
                dbQuery = dbQuery.ilike('key', `%${query}%`);
            } else if (searchIn === 'value') {
                dbQuery = dbQuery.ilike('value', `%${query}%`);
            } else {
                dbQuery = dbQuery.or(`key.ilike.%${query}%,value.ilike.%${query}%`);
            }

            if (locale) dbQuery = dbQuery.eq('locale', locale);

            const { data, error } = await dbQuery.limit(limit);

            if (error) throw new Error(error.message);

            return data ?? [];
        },
    });

    const getMissingTranslations = defineReadOnlyTool({
        name: 'get_missing_translations',
        description: 'Find translation keys that exist in one locale but not another. Useful for identifying gaps.',
        inputSchema: z.object({
            sourceLocale: z.string().length(2).describe('Source locale to compare from'),
            targetLocale: z.string().length(2).describe('Target locale to check'),
            category: z.string().optional(),
            limit: z.number().int().min(1).max(500).default(100),
        }),
        handler: async ({ sourceLocale, targetLocale, category, limit }) => {
            const client = provider.getClient();

            // Get keys from source locale
            let sourceQuery = client
                .from('ui_translations')
                .select('key')
                .eq('locale', sourceLocale);

            if (category) sourceQuery = sourceQuery.eq('category', category);

            const { data: sourceKeys, error: sourceError } = await sourceQuery;
            if (sourceError) throw new Error(sourceError.message);

            // Get keys from target locale
            let targetQuery = client
                .from('ui_translations')
                .select('key')
                .eq('locale', targetLocale);

            if (category) targetQuery = targetQuery.eq('category', category);

            const { data: targetKeys, error: targetError } = await targetQuery;
            if (targetError) throw new Error(targetError.message);

            const targetKeySet = new Set(targetKeys?.map(t => t.key) ?? []);
            const missingKeys = (sourceKeys ?? [])
                .filter(s => !targetKeySet.has(s.key))
                .slice(0, limit);

            return {
                sourceLocale,
                targetLocale,
                missingCount: missingKeys.length,
                missingKeys: missingKeys.map(k => k.key),
            };
        },
    });

    const getTranslationStats = defineReadOnlyTool({
        name: 'get_translation_stats',
        description: 'Get translation statistics by locale and category.',
        inputSchema: z.object({}),
        handler: async () => {
            const client = provider.getClient();

            const { data, error } = await client
                .from('ui_translations')
                .select('locale, category');

            if (error) throw new Error(error.message);

            // Aggregate stats
            const stats: Record<string, Record<string, number>> = {};
            for (const row of data ?? []) {
                const locale = row.locale;
                const category = row.category;
                if (!stats[locale]) stats[locale] = {};
                const localeStats = stats[locale]!;
                localeStats[category] = (localeStats[category] ?? 0) + 1;
            }

            return {
                totalTranslations: data?.length ?? 0,
                byLocale: stats,
            };
        },
    });

    return [listTranslations, searchTranslations, getMissingTranslations, getTranslationStats];
}
