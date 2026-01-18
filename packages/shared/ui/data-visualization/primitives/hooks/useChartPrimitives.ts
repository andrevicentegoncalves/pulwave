/**
 * useChartPrimitives Hook
 *
 * Returns library-agnostic chart primitives from the ChartProvider context.
 * Charts consume these primitives without knowing which library is being used.
 *
 * @example
 * ```tsx
 * const { ChartCanvas, BarSeries, XAxis, YAxis } = useChartPrimitives();
 *
 * return (
 *   <ChartCanvas data={data} height={300}>
 *     <XAxis dataKey="category" />
 *     <YAxis />
 *     <BarSeries dataKey="value" />
 *   </ChartCanvas>
 * );
 * ```
 */
import { useMemo } from 'react';
import { useChartContext } from '../../providers/ChartProvider';
import type { ChartPrimitives, ChartCapabilities } from '../types';

interface UseChartPrimitivesResult {
    /** Library-agnostic primitive components */
    primitives: ChartPrimitives;
    /** Adapter capabilities (what features are supported) */
    capabilities: ChartCapabilities;
    /** Currently active adapter ID */
    adapterId: string;
    /** Check if a feature is supported */
    hasCapability: (capability: keyof ChartCapabilities) => boolean;
}

/**
 * Default capabilities for when no adapter is provided
 */
const DEFAULT_CAPABILITIES: ChartCapabilities = {
    supportsBrush: false,
    supportsZoom: false,
    supportsAnimation: true,
    animationType: 'css',
    supportsResponsive: true,
    supportedChartTypes: ['bar', 'line', 'area', 'pie'],
};

/**
 * Hook to access chart primitives from the current adapter
 *
 * Uses the new ChartAdapter interface from ChartProvider context.
 */
export const useChartPrimitives = (): UseChartPrimitivesResult => {
    const context = useChartContext();

    // Access the new adapter property (ChartAdapter interface)
    const { adapter } = context;

    const result = useMemo<UseChartPrimitivesResult>(() => ({
        primitives: adapter.primitives,
        capabilities: adapter.capabilities || DEFAULT_CAPABILITIES,
        adapterId: adapter.id,
        hasCapability: (capability: keyof ChartCapabilities) => {
            const caps = adapter.capabilities || DEFAULT_CAPABILITIES;
            const value = caps[capability];
            if (typeof value === 'boolean') return value;
            if (Array.isArray(value)) return value.length > 0;
            return value !== 'none';
        },
    }), [adapter]);

    return result;
};

/**
 * Hook to check if a specific capability is supported
 */
export const useChartCapability = (capability: keyof ChartCapabilities): boolean => {
    const { hasCapability } = useChartPrimitives();
    return hasCapability(capability);
};

/**
 * Hook to get just the primitives (convenience alias)
 */
export const usePrimitives = (): ChartPrimitives => {
    const { primitives } = useChartPrimitives();
    return primitives;
};

export default useChartPrimitives;
