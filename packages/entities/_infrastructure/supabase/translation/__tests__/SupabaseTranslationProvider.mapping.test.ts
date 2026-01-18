/**
 * Mapping Tests for Supabase Translation Providers
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase Client
const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    single: vi.fn(),
    upsert: vi.fn().mockReturnThis(),
    rpc: vi.fn(),
};

vi.mock('../../client', () => ({
    getSupabase: () => mockSupabase,
}));

import { getSupabase } from '../../client';
import { SupabaseBundlesProvider } from '../bundles/SupabaseBundlesProvider';
import { SupabaseContentTranslationProvider } from '../content/SupabaseContentTranslationProvider';

describe('Supabase Translation Provider Mappings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('SupabaseBundlesProvider', () => {
        it('should map locale_code to locale and bundle_type to namespace', async () => {
            const mockData = [
                {
                    id: '1',
                    locale_code: 'en-US',
                    bundle_type: 'ui',
                    bundle_data: { hello: 'Hello' },
                    content_hash: 'abc',
                    created_at: '2026-01-01'
                }
            ];

            mockSupabase.eq.mockResolvedValue({ data: mockData, error: null });

            const result = await SupabaseBundlesProvider.getTranslationBundles('en-US');

            expect(mockSupabase.from).toHaveBeenCalledWith('translation_bundles');
            expect(mockSupabase.eq).toHaveBeenCalledWith('locale_code', 'en-US');
            expect(result[0].locale).toBe('en-US');
            expect(result[0].namespace).toBe('ui');
            expect(result[0].hash).toBe('abc');
        });
    });

    describe('SupabaseContentTranslationProvider', () => {
        it('should map locale_code to locale in getContentTranslations', async () => {
            const mockData = [
                {
                    id: '1',
                    entity_type: 'product',
                    entity_id: 'p1',
                    field_name: 'name',
                    locale_code: 'pt-PT',
                    translated_content: 'Produto 1',
                    is_active: true
                }
            ];

            mockSupabase.select.mockResolvedValue({ data: mockData, error: null });

            const result = await SupabaseContentTranslationProvider.getContentTranslations({});

            expect(mockSupabase.from).toHaveBeenCalledWith('content_translations');
            expect(result[0].locale).toBe('pt-PT');
            expect(result[0].translated_content).toBe('Produto 1');
        });
    });
});
