/**
 * World Country Paths
 * 
 * Simplified SVG paths for major world countries.
 */

export interface CountryData {
    name: string;
    code: string;
    path: string;
    coords?: [number, number];
}

export const WORLD_MAP_VIEWBOX = '0 0 600 300';

// Self-hosted TopoJSON path (download from cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json)
export const WORLD_TOPOJSON_PATH = '/geo/world/countries-110m.json';

export const WORLD_COUNTRIES_PATHS: Record<string, CountryData> = {
    // North America
    USA: { name: 'United States', code: 'USA', coords: [-98, 39], path: 'M 55 85 L 130 85 L 135 95 L 130 115 L 95 115 L 55 100 Z' },
    CAN: { name: 'Canada', code: 'CAN', coords: [-106, 56], path: 'M 50 45 L 145 45 L 150 55 L 145 75 L 55 80 L 45 65 Z' },
    MEX: { name: 'Mexico', code: 'MEX', coords: [-102, 23], path: 'M 55 115 L 95 115 L 95 140 L 70 150 L 55 135 Z' },
    // South America
    BRA: { name: 'Brazil', code: 'BRA', coords: [-51, -14], path: 'M 145 165 L 190 145 L 200 180 L 175 220 L 140 200 Z' },
    ARG: { name: 'Argentina', code: 'ARG', coords: [-64, -34], path: 'M 135 220 L 155 210 L 165 260 L 145 290 L 130 260 Z' },
    // Europe
    GBR: { name: 'United Kingdom', code: 'GBR', coords: [-3, 54], path: 'M 255 70 L 265 65 L 270 80 L 260 90 L 252 82 Z' },
    FRA: { name: 'France', code: 'FRA', coords: [2, 46], path: 'M 260 90 L 280 85 L 285 105 L 265 115 L 255 100 Z' },
    DEU: { name: 'Germany', code: 'DEU', coords: [10, 51], path: 'M 285 75 L 305 70 L 310 95 L 290 100 L 280 85 Z' },
    ITA: { name: 'Italy', code: 'ITA', coords: [12, 42], path: 'M 295 105 L 305 100 L 310 130 L 295 140 L 290 120 Z' },
    ESP: { name: 'Spain', code: 'ESP', coords: [-4, 40], path: 'M 245 105 L 275 105 L 275 125 L 245 125 Z' },
    PRT: { name: 'Portugal', code: 'PRT', coords: [-8, 39], path: 'M 235 105 L 245 105 L 245 130 L 235 130 Z' },
    // Asia
    CHN: { name: 'China', code: 'CHN', coords: [105, 35], path: 'M 420 85 L 500 75 L 510 120 L 450 140 L 410 115 Z' },
    JPN: { name: 'Japan', code: 'JPN', coords: [138, 36], path: 'M 520 90 L 535 85 L 540 115 L 525 120 L 515 105 Z' },
    IND: { name: 'India', code: 'IND', coords: [79, 21], path: 'M 395 120 L 430 115 L 425 165 L 395 175 L 380 145 Z' },
    RUS: { name: 'Russia', code: 'RUS', coords: [100, 60], path: 'M 320 30 L 520 25 L 540 70 L 320 75 Z' },
    // Africa
    ZAF: { name: 'South Africa', code: 'ZAF', coords: [25, -29], path: 'M 295 230 L 330 220 L 340 250 L 305 260 L 290 245 Z' },
    EGY: { name: 'Egypt', code: 'EGY', coords: [30, 27], path: 'M 315 135 L 345 130 L 350 155 L 320 160 L 310 145 Z' },
    NGA: { name: 'Nigeria', code: 'NGA', coords: [8, 10], path: 'M 275 170 L 300 165 L 305 190 L 280 195 Z' },
    // Oceania
    AUS: { name: 'Australia', code: 'AUS', coords: [133, -27], path: 'M 475 210 L 545 200 L 555 245 L 485 260 L 465 235 Z' },
};

// Country name lookup
export const WORLD_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
    Object.entries(WORLD_COUNTRIES_PATHS).map(([code, data]) => [data.name, code])
);
