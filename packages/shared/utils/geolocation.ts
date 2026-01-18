/**
 * Geolocation Utils
 * IP-based geolocation detection
 * @package @foundation/shared
 */

export interface LocationData {
    countryCode: string;
    countryName: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
}

export interface GeolocationFetcher {
    fetch(url: string): Promise<Response>;
}

export function createGeolocationService(fetcher: GeolocationFetcher = { fetch: globalThis.fetch?.bind(globalThis) }) {
    return {
        async getUserCountry(): Promise<string | null> {
            try {
                const response = await fetcher.fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Failed to fetch geolocation');
                const data = await response.json();
                return data.country_code || null;
            } catch {
                // Silent error handling for country detection
                return null;
            }
        },

        async getUserLocation(): Promise<LocationData | null> {
            try {
                const response = await fetcher.fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Failed to fetch geolocation');
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
                // Silent error handling for location detection
                return null;
            }
        },
    };
}

// Default instance for direct usage
const defaultService = createGeolocationService();
export const getUserCountry = defaultService.getUserCountry;
export const getUserLocation = defaultService.getUserLocation;
