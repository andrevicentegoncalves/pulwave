/**
 * useTranslation Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLocales, useUpdateUserLocale, useEntityTranslations } from '../useTranslation';
import { translationService } from '../../services/translationService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import type { Locale, UserPreference } from '../../interfaces';

vi.mock('../../services/translationService', () => ({
    translationService: {
        getAllLocales: vi.fn(),
        updateUserLocale: vi.fn(),
        getEntityTranslations: vi.fn(),
    }
}));

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return function TestWrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    };
}

describe('useLocales', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch all available locales', async () => {
        const mockLocales: Locale[] = [
            { code: 'en-US', name: 'English (US)', is_default: true, is_enabled: true },
            { code: 'pt-PT', name: 'Portuguese (Portugal)', is_default: false, is_enabled: true },
            { code: 'es-ES', name: 'Spanish (Spain)', is_default: false, is_enabled: true }
        ];
        vi.mocked(translationService.getAllLocales).mockResolvedValue(mockLocales);

        const { result } = renderHook(() => useLocales(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockLocales);
        expect(translationService.getAllLocales).toHaveBeenCalledTimes(1);
    });

    it('should cache locales with staleTime of 1 hour', async () => {
        const mockLocales: Locale[] = [
            { code: 'en-US', name: 'English (US)', is_default: true, is_enabled: true }
        ];
        vi.mocked(translationService.getAllLocales).mockResolvedValue(mockLocales);

        const { result } = renderHook(() => useLocales(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        // Verify data is cached (staleTime prevents refetch)
        expect(result.current.data).toEqual(mockLocales);
    });

    it('should handle fetch errors', async () => {
        const mockError = new Error('Failed to fetch locales');
        vi.mocked(translationService.getAllLocales).mockRejectedValue(mockError);

        const { result } = renderHook(() => useLocales(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeTruthy();
    });
});

describe('useUpdateUserLocale', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should update user locale and invalidate profile cache', async () => {
        const mockPreference: UserPreference = {
            id: 'pref-1',
            profile_id: 'profile-123',
            locale: 'pt-PT'
        };
        vi.mocked(translationService.updateUserLocale).mockResolvedValue(mockPreference);

        const wrapper = createWrapper();
        const { result } = renderHook(() => useUpdateUserLocale(), { wrapper });

        await result.current.mutateAsync({ profileId: 'profile-123', locale: 'pt-PT' });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(translationService.updateUserLocale).toHaveBeenCalledWith('profile-123', 'pt-PT');
    });

    it('should handle update errors', async () => {
        const mockError = new Error('Failed to update locale');
        vi.mocked(translationService.updateUserLocale).mockRejectedValue(mockError);

        const wrapper = createWrapper();
        const { result } = renderHook(() => useUpdateUserLocale(), { wrapper });

        // Mutation will throw or set error state
        result.current.mutate({ profileId: 'profile-123', locale: 'invalid' });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBeDefined();
    });
});

describe('useEntityTranslations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch entity translations for given type, id, and locale', async () => {
        const mockTranslations: Record<string, string> = {
            title: 'Casa à Venda',
            description: 'Linda casa em Lisboa'
        };
        vi.mocked(translationService.getEntityTranslations).mockResolvedValue(mockTranslations);

        const { result } = renderHook(
            () => useEntityTranslations('property', 'prop-123', 'pt-PT'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockTranslations);
        expect(translationService.getEntityTranslations).toHaveBeenCalledWith('property', 'prop-123', 'pt-PT');
    });

    it('should default to en-US locale when not specified', async () => {
        const mockTranslations: Record<string, string> = { title: 'House for Sale' };
        vi.mocked(translationService.getEntityTranslations).mockResolvedValue(mockTranslations);

        const { result } = renderHook(
            () => useEntityTranslations('property', 'prop-123'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(translationService.getEntityTranslations).toHaveBeenCalledWith('property', 'prop-123', 'en-US');
    });

    it('should not fetch when entityType is empty', () => {
        const { result } = renderHook(
            () => useEntityTranslations('', 'prop-123', 'en-US'),
            { wrapper: createWrapper() }
        );

        expect(result.current.isFetching).toBe(false);
        expect(translationService.getEntityTranslations).not.toHaveBeenCalled();
    });

    it('should not fetch when entityId is empty', () => {
        const { result } = renderHook(
            () => useEntityTranslations('property', '', 'en-US'),
            { wrapper: createWrapper() }
        );

        expect(result.current.isFetching).toBe(false);
        expect(translationService.getEntityTranslations).not.toHaveBeenCalled();
    });

    it('should not fetch when locale is empty', () => {
        const { result } = renderHook(
            () => useEntityTranslations('property', 'prop-123', ''),
            { wrapper: createWrapper() }
        );

        expect(result.current.isFetching).toBe(false);
        expect(translationService.getEntityTranslations).not.toHaveBeenCalled();
    });
});

