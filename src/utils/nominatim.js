/**
 * Nominatim API Utility
 * Free geocoding API from OpenStreetMap
 * Documentation: https://nominatim.org/release-docs/latest/api/Search/
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'PulwaveApp/1.0'; // Required by Nominatim

// Rate limiting: 1 request per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

/**
 * Wait to respect rate limit
 */
const waitForRateLimit = async () => {
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
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of address results
 */
export const searchAddress = async (query, options = {}) => {
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
    } catch (error) {
        console.error('Error searching address:', error);
        return [];
    }
};

/**
 * Search for cities
 * @param {string} query - City name
 * @param {string} countryCode - ISO country code (e.g., 'US', 'ES')
 * @returns {Promise<Array>} Array of city results
 */
export const searchCity = async (query, countryCode = '') => {
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

        // Filter to only include cities, towns, villages
        return data.filter(item =>
            item.type && ['city', 'town', 'village', 'municipality', 'administrative'].includes(item.type)
        );
    } catch (error) {
        console.error('Error searching city:', error);
        return [];
    }
};

/**
 * Search for streets
 * @param {string} query - Street name
 * @param {string} city - City name to filter results
 * @param {string} countryCode - ISO country code
 * @returns {Promise<Array>} Array of street results
 */
export const searchStreet = async (query, city = '', countryCode = '') => {
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
    } catch (error) {
        console.error('Error searching street:', error);
        return [];
    }
};

/**
 * Reverse geocode - get address from coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object|null>} Address object or null
 */
export const reverseGeocode = async (lat, lon) => {
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
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        return null;
    }
};

/**
 * Debounce function for API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
