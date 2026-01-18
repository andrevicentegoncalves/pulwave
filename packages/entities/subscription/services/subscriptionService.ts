/**
 * Subscription Service
 * Domain logic for subscription management.
 */
import { subscriptionRepository } from '../repositories/subscriptionRepository';
import { ISubscriptionPlan } from '../../subscription/interfaces/ISubscriptionPlan';

export const subscriptionService = {
    /**
     * Get all available subscription plans
     */
    async getPlans(): Promise<ISubscriptionPlan[]> {
        return subscriptionRepository.getPlans();
    },

    /**
     * Get current user's subscription plan
     */
    async getCurrentPlan(userId: string): Promise<ISubscriptionPlan | null> {
        return subscriptionRepository.getCurrentPlan(userId);
    }
};

export default subscriptionService;



