/**
 * Progress Utilities
 * Shared math, formatting, and SVG path generation for progress visualization.
 * 
 * @package @foundation/utils
 */

/**
 * Calculate percentage from value/max or use provided percentage.
 * @param {number} value - Current value
 * @param {number} max - Maximum value (default: 100)
 * @param {number} percentage - Direct percentage (overrides value/max)
 * @returns {number} Clamped percentage 0-100
 */
export const calculatePercentage = (value?: number, max = 100, percentage?: number): number => {
    if (typeof percentage === 'number') {
        return Math.min(Math.max(percentage, 0), 100);
    }
    if (typeof value === 'number' && typeof max === 'number' && max > 0) {
        return Math.min(Math.max((value / max) * 100, 0), 100);
    }
    return 0;
};

/**
 * Format label based on format type.
 */
export const formatLabel = (value: number, max: number, percentage: number, format: 'percentage' | 'value' | 'custom' = 'percentage'): string => {
    switch (format) {
        case 'value':
            return `${value}/${max}`;
        case 'percentage':
        default:
            return `${Math.round(percentage)}%`;
    }
};

/**
 * Generate SVG arc path for circular progress.
 * @param {number} radius - Circle radius
 * @param {number} percentage - Fill percentage (0-100)
 * @param {number} startAngle - Start angle in degrees (default: -90 for top)
 * @returns {string} SVG path d attribute
 */
export const getCircularArcPath = (radius: number, percentage: number, startAngle: number = -90): string => {
    if (percentage === 0) return '';
    if (percentage >= 100) {
        // Full circle
        return `M ${radius} 0 A ${radius} ${radius} 0 1 1 ${radius - 0.001} 0`;
    }

    const endAngle = startAngle + (percentage / 100) * 360;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    const largeArc = percentage > 50 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
};

/**
 * Generate SVG arc path for semi-circle progress (gauge).
 * Arc goes from left to right along the TOP half of a circle.
 * The semi-circle is oriented with its flat side at the bottom.
 */
export const getSemiCircleArcPath = (centerX: number, centerY: number, radius: number, percentage: number): string => {
    if (percentage <= 0) return '';

    // Clamp percentage to max 100
    const clampedPercent = Math.min(percentage, 100);

    // For a semi-circle from left to right along the TOP:
    // - 0% starts at the left point (centerX - radius, centerY)
    // - 100% ends at the right point (centerX + radius, centerY)
    // The arc curves upward (through the top of the circle)

    // Start point is always at the LEFT of the semi-circle
    const startX = centerX - radius;
    const startY = centerY;

    // End point based on percentage
    // Angle: 0% = 180° (left), 100% = 0° (right)
    // Using standard math: angle measured from positive X-axis, counterclockwise
    // Arc goes from 180° to (180° - percentage * 180°)
    const endAngleRad = (Math.PI) - (clampedPercent / 100) * Math.PI;

    const endX = centerX + radius * Math.cos(endAngleRad);
    const endY = centerY - radius * Math.sin(endAngleRad); // Negative because SVG Y is inverted

    // Large arc flag: ALWAYS 0 for semi-circles since they never exceed 180 degrees
    // A semi-circle is exactly 180° at 100%, so even then it's not "large"
    const largeArcFlag = 0;

    // Sweep flag: 1 = clockwise, 0 = counterclockwise
    // We want clockwise (going from left, up through top, to right)
    const sweepFlag = 1;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
};

/**
 * Calculate circumference of a circle.
 */
export const getCircumference = (radius: number): number => 2 * Math.PI * radius;

/**
 * Calculate stroke dasharray and dashoffset for circular progress.
 */
export const getStrokeDashValues = (radius: number, percentage: number): { dasharray: number, dashoffset: number } => {
    const circumference = getCircumference(radius);
    const dasharray = circumference;
    const dashoffset = circumference - (percentage / 100) * circumference;
    return { dasharray, dashoffset };
};

/**
 * Size configuration map for progress variants.
 */
export const SIZE_CONFIG = {
    s: {
        height: 4,
        strokeWidth: 3,
        radius: 32,
        fontSize: 'caption-s',
        gap: 2,
    },
    m: {
        height: 8,
        strokeWidth: 4,
        radius: 48,
        fontSize: 'caption-m',
        gap: 4,
    },
    l: {
        height: 12,
        strokeWidth: 6,
        radius: 64,
        fontSize: 'body-s',
        gap: 6,
    },
    xl: {
        height: 16,
        strokeWidth: 8,
        radius: 80,
        fontSize: 'body-m',
        gap: 8,
    },
};
