/**
 * useTimezones Hook
 * 
 * Fetches timezone options from the database for use in Select components.
 * Caches results to avoid repeated fetches.
 */

import { useState, useEffect } from 'react';
import { lookupService } from '../services/lookupService';

/**
 * Hook to fetch timezones from database
 * @param {boolean} autoFetch - Whether to fetch on mount (default: true)
 * @returns {{ timezones: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export const useTimezones = (autoFetch = true) => {
    const [timezones, setTimezones] = useState([]);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    const fetchData = async (forceRefresh = false) => {
        setLoading(true);
        setError(null);

        try {
            const data = await lookupService.fetchTimezones(forceRefresh);
            setTimezones(data);
        } catch (err) {
            setError(err);
            console.error('Error in useTimezones:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch]);

    return {
        timezones,
        loading,
        error,
        refetch: (forceRefresh = true) => fetchData(forceRefresh),
    };
};

export default useTimezones;
