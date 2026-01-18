/**
 * useTimezones Hook
 * 
 * Fetches timezone options from the database for use in Select components.
 * Caches results to avoid repeated fetches.
 * 
 * @package @foundation
 */
import { useState, useEffect, useCallback } from 'react';
import { timezoneLookupService } from '../services/configurations/timezoneLookupService';

// Cache for timezones handled by service or react-query in future
// For now relying on service cache

export interface TimezoneOptionItem {
    value: string;
    label: string;
    offset?: string;
}



export interface UseTimezonesReturn {
    timezones: TimezoneOptionItem[];
    loading: boolean;
    error: Error | null;
    refetch: (forceRefresh?: boolean) => Promise<void>;
}

/**
 * Hook to fetch timezones from database
 */
export const useTimezones = (autoFetch = true): UseTimezonesReturn => {
    const [timezones, setTimezones] = useState<TimezoneOptionItem[]>([]);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async (forceRefresh = false) => {
        setLoading(true);
        setError(null);

        try {
            const data = await timezoneLookupService.fetchTimezones(forceRefresh);
            // Service returns { value, label, utcOffset }, hook expects { value, label, offset }
            // Or adapt service to return consistent shape. 
            // Looking at service it returns { value, label, utcOffset }.
            // This hook Interface is TimezoneOptionItem { value, label, offset }.
            // Map it.
            const mapped = data.map((tz: any) => ({
                value: tz.value,
                label: tz.label,
                offset: tz.utcOffset
            }));
            setTimezones(mapped);
        } catch (err) {
            setError(err as Error);
            // Silent error handling - error already captured in state
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch, fetchData]);

    return {
        timezones,
        loading,
        error,
        refetch: fetchData,
    };
};

export default useTimezones;






