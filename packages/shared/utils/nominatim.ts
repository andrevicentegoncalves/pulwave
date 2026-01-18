/**
 * Nominatim API Utility
 * Free geocoding API from OpenStreetMap
 * Documentation: https://nominatim.org/release-docs/latest/api/Search/
 * 
 * @package @foundation/utils
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'PulwaveApp/1.0'; // Required by Nominatim

// Rate limiting: 1 request per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

export interface SearchOptions {
    [key: string]: string | undefined;
    limit?: string;
    countrycodes?: string;
}

export interface NominatimResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
    address?: Record<string, string>;
    [key: string]: any;
}

/**
 * Wait to respect rate limit
 */
const waitForRateLimit = async (): Promise<void> => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve =>
            setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
    }

    lastRequestTime = Date.now();
};

/**
 * Search for addresses
 */
export const searchAddress = async (query: string, options: SearchOptions = {}): Promise<NominatimResult[]> => {
    if (!query || query.trim().length < 3) {
        return [];
    }

    try {
        await waitForRateLimit();

        const params = new URLSearchParams({
            q: query,
            format: 'json',
            addressdetails: '1',
            limit: options.limit || '5',
            ...options
        });

        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (!response.ok) {
            throw new Error('Nominatim API request failed');
        }

        const data = await response.json();
        return data;
    } catch {
        // Silent error handling for address search
        return [];
    }
};

/**
 * Search for cities
 */
export const searchCity = async (query: string, countryCode = ''): Promise<NominatimResult[]> => {
    if (!query || query.trim().length < 2) {
        return [];
    }

    try {
        await waitForRateLimit();

        const params = new URLSearchParams({
            q: query,
            format: 'json',
            addressdetails: '1',
            limit: '50'
        });

        if (countryCode) {
            params.append('countrycodes', countryCode.toLowerCase());
        }

        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (!response.ok) {
            throw new Error('Nominatim API request failed');
        }

        const data = await response.json();

        // Filter to include cities, towns, villages, and smaller localities
        return data.filter((item: any) =>
            item.type && [
                'city',
                'town',
                'village',
                'municipality',
                'administrative',
                'suburb',      // Parishes/neighborhoods
                'hamlet',      // Small settlements
                'locality',    // General localities
                'neighbourhood' // Alternative spelling
            ].includes(item.type)
        );
    } catch {
        // Silent error handling for city search
        return [];
    }
};

/**
 * Search for streets
 */
export const searchStreet = async (query: string, city = '', countryCode = ''): Promise<NominatimResult[]> => {
    if (!query || query.trim().length < 3) {
        return [];
    }

    try {
        await waitForRateLimit();

        let searchQuery = query;
        if (city) {
            searchQuery = `${query}, ${city}`;
        }

        const params = new URLSearchParams({
            street: query,
            city: city,
            format: 'json',
            addressdetails: '1',
            limit: '10'
        });

        if (countryCode) {
            params.append('countrycodes', countryCode.toLowerCase());
        }

        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (!response.ok) {
            throw new Error('Nominatim API request failed');
        }

        const data = await response.json();
        return data;
    } catch {
        // Silent error handling for street search
        return [];
    }
};

/**
 * Reverse geocode - get address from coordinates
 */
export const reverseGeocode = async (lat: number, lon: number): Promise<NominatimResult | null> => {
    try {
        await waitForRateLimit();

        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString(),
            format: 'json',
            addressdetails: '1'
        });

        const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (!response.ok) {
            throw new Error('Nominatim API request failed');
        }

        const data = await response.json();
        return data;
    } catch {
        // Silent error handling for reverse geocoding
        return null;
    }
};

/**
 * Search for parishes/suburbs within a city
 */
export const searchParishes = async (cityName: string, countryCode = ''): Promise<any[]> => {
    if (!cityName || cityName.trim().length < 2) {
        return [];
    }

    try {
        await waitForRateLimit();

        // Search for suburbs/parishes in the city
        const params = new URLSearchParams({
            city: cityName,
            format: 'json',
            addressdetails: '1',
            limit: '50'
        });

        if (countryCode) {
            params.append('countrycodes', countryCode.toLowerCase());
        }

        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (!response.ok) {
            throw new Error('Nominatim API request failed');
        }

        const data = await response.json();

        // Extract unique parish names from the results
        const parishSet = new Set();
        const parishes: any[] = [];

        data.forEach((item: any) => {
            const addr = item.address || {};
            // Look for parish indicators in the address
            const parishName = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district;

            if (parishName && !parishSet.has(parishName)) {
                parishSet.add(parishName);
                parishes.push({
                    name: parishName,
                    display_name: `${parishName}, ${cityName}`,
                    lat: item.lat,
                    lon: item.lon,
                    address: addr
                });
            }
        });

        return parishes.sort((a, b) => a.name.localeCompare(b.name));
    } catch {
        // Silent error handling for parish search
        return [];
    }
};

/**
 * Debounce function for API calls
 */
export const debounce = (func: Function, wait = 300) => {
    let timeout: any;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
