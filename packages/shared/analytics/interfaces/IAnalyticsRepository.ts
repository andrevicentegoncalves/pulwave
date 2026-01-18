/**
 * Analytics Repository Interface
 * Provider-agnostic interface for analytics and observability.
 */
import type {
    AnalyticsEvent,
    PerformanceMetric,
    ErrorEvent,
    UserIdentification
} from './types';

export type { AnalyticsEvent, PerformanceMetric, ErrorEvent, UserIdentification };

import type { IVersionedRepository } from '../../types/repository';
export interface IAnalyticsRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    /**
     * Track a generic event
     */
    trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void>;

    /**
     * Track a page view
     */
    trackPageView(pageName: string, properties?: Record<string, unknown>): Promise<void>;

    /**
     * Track a performance metric
     */
    trackMetric(metric: Omit<PerformanceMetric, 'timestamp'>): Promise<void>;

    /**
     * Capture an error
     */
    captureError(error: Error, context?: Record<string, unknown>): Promise<void>;

    /**
     * Identify a user for tracking
     */
    identifyUser(userId: string, traits?: Record<string, unknown>): Promise<void>;

    /**
     * Get events for a user (admin only)
     */
    getEventsByUser(userId: string, limit?: number): Promise<AnalyticsEvent[]>;

    /**
     * Flush any pending events (for providers that batch)
     */
    flush(): Promise<void>;
}
