import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';
import { subscriptionKeys } from '../keys';

/**
 * Hook to fetch all available subscription plans
 */
export const useSubscriptionPlans = () => {
    return useQuery({
        queryKey: subscriptionKeys.plans,
        queryFn: () => subscriptionService.getPlans(),
        staleTime: 3600000, // 1 hour
    });
};

/**
 * Hook to fetch current user's subscription plan
 */
export const useCurrentSubscription = (userId: string) => {
    return useQuery({
        queryKey: subscriptionKeys.current(userId),
        queryFn: () => subscriptionService.getCurrentPlan(userId),
        enabled: !!userId,
    });
};
