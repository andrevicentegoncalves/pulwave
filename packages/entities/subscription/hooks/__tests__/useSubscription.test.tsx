import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSubscriptionPlans, useCurrentSubscription } from '../useSubscription';
import { subscriptionService } from '../../services/subscriptionService';
import type { ISubscriptionPlan } from '../../interfaces/ISubscriptionPlan';
import React from 'react';

vi.mock('../../services/subscriptionService');

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    };
}

describe('useSubscriptionPlans', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch and return subscription plans', async () => {
        const mockPlans: ISubscriptionPlan[] = [
            { id: 'free', plan_name: 'Free', monthly_price: '0', is_active: true, plan_tier: 'free' },
            { id: 'pro', plan_name: 'Pro', monthly_price: '29', is_active: true, plan_tier: 'pro' },
        ];

        vi.mocked(subscriptionService.getPlans).mockResolvedValue(mockPlans);

        const { result } = renderHook(() => useSubscriptionPlans(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockPlans);
        expect(subscriptionService.getPlans).toHaveBeenCalledTimes(1);
    });

    it('should handle loading state', () => {
        vi.mocked(subscriptionService.getPlans).mockImplementation(() => new Promise(() => { }));

        const { result } = renderHook(() => useSubscriptionPlans(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', async () => {
        const error = new Error('Failed to fetch plans');
        vi.mocked(subscriptionService.getPlans).mockRejectedValue(error);

        const { result } = renderHook(() => useSubscriptionPlans(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeDefined();
    });
});

describe('useCurrentSubscription', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch current subscription for user', async () => {
        const mockPlan: ISubscriptionPlan = { id: 'pro', plan_name: 'Pro', monthly_price: '29', is_active: true, plan_tier: 'pro' };

        vi.mocked(subscriptionService.getCurrentPlan).mockResolvedValue(mockPlan);

        const { result } = renderHook(() => useCurrentSubscription('user-123'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockPlan);
        expect(subscriptionService.getCurrentPlan).toHaveBeenCalledWith('user-123');
    });

    it('should not fetch when userId is empty', () => {
        const { result } = renderHook(() => useCurrentSubscription(''), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
        expect(subscriptionService.getCurrentPlan).not.toHaveBeenCalled();
    });

    it('should handle null subscription (user on free tier)', async () => {
        vi.mocked(subscriptionService.getCurrentPlan).mockResolvedValue(null);

        const { result } = renderHook(() => useCurrentSubscription('user-free'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBeNull();
    });

    it('should handle loading state', () => {
        vi.mocked(subscriptionService.getCurrentPlan).mockImplementation(() => new Promise(() => { }));

        const { result } = renderHook(() => useCurrentSubscription('user-123'), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
    });

    it('should handle error state', async () => {
        const error = new Error('User not found');
        vi.mocked(subscriptionService.getCurrentPlan).mockRejectedValue(error);

        const { result } = renderHook(() => useCurrentSubscription('invalid-user'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeDefined();
    });

    it('should refetch when userId changes', async () => {
        const plan1: ISubscriptionPlan = { id: 'free', plan_name: 'Free', monthly_price: '0', is_active: true, plan_tier: 'free' };
        const plan2: ISubscriptionPlan = { id: 'pro', plan_name: 'Pro', monthly_price: '29', is_active: true, plan_tier: 'pro' };

        vi.mocked(subscriptionService.getCurrentPlan)
            .mockResolvedValueOnce(plan1)
            .mockResolvedValueOnce(plan2);

        const { result, rerender } = renderHook(
            ({ userId }) => useCurrentSubscription(userId),
            {
                wrapper: createWrapper(),
                initialProps: { userId: 'user-1' },
            }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(plan1);

        // Change user ID
        rerender({ userId: 'user-2' });

        await waitFor(() => expect(result.current.data).toEqual(plan2));
        expect(subscriptionService.getCurrentPlan).toHaveBeenCalledTimes(2);
    });
});
