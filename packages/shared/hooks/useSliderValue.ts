/**
 * useSliderValue Hook
 * Centralized value math and calculations for slider components.
 * 
 * @package @foundation/hooks
 */

export interface SliderMark {
    value: number;
    label?: string;
}

export interface SliderSizeConfig {
    trackHeight: number;
    thumbSize: number;
    iconSize: number;
    touchArea: number;
    fontSize: string;
}

/**
 * Clamp a value between min and max, optionally snapping to step.
 */
export const clampValue = (value: number, min: number, max: number, step = 1): number => {
    const clamped = Math.min(Math.max(value, min), max);
    if (step > 0) {
        const steps = Math.round((clamped - min) / step);
        return Math.min(min + steps * step, max);
    }
    return clamped;
};

/**
 * Convert a value to percentage (0-100) within a range.
 */
export const getPercentage = (value: number, min: number, max: number): number => {
    if (max === min) return 0;
    return ((value - min) / (max - min)) * 100;
};

/**
 * Convert a percentage to value within a range.
 */
export const valueFromPercentage = (percent: number, min: number, max: number, step = 1): number => {
    const rawValue = min + (percent / 100) * (max - min);
    return clampValue(rawValue, min, max, step);
};

/**
 * Format slider value for display.
 */
export const formatSliderValue = (
    value: number,
    format: 'number' | 'percentage' | 'currency' | 'custom' = 'number',
    customFormatter?: (value: number) => string
): string => {
    if (format === 'custom' && typeof customFormatter === 'function') {
        return customFormatter(value);
    }

    switch (format) {
        case 'percentage':
            return `${Math.round(value)}%`;
        case 'currency':
            return `$${value.toLocaleString()}`;
        case 'number':
        default:
            return value.toLocaleString();
    }
};

/**
 * Get the closest mark to a value.
 */
export const getClosestMark = (value: number, marks: SliderMark[]): SliderMark | null => {
    if (!marks || marks.length === 0) return null;

    return marks.reduce((closest, mark) => {
        const closestDiff = Math.abs(closest.value - value);
        const markDiff = Math.abs(mark.value - value);
        return markDiff < closestDiff ? mark : closest;
    }, marks[0]);
};

/**
 * Check if two thumbs would overlap (for range slider).
 */
export const thumbsWouldOverlap = (value1: number, value2: number, minGap = 0): boolean => {
    return Math.abs(value1 - value2) < minGap;
};

/**
 * Size configuration for slider variants.
 */
export const SLIDER_SIZE_CONFIG: Record<'s' | 'm' | 'l' | 'xl', SliderSizeConfig> = {
    s: {
        trackHeight: 4,
        thumbSize: 16,
        iconSize: 16,
        touchArea: 44,
        fontSize: 'caption-s',
    },
    m: {
        trackHeight: 6,
        thumbSize: 20,
        iconSize: 20,
        touchArea: 44,
        fontSize: 'caption-m',
    },
    l: {
        trackHeight: 8,
        thumbSize: 24,
        iconSize: 24,
        touchArea: 48,
        fontSize: 'body-s',
    },
    xl: {
        trackHeight: 10,
        thumbSize: 32,
        iconSize: 32,
        touchArea: 56,
        fontSize: 'body-m',
    },
};
