/**
 * Subscription Repository Interface
 */
import { ISubscriptionPlan } from '../../subscription/interfaces/ISubscriptionPlan';

import type { IVersionedRepository } from '../../_infrastructure/interfaces';
export interface ISubscriptionRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    getPlans(): Promise<ISubscriptionPlan[]>;
    getCurrentPlan(userId: string): Promise<ISubscriptionPlan | null>;
}


