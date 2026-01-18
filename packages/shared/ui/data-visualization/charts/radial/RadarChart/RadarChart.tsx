import { useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { useChartColors } from '../../../hooks/useChartColors';
import { useSeriesVisibility } from '../../../hooks/useSeriesVisibility';
import { useLegendPayload } from '../../../hooks/useLegendPayload';
import { getChartMargins } from '../../../utils/chartDefaults';
import { radarChartVariants, type RadarChartProps } from './types';
import './styles/_index.scss';

/**
 * RadarChart Component
 * Displays multi-dimensional data on radial axes.
 * Uses ChartProvider for library abstraction.
 */
export const RadarChart = ({
    data = [],
    angleKey,
    dataKeys = [],
    dataKeyNames = {},
    width = '100%',
    height = 300,
    fillOpacity = 0.3,
    strokeWidth = 2,
    showGrid = true,
    showDots = true,
    showTooltip = true,
    showLegend = true,
    legendPosition = 'bottom',
    colors,
    animate = true,
    animationDuration = 400,
    tooltipFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ariaLabel,
    ...restProps
}: RadarChartProps) => {
    const { semanticColors } = useChartContext();
    const {
        RadarChart: RechartsRadarChart,
        PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
    } = useChartComponents();
    const { hiddenSeries, handleLegendClick, isHidden } = useSeriesVisibility();
    const margins = getChartMargins({ top: 60, right: 60, bottom: 60, left: 60 });

    // Hover state for bidirectional legend-chart interaction
    const [hoveredRadarIndex, setHoveredRadarIndex] = useState<number | null>(null);

    const handleLegendHover = useCallback((index: number) => {
        setHoveredRadarIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredRadarIndex(null);
    }, []);

    // Resolve colors (CSS variables → actual color values for SVG attributes)
    const chartColors = useChartColors(dataKeys.length, colors);

    const legendPayload = useLegendPayload({
        keys: dataKeys,
        names: dataKeyNames,
        colors: chartColors,
    });

    return (
        <ChartShell
            width={width}
            height={height}
            className={cn(radarChartVariants(), className)}
            role="img"
            aria-label={ariaLabel || 'Radar chart'}
        >
            <RechartsRadarChart data={data} margin={margins} {...restProps}>
                {showGrid && (
                    <PolarGrid stroke={semanticColors.grid} strokeOpacity={0.6} />
                )}

                <PolarAngleAxis
                    dataKey={angleKey}
                    className="chart--radar__angle-axis"
                    tick={{ fill: semanticColors.textSecondary, fontSize: 11 }}
                    tickLine={false}
                />

                <PolarRadiusAxis
                    className="chart--radar__radius-axis"
                    axisLine={false}
                    tick={{ fill: semanticColors.textSecondary, fontSize: 10 }}
                    angle={90}
                    tickCount={5}
                />

                <ChartTooltipLayer
                    show={showTooltip}
                    formatter={tooltipFormatter}
                />

                <ChartLegendLayer
                    show={showLegend}
                    payload={legendPayload}
                    onClick={handleLegendClick}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                    activeIndex={hoveredRadarIndex}
                    inactiveKeys={hiddenSeries}
                    position={legendPosition}
                    iconType="line"
                />

                {dataKeys.map((key: string, index: number) => {
                    const hidden = isHidden(key);
                    const isHovered = hoveredRadarIndex === index;
                    const isDimmed = hoveredRadarIndex !== null && hoveredRadarIndex !== index;
                    const radarOpacity = isDimmed ? 0.2 : 1;
                    const radarStrokeWidth = hidden ? 0 : isHovered ? strokeWidth + 1 : strokeWidth;
                    const radarDotSize = isHovered ? 5 : 4;

                    // Dot configs with hover callbacks for chart → legend interaction
                    const activeDotConfig = {
                        r: 6,
                        onMouseEnter: () => setHoveredRadarIndex(index),
                        onMouseLeave: () => setHoveredRadarIndex(null),
                    };

                    const dotConfig = showDots && !hidden ? {
                        r: radarDotSize,
                        fill: chartColors[index],
                        onMouseEnter: () => setHoveredRadarIndex(index),
                        onMouseLeave: () => setHoveredRadarIndex(null),
                    } : false;

                    return (
                        <Radar
                            key={key}
                            name={dataKeyNames[key] || key}
                            dataKey={key}
                            stroke={chartColors[index]}
                            strokeOpacity={radarOpacity}
                            fill={chartColors[index]}
                            fillOpacity={hidden ? 0 : isDimmed ? fillOpacity * 0.2 : fillOpacity}
                            strokeWidth={radarStrokeWidth}
                            dot={dotConfig}
                            activeDot={activeDotConfig}
                            isAnimationActive={animate}
                            animationDuration={animationDuration}
                        />
                    );
                })}
            </RechartsRadarChart>
        </ChartShell>
    );
};

export default RadarChart;
