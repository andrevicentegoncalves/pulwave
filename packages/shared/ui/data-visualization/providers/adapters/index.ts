// =============================================================================
// LEGACY ADAPTERS (ChartLibraryComponents interface)
// =============================================================================

export { RechartsAdapter } from './RechartsAdapter';
export { VISXAdapter } from './visx';

// =============================================================================
// NEW PRIMITIVES ADAPTERS (ChartAdapter interface)
// =============================================================================

export { RechartsPrimitivesAdapter } from './recharts';
export { VISXPrimitivesAdapter } from './visx';

// =============================================================================
// Note: Primitives are NOT re-exported here to avoid naming conflicts.
// Import directly from the adapter if needed:
// - import { BarSeries } from './adapters/recharts/primitives';
// - import { BarSeries as VISXBarSeries } from './adapters/visx/primitives';
// =============================================================================
