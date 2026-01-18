import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';

export type ChartAnnotationType = 'line' | 'band' | 'label';

export interface ChartAnnotationProps {
    /** Type of annotation: 'line' for reference line, 'band' for area, 'label' for text. */
    type: ChartAnnotationType;
    /** X position for vertical line or label (data value). */
    x?: number | string;
    /** Y position for horizontal line or label (data value). */
    y?: number | string;
    /** Starting X for band. */
    x1?: number | string;
    /** Ending X for band. */
    x2?: number | string;
    /** Starting Y for band. */
    y1?: number | string;
    /** Ending Y for band. */
    y2?: number | string;
    /** Label text for the annotation. */
    label?: string;
    /** Stroke color. */
    stroke?: string;
    /** Fill color (for bands). */
    fill?: string;
    /** Stroke dash pattern. */
    strokeDasharray?: string;
    /** Stroke width. */
    strokeWidth?: number;
    /** Label position. */
    labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'insideTop' | 'insideBottom';
    /** Whether this is a threshold line (uses danger color). */
    isThreshold?: boolean;
    /** Whether this is a target line (uses success color). */
    isTarget?: boolean;
}

/**
 * ChartAnnotation
 *
 * A unified annotation component for reference lines, bands, and labels.
 * Uses ChartProvider for library abstraction.
 */
export function ChartAnnotation({
    type,
    x,
    y,
    x1,
    x2,
    y1,
    y2,
    label,
    stroke,
    fill,
    strokeDasharray = '4 4',
    strokeWidth = 1,
    labelPosition = 'top',
    isThreshold = false,
    isTarget = false,
}: ChartAnnotationProps) {
    const { ReferenceLine, ReferenceArea, Label } = useChartComponents();

    // Determine colors based on semantic meaning
    const resolvedStroke = stroke || (
        isThreshold ? 'var(--chart-status-error)' :
            isTarget ? 'var(--chart-status-success)' :
                'var(--chart-grid-color)'
    );

    const resolvedFill = fill || 'var(--chart-sequential-primary-1)';

    // Reference line
    if (type === 'line') {
        return (
            <ReferenceLine
                x={x}
                y={y}
                stroke={resolvedStroke}
                strokeDasharray={strokeDasharray}
                strokeWidth={strokeWidth}
            >
                {label && (
                    <Label
                        value={label}
                        position={labelPosition}
                        fill={resolvedStroke}
                        fontSize="var(--chart-font-size-label)"
                    />
                )}
            </ReferenceLine>
        );
    }

    // Reference band/area
    if (type === 'band') {
        return (
            <ReferenceArea
                x1={x1}
                x2={x2}
                y1={y1}
                y2={y2}
                fill={resolvedFill}
                fillOpacity={0.2}
                stroke={resolvedStroke}
                strokeOpacity={0.5}
            >
                {label && (
                    <Label
                        value={label}
                        position="center"
                        fill="var(--chart-text-muted-color)"
                        fontSize="var(--chart-font-size-label)"
                    />
                )}
            </ReferenceArea>
        );
    }

    // Standalone label (rendered as a reference line with invisible line)
    if (type === 'label' && label) {
        return (
            <ReferenceLine
                x={x}
                y={y}
                stroke="transparent"
                strokeWidth={0}
            >
                <Label
                    value={label}
                    position={labelPosition}
                    fill="var(--chart-text-color)"
                    fontSize="var(--chart-font-size-label)"
                    fontWeight="var(--chart-font-weight-medium)"
                />
            </ReferenceLine>
        );
    }

    return null;
}

ChartAnnotation.displayName = 'ChartAnnotation';

export default ChartAnnotation;
