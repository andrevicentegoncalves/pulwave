/**
 * useTimezones Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTimezones } from '../useTimezones';
import { timezoneLookupService, type TimezoneOption } from '../../services/configurations/timezoneLookupService';

// Mock dependencies
vi.mock('../../services/configurations/timezoneLookupService', () => ({
    timezoneLookupService: {
        fetchTimezones: vi.fn(),
    }
}));

describe('useTimezones', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch timezones on mount', async () => {
        const mockTimezones: TimezoneOption[] = [{ value: 'UTC', label: 'Coordinated Universal Time', utcOffset: '+00:00' }];
        vi.mocked(timezoneLookupService.fetchTimezones).mockResolvedValue(mockTimezones);

        const { result } = renderHook(() => useTimezones());

        // Initial state
        expect(result.current.loading).toBe(true);

        // Wait for fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.timezones).toEqual(mockTimezones);
    });

    it('should handle errors', async () => {
        vi.mocked(timezoneLookupService.fetchTimezones).mockRejectedValue(new Error('Fetch error'));

        const { result } = renderHook(() => useTimezones());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe('Fetch error');
        expect(result.current.timezones).toEqual([]);
    });
});
