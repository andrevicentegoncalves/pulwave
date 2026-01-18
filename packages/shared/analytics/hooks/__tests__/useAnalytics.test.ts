import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnalytics, usePageView, usePerformanceTracking, useErrorCapture } from '../useAnalytics';
import { analyticsService } from '../../services/analyticsService';

vi.mock('../../services/analyticsService', () => ({
    analyticsService: {
        trackAction: vi.fn().mockResolvedValue(undefined),
        trackPageView: vi.fn().mockResolvedValue(undefined),
        trackFeatureUsage: vi.fn().mockResolvedValue(undefined),
        trackPerformance: vi.fn().mockResolvedValue(undefined),
        captureError: vi.fn().mockResolvedValue(undefined),
        identify: vi.fn().mockResolvedValue(undefined),
        flush: vi.fn().mockResolvedValue(undefined),
    },
}));

describe('useAnalytics', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should provide trackAction function', async () => {
        const { result } = renderHook(() => useAnalytics({ userId: 'user-123' }));

        await act(async () => {
            await result.current.trackAction('button_click', { buttonId: 'submit' });
        });

        expect(analyticsService.trackAction).toHaveBeenCalledWith(
            'button_click',
            { buttonId: 'submit' },
            'user-123'
        );
    });

    it('should provide trackFeature function', async () => {
        const { result } = renderHook(() => useAnalytics({ userId: 'user-456' }));

        await act(async () => {
            await result.current.trackFeature('dark_mode', 'enabled');
        });

        expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith(
            'dark_mode',
            'enabled',
            'user-456'
        );
    });

    it('should provide captureError function', async () => {
        const { result } = renderHook(() => useAnalytics());
        const error = new Error('Test error');

        await act(async () => {
            await result.current.captureError(error, { component: 'TestComponent' });
        });

        expect(analyticsService.captureError).toHaveBeenCalledWith(error, {
            component: 'TestComponent',
        });
    });

    it('should not track when enabled is false', async () => {
        const { result } = renderHook(() => useAnalytics({ enabled: false }));

        await act(async () => {
            await result.current.trackAction('should_not_track');
        });

        expect(analyticsService.trackAction).not.toHaveBeenCalled();
    });
});

describe('usePageView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should track page view on mount', () => {
        renderHook(() => usePageView('home'));

        expect(analyticsService.trackPageView).toHaveBeenCalledWith('home', undefined);
    });

    it('should include userId when provided', () => {
        renderHook(() => usePageView('dashboard', { userId: 'user-123' }));

        expect(analyticsService.trackPageView).toHaveBeenCalledWith('dashboard', 'user-123');
    });

    it('should not track when enabled is false', () => {
        renderHook(() => usePageView('hidden', { enabled: false }));

        expect(analyticsService.trackPageView).not.toHaveBeenCalled();
    });

    it('should not track when pageName is empty', () => {
        renderHook(() => usePageView(''));

        expect(analyticsService.trackPageView).not.toHaveBeenCalled();
    });

    it('should only track once even on re-renders', () => {
        const { rerender } = renderHook(() => usePageView('dashboard'));

        rerender();
        rerender();

        expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
    });
});

describe('usePerformanceTracking', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should track timing with startTiming and endTiming', async () => {
        const { result } = renderHook(() => usePerformanceTracking());

        act(() => {
            result.current.startTiming();
        });

        await act(async () => {
            await result.current.endTiming('api_call');
        });

        expect(analyticsService.trackPerformance).toHaveBeenCalledWith(
            'api_call',
            expect.any(Number),
            undefined
        );
    });

    it('should track timing with trackTiming directly', async () => {
        const { result } = renderHook(() => usePerformanceTracking());
        const startTime = performance.now() - 100;

        await act(async () => {
            await result.current.trackTiming('operation', startTime, { type: 'fetch' });
        });

        expect(analyticsService.trackPerformance).toHaveBeenCalledWith(
            'operation',
            expect.any(Number),
            { type: 'fetch' }
        );
    });

    it('should warn when endTiming is called without startTiming', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const { result } = renderHook(() => usePerformanceTracking());

        await act(async () => {
            await result.current.endTiming('orphan_end');
        });

        expect(warnSpy).toHaveBeenCalled();
        expect(analyticsService.trackPerformance).not.toHaveBeenCalled();

        warnSpy.mockRestore();
    });
});

describe('useErrorCapture', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return error capture function', async () => {
        const { result } = renderHook(() => useErrorCapture());
        const error = new Error('Component error');

        await act(async () => {
            await result.current(error, { componentStack: 'in TestComponent' });
        });

        expect(analyticsService.captureError).toHaveBeenCalledWith(error, {
            componentStack: 'in TestComponent',
        });
    });

    it('should work without errorInfo', async () => {
        const { result } = renderHook(() => useErrorCapture());
        const error = new Error('Simple error');

        await act(async () => {
            await result.current(error);
        });

        expect(analyticsService.captureError).toHaveBeenCalledWith(error, {
            componentStack: undefined,
        });
    });
});
