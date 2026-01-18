import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';

export interface PieSeriesProps {
    /** Data array for the pie segments. */
    data: any[];
    /** Data key for segment values. */
    dataKey: string;
    /** Data key for segment names. */
    nameKey?: string;
    /** Colors for each segment. Uses theme tokens. */
    colors?: string[];
    /** Inner radius for donut style (0 = full pie). */
    innerRadius?: number | string;
    /** Outer radius. */
    outerRadius?: number | string;
    /** Start angle in degrees (0 = 3 o'clock). */
    startAngle?: number;
    /** End angle in degrees. */
    endAngle?: number;
    /** Padding between segments. */
    paddingAngle?: number;
    /** Corner radius for segments. */
    cornerRadius?: number;
    /** Stroke color between segments. */
    stroke?: string;
    /** Stroke width. */
    strokeWidth?: number;
    /** Animation duration. */
    animationDuration?: number;
    /** Center label text. */
    centerLabel?: string;
    /** Center label value. */
    centerValue?: string | number;
    /** Whether to show segment labels. */
    label?: boolean | ((props: any) => React.ReactElement);
    /** Label line visibility. */
    labelLine?: boolean;
    children?: React.ReactNode;
}

/**
 * PieSeries
 *
 * A composable pie/donut series primitive.
 * Uses ChartProvider for library abstraction.
 */
export function PieSeries({
    data,
    dataKey,
    nameKey = 'name',
    colors,
    innerRadius = 0,
    outerRadius = '80%',
    startAngle = 90,
    endAngle = -270,
    paddingAngle = 2,
    cornerRadius = 4,
    stroke = 'var(--chart-background-color)',
    strokeWidth = 2,
    animationDuration = 400,
    centerLabel,
    centerValue,
    label = false,
    labelLine = false,
    children,
    ...props
}: PieSeriesProps) {
    const { Pie, Cell, Label } = useChartComponents();

    // Default categorical colors
    const defaultColors = [
        'var(--chart-color-1)',
        'var(--chart-color-2)',
        'var(--chart-color-3)',
        'var(--chart-color-4)',
        'var(--chart-color-5)',
        'var(--chart-color-6)',
        'var(--chart-color-7)',
        'var(--chart-color-8)',
        'var(--chart-color-9)',
    ];

    const segmentColors = colors || defaultColors;

    // Simple label renderer
    const renderLabel = label === true
        ? ({ name, percent }: { name: string; percent: number }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
        : label;

    return (
        <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            paddingAngle={paddingAngle}
            cornerRadius={cornerRadius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            animationDuration={animationDuration}
            label={renderLabel}
            labelLine={labelLine}
            {...props}
        >
            {data.map((_, index) => (
                <Cell
                    key={`cell-${index}`}
                    fill={segmentColors[index % segmentColors.length]}
                />
            ))}

            {/* Center label for donut charts */}
            {(centerLabel || centerValue) && innerRadius !== 0 && (
                <>
                    {centerValue && (
                        <Label
                            value={centerValue}
                            position="center"
                            fill="var(--chart-text-color)"
                            fontSize="var(--chart-font-size-title)"
                            fontWeight="var(--chart-font-weight-bold)"
                            dy={centerLabel ? -8 : 0}
                        />
                    )}
                    {centerLabel && (
                        <Label
                            value={centerLabel}
                            position="center"
                            fill="var(--chart-text-muted-color)"
                            fontSize="var(--chart-font-size-label)"
                            dy={centerValue ? 12 : 0}
                        />
                    )}
                </>
            )}

            {children}
        </Pie>
    );
}

PieSeries.displayName = 'PieSeries';

export default PieSeries;
