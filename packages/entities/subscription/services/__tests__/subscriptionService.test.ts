import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { subscriptionService } from '../subscriptionService';
import type { ISubscriptionPlan } from '../../interfaces/ISubscriptionPlan';

vi.mock('../../../../../infrastructure', () => {
    const mockRepo = {
        getPlans: vi.fn(),
        getCurrentPlan: vi.fn(),
    };
    return {
        dataProvider: {
            subscription: mockRepo
        }
    };
});

import { dataProvider } from '@pulwave/entity-infrastructure';

const mockGetPlans = dataProvider.subscription.getPlans as Mock;
const mockGetCurrentPlan = dataProvider.subscription.getCurrentPlan as Mock;

describe('Subscription Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getPlans', () => {
        it('should fetch all subscription plans', async () => {
            const mockPlans: ISubscriptionPlan[] = [
                { id: 'free', plan_name: 'Free', monthly_price: '0', is_active: true, plan_tier: 'free' },
                { id: 'pro', plan_name: 'Pro', monthly_price: '29', is_active: true, plan_tier: 'pro' },
                { id: 'enterprise', plan_name: 'Enterprise', monthly_price: '99', is_active: true, plan_tier: 'enterprise' },
            ];
            mockGetPlans.mockResolvedValue(mockPlans);

            const result = await subscriptionService.getPlans();

            expect(dataProvider.subscription.getPlans).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockPlans);
            expect(result).toHaveLength(3);
        });

        it('should return empty array when no plans exist', async () => {
            mockGetPlans.mockResolvedValue([]);

            const result = await subscriptionService.getPlans();

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should propagate errors from repository', async () => {
            const error = new Error('Database connection failed');
            mockGetPlans.mockRejectedValue(error);

            await expect(subscriptionService.getPlans()).rejects.toThrow('Database connection failed');
        });
    });

    describe('getCurrentPlan', () => {
        it('should fetch current user plan', async () => {
            const mockPlan: ISubscriptionPlan = { id: 'pro', plan_name: 'Pro', monthly_price: '29', is_active: true, plan_tier: 'pro' };
            mockGetCurrentPlan.mockResolvedValue(mockPlan);

            const result = await subscriptionService.getCurrentPlan('user-123');

            expect(dataProvider.subscription.getCurrentPlan).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(mockPlan);
        });

        it('should return null for user without subscription', async () => {
            mockGetCurrentPlan.mockResolvedValue(null);

            const result = await subscriptionService.getCurrentPlan('user-without-plan');

            expect(result).toBeNull();
        });

        it('should handle different user IDs correctly', async () => {
            const freePlan: ISubscriptionPlan = { id: 'free', plan_name: 'Free', monthly_price: '0', is_active: true, plan_tier: 'free' };
            const proPlan: ISubscriptionPlan = { id: 'pro', plan_name: 'Pro', monthly_price: '29', is_active: true, plan_tier: 'pro' };

            mockGetCurrentPlan
                .mockResolvedValueOnce(freePlan)
                .mockResolvedValueOnce(proPlan);

            const result1 = await subscriptionService.getCurrentPlan('user-free');
            const result2 = await subscriptionService.getCurrentPlan('user-pro');

            expect(result1).toEqual(freePlan);
            expect(result2).toEqual(proPlan);
            expect(dataProvider.subscription.getCurrentPlan).toHaveBeenCalledTimes(2);
        });

        it('should propagate errors from repository', async () => {
            const error = new Error('User not found');
            mockGetCurrentPlan.mockRejectedValue(error);

            await expect(subscriptionService.getCurrentPlan('invalid-user')).rejects.toThrow('User not found');
        });
    });
});
