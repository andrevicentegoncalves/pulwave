/**
 * Geolocation Utility
 * Detects user's country using IP-based geolocation
 */

/**
 * Get user's country code using IP geolocation
 * @returns {Promise<string|null>} ISO country code (e.g., 'US', 'ES') or null if detection fails
 */
export const getUserCountry = async (): Promise<string | null> => {
    try {
        // Use ipapi.co for IP-based geolocation (free, no API key required)
        const response = await fetch('https://ipapi.co/json/');

        if (!response.ok) {
            throw new Error('Failed to fetch geolocation data');
        }

        const data = await response.json();

        // Return the ISO 3166-1 alpha-2 country code
        return data.country_code || null;
    } catch {
        // Silent error handling - return null on failure
        return null;
    }
};

/**
 * Get user's full location data
 * @returns {Promise<Object|null>} Location data object or null if detection fails
 */
export const getUserLocation = async (): Promise<any | null> => {
    try {
        const response = await fetch('https://ipapi.co/json/');

        if (!response.ok) {
            throw new Error('Failed to fetch geolocation data');
        }

        const data = await response.json();

        return {
            countryCode: data.country_code,
            countryName: data.country_name,
            region: data.region,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
        };
    } catch {
        // Silent error handling - return null on failure
        return null;
    }
};
