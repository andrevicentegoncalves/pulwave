import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';

export interface ChartBrushProps {
    /** Data array to display in the brush. */
    data?: any[];
    /** Key for the data values to display. */
    dataKey: string;
    /** Starting index of the brush. */
    startIndex?: number;
    /** Ending index of the brush. */
    endIndex?: number;
    /** Callback when brush range changes. */
    onChange?: (range: { startIndex: number; endIndex: number }) => void;
    /** Height of the brush component. */
    height?: number;
    /** Fill color of the brush area. */
    fill?: string;
    /** Stroke color of the brush handles. */
    stroke?: string;
    /** Gap between brush area and chart. */
    gap?: number;
    /** Width of the traveller handles. */
    travellerWidth?: number;
}

/**
 * ChartBrush
 *
 * A brush component for zoom/pan functionality on time-series charts.
 * Uses ChartProvider for library abstraction.
 */
export function ChartBrush({
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
}: ChartBrushProps) {
    const { Brush } = useChartComponents();

    const handleChange = (newRange: { startIndex?: number; endIndex?: number }) => {
        if (onChange && newRange.startIndex !== undefined && newRange.endIndex !== undefined) {
            onChange({
                startIndex: newRange.startIndex,
                endIndex: newRange.endIndex,
            });
        }
    };

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

ChartBrush.displayName = 'ChartBrush';

export default ChartBrush;
