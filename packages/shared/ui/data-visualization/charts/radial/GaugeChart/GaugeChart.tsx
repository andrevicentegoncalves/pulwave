import { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { useResolvedSemanticColors } from '../../../hooks/useResolvedSemanticColors';
import { resolveCssColor } from '../../../hooks/useChartColors';
import { ChartShell } from '../../../primitives/ChartShell';
import { gaugeChartVariants, type GaugeChartProps } from './types';
import './styles/_index.scss';

/**
 * GaugeChart Component
 * Displays a single metric as a dial/gauge visualization.
 */
export const GaugeChart = ({
    value = 0,
    min = 0,
    max = 100,
    width = 200,
    height = 140,
    thickness = 16,
    color,
    trackColor,
    label,
    valueFormatter,
    showValue = true,
    animate = true,
    segments,
    className,
    ariaLabel,
}: GaugeChartProps) => {
    const { getColor } = useChartContext();
    const semanticColors = useResolvedSemanticColors();

    // Calculate percentage
    const percentage = useMemo(() => {
        const range = max - min;
        return Math.min(100, Math.max(0, ((value - min) / range) * 100));
    }, [value, min, max]);

    // Resolve colors - all colors must be resolved for SVG stroke attributes
    const fillColor = useMemo(() => {
        if (color) {
            // If it's a semantic color name, look it up
            if (!color.startsWith('var(') && !color.startsWith('#') && !color.startsWith('rgb')) {
                const colorKey = color as keyof typeof semanticColors;
                if (colorKey in semanticColors) {
                    return semanticColors[colorKey];
                }
            }
            // Otherwise resolve any CSS variable
            return resolveCssColor(color);
        }

        // Auto color based on percentage (already resolved by useResolvedSemanticColors)
        if (percentage >= 75) return semanticColors.success;
        if (percentage >= 50) return semanticColors.primary;
        if (percentage >= 25) return semanticColors.warning;
        return semanticColors.error;
    }, [color, percentage, semanticColors, getColor]);

    const bgColor = trackColor ? resolveCssColor(trackColor) : semanticColors.border;

    // SVG calculations
    const arcHeight = height * 0.65;
    const centerX = width / 2;
    const centerY = arcHeight;
    const radius = Math.min(centerX, arcHeight) - thickness / 2 - 4;

    // Arc calculations for a typical gauge
    // Gauge typically goes from lower-left to lower-right through the bottom
    // In SVG: 0° is right, 90° is down, 180° is left, 270° is up
    // Start at 225° (lower-left), end at 315° (lower-right)
    const startAngle = 225; // degrees (lower-left, 7-8 o'clock position)
    const endAngle = 315; // degrees (lower-right, 4-5 o'clock position)
    const valueAngle = startAngle + ((endAngle - startAngle) * percentage / 100);

    // Convert degrees to radians for the actual path calculation
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    // Arc path helper - using degrees for clarity
    const describeArc = (startDeg: number, endDeg: number) => {
        const startRad = toRadians(startDeg);
        const endRad = toRadians(endDeg);

        const start = {
            x: centerX + radius * Math.cos(startRad),
            y: centerY + radius * Math.sin(startRad)
        };
        const end = {
            x: centerX + radius * Math.cos(endRad),
            y: centerY + radius * Math.sin(endRad)
        };

        // Calculate angle difference
        const diff = Math.abs(endDeg - startDeg);
        const largeArcFlag = diff > 180 ? 1 : 0;
        // In SVG with Y-down: sweep-flag=1 is clockwise, sweep-flag=0 is counter-clockwise
        // From 180° (left) to 0° (right), clockwise goes through bottom (270°)
        // So we need sweep-flag=1 to go through the bottom
        const sweepFlag = 1;

        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
    };

    // Format value
    const formattedValue = valueFormatter
        ? valueFormatter(value)
        : value.toLocaleString();

    return (
        <ChartShell
            className={cn(gaugeChartVariants(), className)}
            height={height}
            width={width}
            responsive={false}
            role="meter"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={ariaLabel || `Gauge showing ${value} of ${max}`}
        >
            <div className="chart--gauge__container">
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    {/* Track (background) */}
                    <path
                        d={describeArc(startAngle, endAngle)}
                        className="chart--gauge__track"
                        stroke={bgColor}
                        strokeWidth={thickness}
                    />

                    {/* Segments (optional) */}
                    {segments && segments.map((segment, index) => {
                        const segStart = startAngle + ((endAngle - startAngle) * (segment.start || 0) / 100);
                        const segEnd = startAngle + ((endAngle - startAngle) * (segment.end || 0) / 100);
                        const segmentColor = segment.color ? resolveCssColor(segment.color) : semanticColors.border;
                        return (
                            <path
                                key={index}
                                d={describeArc(segStart, segEnd)}
                                className="chart--gauge__segment"
                                stroke={segmentColor}
                                strokeWidth={thickness}
                                opacity={0.3}
                            />
                        );
                    })}

                    {/* Fill (value) */}
                    <path
                        d={describeArc(startAngle, valueAngle)}
                        className="chart--gauge__fill"
                        stroke={fillColor}
                        strokeWidth={thickness}
                        style={{
                            transition: animate ? 'stroke-dashoffset 0.6s ease, stroke 0.6s ease' : 'none',
                        }}
                    />
                </svg>

                {/* Value display */}
                {showValue && (
                    <div
                        className="chart--gauge__content"
                        style={{ bottom: height * 0.15 }}
                    >
                        <div className="chart--gauge__value" style={{ color: fillColor }}>
                            {formattedValue}
                        </div>
                        {label && (
                            <div className="chart--gauge__label">{label}</div>
                        )}
                    </div>
                )}
            </div>
        </ChartShell>
    );
};

export default GaugeChart;
