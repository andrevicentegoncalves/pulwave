import React from 'react';

export interface ArcRendererProps {
    /** Center X coordinate. */
    cx: number;
    /** Center Y coordinate. */
    cy: number;
    /** Inner radius (0 for full pie). */
    innerRadius: number;
    /** Outer radius. */
    outerRadius: number;
    /** Start angle in degrees (0 = 3 o'clock, clockwise). */
    startAngle: number;
    /** End angle in degrees. */
    endAngle: number;
    /** Fill color. */
    fill?: string;
    /** Stroke color. */
    stroke?: string;
    /** Stroke width. */
    strokeWidth?: number;
    /** Corner radius. */
    cornerRadius?: number;
    /** Fill opacity. */
    fillOpacity?: number;
    /** Stroke opacity. */
    strokeOpacity?: number;
    /** Additional CSS class. */
    className?: string;
    /** Click handler. */
    onClick?: (event: React.MouseEvent<SVGPathElement>) => void;
    /** Mouse enter handler. */
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void;
    /** Mouse leave handler. */
    onMouseLeave?: (event: React.MouseEvent<SVGPathElement>) => void;
}

/**
 * Convert degrees to radians
 */
const degToRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Calculate point on circle
 */
const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = degToRad(angleInDegrees);
    return {
        x: cx + radius * Math.cos(angleInRadians),
        y: cy + radius * Math.sin(angleInRadians),
    };
};

/**
 * Generate SVG arc path
 */
const generateArcPath = (
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    cornerRadius: number = 0
): string => {
    // Normalize angles
    const start = startAngle;
    const end = endAngle;
    const sweep = end - start;
    const largeArc = Math.abs(sweep) > 180 ? 1 : 0;
    const sweepFlag = sweep > 0 ? 1 : 0;

    // Outer arc
    const outerStart = polarToCartesian(cx, cy, outerRadius, start);
    const outerEnd = polarToCartesian(cx, cy, outerRadius, end);

    // If no inner radius, draw a pie slice
    if (innerRadius === 0) {
        return [
            `M ${cx} ${cy}`,
            `L ${outerStart.x} ${outerStart.y}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArc} ${sweepFlag} ${outerEnd.x} ${outerEnd.y}`,
            'Z',
        ].join(' ');
    }

    // Inner arc for donut
    const innerStart = polarToCartesian(cx, cy, innerRadius, start);
    const innerEnd = polarToCartesian(cx, cy, innerRadius, end);

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} ${sweepFlag} ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} ${1 - sweepFlag} ${innerStart.x} ${innerStart.y}`,
        'Z',
    ].join(' ');
};

/**
 * ArcRenderer
 *
 * A custom SVG arc primitive for building pie, donut, gauge, and radial charts.
 * No charting library dependency - pure SVG.
 *
 * @example
 * // Full pie slice
 * <ArcRenderer cx={100} cy={100} innerRadius={0} outerRadius={80} startAngle={0} endAngle={90} fill="red" />
 *
 * // Donut segment
 * <ArcRenderer cx={100} cy={100} innerRadius={40} outerRadius={80} startAngle={0} endAngle={120} fill="blue" />
 *
 * // Gauge
 * <ArcRenderer cx={100} cy={100} innerRadius={60} outerRadius={80} startAngle={180} endAngle={270} />
 */
export function ArcRenderer({
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill = 'var(--chart-color-1)',
    stroke,
    strokeWidth = 0,
    cornerRadius = 0,
    fillOpacity = 1,
    strokeOpacity = 1,
    className,
    onClick,
    onMouseEnter,
    onMouseLeave,
}: ArcRendererProps) {
    const pathData = generateArcPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle, cornerRadius);

    return (
        <path
            d={pathData}
            fill={fill}
            fillOpacity={fillOpacity}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            className={className}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                transition: 'fill 0.2s ease, fill-opacity 0.2s ease',
                cursor: onClick ? 'pointer' : undefined,
            }}
        />
    );
}

ArcRenderer.displayName = 'ArcRenderer';

export default ArcRenderer;
