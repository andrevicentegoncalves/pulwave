import React from 'react';
import { useChartTheme } from '../../hooks/useChartTheme';
import type { ChartTooltipProps, TooltipPayloadItem } from './types';
import './styles/_index.scss';

/**
 * ChartTooltip Component
 * Custom tooltip styled with design system tokens.
 * Works as a Recharts custom tooltip content component.
 *
 * @example
 * <LineChart>
 *   <Tooltip content={<ChartTooltip />} />
 * </LineChart>
 */
export function ChartTooltip({
    active,
    payload,
    label,
    formatter,
    labelFormatter,
    separator = ': ',
    hideLabel = false,
    items,
}: ChartTooltipProps) {
    const { semanticColors } = useChartTheme();

    // Use custom items if provided, otherwise use Recharts payload
    const displayItems = items || payload;

    if (!active && !items) return null;
    if (!displayItems || displayItems.length === 0) return null;

    const formattedLabel = labelFormatter ? labelFormatter(label!) : label;

    return (
        <div className="chart-tooltip">
            {!hideLabel && formattedLabel && (
                <div className="chart-tooltip__label">{formattedLabel}</div>
            )}
            <div className="chart-tooltip__items">
                {displayItems.map((entry, index) => {
                    const value = formatter && payload
                        ? formatter(entry.value, entry.name, entry as TooltipPayloadItem, index)
                        : entry.value;

                    // Use name as key, fallback to dataKey if available (type-safe check)
                    const maybeDataKey = 'dataKey' in entry && entry.dataKey ? String(entry.dataKey) : null;
                    const entryKey = entry.name || maybeDataKey || `item-${index}`;

                    return (
                        <div key={entryKey} className="chart-tooltip__item">
                            <span
                                className="chart-tooltip__indicator"
                                style={{ backgroundColor: entry.color }}
                                aria-hidden="true"
                            />
                            <span className="chart-tooltip__name">{entry.name}</span>
                            <span className="chart-tooltip__separator">{separator}</span>
                            <span className="chart-tooltip__value">{value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChartTooltip;
