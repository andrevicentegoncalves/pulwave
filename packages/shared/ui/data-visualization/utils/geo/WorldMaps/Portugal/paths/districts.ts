/**
 * Portugal Districts SVG Paths
 * 
 * Simplified SVG paths for all 18 Portuguese mainland districts.
 * Based on simplified geographic outlines for web rendering.
 * 
 * ViewBox: 0 0 200 395 (vertical orientation)
 */

export interface DistrictData {
    path: string;
    name: string;
    center: [number, number]; // [x, y] for label placement
}

export const PORTUGAL_MAP_VIEWBOX = '0 0 200 395';
export const PORTUGAL_MAP_ASPECT_RATIO = 200 / 395;

export const PORTUGAL_DISTRICTS_PATHS: Record<string, DistrictData> = {
    VCT: {
        name: 'Viana do Castelo',
        path: 'M25,10 L60,5 L75,25 L65,50 L40,55 L25,40 Z',
        center: [48, 30]
    },
    BRA: {
        name: 'Braga',
        path: 'M40,55 L65,50 L95,45 L105,70 L85,85 L50,90 L40,70 Z',
        center: [70, 68]
    },
    VRL: {
        name: 'Vila Real',
        path: 'M75,25 L120,15 L145,35 L140,65 L105,70 L95,45 L75,25 Z',
        center: [110, 48]
    },
    BGR: {
        name: 'Bragança',
        path: 'M120,15 L175,5 L190,40 L180,75 L145,80 L140,65 L145,35 L120,15 Z',
        center: [155, 45]
    },
    OPO: {
        name: 'Porto',
        path: 'M15,65 L40,55 L50,90 L55,115 L30,120 L10,100 Z',
        center: [35, 90]
    },
    AVR: {
        name: 'Aveiro',
        path: 'M10,100 L30,120 L55,115 L60,145 L25,155 L5,130 Z',
        center: [35, 130]
    },
    VIS: {
        name: 'Viseu',
        path: 'M55,90 L85,85 L130,80 L135,115 L105,130 L60,135 L55,115 Z',
        center: [95, 108]
    },
    GDA: {
        name: 'Guarda',
        path: 'M130,80 L145,80 L180,75 L190,115 L175,145 L140,140 L135,115 Z',
        center: [158, 110]
    },
    CMB: {
        name: 'Coimbra',
        path: 'M25,155 L60,145 L105,145 L110,175 L75,190 L35,185 L25,170 Z',
        center: [68, 168]
    },
    CBR: {
        name: 'Castelo Branco',
        path: 'M105,130 L135,115 L175,145 L180,190 L145,210 L100,200 L100,175 Z',
        center: [140, 168]
    },
    LEI: {
        name: 'Leiria',
        path: 'M10,175 L35,185 L75,190 L80,225 L50,240 L15,225 Z',
        center: [45, 208]
    },
    STM: {
        name: 'Santarém',
        path: 'M50,190 L100,175 L100,200 L115,235 L80,260 L55,255 L50,225 Z',
        center: [80, 220]
    },
    POR: {
        name: 'Portalegre',
        path: 'M115,200 L145,210 L180,190 L190,235 L155,260 L120,250 L115,235 Z',
        center: [150, 228]
    },
    LIS: {
        name: 'Lisboa',
        path: 'M15,240 L50,240 L55,270 L25,285 L5,265 Z',
        center: [32, 260]
    },
    STB: {
        name: 'Setúbal',
        path: 'M25,270 L55,270 L75,285 L65,310 L35,315 L20,295 Z',
        center: [48, 292]
    },
    EVR: {
        name: 'Évora',
        path: 'M55,255 L80,260 L120,250 L130,290 L95,315 L60,310 L55,280 Z',
        center: [88, 285]
    },
    BEJ: {
        name: 'Beja',
        path: 'M35,315 L65,310 L95,315 L130,290 L145,325 L110,355 L55,355 L35,335 Z',
        center: [88, 335]
    },
    FAR: {
        name: 'Faro',
        path: 'M55,355 L110,355 L145,340 L155,365 L105,385 L50,380 L45,365 Z',
        center: [100, 368]
    }
};

// Portugal outline for shadow/background
export const PORTUGAL_OUTLINE = 'M25,10 L175,5 L190,40 L190,235 L155,365 L50,380 L5,265 L5,130 L15,65 L25,10 Z';

// District code lookup by name
export const PORTUGAL_NAME_TO_CODE: Record<string, string> = {
    'Aveiro': 'AVR',
    'Beja': 'BEJ',
    'Braga': 'BRA',
    'Bragança': 'BGR',
    'Castelo Branco': 'CBR',
    'Coimbra': 'CMB',
    'Évora': 'EVR',
    'Faro': 'FAR',
    'Guarda': 'GDA',
    'Leiria': 'LEI',
    'Lisboa': 'LIS',
    'Portalegre': 'POR',
    'Porto': 'OPO',
    'Santarém': 'STM',
    'Setúbal': 'STB',
    'Viana do Castelo': 'VCT',
    'Vila Real': 'VRL',
    'Viseu': 'VIS',
};
