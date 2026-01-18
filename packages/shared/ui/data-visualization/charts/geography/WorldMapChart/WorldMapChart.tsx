import React, { useMemo, useState } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import {
    WORLD_COUNTRIES,
    projectWorld,
    getColorFromScale,
    generateLegendStops,
} from '../../../utils/geo/geoData';
import {
    worldMapChartVariants,
    type WorldMapChartProps,
    type WorldMapDataItem,
    type CountryData,
    type CountryRegion,
    type MapMarker,
    type MapRoute,
} from './types';
import './styles/_index.scss';

// Simplified continent paths for realistic world map rendering
const CONTINENT_PATHS = {
    northAmerica: 'M 80 60 L 180 55 L 200 70 L 210 120 L 195 150 L 160 160 L 140 145 L 110 165 L 85 150 L 70 125 L 55 100 L 60 75 Z',
    southAmerica: 'M 175 180 L 200 175 L 215 195 L 225 230 L 220 280 L 195 320 L 170 310 L 155 270 L 160 220 L 165 190 Z',
    europe: 'M 340 65 L 380 55 L 420 60 L 430 75 L 425 100 L 395 115 L 365 120 L 345 110 L 330 95 L 335 75 Z',
    africa: 'M 340 125 L 395 120 L 420 140 L 430 180 L 425 230 L 400 270 L 360 275 L 335 250 L 330 200 L 335 150 Z',
    asia: 'M 430 50 L 550 40 L 620 55 L 650 90 L 640 140 L 610 170 L 560 180 L 510 175 L 470 150 L 440 120 L 425 85 Z',
    oceania: 'M 580 230 L 650 225 L 670 250 L 660 285 L 620 295 L 580 285 L 570 255 Z',
};

// Country approximate bounding boxes within continents (for interactive regions)
const COUNTRY_REGIONS: Record<string, CountryRegion> = {
    USA: { x: 85, y: 90, w: 80, h: 45 },
    CAN: { x: 80, y: 55, w: 100, h: 40 },
    MEX: { x: 95, y: 140, w: 45, h: 35 },
    BRA: { x: 170, y: 210, w: 50, h: 60 },
    ARG: { x: 165, y: 275, w: 35, h: 45 },
    GBR: { x: 340, y: 65, w: 20, h: 25 },
    FRA: { x: 355, y: 85, w: 25, h: 25 },
    DEU: { x: 375, y: 75, w: 25, h: 25 },
    ITA: { x: 375, y: 100, w: 20, h: 30 },
    ESP: { x: 340, y: 95, w: 30, h: 25 },
    PRT: { x: 330, y: 95, w: 15, h: 25 },
    CHN: { x: 520, y: 85, w: 70, h: 55 },
    JPN: { x: 610, y: 85, w: 25, h: 40 },
    IND: { x: 490, y: 120, w: 45, h: 50 },
    RUS: { x: 430, y: 45, w: 180, h: 50 },
    ZAF: { x: 365, y: 250, w: 35, h: 30 },
    EGY: { x: 380, y: 130, w: 30, h: 30 },
    NGA: { x: 355, y: 180, w: 30, h: 30 },
    AUS: { x: 580, y: 235, w: 70, h: 50 },
};

/**
 * WorldMapChart Component
 */
