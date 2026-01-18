/**
 * Recharts BarSeries Primitive
 *
 * Wraps Recharts Bar component with unified props.
 */

import React from 'react';
import { Bar, Cell } from 'recharts';

import type { BarSeriesProps } from '../../../../primitives/types';

/**
 * BarSeries for Recharts
 */
export function BarSeries({
    dataKey,
    name,
    color,
    fill,
    stroke,
    strokeWidth,
    radius,
    maxBarSize,
    barSize,
    stackId,
    background,
    opacity,
    animate = true,
    animationDuration = 400,
    hide,
    colors,
    children,
}: BarSeriesProps) {
    // Use fill or color, defaulting to a brand color
    const fillColor = fill ?? color ?? 'var(--color-brand)';

    // Convert radius to Recharts format [topLeft, topRight, bottomRight, bottomLeft]
    const radiusValue: [number, number, number, number] | undefined =
        typeof radius === 'number'
            ? [radius, radius, 0, 0]
            : Array.isArray(radius)
                ? (radius as [number, number, number, number])
                : undefined;

    // Handle background prop
    const backgroundProp =
        background === true
            ? { fill: 'var(--color-surface-secondary)' }
            : background === false
              ? undefined
              : background;

    return (
        <Bar
            dataKey={dataKey}
            name={name ?? dataKey}
            fill={fillColor}
            stroke={stroke}
            strokeWidth={strokeWidth}
            radius={radiusValue}
            maxBarSize={maxBarSize}
            barSize={typeof barSize === 'string' ? parseInt(barSize, 10) : barSize}
            stackId={stackId}
            background={backgroundProp}
            fillOpacity={opacity}
            isAnimationActive={animate}
            animationDuration={animationDuration}
            hide={hide}
        >
            {/* Render cells if colors array provided */}
            {colors?.map((cellColor, index) => <Cell key={`cell-${index}`} fill={cellColor} />)}
            {children}
        </Bar>
    );
}

export default BarSeries;
