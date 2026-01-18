import { cva, type VariantProps } from 'class-variance-authority';

export const worldMapChartVariants = cva('chart chart--world-map', {
    variants: {
        mode: {
            choropleth: 'chart--world-map--choropleth',
            markers: 'chart--world-map--markers',
            bubbles: 'chart--world-map--bubbles',
            routes: 'chart--world-map--routes',
        },
    },
    defaultVariants: {
        mode: 'choropleth',
    },
});

export interface WorldMapDataItem {
    country?: string;
    value?: number;
    color?: string;
    from?: string;
    to?: string;
    [key: string]: unknown;
}

export interface CountryData {
    name: string;
    coords: number[] | [number, number];
}

export interface CountryRegion {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface MapMarker extends WorldMapDataItem {
    x: number;
    y: number;
    radius: number;
    name: string;
}

export interface MapRoute extends Omit<WorldMapDataItem, 'from' | 'to'> {
    path: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
    fromCountry?: string;
    toCountry?: string;
}

export interface WorldMapChartProps extends VariantProps<typeof worldMapChartVariants> {
    data: WorldMapDataItem[];
    countryKey?: string;
    valueKey?: string;
    width?: number;
    height?: number;
    colorScheme?: string;
    showLegend?: boolean;
    showLabels?: boolean;
    showTooltip?: boolean;
    interactive?: boolean;
    markerColor?: string;
    bubbleMinSize?: number;
    bubbleMaxSize?: number;
    routeColor?: string;
    className?: string;
}
