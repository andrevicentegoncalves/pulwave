/**
 * Portugal Lookup Utilities
 * 
 * Functions for looking up district data by name or code.
 */

import { PORTUGAL_NAME_TO_CODE, PORTUGAL_DISTRICTS_PATHS } from '../paths';

/**
 * Get district code from name
 */
export const getDistrictCode = (name: string): string | undefined => {
    return PORTUGAL_NAME_TO_CODE[name];
};

/**
 * Get district name from code
 */
export const getDistrictName = (code: string): string | undefined => {
    return PORTUGAL_DISTRICTS_PATHS[code]?.name;
};

/**
 * Get district center coordinates for label placement
 */
export const getDistrictCenter = (code: string): [number, number] | undefined => {
    return PORTUGAL_DISTRICTS_PATHS[code]?.center;
};

/**
 * Get all district codes
 */
export const getAllDistrictCodes = (): string[] => {
    return Object.keys(PORTUGAL_DISTRICTS_PATHS);
};

/**
 * Get mainland districts (excluding islands)
 */
export const getMainlandDistrictCodes = (): string[] => {
    return getAllDistrictCodes().filter(code => !['AZR', 'MAD'].includes(code));
};

/**
 * Get island districts
 */
export const getIslandDistrictCodes = (): string[] => {
    return ['AZR', 'MAD'];
};
