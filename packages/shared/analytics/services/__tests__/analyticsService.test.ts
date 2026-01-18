import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService, configureAnalytics } from '../analyticsService';
import type { IAnalyticsRepository } from '../../interfaces';

// Create mock repository
const createMockRepository = (): IAnalyticsRepository => ({
    version: '1.0.0',
    trackEvent: vi.fn().mockResolvedValue(undefined),
    trackPageView: vi.fn().mockResolvedValue(undefined),
    trackMetric: vi.fn().mockResolvedValue(undefined),
    captureError: vi.fn().mockResolvedValue(undefined),
    identifyUser: vi.fn().mockResolvedValue(undefined),
    getEventsByUser: vi.fn().mockResolvedValue([]),
    flush: vi.fn().mockResolvedValue(undefined),
});

describe('analyticsService', () => {
    let mockRepository: IAnalyticsRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        mockRepository = createMockRepository();
        configureAnalytics(mockRepository);
    });

    describe('trackAction', () => {
        it('should track a user action with correct event category', async () => {
            await analyticsService.trackAction('button_click', { buttonId: 'submit' }, 'user-123');

            expect(mockRepository.trackEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventName: 'button_click',
                    eventCategory: 'user_action',
                    properties: { buttonId: 'submit' },
                    userId: 'user-123',
                })
            );
        });

        it('should include session ID in tracked events', async () => {
            await analyticsService.trackAction('test_action');

            expect(mockRepository.trackEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    sessionId: expect.stringMatching(/^sess_\d+_[a-z0-9]+$/),
                })
            );
        });

        it('should work without optional parameters', async () => {
            await analyticsService.trackAction('simple_action');

            expect(mockRepository.trackEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventName: 'simple_action',
                    eventCategory: 'user_action',
                })
            );
        });
    });

    describe('trackPageView', () => {
        it('should track page view with page name', async () => {
            await analyticsService.trackPageView('home');

            expect(mockRepository.trackPageView).toHaveBeenCalledWith(
                'home',
                expect.objectContaining({
                    sessionId: expect.any(String),
                })
            );
        });

        it('should include userId when provided', async () => {
            await analyticsService.trackPageView('dashboard', 'user-456');

            expect(mockRepository.trackPageView).toHaveBeenCalledWith(
                'dashboard',
                expect.objectContaining({
                    userId: 'user-456',
                })
            );
        });
    });

    describe('trackFeatureUsage', () => {
        it('should track feature usage with correct event name format', async () => {
            await analyticsService.trackFeatureUsage('dark_mode', 'enabled', 'user-123');

            expect(mockRepository.trackEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventName: 'feature_dark_mode_enabled',
                    eventCategory: 'feature_usage',
                    properties: { featureName: 'dark_mode', action: 'enabled' },
                })
            );
        });

        it('should handle different actions', async () => {
            await analyticsService.trackFeatureUsage('notifications', 'disabled');
            await analyticsService.trackFeatureUsage('chat', 'used');

            expect(mockRepository.trackEvent).toHaveBeenCalledTimes(2);
        });
    });

    describe('trackPerformance', () => {
        it('should track performance metric with correct unit', async () => {
            await analyticsService.trackPerformance('page_load', 1500);

            expect(mockRepository.trackMetric).toHaveBeenCalledWith({
                name: 'page_load',
                value: 1500,
                unit: 'ms',
                context: undefined,
            });
        });

        it('should include context when provided', async () => {
            await analyticsService.trackPerformance('api_call', 200, { endpoint: '/users' });

            expect(mockRepository.trackMetric).toHaveBeenCalledWith({
                name: 'api_call',
                value: 200,
                unit: 'ms',
                context: { endpoint: '/users' },
            });
        });
    });

    describe('captureError', () => {
        it('should capture error with message and context', async () => {
            const error = new Error('Test error');
            await analyticsService.captureError(error, { component: 'TestComponent' });

            expect(mockRepository.captureError).toHaveBeenCalledWith(
                error,
                expect.objectContaining({
                    component: 'TestComponent',
                    sessionId: expect.any(String),
                })
            );
        });

        it('should work without context', async () => {
            const error = new Error('Simple error');
            await analyticsService.captureError(error);

            expect(mockRepository.captureError).toHaveBeenCalledWith(
                error,
                expect.objectContaining({
                    sessionId: expect.any(String),
                })
            );
        });
    });

    describe('identify', () => {
        it('should identify user with traits', async () => {
            await analyticsService.identify('user-789', { plan: 'pro', role: 'admin' });

            expect(mockRepository.identifyUser).toHaveBeenCalledWith('user-789', {
                plan: 'pro',
                role: 'admin',
            });
        });

        it('should work without traits', async () => {
            await analyticsService.identify('user-simple');

            expect(mockRepository.identifyUser).toHaveBeenCalledWith('user-simple', undefined);
        });
    });

    describe('getEventsByUser', () => {
        it('should fetch events for a user', async () => {
            const mockEvents = [
                { id: '1', eventName: 'login', eventCategory: 'user_action', timestamp: '2026-01-12', userId: 'user-123', sessionId: 'sess_1' },
            ];
            vi.mocked(mockRepository.getEventsByUser).mockResolvedValue(mockEvents);

            const result = await analyticsService.getEventsByUser('user-123', 10);

            expect(result).toEqual(mockEvents);
            expect(mockRepository.getEventsByUser).toHaveBeenCalledWith('user-123', 10);
        });
    });

    describe('flush', () => {
        it('should flush pending events', async () => {
            await analyticsService.flush();

            expect(mockRepository.flush).toHaveBeenCalled();
        });
    });

    describe('getSessionId', () => {
        it('should return consistent session ID', () => {
            const sessionId1 = analyticsService.getSessionId();
            const sessionId2 = analyticsService.getSessionId();

            expect(sessionId1).toBe(sessionId2);
            expect(sessionId1).toMatch(/^sess_\d+_[a-z0-9]+$/);
        });
    });
});
