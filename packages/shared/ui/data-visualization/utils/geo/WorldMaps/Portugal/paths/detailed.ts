/**
 * Portugal Detailed Paths
 * 
 * High-fidelity SVG paths for Portugal districts and regions.
 * Source: AfonsoFG/PortugalSVG (GitHub)
 * 
 * Contains:
 * - 18 Mainland Districts (z31-z48)
 * - 2 Autonomous Regions (Madeira z49, Azores z50)
 * 
 * ViewBox: 0 0 12969 26674
 */

// Re-export the high-fidelity paths from legacy location
// TODO: Move the actual path data here when doing full migration
export {
    z31, z32, z33, z34, z35, z36, z37, z38, z39, z40,
    z41, z42, z43, z44, z45, z46, z47, z48, z49, z50
} from './portugalPaths';

// Re-export as named bundle
export * as PortugalDetailedPaths from './portugalPaths';

export const PORTUGAL_DETAILED_VIEWBOX = '0 0 12969 26674';

export interface DetailedDistrictData {
    path: string;
    name: string;
    center?: [number, number];
    transform?: string;
}

// High-fidelity mapping using the z-paths
// This will be populated when paths are moved to this file
export const PORTUGAL_DETAILED_PATHS_CONFIG = {
    viewBox: PORTUGAL_DETAILED_VIEWBOX,
    districtCodes: [
        'AVR', 'BEJ', 'BRA', 'BGR', 'CBR', 'CMB', 'EVR', 'FAR',
        'GDA', 'LEI', 'LIS', 'POR', 'OPO', 'STM', 'STB', 'VCT',
        'VRL', 'VIS', 'AZR', 'MAD'
    ],
    islands: {
        AZR: { transform: 'translate(600, 20500) scale(0.65)' },
        MAD: { transform: 'translate(5000, 22500) scale(0.65)' },
    },
    islandOutline: 'M 200 20000 h 4500 v 6000 h -4500 z M 5000 22000 h 4000 v 4000 h -4000 z',
};