export function WorldMapChart({
    data = [],
    countryKey = 'country',
    valueKey = 'value',
    mode = 'choropleth',
    width = 700,
    height = 380,
    colorScheme = 'blue',
    showLegend = true,
    showLabels = false,
    showTooltip = true,
    interactive = true,
    markerColor,
    bubbleMinSize = 8,
    bubbleMaxSize = 40,
    routeColor,
    className,
}: WorldMapChartProps) {
    const { semanticColors } = useChartContext();
    const resolvedMarkerColor = markerColor ?? semanticColors.error;
    const resolvedRouteColor = routeColor ?? semanticColors.primary;

    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ name: string; value: number | undefined; x: number; y: number } | null>(null);

    const scaleX = (width as number) / 700;
    const scaleY = (height as number) / 380;

    const dataMap = useMemo(() => {
        const map: Record<string, number | undefined> = {};
        data.forEach((item: WorldMapDataItem) => {
            const key = item[countryKey as keyof WorldMapDataItem] as string;
            const val = item[valueKey as keyof WorldMapDataItem] as number | undefined;
            map[key] = val;
        });
        return map;
    }, [data, countryKey, valueKey]);

    const { minValue, maxValue } = useMemo(() => {
        const values = data
            .map((d: WorldMapDataItem) => d[valueKey as keyof WorldMapDataItem] as number | undefined)
            .filter((v): v is number => v != null);
        return {
            minValue: Math.min(0, ...values),
            maxValue: Math.max(...values, 100),
        };
    }, [data, valueKey]);

    const legendStops = useMemo(() => {
        return generateLegendStops(minValue, maxValue, colorScheme ?? 'blue');
    }, [minValue, maxValue, colorScheme]);

    const markers = useMemo((): MapMarker[] => {
        if (mode !== 'markers' && mode !== 'bubbles') return [];

        const worldCountries = WORLD_COUNTRIES as Record<string, { name: string; coords: number[] }>;

        const result: MapMarker[] = [];
        data.forEach((item: WorldMapDataItem) => {
            const countryCode = item[countryKey as keyof WorldMapDataItem] as string;
            const country = worldCountries[countryCode];
            const region = COUNTRY_REGIONS[countryCode];
            if (!country && !region) return;

            const x = region ? (region.x + region.w / 2) * scaleX : projectWorld(country.coords[0], country.coords[1], width as number, height as number).x;
            const y = region ? (region.y + region.h / 2) * scaleY : projectWorld(country.coords[0], country.coords[1], width as number, height as number).y;
            const value = (item[valueKey as keyof WorldMapDataItem] as number) ?? 0;
            const normalizedValue = (value - minValue) / (maxValue - minValue || 1);
            const radius = mode === 'bubbles'
                ? bubbleMinSize + normalizedValue * (bubbleMaxSize - bubbleMinSize)
                : 8;

            result.push({
                ...item,
                x,
                y,
                radius,
                color: item.color || resolvedMarkerColor,
                name: country?.name || countryCode,
            });
        });
        return result;
    }, [data, countryKey, valueKey, mode, width, height, minValue, maxValue, bubbleMinSize, bubbleMaxSize, resolvedMarkerColor, scaleX, scaleY]);

    const routes = useMemo((): MapRoute[] => {
        if (mode !== 'routes') return [];

        const result: MapRoute[] = [];
        data.filter((item: WorldMapDataItem) => item.from && item.to).forEach((item: WorldMapDataItem) => {
            const fromRegion = COUNTRY_REGIONS[item.from as string];
            const toRegion = COUNTRY_REGIONS[item.to as string];
            if (!fromRegion || !toRegion) return;

            const from = { x: (fromRegion.x + fromRegion.w / 2) * scaleX, y: (fromRegion.y + fromRegion.h / 2) * scaleY };
            const to = { x: (toRegion.x + toRegion.w / 2) * scaleX, y: (toRegion.y + toRegion.h / 2) * scaleY };
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 - 40;

            result.push({
                path: `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`,
                from,
                to,
                fromCountry: item.from as string,
                toCountry: item.to as string,
                country: item.country,
                value: item.value,
                color: item.color,
            });
        });
        return result;
    }, [data, mode, scaleX, scaleY]);

    const handleMouseEnter = (code: string, name: string, value: number | undefined, x: number, y: number) => {
        if (!interactive) return;
        setHoveredCountry(code);
        if (showTooltip && value != null) {
            setTooltip({ name, value, x, y });
        }
    };

    const handleMouseLeave = () => {
        setHoveredCountry(null);
        setTooltip(null);
    };

    const getCountryColor = (code: string) => {
        const value = dataMap[code];
        if (value == null) return semanticColors.grid; // Used for "empty" or "no data" states
        return getColorFromScale(value, minValue, maxValue, colorScheme ?? 'blue');
    };

    return (
        <ChartShell
            className={cn(worldMapChartVariants({ mode }), className)}
            height={height}
            width={width}
        >
            <svg
                width={width}
                height={height}
                viewBox={`0 0 700 380`}
                preserveAspectRatio="xMidYMid meet"
                className="chart--world-map__svg"
                role="img"
                aria-label={`World map chart with ${data.length} data points`}
            >
                <g className="chart--world-map__continent">
                    {Object.entries(CONTINENT_PATHS).map(([name, path]) => (
                        <path key={name} d={path} />
                    ))}
                </g>

                {mode === 'choropleth' && Object.entries(COUNTRY_REGIONS).map(([code, region]) => {
                    const worldCountries = WORLD_COUNTRIES as Record<string, { name: string; coords: number[] }>;
                    const country = worldCountries[code];
                    const isHovered = hoveredCountry === code;
                    const fillColor = getCountryColor(code);

                    return (
                        <g key={code}>
                            <rect
                                x={region.x}
                                y={region.y}
                                width={region.w}
                                height={region.h}
                                rx={4}
                                fill={fillColor}
                                stroke={isHovered ? semanticColors.primary : semanticColors.border}
                                strokeWidth={isHovered ? 2 : 0.5}
                                className={cn('chart--world-map__country', {
                                    'chart--world-map__country--hovered': isHovered,
                                    'chart--world-map__country--dimmed': !!hoveredCountry && !isHovered
                                })}
                                style={{
                                    cursor: interactive ? 'pointer' : 'default',
                                }}
                                onMouseEnter={() => handleMouseEnter(code, country?.name || code, dataMap[code], region.x + region.w / 2, region.y)}
                                onMouseLeave={handleMouseLeave}
                            />
                            {showLabels && (
                                <text
                                    x={region.x + region.w / 2}
                                    y={region.y + region.h / 2 + 4}
                                    className="chart--world-map__country-label"
                                >
                                    {code}
                                </text>
                            )}
                        </g>
                    );
                })}

                {routes.map((route: MapRoute, idx: number) => (
                    <g key={idx}>
                        <path
                            d={route.path}
                            fill="none"
                            stroke={route.color || resolvedRouteColor}
                            strokeWidth={2.5}
                            strokeDasharray="6 3"
                        />
                        <circle cx={route.from.x} cy={route.from.y} r={5} fill={resolvedRouteColor} stroke="white" strokeWidth={2} />
                        <circle cx={route.to.x} cy={route.to.y} r={5} fill={resolvedRouteColor} stroke="white" strokeWidth={2} />
                    </g>
                ))}

                {markers.map((marker: MapMarker, idx: number) => (
                    <g
                        key={idx}
                        className="chart--world-map__marker"
                        onMouseEnter={() => handleMouseEnter(marker[countryKey] as string, marker.name, marker[valueKey] as number | undefined, marker.x, marker.y)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {mode === 'markers' ? (
                            <g transform={`translate(${marker.x}, ${marker.y - 15})`}>
                                <path
                                    d="M 0 22 C -8 14, -8 0, 0 -10 C 8 0, 8 14, 0 22 Z"
                                    fill={marker.color}
                                    stroke="white"
                                    strokeWidth={2}
                                />
                                <circle cx={0} cy={-3} r={4} fill="white" />
                            </g>
                        ) : (
                            <g>
                                <circle
                                    cx={marker.x + 3}
                                    cy={marker.y + 3}
                                    r={marker.radius}
                                    fill="var(--color-shadow, rgba(0,0,0,0.15))"
                                />
                                <circle
                                    cx={marker.x}
                                    cy={marker.y}
                                    r={marker.radius}
                                    fill={marker.color}
                                    fillOpacity={0.75}
                                    stroke="white"
                                    strokeWidth={2}
                                />
                            </g>
                        )}
                    </g>
                ))}

            </svg>

            {showLegend && mode === 'choropleth' && (
                <div className="chart--world-map__legend">
                    <span>{Math.round(minValue).toLocaleString()}</span>
                    <div className="chart--world-map__legend-bar">
                        {legendStops.map((stop, idx) => (
                            <div key={idx} className="chart--world-map__legend-stop" style={{ backgroundColor: stop.color }} />
                        ))}
                    </div>
                    <span>{Math.round(maxValue).toLocaleString()}</span>
                </div>
            )}

            {tooltip && (
                <div
                    className="chart--world-map__tooltip"
                    style={{
                        left: tooltip.x * scaleX,
                        top: tooltip.y * scaleY - 50,
                    }}
                >
                    <strong>{tooltip.name}</strong>: {tooltip.value?.toLocaleString() ?? 'N/A'}
                </div>
            )}
        </ChartShell>
    );
}

export default WorldMapChart;
