// Data Visualization Primitives Index

// =============================================================================
// CORE ADAPTER TYPES (from types.ts)
// These are the primary interfaces for the primitives adapter pattern.
// Series props are NOT re-exported here to avoid conflicts with component exports.
// =============================================================================

export type {
    // Core types
    DataPoint,
    DataAccessor,
    ChartMargins,
    ScaleType,
    ScaleConfig,
    // Main interfaces for the adapter pattern
    ChartPrimitives,
    ChartAdapter,
    ChartCapabilities,
    // Canvas props
    ChartCanvasProps,
    // Tooltip/Legend payloads
    TooltipPayload,
    LegendPayload,
} from './types';

// =============================================================================
// HOOKS
// =============================================================================

export * from './hooks';

// =============================================================================
// CONTAINER & STRUCTURE COMPONENTS
// =============================================================================

export * from './ChartShell';
export * from './ChartContainer'; // Deprecated - use ChartShell
export * from './ChartAxes';
export * from './ChartAxisTick';
export * from './ChartGrid';

// =============================================================================
// OVERLAY & DECORATION COMPONENTS
// =============================================================================

export * from './ChartTooltip';
export * from './ChartLegend';
export * from './ChartDefs';
export * from './ChartBrush';
export * from './ChartAnnotation';
export * from './ChartZoom';

// =============================================================================
// SERIES PRIMITIVES
// =============================================================================

export * from './LineSeries';
export * from './BarSeries';
export * from './AreaSeries';
export * from './ScatterSeries';
export * from './PieSeries';

// =============================================================================
// CUSTOM RENDERERS (no library dependency)
// =============================================================================

export * from './ArcRenderer';
