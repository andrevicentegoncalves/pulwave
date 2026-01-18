/**
 * Analytics Service
 * Business logic for analytics and observability.
 */
import type {
    AnalyticsEvent,
    PerformanceMetric,
    IAnalyticsRepository
} from '../interfaces';

// In-memory session ID for browser session
let sessionId: string | null = null;

const getSessionId = (): string => {
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    return sessionId;
};

// Get browser context safely
const getBrowserContext = () => {
    if (typeof window === 'undefined') {
        return { url: undefined, userAgent: undefined, referrer: undefined };
    }
    return {
        url: window.location.href,
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined,
    };
};

// Default no-op repository for when no provider is configured
const noOpRepository: IAnalyticsRepository = {
    version: '1.0.0',
    trackEvent: async () => { },
    trackPageView: async () => { },
    trackMetric: async () => { },
    captureError: async () => { },
    identifyUser: async () => { },
    getEventsByUser: async () => [],
    flush: async () => { },
};

// Repository reference (can be swapped for different providers)
let analyticsRepository: IAnalyticsRepository = noOpRepository;

/**
 * Configure the analytics provider
 * 
 * @param repository - Analytics repository implementation (e.g., Google Analytics, Mixpanel)
 * 
 * @example
 * ```typescript
 * import { configureAnalytics } from '@pulwave/analytics';
 * import { GoogleAnalyticsRepository } from './providers/google-analytics';
 * 
 * configureAnalytics(new GoogleAnalyticsRepository());
 * ```
 */
export const configureAnalytics = (repository: IAnalyticsRepository): void => {
    analyticsRepository = repository;
};

export const analyticsService = {
    /**
     * Track a user action (button clicks, form submissions, etc.)
     * 
     * @param actionName - Name of the action (e.g., 'button_click', 'form_submit')
     * @param properties - Optional additional properties about the action
     * @param userId - Optional user ID to associate with the event
     * 
     * @example
     * ```typescript
     * // Track a button click
     * await analyticsService.trackAction('button_click', { 
     *   buttonId: 'submit',
     *   formName: 'contact' 
     * }, userId);
     * 
     * // Track a search
     * await analyticsService.trackAction('search', { query: 'apartments' });
     * ```
     */
    async trackAction(
        actionName: string,
        properties?: Record<string, unknown>,
        userId?: string
    ): Promise<void> {
        const context = getBrowserContext();
        return analyticsRepository.trackEvent({
            eventName: actionName,
            eventCategory: 'user_action',
            properties,
            userId,
            sessionId: getSessionId(),
            metadata: context,
        });
    },

    /**
     * Track a page view
     */
    async trackPageView(pageName: string, userId?: string): Promise<void> {
        return analyticsRepository.trackPageView(pageName, {
            userId,
            sessionId: getSessionId(),
        });
    },

    /**
     * Track feature usage
     */
    async trackFeatureUsage(
        featureName: string,
        action: 'enabled' | 'disabled' | 'used',
        userId?: string
    ): Promise<void> {
        return analyticsRepository.trackEvent({
            eventName: `feature_${featureName}_${action}`,
            eventCategory: 'feature_usage',
            properties: { featureName, action },
            userId,
            sessionId: getSessionId(),
        });
    },

    /**
     * Track a performance metric (page load time, API response time, etc.)
     * 
     * @param metricName - Name of the performance metric (e.g., 'page_load', 'api_call')
     * @param valueMs - Performance value in milliseconds
     * @param context - Optional context about the measurement
     * 
     * @example
     * ```typescript
     * const startTime = performance.now();
     * await fetchData();
     * const duration = performance.now() - startTime;
     * 
     * await analyticsService.trackPerformance('data_fetch', duration, {
     *   endpoint: '/api/users',
     *   count: users.length
     * });
     * ```
     */
    async trackPerformance(
        metricName: string,
        valueMs: number,
        context?: Record<string, unknown>
    ): Promise<void> {
        return analyticsRepository.trackMetric({
            name: metricName,
            value: valueMs,
            unit: 'ms',
            context,
        });
    },

    /**
     * Capture and report an error for monitoring
     * 
     * @param error - Error object to capture
     * @param context - Optional context about when/where the error occurred
     * 
     * @example
     * ```typescript
     * try {
     *   await riskyOperation();
     * } catch (error) {
     *   await analyticsService.captureError(error, {
     *     component: 'UserProfile',
     *     action: 'updateProfile',
     *     userId
     *   });
     *   throw error; // Re-throw or handle
     * }
     * ```
     */
    async captureError(
        error: Error,
        context?: Record<string, unknown>
    ): Promise<void> {
        const browserContext = getBrowserContext();
        return analyticsRepository.captureError(error, {
            ...context,
            sessionId: getSessionId(),
            url: browserContext.url,
        });
    },

    /**
     * Identify the current user
     */
    async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
        return analyticsRepository.identifyUser(userId, traits);
    },

    /**
     * Get events for a user (admin)
     */
    async getEventsByUser(userId: string, limit?: number): Promise<AnalyticsEvent[]> {
        return analyticsRepository.getEventsByUser(userId, limit);
    },

    /**
     * Flush pending events
     */
    async flush(): Promise<void> {
        return analyticsRepository.flush();
    },

    /**
     * Get the current session ID
     */
    getSessionId,
};

export default analyticsService;
