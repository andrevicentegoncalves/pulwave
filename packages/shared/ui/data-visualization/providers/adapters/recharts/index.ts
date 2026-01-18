/**
 * Recharts Adapter Exports
 *
 * Exports both the legacy ChartLibraryComponents adapter (RechartsAdapter)
 * and the new ChartAdapter with primitives (RechartsPrimitivesAdapter).
 */

// Legacy adapter (ChartLibraryComponents interface)
export { RechartsAdapter } from '../RechartsAdapter';

// New primitives adapter (ChartAdapter interface)
export { RechartsPrimitivesAdapter } from './RechartsPrimitivesAdapter';

// Export primitives for direct use if needed
export * from './primitives';
