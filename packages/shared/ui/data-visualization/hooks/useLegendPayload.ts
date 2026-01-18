import { useMemo } from 'react';
import type { LegendPayloadItem } from '../types';

interface UseLegendPayloadOptions {
    /** Data keys for series */
    keys: string[];
    /** Display names mapping */
    names?: Record<string, string>;
    /** Colors for each series */
    colors: string[];
    /** Optional inactive/hidden keys */
    inactiveKeys?: string[];
}

/**
 * useLegendPayload Hook
 * 
 * Generates standardized legend payload for Recharts Legend component.
 * Eliminates the repeated `keys.map(...)` pattern across charts.
 * 
 * @example
 * const legendPayload = useLegendPayload({
 *   keys: yKeys,
 *   names: yKeyNames,
 *   colors: chartColors,
 * });
 */
export const useLegendPayload = ({
    keys,
    names = {},
    colors,
    inactiveKeys = [],
}: UseLegendPayloadOptions): LegendPayloadItem[] => {
    return useMemo(
        () =>
            keys.map((key, index) => ({
                value: names?.[key] || key,
                dataKey: key,
                color: colors[index % colors.length], // Safe access
                inactive: inactiveKeys.includes(key),
            })),
        [keys, names, colors, inactiveKeys]
    );
};

export default useLegendPayload;
