import React from 'react';
import { cn } from '@pulwave/utils';
import { useChartTheme } from '../../hooks/useChartTheme';
import type { ChartLegendProps, ChartLegendPayloadItem } from './types';
import './styles/_index.scss';

// ============================================================================
// LineSeriesIcon - Internal Component
// ============================================================================

interface LineSeriesIconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
    className?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
}

function LineSeriesIcon({
    size = 16,
    color = 'currentColor',
    strokeWidth = 2,
    className,
    'aria-hidden': ariaHidden,
}: LineSeriesIconProps) {
    return (
    <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden={ariaHidden}
    >
        <line x1="0" y1="8" x2="16" y2="8" stroke={color} strokeWidth={strokeWidth} />
    </svg>
    );
}

// ============================================================================
// ChartLegend Component
// ============================================================================

/**
 * ChartLegend Component
 * Custom legend styled with design system tokens.
 * Supports interactive toggling of series visibility.
 *
 * @example
 * <LineChart>
 *   <Legend content={<ChartLegend />} />
 * </LineChart>
 */
export function ChartLegend({
    payload,
    onClick,
    onItemHover,
    onItemLeave,
    layout = 'horizontal',
    align = 'center',
    iconType = 'circle',
    inactiveKeys = [],
    activeIndex = null,
}: ChartLegendProps) {
    const { semanticColors } = useChartTheme();

    if (!payload || payload.length === 0) {
        return null;
    }

    const handleClick = (entry: ChartLegendPayloadItem, index: number) => {
        if (onClick) {
            onClick({ dataKey: entry.dataKey, value: entry.value }, index);
        }
    };

    const handleMouseEnter = (index: number) => {
        if (onItemHover) {
            onItemHover(index);
        }
    };

    const handleMouseLeave = () => {
        if (onItemLeave) {
            onItemLeave();
        }
    };

    const handlePointerEnter = (index: number) => {
        if (onItemHover) {
            onItemHover(index);
        }
    };

    const handlePointerLeave = () => {
        if (onItemLeave) {
            onItemLeave();
        }
    };

    return (
        <div
            className={cn(
                'chart-legend',
                `chart-legend--${layout}`,
                `chart-legend--align-${align}`,
            )}
        >
            {payload.map((entry, index) => {
                const isInactive = inactiveKeys.includes(entry.dataKey || entry.value);
                const isActive = activeIndex === index;

                return (
                    <button
                        key={entry.id || entry.value || index}
                        type="button"
                        className={cn('chart-legend__item', {
                            'chart-legend__item--inactive': isInactive,
                            'chart-legend__item--interactive': !!onClick || !!onItemHover,
                            'chart-legend__item--active': isActive,
                        })}
                        onClick={() => handleClick(entry, index)}
                        onPointerEnter={() => handlePointerEnter(index)}
                        onPointerLeave={handlePointerLeave}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {iconType === 'line' ? (
                            <LineSeriesIcon
                                className="chart-legend__icon chart-legend__icon--line"
                                color={isInactive ? 'var(--chart-color-inactive)' : entry.color}
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        ) : (
                            <span
                                className={cn('chart-legend__icon', `chart-legend__icon--${iconType}`)}
                                style={{ backgroundColor: isInactive ? 'var(--chart-color-inactive)' : entry.color }}
                                aria-hidden="true"
                            />
                        )}
                        <span className="chart-legend__text">{entry.value}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default ChartLegend;
