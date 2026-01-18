import { useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';
import { circularLineChartVariants, type CircularLineChartProps, type DataKeyConfig } from './types';
import './styles/_index.scss';

/**
 * CircularLineChart Component (Radar variant with line/area)
 * Circular chart showing multiple metrics on radial axes.
 * Uses ChartProvider for library abstraction.
 */
export const CircularLineChart = ({
    data = [],
    dataKeys = [],
    categoryKey = 'metric',
    height = 400,
    showGrid = true,
    showLegend = true,
    fillOpacity = 0.3,
    strokeWidth = 2,
    dotSize = 4,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: CircularLineChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const {
        RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
    } = useChartComponents();
    const margins = getChartMargins();

    // Hover state for bidirectional legend-chart interaction
    const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

    const handleLegendHover = useCallback((index: number) => {
        setHoveredLineIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredLineIndex(null);
    }, []);

    // Assign colors to data keys
    const coloredDataKeys = dataKeys.map((dk: DataKeyConfig, idx: number) => ({
        ...dk,
        color: dk.color || getColor(idx),
    }));

    const legendPayload = coloredDataKeys.map((dk: DataKeyConfig) => ({
        value: dk.name || dk.key,
        dataKey: dk.key,
        color: dk.color,
    }));

    return (
        <ChartShell
            height={height}
            className={cn(circularLineChartVariants(), className)}
        >
            <RadarChart data={data} margin={margins} {...props}>
                {showGrid && (
                    <PolarGrid stroke={semanticColors.grid} strokeOpacity={0.5} />
                )}

                <PolarAngleAxis
                    dataKey={categoryKey}
                    className="chart--circular-line__angle-axis"
                />
                <PolarRadiusAxis
                    className="chart--circular-line__radius-axis"
                    tickFormatter={valueFormatter}
                    angle={30}
                />

                <ChartTooltipLayer
                    formatter={valueFormatter}
                />

                <ChartLegendLayer
                    show={showLegend}
                    payload={legendPayload}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                    activeIndex={hoveredLineIndex}
                    iconType="line"
                />

                {coloredDataKeys.map((dk: DataKeyConfig, idx: number) => {
                    const isHovered = hoveredLineIndex === idx;
                    const isDimmed = hoveredLineIndex !== null && hoveredLineIndex !== idx;
                    const radarOpacity = isDimmed ? 0.2 : 1;
                    const radarStrokeWidth = isHovered ? strokeWidth + 1 : strokeWidth;
                    const radarDotSize = isHovered ? dotSize + 1 : dotSize;

                    // Dot configs with hover callbacks for chart → legend interaction
                    const activeDotConfig = {
                        r: dotSize + 2,
                        onMouseEnter: () => setHoveredLineIndex(idx),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    };

                    const dotConfig = {
                        r: radarDotSize,
                        fill: dk.color,
                        onMouseEnter: () => setHoveredLineIndex(idx),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    };

                    return (
                        <Radar
                            key={dk.key}
                            name={dk.name || dk.key}
                            dataKey={dk.key}
                            stroke={dk.color}
                            strokeOpacity={radarOpacity}
                            fill={dk.color}
                            fillOpacity={isDimmed ? fillOpacity * 0.2 : fillOpacity}
                            strokeWidth={radarStrokeWidth}
                            dot={dotConfig}
                            activeDot={activeDotConfig}
                        />
                    );
                })}
            </RadarChart>
        </ChartShell>
    );
};

export default CircularLineChart;
