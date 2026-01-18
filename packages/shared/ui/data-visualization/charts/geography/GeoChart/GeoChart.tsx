import React, { useMemo, useState, memo } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { getColorFromScale, generateLegendStops } from '../../../utils/geo/geoData';
import { MAPS_REGISTRY } from '../../../utils/geo/geoMapsData';
import { geoChartVariants, type GeoChartProps, type GeoDataItem, type ColorScaleType } from './types';
import type { MapDefinition } from '../../../utils/geo/geoMapsData';
import './styles/_index.scss';

/**
 * GeoChart Component
 * 
 * A robust, SVG-based geographical map component that supports multiple countries
 * using internal path data.
 */
export function GeoChart({
    mapType = 'portugal',
    data = [],
    regionKey = 'region',
    valueKey = 'value',
    colorScale = 'blue',
    showLegend = true,
    showLabels = false,
    showTooltip = true,
    interactive = true,
    title = '',
    className,
    width = 400,
    height = 'auto',
}: GeoChartProps) {
    const { semanticColors } = useChartContext();
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ name: string; code: string; value: number | null; x: number; y: number } | null>(null);

    const normalizedMapType = mapType.toLowerCase();
    const mapConfig = MAPS_REGISTRY[normalizedMapType];

    const dataMap = useMemo(() => {
        if (!mapConfig) return {};
        const map: Record<string, number> = {};

        data.forEach((item: GeoDataItem) => {
            const rawKey = item[regionKey as string];
            const rawKeyStr = String(rawKey);
            const code = (mapConfig.nameToCode?.[rawKeyStr]) || rawKeyStr;
            const value = item[valueKey as string];
            if (typeof value === 'number') {
                map[code] = value;
            }
        });
        return map;
    }, [data, regionKey, valueKey, mapConfig]);

    const { minValue, maxValue } = useMemo(() => {
        const values = data
            .map((d: GeoDataItem) => d[valueKey as string])
            .filter((v): v is number => typeof v === 'number');
        return {
            minValue: Math.min(0, ...values),
            maxValue: Math.max(...values, 100),
        };
    }, [data, valueKey]);

    const legendStops = useMemo(() => {
        return generateLegendStops(minValue, maxValue, colorScale ?? 'blue');
    }, [minValue, maxValue, colorScale]);

    const handleMouseEnter = (code: string, name: string, e: React.MouseEvent) => {
        if (!interactive) return;
        setHoveredRegion(code);
        if (showTooltip) {
            const value = dataMap[code];
            setTooltip({
                name,
                code,
                value: value ?? null,
                x: e.clientX,
                y: e.clientY
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (tooltip) {
            setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
        }
    };

    const handleMouseLeave = () => {
        setHoveredRegion(null);
        setTooltip(null);
    };

    if (!mapConfig) {
        return (
            <div className={cn('chart--geo', className)}>
                <div className="chart--geo__placeholder">
                    <div>
                        <h4 className="chart--geo__placeholder-title">Map not available</h4>
                        <p className="chart--geo__placeholder-text">
                            Map type "{mapType}" is not yet supported in the registry.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(geoChartVariants({ colorScale }), className)}>
            {title && <h4 className="chart--geo__title">{title}</h4>}

            <svg
                width="100%"
                height="100%"
                viewBox={mapConfig.viewBox}
                preserveAspectRatio="xMidYMid meet"
                className="chart--geo__svg"
                style={{
                    maxWidth: width === '100%' ? 'none' : width,
                    maxHeight: height === 'auto' ? '80vh' : height,
                }}
                role="img"
                aria-label={`Geographic map of ${mapType}`}
            >
                {mapConfig.outline && (
                    <>
                        <path
                            d={mapConfig.outline}
                            fill="var(--color-shadow, rgba(0,0,0,0.06))"
                            transform="translate(2, 2)"
                        />
                        <path
                            d={mapConfig.outline}
                            fill={semanticColors.background}
                            stroke="none"
                        />
                    </>
                )}

                {Object.entries(mapConfig.paths).map(([code, regionData]) => {
                    const value = dataMap[code];
                    const hasData = value != null;
                    const isHovered = hoveredRegion === code;

                    let fillColor = semanticColors.grid;
                    if (hasData) {
                        fillColor = getColorFromScale(value, minValue, maxValue, colorScale ?? 'blue');
                    }

                    return (
                        <g key={code}>
                            <path
                                id={`region-${code}`}
                                d={regionData.path}
                                transform={regionData.transform}
                                fill={fillColor}
                                className={cn('chart--geo__region', {
                                    'chart--geo__region--hovered': isHovered,
                                    'chart--geo__region--dimmed': !!hoveredRegion && !isHovered
                                })}
                                style={{
                                    cursor: interactive ? 'pointer' : 'default',
                                }}
                                onMouseEnter={(e) => handleMouseEnter(code, regionData.name, e)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            />

                            {showLabels && (
                                <text
                                    x={regionData.center[0]}
                                    y={regionData.center[1]}
                                    className="chart--geo__region-label"
                                    fill={hasData ? semanticColors.text : semanticColors.textMuted}
                                >
                                    {code}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>


            {showLegend && (
                <div className="chart--geo__legend">
                    <span>{Math.round(minValue).toLocaleString()}</span>
                    <div className="chart--geo__legend-bar">
                        {legendStops.map((stop, idx) => (
                            <div key={idx} className="chart--geo__legend-stop" style={{ backgroundColor: stop.color }} />
                        ))}
                    </div>
                    <span>{Math.round(maxValue).toLocaleString()}</span>
                </div>
            )}

            {tooltip && (
                <div
                    className="chart--geo__tooltip"
                    style={{
                        left: tooltip.x + 10,
                        top: tooltip.y - 40,
                    }}
                >
                    <div className="chart--geo__tooltip-name">{tooltip.name}</div>
                    <div className="chart--geo__tooltip-value">
                        {tooltip.value != null ? tooltip.value.toLocaleString() : 'No data'}
                    </div>
                </div>
            )}
        </div>
    );
}

export const GeoChartMemo = memo(GeoChart);
export default GeoChartMemo;
