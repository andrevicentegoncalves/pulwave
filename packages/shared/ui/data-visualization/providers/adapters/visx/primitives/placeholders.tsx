/**
 * VISX Placeholder Primitives
 *
 * Placeholder implementations for primitives that VISX handles differently
 * or doesn't support in the same way as Recharts.
 */

import React from 'react';
import type {
    ScatterSeriesProps,
    PieSeriesProps,
    RadarSeriesProps,
    PolarAngleAxisProps,
    PolarRadiusAxisProps,
    PolarGridProps,
    BrushProps,
    ReferenceLineProps,
    ReferenceAreaProps,
    LabelProps,
    LabelListProps,
    CellProps,
} from '../../../../primitives/types';

/**
 * ScatterSeries placeholder
 * VISX uses GlyphSeries for scatter plots
 */
export function ScatterSeries({ children }: ScatterSeriesProps) {
    console.warn('[VISX] ScatterSeries: Use GlyphSeries from @visx/xychart for scatter plots');
    return <>{children}</>;
}

/**
 * PieSeries placeholder
 * VISX Pie charts use @visx/shape Pie, not xychart
 */
export function PieSeries({ children }: PieSeriesProps) {
    console.warn('[VISX] PieSeries: Use Pie from @visx/shape for pie charts');
    return <>{children}</>;
}

/**
 * RadarSeries placeholder
 * VISX doesn't have a direct radar chart equivalent
 */
export function RadarSeries({ children }: RadarSeriesProps) {
    console.warn('[VISX] RadarSeries: Not directly supported. Consider using custom implementation with @visx/shape');
    return <>{children}</>;
}

/**
 * PolarAngleAxis placeholder
 */
export function PolarAngleAxis(_props: PolarAngleAxisProps) {
    console.warn('[VISX] PolarAngleAxis: Not directly supported in VISX');
    return null;
}

/**
 * PolarRadiusAxis placeholder
 */
export function PolarRadiusAxis(_props: PolarRadiusAxisProps) {
    console.warn('[VISX] PolarRadiusAxis: Not directly supported in VISX');
    return null;
}

/**
 * PolarGrid placeholder
 */
export function PolarGrid(_props: PolarGridProps) {
    console.warn('[VISX] PolarGrid: Not directly supported in VISX');
    return null;
}

/**
 * Brush placeholder
 * VISX has @visx/brush but it works differently
 */
export function Brush(_props: BrushProps) {
    console.warn('[VISX] Brush: Use @visx/brush for brush functionality');
    return null;
}

/**
 * ReferenceLine placeholder
 * VISX can use Annotation for reference elements
 */
export function ReferenceLine({ x, y, stroke, strokeDasharray }: ReferenceLineProps) {
    // Could implement using visx Annotation or custom line
    console.warn('[VISX] ReferenceLine: Consider using @visx/annotation for reference elements');
    return null;
}

/**
 * ReferenceArea placeholder
 */
export function ReferenceArea(_props: ReferenceAreaProps) {
    console.warn('[VISX] ReferenceArea: Consider using @visx/annotation or custom rect for reference areas');
    return null;
}

/**
 * Label placeholder
 */
export function Label({ value, position, fill, fontSize }: LabelProps) {
    // VISX uses text components from @visx/text
    return null;
}

/**
 * LabelList placeholder
 */
export function LabelList(_props: LabelListProps) {
    // VISX handles labels differently, typically inline with series
    return null;
}

/**
 * Cell placeholder
 */
export function Cell(_props: CellProps) {
    // VISX handles individual cell colors through colorAccessor
    return null;
}
