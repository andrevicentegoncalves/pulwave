/**
 * Nominatim API Utility
 * Free geocoding API from OpenStreetMap
 * Documentation: https://nominatim.org/release-docs/latest/api/Search/
 * 
 * @package @pulwave/features-forms
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'PulwaveApp/1.0'; // Required by Nominatim

// Rate limiting: 1 request per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

// Types
export interface NominatimAddress {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    region?: string;
    country?: string;
    road?: string;
    postcode?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    city_district?: string;
    [key: string]: string | undefined;
}

export interface NominatimResult {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
    type: string;
    address: NominatimAddress;
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

        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params.toString()}`, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (!response.ok) {
            throw new Error('Nominatim API request failed');
        }

        const data = await response.json();

        // Filter to include cities, towns, villages, and smaller localities
        return data.filter((item: NominatimResult) =>
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
        // Silent error handling - return empty results on failure
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

        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params.toString()}`, {
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
        // Silent error handling - return empty results on failure
        return [];
    }
};

/**
 * Debounce function type
 */
export const debounce = <F extends (...args: any[]) => any>(func: F, wait = 300) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
