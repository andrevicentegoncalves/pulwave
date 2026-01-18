/**
 * Timezone Lookup Service
 */
import { systemRepository } from '../../repositories/systemRepository';

export interface TimezoneOption {
    value: string;
    label: string;
    utcOffset: string;
}

// In-memory cache
let timezonesCache: TimezoneOption[] | null = null;
let lastFetch: number | null = null;
const CACHE_TTL = 5 * 60 * 1000;

const isCacheValid = (): boolean => {
    return !!lastFetch && (Date.now() - lastFetch) < CACHE_TTL;
};

export const timezoneLookupService = {
    async fetchTimezones(forceRefresh = false): Promise<TimezoneOption[]> {
        if (!forceRefresh && timezonesCache && isCacheValid()) {
            return timezonesCache;
        }

        try {
            const data = await systemRepository.getTimezones();
            timezonesCache = (data || []).map((tz: any) => ({
                value: tz.value,
                label: tz.label,
                utcOffset: tz.utcOffset,
            }));
            lastFetch = Date.now();
            return timezonesCache;
        } catch (error) {
            // Error fetching timezones, return cached data if available
            return timezonesCache || [];
        }
    },

    clearCache(): void {
        timezonesCache = null;
        lastFetch = null;
    },
};



