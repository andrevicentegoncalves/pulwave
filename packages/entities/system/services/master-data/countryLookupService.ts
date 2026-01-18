/**
 * Country Lookup Service
 */
import { systemRepository } from '../../repositories/systemRepository';

export interface Country {
    id: string;
    name: string;
    iso_code_2: string;
    phone_code?: string;
}

// In-memory cache
let countriesCache: Country[] | null = null;
let countriesWithPhoneCache: Country[] | null = null;
let countryById: Record<string, Country> = {};
let lastFetch: Record<string, number> = {};
const CACHE_TTL = 5 * 60 * 1000;

const isCacheValid = (key: string): boolean => {
    return !!lastFetch[key] && (Date.now() - lastFetch[key]) < CACHE_TTL;
};

export const countryLookupService = {
    async fetchCountries(forceRefresh = false): Promise<Country[]> {
        if (!forceRefresh && countriesCache && isCacheValid('countries')) {
            return countriesCache;
        }

        try {
            const data = await systemRepository.getCountries();
            countriesCache = data || [];
            lastFetch.countries = Date.now();

            (data || []).forEach((country: Country) => {
                countryById[country.id] = country;
            });

            return countriesCache;
        } catch (error) {
            // Error fetching countries, return cached data if available
            return countriesCache || [];
        }
    },

    async getCountryById(id: string): Promise<Country | null> {
        if (countryById && countryById[id]) {
            return countryById[id];
        }

        try {
            const data = await systemRepository.getCountryById(id);
            if (data) {
                countryById[id] = data;
            }
            return data;
        } catch (error) {
            // Error fetching country by id
            return null;
        }
    },

    async getCountriesWithPhoneCodes(forceRefresh = false): Promise<Country[]> {
        if (!forceRefresh && countriesWithPhoneCache && isCacheValid('countriesWithPhone')) {
            return countriesWithPhoneCache;
        }

        try {
            if (countriesCache && isCacheValid('countries')) {
                const filtered = countriesCache.filter(c => c.phone_code);
                countriesWithPhoneCache = filtered;
                return filtered;
            }

            const data = await systemRepository.getCountriesWithPhoneCodes();
            countriesWithPhoneCache = data || [];
            lastFetch.countriesWithPhone = Date.now();
            return countriesWithPhoneCache;
        } catch (error) {
            // Error fetching phone codes, return cached data if available
            return countriesWithPhoneCache || [];
        }
    },

    clearCache(): void {
        countriesCache = null;
        countriesWithPhoneCache = null;
        countryById = {};
        lastFetch = {};
    },
};



