/**
 * ChartAxisTick Component
 * 
 * Custom tick renderer with truncation and tooltip support.
 * Properly themed with design tokens for dark mode support.
 */
import React from 'react';
import { useChartContext } from '../../providers/ChartProvider';
import './styles/_index.scss';

interface ChartAxisTickProps {
    x: number;
    y: number;
    payload: { value: string | number };
    /** Maximum characters before truncation */
    maxLength?: number;
    /** Text anchor position */
    textAnchor?: 'start' | 'middle' | 'end';
    /** Vertical offset */
    dy?: number;
    /** Horizontal offset */
    dx?: number;
    /** Font size in pixels */
    fontSize?: number;
    /** Whether this is for Y-axis (affects positioning) */
    isYAxis?: boolean;
}

/**
 * Custom tick component for chart axes with automatic truncation and tooltips.
 * Uses semantic colors from ChartProvider for proper dark mode support.
 *
 * @example
 * <XAxis tick={<ChartAxisTick maxLength={10} />} />
 */
export function ChartAxisTick({
    x,
    y,
    payload,
    maxLength = 12,
    textAnchor = 'middle',
    dy = 4,
    dx = 0,
    fontSize = 12,
    isYAxis = false,
}: ChartAxisTickProps) {
    const { semanticColors } = useChartContext();

    const rawLabel = String(payload?.value || '');
    const isTruncated = rawLabel.length > maxLength;
    const displayLabel = isTruncated
        ? `${rawLabel.substring(0, maxLength)}…`
        : rawLabel;

    // Adjust positioning for Y-axis
    const adjustedTextAnchor = isYAxis ? 'end' : textAnchor;
    const adjustedDx = isYAxis ? -5 : dx;

    return (
        <g transform={`translate(${x},${y})`}>
            {isTruncated && <title>{rawLabel}</title>}
            <text
                x={adjustedDx}
                y={0}
                dy={dy}
                textAnchor={adjustedTextAnchor}
                fill={semanticColors.textMuted}
                fontSize={fontSize}
                className={isTruncated ? 'chart-axis-tick--truncated' : ''}
            >
                {displayLabel}
            </text>
        </g>
    );
}

/**
 * Factory function to create a tick component with preset options
 */
export const createAxisTick = (options: Partial<ChartAxisTickProps>) => {
    return (props: any) => <ChartAxisTick {...props} {...options} />;
};

export default ChartAxisTick;
