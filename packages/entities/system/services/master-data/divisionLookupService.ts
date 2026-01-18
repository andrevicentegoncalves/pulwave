/**
 * Division Lookup Service
 * Administrative divisions and localities.
 */
import { systemRepository } from '../../repositories/systemRepository';

export interface DivisionOption {
    value: string;
    label: string;
    code?: string;
    type?: string;
    parentId?: string | null;
}

export interface LocalityOption {
    value: string;
    label: string;
    name: string;
    postalCode?: string;
}

// In-memory cache
const cache: Record<string, DivisionOption[] | LocalityOption[]> = {};
const lastFetch: Record<string, number> = {};
const CACHE_TTL = 5 * 60 * 1000;

const isCacheValid = (key: string): boolean => {
    return !!lastFetch[key] && (Date.now() - lastFetch[key]) < CACHE_TTL;
};

export const divisionLookupService = {
    async fetchAdministrativeDivisions(
        countryId: string,
        divisionType: string | null = null,
        forceRefresh = false
    ): Promise<DivisionOption[]> {
        const cacheKey = `regions_${countryId}_${divisionType || 'all'}`;

        if (!forceRefresh && cache[cacheKey] && isCacheValid(cacheKey)) {
            return cache[cacheKey] as DivisionOption[];
        }

        try {
            const data = await systemRepository.getAdministrativeDivisions(countryId, divisionType);
            const result = (data || []).map((div: any) => ({
                value: div.id,
                label: div.name,
                code: div.code,
                type: div.division_type,
                parentId: div.parent_division_id,
            }));

            cache[cacheKey] = result;
            lastFetch[cacheKey] = Date.now();

            return result;
        } catch (error) {
            return (cache[cacheKey] as DivisionOption[]) || [];
        }
    },

    async fetchPortugalDistricts(): Promise<DivisionOption[]> {
        const portugal = await systemRepository.getCountryByCode('PT');
        if (!portugal?.id) return [];
        return this.fetchAdministrativeDivisions(portugal.id, 'district');
    },

    async fetchLocalities(
        divisionId: string,
        forceRefresh = false
    ): Promise<LocalityOption[]> {
        const cacheKey = `localities_${divisionId}`;

        if (!forceRefresh && cache[cacheKey] && isCacheValid(cacheKey)) {
            return cache[cacheKey] as LocalityOption[];
        }

        try {
            const data = await systemRepository.getLocalities(divisionId);
            const result = (data || []).map((loc: any) => ({
                value: loc.id,
                label: loc.postal_code ? `${loc.name} (${loc.postal_code})` : loc.name,
                name: loc.name,
                postalCode: loc.postal_code,
            }));

            cache[cacheKey] = result;
            lastFetch[cacheKey] = Date.now();

            return result;
        } catch (error) {
            // Error fetching localities, return cached data if available
            return (cache[cacheKey] as LocalityOption[]) || [];
        }
    },

    clearCache(): void {
        Object.keys(cache).forEach(key => delete cache[key]);
        Object.keys(lastFetch).forEach(key => delete lastFetch[key]);
    },
};



