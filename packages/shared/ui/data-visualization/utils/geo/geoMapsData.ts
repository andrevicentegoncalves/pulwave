
/**
 * Maps Registry
 * 
 * Central registry for SVG map paths.
 * Allows decoupling the GeoChart from specific map implementations.
 */

export interface MapDefinition {
    viewBox: string;
    outline?: string;
    nameToCode?: Record<string, string>;
    paths: Record<string, {
        name: string;
        path: string;
        transform?: string;
        center: [number, number];
    }>;
}

export type MapType = 'portugal' | 'usa' | 'world' | string;

import {
    PORTUGAL_DISTRICTS_PATHS,
    PORTUGAL_MAP_VIEWBOX,
    PORTUGAL_OUTLINE,
    PORTUGAL_NAME_TO_CODE
} from './WorldMaps/Portugal';

import {
    USA_STATES_PATHS,
    USA_MAP_VIEWBOX,
    USA_NAME_TO_ABBR
} from './WorldMaps/USA';

export const MAPS_REGISTRY: Record<string, MapDefinition> = {
    // Portugal Map
    portugal: {
        viewBox: PORTUGAL_MAP_VIEWBOX,
        outline: PORTUGAL_OUTLINE,
        nameToCode: PORTUGAL_NAME_TO_CODE,
        paths: PORTUGAL_DISTRICTS_PATHS
    },
    // USA Map
    usa: {
        viewBox: USA_MAP_VIEWBOX,
        nameToCode: USA_NAME_TO_ABBR,
        paths: Object.fromEntries(
            Object.entries(USA_STATES_PATHS).map(([abbr, data]) => [
                abbr,
                {
                    name: data.name,
                    path: data.path,
                    center: data.coords || [0, 0]
                }
            ])
        )
    }
};
