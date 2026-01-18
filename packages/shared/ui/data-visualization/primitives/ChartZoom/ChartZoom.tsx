import React, { useState, useCallback } from 'react';
import { useChartComponents } from '../../providers/ChartProvider';

export interface ChartZoomRange {
    startIndex: number;
    endIndex: number;
}

export interface ChartZoomProps {
    /** Data array to display in the zoom preview. */
    data?: any[];
    /** Key for the data values to display in preview. */
    dataKey: string;
    /** Initial start index. */
    startIndex?: number;
    /** Initial end index. */
    endIndex?: number;
    /** Callback when zoom range changes. */
    onChange?: (range: ChartZoomRange) => void;
    /** Height of the zoom component. */
    height?: number;
    /** Fill color of the zoom area. */
    fill?: string;
    /** Stroke color of the zoom handles. */
    stroke?: string;
    /** Gap between zoom area and chart. */
    gap?: number;
    /** Width of the traveller handles. */
    travellerWidth?: number;
    /** Whether zoom is enabled. */
    enabled?: boolean;
}

/**
 * ChartZoom
 *
 * A zoom/pan control for charts. Provides a brush-style selection
 * for zooming into specific data ranges.
 *
 * @example
 * const [range, setRange] = useState({ startIndex: 0, endIndex: 10 });
 *
 * <LineChart data={data.slice(range.startIndex, range.endIndex + 1)}>
 *   <Line dataKey="value" />
 *   <ChartZoom
 *     data={data}
 *     dataKey="value"
 *     onChange={setRange}
 *   />
 * </LineChart>
 */
export function ChartZoom({
    data,
    dataKey,
    startIndex,
    endIndex,
    onChange,
    height = 40,
    fill = 'var(--chart-sequential-primary-1)',
    stroke = 'var(--chart-color-1)',
    gap = 1,
    travellerWidth = 10,
    enabled = true,
}: ChartZoomProps) {
    const { Brush } = useChartComponents();

    const handleChange = useCallback((newRange: { startIndex?: number; endIndex?: number }) => {
        if (onChange && newRange.startIndex !== undefined && newRange.endIndex !== undefined) {
            onChange({
                startIndex: newRange.startIndex,
                endIndex: newRange.endIndex,
            });
        }
    }, [onChange]);

    if (!enabled) {
        return null;
    }

    return (
        <Brush
            data={data}
            dataKey={dataKey}
            startIndex={startIndex}
            endIndex={endIndex}
            onChange={handleChange}
            height={height}
            fill={fill}
            stroke={stroke}
            gap={gap}
            travellerWidth={travellerWidth}
        />
    );
}

ChartZoom.displayName = 'ChartZoom';

export default ChartZoom;
