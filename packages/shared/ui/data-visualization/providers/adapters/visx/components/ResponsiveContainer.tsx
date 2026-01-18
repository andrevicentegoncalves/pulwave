/**
 * VISX ResponsiveContainer
 *
 * Wrapper for visx charts to provide responsive sizing.
 */

import React from 'react';
import { ParentSize } from '@visx/responsive';

export interface VISXResponsiveContainerProps {
    width?: number | string;
    height?: number | string;
    minWidth?: number;
    minHeight?: number;
    debounceTime?: number;
    children: (props: { width: number; height: number }) => React.ReactNode;
    className?: string;
}

/**
 * ResponsiveContainer for VISX charts
 * Automatically sizes charts to fit their container
 */
export function VISXResponsiveContainer({
    width = '100%',
    height = 400,
    minWidth = 0,
    minHeight = 0,
    debounceTime = 300,
    children,
    className,
}: VISXResponsiveContainerProps) {
    // If explicit dimensions are provided, use them
    if (typeof width === 'number' && typeof height === 'number') {
        return (
            <div className={className} style={{ width, height }}>
                {children({ width, height })}
            </div>
        );
    }

    // Otherwise, use ParentSize for responsiveness
    return (
        <div className={className} style={{ width, height: typeof height === 'number' ? height : '100%' }}>
            <ParentSize debounceTime={debounceTime}>
                {({ width: parentWidth, height: parentHeight }) => {
                    const finalWidth = Math.max(parentWidth, minWidth);
                    const finalHeight = typeof height === 'number'
                        ? height
                        : Math.max(parentHeight, minHeight);

                    return children({ width: finalWidth, height: finalHeight });
                }}
            </ParentSize>
        </div>
    );
}

export default VISXResponsiveContainer;
