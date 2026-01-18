import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFeatureFlag, useIsFeatureEnabled, useFeatureFlags } from '../useFeatureFlag';
import { featureFlagService } from '../../services/featureFlagService';
import type { FeatureFlagEvaluation } from '../../interfaces';
import React from 'react';

vi.mock('../../services/featureFlagService');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useFeatureFlag', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch and return flag evaluation', async () => {
        const mockEvaluation: FeatureFlagEvaluation = {
            flagKey: 'test-flag',
            enabled: true,
            reason: 'default',
        };

        vi.mocked(featureFlagService.evaluate).mockResolvedValue(mockEvaluation);

        const { result } = renderHook(() => useFeatureFlag('test-flag'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockEvaluation);
        expect(featureFlagService.evaluate).toHaveBeenCalledWith('test-flag', undefined, undefined);
    });

    it('should pass userId and userRoles', async () => {
        const mockEvaluation: FeatureFlagEvaluation = {
            flagKey: 'test-flag',
            enabled: true,
            reason: 'user_targeted',
        };
        vi.mocked(featureFlagService.evaluate).mockResolvedValue(mockEvaluation);

        const { result } = renderHook(
            () => useFeatureFlag('test-flag', { userId: 'user-123', userRoles: ['admin'] }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(featureFlagService.evaluate).toHaveBeenCalledWith('test-flag', 'user-123', ['admin']);
    });

    it('should not fetch when enabled is false', () => {
        const { result } = renderHook(
            () => useFeatureFlag('test-flag', { enabled: false }),
            { wrapper: createWrapper() }
        );

        expect(result.current.isLoading).toBe(false);
        expect(featureFlagService.evaluate).not.toHaveBeenCalled();
    });

    it('should not fetch when flagKey is empty', () => {
        const { result } = renderHook(
            () => useFeatureFlag(''),
            { wrapper: createWrapper() }
        );

        expect(result.current.isLoading).toBe(false);
        expect(featureFlagService.evaluate).not.toHaveBeenCalled();
    });
});

describe('useIsFeatureEnabled', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return false while loading', () => {
        vi.mocked(featureFlagService.evaluate).mockImplementation(() => new Promise(() => { }));

        const { result } = renderHook(() => useIsFeatureEnabled('test-flag'), {
            wrapper: createWrapper(),
        });

        expect(result.current).toBe(false);
    });

    it('should return true when flag is enabled', async () => {
        const mockEvaluation: FeatureFlagEvaluation = {
            flagKey: 'test-flag',
            enabled: true,
            reason: 'default',
        };
        vi.mocked(featureFlagService.evaluate).mockResolvedValue(mockEvaluation);

        const { result } = renderHook(() => useIsFeatureEnabled('test-flag'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current).toBe(true));
    });

    it('should return false when flag is disabled', async () => {
        const mockEvaluation: FeatureFlagEvaluation = {
            flagKey: 'test-flag',
            enabled: false,
            reason: 'default',
        };
        vi.mocked(featureFlagService.evaluate).mockResolvedValue(mockEvaluation);

        const { result } = renderHook(() => useIsFeatureEnabled('test-flag'), {
            wrapper: createWrapper(),
        });

        // Initial is false (loading)
        expect(result.current).toBe(false);

        // After load, still false
        await waitFor(() => {
            // Just wait for query to complete
        });
        expect(result.current).toBe(false);
    });
});

describe('useFeatureFlags', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch multiple flags at once', async () => {
        const mockEvaluation1: FeatureFlagEvaluation = { flagKey: 'flag-1', enabled: true, reason: 'default' };
        const mockEvaluation2: FeatureFlagEvaluation = { flagKey: 'flag-2', enabled: false, reason: 'default' };
        vi.mocked(featureFlagService.evaluate)
            .mockResolvedValueOnce(mockEvaluation1)
            .mockResolvedValueOnce(mockEvaluation2);

        const { result } = renderHook(
            () => useFeatureFlags(['flag-1', 'flag-2']),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual({
            'flag-1': true,
            'flag-2': false,
        });
    });

    it('should not fetch when flagKeys is empty', () => {
        const { result } = renderHook(() => useFeatureFlags([]), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
        expect(featureFlagService.evaluate).not.toHaveBeenCalled();
    });
});
