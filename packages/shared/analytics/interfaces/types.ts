/**
 * Analytics Types
 * Type definitions for analytics and observability.
 */

export interface AnalyticsEvent {
    id?: string;
    eventName: string;
    eventCategory: 'page_view' | 'user_action' | 'feature_usage' | 'error' | 'performance';
    properties?: Record<string, unknown>;
    userId?: string;
    sessionId?: string;
    timestamp: string;
    metadata?: {
        url?: string;
        userAgent?: string;
        referrer?: string;
    };
}

export interface PerformanceMetric {
    name: string;
    value: number;
    unit: 'ms' | 'bytes' | 'count' | 'percent';
    timestamp: string;
    context?: Record<string, unknown>;
}

export interface ErrorEvent {
    id?: string;
    message: string;
    stack?: string;
    level: 'error' | 'warning' | 'info';
    userId?: string;
    context?: Record<string, unknown>;
    timestamp: string;
}

export interface UserIdentification {
    userId: string;
    traits?: Record<string, unknown>;
}
