import React from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import { bulletChartVariants, type BulletChartProps, type BulletRange } from './types';
import './styles/_index.scss';

/**
 * BulletChart Component
 * 
 * Compact KPI visualization showing progress against target with background ranges.
 */
export const BulletChart = ({
    value = 0,
    target,
    ranges = [],
    maxValue,
    height = 40,
    width = '100%',
    showValue = true,
    showTarget = true,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    title,
    subtitle,
    className,
}: BulletChartProps) => {
    const { semanticColors } = useChartContext();

    const max = maxValue || Math.max(
        ...ranges.map((r) => r.max),
        value,
        target || 0
    );

    const getPercentage = (val: number) => (val / max) * 100;

    return (
        <ChartShell
            className={cn(bulletChartVariants(), className)}
            width={width}
            height={height}
            title={title}
            subtitle={subtitle}
            responsive={false}
        >
            <div className="chart--bullet__wrapper">
                <div
                    className="chart--bullet__container"
                    style={{ height: `${height}px` }}
                >
                    {/* Ranges */}
                    {ranges.map((range: BulletRange, idx: number) => {
                        const prevMax = idx > 0 ? ranges[idx - 1].max : 0;
                        const left = getPercentage(prevMax);
                        const rangeWidth = getPercentage(range.max) - left;

                        return (
                            <div
                                key={idx}
                                className="chart--bullet__range"
                                style={{
                                    left: `${left}%`,
                                    width: `${rangeWidth}%`,
                                    backgroundColor: range.color,
                                }}
                                title={range.label}
                            />
                        );
                    })}

                    {/* Value bar */}
                    <div
                        className="chart--bullet__value"
                        style={{
                            width: `${Math.min(getPercentage(value), 100)}%`,
                        }}
                    />

                    {/* Target marker */}
                    {showTarget && target !== undefined && (
                        <div
                            className="chart--bullet__target"
                            style={{
                                left: `${getPercentage(target)}%`,
                            }}
                        />
                    )}
                </div>

                {/* Labels */}
                {showValue && (
                    <div className="chart--bullet__label">
                        <span className="chart--bullet__value-text">
                            {valueFormatter(value)}
                        </span>
                        {target !== undefined && (
                            <span className="chart--bullet__target-text">
                                Target: {valueFormatter(target)}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </ChartShell>
    );
};

export default BulletChart;
