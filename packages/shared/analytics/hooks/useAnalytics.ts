/**
 * useAnalytics Hook
 * React hooks for analytics tracking.
 */
import { useCallback, useEffect, useRef } from 'react';
import { analyticsService } from '../services/analyticsService';

export interface UseAnalyticsOptions {
    userId?: string;
    enabled?: boolean;
}

/**
 * Hook for tracking events
 */
export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
    const { userId, enabled = true } = options;

    const trackAction = useCallback(
        async (actionName: string, properties?: Record<string, unknown>) => {
            if (!enabled) return;
            return analyticsService.trackAction(actionName, properties, userId);
        },
        [enabled, userId]
    );

    const trackFeature = useCallback(
        async (featureName: string, action: 'enabled' | 'disabled' | 'used') => {
            if (!enabled) return;
            return analyticsService.trackFeatureUsage(featureName, action, userId);
        },
        [enabled, userId]
    );

    const captureError = useCallback(
        async (error: Error, context?: Record<string, unknown>) => {
            if (!enabled) return;
            return analyticsService.captureError(error, context);
        },
        [enabled]
    );

    return {
        trackAction,
        trackFeature,
        captureError,
        identify: analyticsService.identify,
        flush: analyticsService.flush,
    };
};

/**
 * Hook for automatic page view tracking
 */
export const usePageView = (
    pageName: string,
    options: UseAnalyticsOptions = {}
) => {
    const { userId, enabled = true } = options;
    const hasTrackedRef = useRef(false);

    useEffect(() => {
        if (!enabled || !pageName || hasTrackedRef.current) return;

        hasTrackedRef.current = true;
        analyticsService.trackPageView(pageName, userId);

        return () => {
            hasTrackedRef.current = false;
        };
    }, [pageName, userId, enabled]);
};

/**
 * Hook for performance tracking
 */
export const usePerformanceTracking = () => {
    const startTimeRef = useRef<number | null>(null);

    const startTiming = useCallback(() => {
        startTimeRef.current = performance.now();
    }, []);

    const endTiming = useCallback(async (metricName: string, context?: Record<string, unknown>) => {
        if (startTimeRef.current === null) {
            // startTiming was not called before endTiming
            return;
        }

        const duration = performance.now() - startTimeRef.current;
        startTimeRef.current = null;

        return analyticsService.trackPerformance(metricName, duration, context);
    }, []);

    const trackTiming = useCallback(
        async (metricName: string, startTime: number, context?: Record<string, unknown>) => {
            const duration = performance.now() - startTime;
            return analyticsService.trackPerformance(metricName, duration, context);
        },
        []
    );

    return { startTiming, endTiming, trackTiming };
};

/**
 * Hook for error boundary integration
 */
export const useErrorCapture = () => {
    return useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
        return analyticsService.captureError(error, {
            componentStack: errorInfo?.componentStack,
        });
    }, []);
};
