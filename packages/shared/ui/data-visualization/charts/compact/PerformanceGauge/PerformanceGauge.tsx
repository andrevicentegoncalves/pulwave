import React from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { performanceGaugeVariants, type PerformanceGaugeProps } from './types';
import './styles/_index.scss';

/**
 * PerformanceGauge Component
 * 
 * Semi-circle gauge with colored ranges and needle pointer.
 */
export const PerformanceGauge = ({
    value = 0,
    min = 0,
    max = 100,
    ranges = [],
    size = 300,
    thickness = 30,
    showTicks = true,
    tickCount = 5,
    showValue = true,
    valueLabel,
    needleColor,
    className,
}: PerformanceGaugeProps) => {
    const { semanticColors } = useChartContext();
    const resolvedNeedleColor = needleColor ?? semanticColors.error;
    const { tooltip, getHandlers } = useSVGTooltip();


    const center = size / 2;
    const radius = (size - thickness) / 2 - 10;

    // Normalize value to 0-180 degrees
    const normalizedValue = Math.max(min, Math.min(max, value));
    const percentage = (normalizedValue - min) / (max - min || 1);
    const needleAngle = percentage * 180;

    // Calculate arc path for a range
    const getArcPath = (startPercent: number, endPercent: number, r: number) => {
        const startAngle = startPercent * Math.PI;
        const endAngle = endPercent * Math.PI;

        const x1 = center - Math.cos(startAngle) * r;
        const y1 = center - Math.sin(startAngle) * r;
        const x2 = center - Math.cos(endAngle) * r;
        const y2 = center - Math.sin(endAngle) * r;

        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    };

    // Generate tick marks
    const ticks = [];
    for (let i = 0; i <= tickCount; i++) {
        const tickPercent = i / (tickCount || 1);
        const tickAngle = tickPercent * Math.PI;
        const tickValue = min + (max - min) * tickPercent;

        const outerX = center - Math.cos(tickAngle) * (radius + 5);
        const outerY = center - Math.sin(tickAngle) * (radius + 5);
        const innerX = center - Math.cos(tickAngle) * (radius - 5);
        const innerY = center - Math.sin(tickAngle) * (radius - 5);
        const labelX = center - Math.cos(tickAngle) * (radius + 25);
        const labelY = center - Math.sin(tickAngle) * (radius + 20);

        ticks.push({
            outerX, outerY, innerX, innerY, labelX, labelY,
            value: Math.round(tickValue),
        });
    }

    // Needle path
    const needleAngleRad = (needleAngle * Math.PI) / 180;
    const needleTipX = center - Math.cos(needleAngleRad) * (radius - 20);
    const needleTipY = center - Math.sin(needleAngleRad) * (radius - 20);

    return (
        <div
            className={cn(performanceGaugeVariants(), className)}
            style={{ height: `${size / 2 + 60}px` }}
        >
            <div className="chart--performance-gauge__container">
                <svg
                    width={size}
                    height={size / 2 + 60}
                    className="chart--performance-gauge__svg"
                >
                    {/* Background arc */}
                    <path
                        d={getArcPath(0, 1, radius)}
                        fill="none"
                        className="chart--performance-gauge__background-arc"
                        strokeWidth={thickness}
                        strokeLinecap="round"
                    />

                    {/* Range arcs */}
                    {ranges.map((range, idx) => {
                        const startPercent = (range.min - min) / (max - min || 1);
                        const endPercent = (range.max - min) / (max - min || 1);
                        const tooltipHandlers = getHandlers(range.label || `Range ${idx + 1}`);

                        return (
                            <path
                                key={idx}
                                d={getArcPath(startPercent, endPercent, radius)}
                                fill="none"
                                stroke={range.color}
                                strokeWidth={thickness}
                                {...tooltipHandlers}
                            />
                        );
                    })}

                    {/* Tick marks */}
                    {showTicks && ticks.map((tick, idx) => (
                        <g key={idx}>
                            <line
                                x1={tick.innerX}
                                y1={tick.innerY}
                                x2={tick.outerX}
                                y2={tick.outerY}
                                className="chart--performance-gauge__tick-line"
                            />
                            <text
                                x={tick.labelX}
                                y={tick.labelY}
                                className="chart--performance-gauge__tick-label"
                            >
                                {tick.value}
                            </text>
                        </g>
                    ))}

                    {/* Needle */}
                    <line
                        x1={center}
                        y1={center}
                        x2={needleTipX}
                        y2={needleTipY}
                        stroke={resolvedNeedleColor}
                        className="chart--performance-gauge__needle-line"
                    />
                    <circle
                        cx={center}
                        cy={center}
                        r={8}
                        className="chart--performance-gauge__needle-center"
                    />

                    {/* Value display */}
                    {showValue && (
                        <g>
                            <text
                                x={center}
                                y={center + 35}
                                className="chart--performance-gauge__label-text"
                            >
                                {valueLabel || 'Score'}
                            </text>
                            <text
                                x={center}
                                y={center + 55}
                                className="chart--performance-gauge__value-text"
                            >
                                {Math.round(value)}
                            </text>
                        </g>
                    )}
                </svg>

                <SVGTooltip tooltip={tooltip} />
            </div>
        </div>
    );
};

export default PerformanceGauge;
