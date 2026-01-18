/**
 * Translation Bundles Service
 * Fetches UI translation bundles.
 */
import { translationRepository } from '../../repositories/translationRepository';
import type { TranslationBundles, BundleHashes } from '@pulwave/types';

export const bundlesService = {
    async fetchBundles(locale: string, _orgId: string | null = null): Promise<{ bundles: TranslationBundles; hashes: BundleHashes }> {
        try {
            const data = await translationRepository.getTranslationBundles(locale);

            const bundles: TranslationBundles = { ui: {}, schema: {}, enum: {}, master_data: {}, content: {} };
            const hashes: BundleHashes = { ui: null, schema: null, enum: null, master_data: null, content: null };

            const processedTypes = new Set<string>();

            data.forEach((bundle) => {
                const type = bundle.namespace;
                if (typeof type === 'string' && !processedTypes.has(type) && type in bundles) {
                    const bundleKey = type as keyof TranslationBundles;
                    bundles[bundleKey] = bundle.content || {};
                    hashes[bundleKey as keyof BundleHashes] = bundle.hash;
                    processedTypes.add(type);
                }
            });

            return { bundles, hashes };
        } catch (error) {
            // Failed to fetch translation bundles
            throw error;
        }
    },

    async fetchBundleHashes(locale: string, _orgId: string | null = null): Promise<BundleHashes> {
        try {
            const data = await translationRepository.getTranslationBundles(locale);

            const hashes: BundleHashes = { ui: null, schema: null, enum: null, master_data: null, content: null };
            data?.forEach((bundle) => {
                const type = bundle.namespace;
                if (typeof type === 'string' && type in hashes && !hashes[type as keyof BundleHashes]) {
                    hashes[type as keyof BundleHashes] = bundle.hash;
                }
            });

            return hashes;
        } catch (error) {
            // Failed to fetch bundle hashes
            throw error;
        }
    },
};

