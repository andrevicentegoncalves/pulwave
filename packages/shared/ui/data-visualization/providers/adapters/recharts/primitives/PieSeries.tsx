/**
 * Recharts PieSeries Primitive
 *
 * Wraps Recharts Pie component with unified props.
 */

import React from 'react';
import { Pie, Cell } from 'recharts';

import type { PieSeriesProps } from '../../../../primitives/types';

/**
 * PieSeries for Recharts
 */
export function PieSeries({
    dataKey,
    data,
    name,
    color,
    innerRadius = 0,
    outerRadius = '80%',
    startAngle = 0,
    endAngle = 360,
    paddingAngle = 0,
    label = false,
    labelLine = true,
    cornerRadius = 0,
    colors,
    opacity,
    animate = true,
    animationDuration = 400,
    hide,
    children,
}: PieSeriesProps) {
    // Use color as default fill
    const fillColor = color ?? 'var(--color-brand)';

    // Cast label to boolean (Recharts expects specific label types)
    const labelProp = typeof label === 'boolean' ? label : Boolean(label);

    return (
        <Pie
            dataKey={dataKey}
            data={data}
            name={name ?? dataKey}
            fill={fillColor}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            paddingAngle={paddingAngle}
            label={labelProp}
            labelLine={labelLine}
            cornerRadius={cornerRadius}
            fillOpacity={opacity}
            isAnimationActive={animate}
            animationDuration={animationDuration}
            hide={hide}
        >
            {/* Render cells if colors array provided */}
            {colors?.map((cellColor, index) => <Cell key={`cell-${index}`} fill={cellColor} />)}
            {children}
        </Pie>
    );
}

export default PieSeries;
