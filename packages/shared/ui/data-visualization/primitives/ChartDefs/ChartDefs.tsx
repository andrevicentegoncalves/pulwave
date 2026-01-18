import React, { useId } from 'react';

export interface GradientStop {
    offset: string;
    color: string;
    opacity?: number;
}

export interface GradientDef {
    id: string;
    type: 'linear' | 'radial';
    stops: GradientStop[];
    /** For linear gradients: x1, y1, x2, y2 */
    direction?: { x1: string; y1: string; x2: string; y2: string };
}

export interface PatternDef {
    id: string;
    type: 'lines' | 'dots' | 'crosshatch';
    color: string;
    backgroundColor?: string;
    size?: number;
}

export interface ChartDefsProps {
    /** Array of gradient definitions */
    gradients?: GradientDef[];
    /** Array of pattern definitions */
    patterns?: PatternDef[];
    /** Auto-generate area gradients for these colors */
    areaColors?: string[];
    /** Fill opacity for auto-generated area gradients */
    areaOpacity?: number;
    /** Children (for custom defs) */
    children?: React.ReactNode;
}

/**
 * ChartDefs Component
 *
 * Centralized SVG definitions (gradients, patterns) for chart styling.
 * Generates unique IDs to prevent collisions when multiple charts on page.
 *
 * @example
 * // Auto-generate area gradients
 * <ChartDefs areaColors={chartColors} />
 *
 * // Then use: fill={`url(#area-gradient-0)`}
 *
 * @example
 * // Custom gradients
 * <ChartDefs
 *   gradients={[{
 *     id: 'custom',
 *     type: 'linear',
 *     stops: [
 *       { offset: '0%', color: '#ff0000' },
 *       { offset: '100%', color: '#0000ff' },
 *     ]
 *   }]}
 * />
 */
export function ChartDefs({
    gradients = [],
    patterns = [],
    areaColors = [],
    areaOpacity = 0.3,
    children,
}: ChartDefsProps) {
    const prefix = useId();

    // Generate area gradients from colors
    const areaGradients: GradientDef[] = areaColors.map((color, index) => ({
        id: `area-gradient-${index}`,
        type: 'linear',
        direction: { x1: '0', y1: '0', x2: '0', y2: '1' },
        stops: [
            { offset: '5%', color, opacity: areaOpacity },
            { offset: '95%', color, opacity: 0.05 },
        ],
    }));

    const allGradients = [...areaGradients, ...gradients];

    return (
        <defs>
            {/* Linear/Radial Gradients */}
            {allGradients.map((gradient) => {
                const id = `${prefix}-${gradient.id}`;

                if (gradient.type === 'radial') {
                    return (
                        <radialGradient key={id} id={gradient.id}>
                            {gradient.stops.map((stop, i) => (
                                <stop
                                    key={i}
                                    offset={stop.offset}
                                    stopColor={stop.color}
                                    stopOpacity={stop.opacity ?? 1}
                                />
                            ))}
                        </radialGradient>
                    );
                }

                const dir = gradient.direction || { x1: '0', y1: '0', x2: '0', y2: '1' };
                return (
                    <linearGradient
                        key={id}
                        id={gradient.id}
                        x1={dir.x1}
                        y1={dir.y1}
                        x2={dir.x2}
                        y2={dir.y2}
                    >
                        {gradient.stops.map((stop, i) => (
                            <stop
                                key={i}
                                offset={stop.offset}
                                stopColor={stop.color}
                                stopOpacity={stop.opacity ?? 1}
                            />
                        ))}
                    </linearGradient>
                );
            })}

            {/* Patterns */}
            {patterns.map((pattern) => {
                const id = `${prefix}-${pattern.id}`;
                const size = pattern.size || 8;

                switch (pattern.type) {
                    case 'lines':
                        return (
                            <pattern
                                key={id}
                                id={pattern.id}
                                patternUnits="userSpaceOnUse"
                                width={size}
                                height={size}
                            >
                                <rect width={size} height={size} fill={pattern.backgroundColor || 'transparent'} />
                                <line x1="0" y1="0" x2={size} y2={size} stroke={pattern.color} strokeWidth="1" />
                            </pattern>
                        );
                    case 'dots':
                        return (
                            <pattern
                                key={id}
                                id={pattern.id}
                                patternUnits="userSpaceOnUse"
                                width={size}
                                height={size}
                            >
                                <rect width={size} height={size} fill={pattern.backgroundColor || 'transparent'} />
                                <circle cx={size / 2} cy={size / 2} r={size / 4} fill={pattern.color} />
                            </pattern>
                        );
                    case 'crosshatch':
                        return (
                            <pattern
                                key={id}
                                id={pattern.id}
                                patternUnits="userSpaceOnUse"
                                width={size}
                                height={size}
                            >
                                <rect width={size} height={size} fill={pattern.backgroundColor || 'transparent'} />
                                <line x1="0" y1="0" x2={size} y2={size} stroke={pattern.color} strokeWidth="1" />
                                <line x1={size} y1="0" x2="0" y2={size} stroke={pattern.color} strokeWidth="1" />
                            </pattern>
                        );
                    default:
                        return null;
                }
            })}

            {/* Custom children */}
            {children}
        </defs>
    );
}

export default ChartDefs;
