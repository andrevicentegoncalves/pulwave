/**
 * VISX Adapter - Index
 *
 * Exports all visx adapter components and the main adapter object.
 */

// Legacy adapter (ChartLibraryComponents interface)
export { VISXAdapter } from './VISXAdapter';

// New primitives adapter (ChartAdapter interface)
export { VISXPrimitivesAdapter } from './VISXPrimitivesAdapter';

// Export types
export * from './types';

// Note: ./components and ./primitives are NOT re-exported to avoid conflicts.
// Import directly from the sub-modules if needed:
// - import { XYChart, LineSeries } from './adapters/visx/components';
// - import { BarSeries as VISXBarSeries } from './adapters/visx/primitives';
