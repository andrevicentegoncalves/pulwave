# Chart Migration - Implementation Plan

> **Created:** 2026-01-06  
> **Source of Truth:** [CHART_REGISTRY.md](./CHART_REGISTRY.md)  
> **Scope:** 60 Charts | [99 UI Components](../docs/COMPONENT_REGISTRY.md)  
> **Target:** Standardize all charts to use primitives, hooks, and design system patterns

---

## Overview

This plan addresses all charts that need migration to the target architecture:
- **Use Primitives** (ChartContainer, ChartTooltip, ChartLegend)
- **Use Hooks** (useChartTheme, useChartDimensions, useSeriesVisibility)
- **Remove Inline Styles** where possible
- **Add CVA** for chart variants (optional - lower priority)

---

## Current State Summary

| Criteria | Compliant | Non-Compliant |
|----------|-----------|---------------|
| Uses ChartContainer | 0 | 60 |
| Uses ChartTooltip | 26 | 34 |
| Uses ChartLegend | 30 | 30 |
| Uses useChartTheme | 6 | 54 |
| Uses useChartDimensions | 5 | 55 |
| No Inline Styles | 7 | 53 |

---

## Priority Levels

| Priority | Focus | Charts |
|----------|-------|--------|
| **P0** | Add ChartContainer + Hooks | All 60 charts |
| **P1** | Add ChartTooltip | 34 charts missing |
| **P2** | Add ChartLegend | 30 charts missing |
| **P3** | Remove Inline Styles | 53 charts (ongoing) |
| **P4** | Add CVA/Types | Optional - future work |

---

## P0: Charts Needing All Updates (15)

These charts use **no primitives or hooks** - highest priority:

### Bar Charts
- [ ] `BulletChart` - Add Container, Tooltip, Legend, Theme hook

### Pie & Radial
- [ ] `GaugeChart` - Add Container, Tooltip, Theme hook
- [ ] `PerformanceGauge` - Add Container, Tooltip, Theme hook

### Network & Flow
- [ ] `ChordDiagram` - Add Container, Tooltip, Legend
- [ ] `FlowChart` - Add Container, Tooltip
- [ ] `NetworkDiagram` - Add Container, Tooltip

### Geographic
- [ ] `GeoChart` - Add Container, Tooltip, Legend
- [ ] `WorldMapChart` - Add Container, Tooltip, Legend

### Special
- [ ] `CandlestickChart` - Add Container, Tooltip, Legend
- [ ] `GanttChart` - Add Container, Tooltip
- [ ] `PyramidChart` - Add Container, Tooltip, Legend
- [ ] `SparklineChart` - Add Container (minimal chart)
- [ ] `SpiralPlot` - Add Container, Tooltip
- [ ] `WordCloudChart` - Add Container, Tooltip

### Hierarchical
- [ ] `OrgChart` - Add Container, Tooltip

---

## P1: Charts Missing ChartTooltip (34)

Add `ChartTooltip` primitive for consistent tooltip behavior:

### Already have Legend, need Tooltip
- [ ] BoxPlotChart
- [ ] BubbleMapChart
- [ ] MekkoChart
- [ ] NestedPieChart
- [ ] ParallelCoordinatesPlot
- [ ] ParliamentChart
- [ ] PictogramChart
- [ ] PolarAreaChart
- [ ] ProgressRingsChart
- [ ] RadialBarChart
- [ ] RoseChart
- [ ] SunburstChart
- [ ] TimelineChart
- [ ] VennDiagram
- [ ] ViolinPlot
- [ ] WaffleChart

### Need both Tooltip and Legend
- [ ] CountryMapChart
- [ ] DonutChart
- [ ] DotPlotChart
- [ ] GeoMapChart

---

## P2: Charts Missing ChartLegend (30)

Add `ChartLegend` for multi-series charts:

- [ ] AccumulatedLineChart
- [ ] BubblePackChart
- [ ] BulletChart
- [ ] DivergingBarChart
- [ ] FunnelChart
- [ ] HeatmapChart
- [ ] HistogramChart
- [ ] LollipopChart
- [ ] PopulationPyramidChart
- [ ] SankeyDiagram
- [ ] StreamGraph
- [ ] ThresholdAreaChart
- [ ] TreemapChart
- [ ] WaterfallChart

---

## P3: Charts with Inline Styles (53)

Most charts use inline styles for dynamic SVG positioning. Strategy:

### Acceptable Inline Styles (Keep)
- `transform` for positioning
- `fill` and `stroke` for data-driven colors
- `opacity` for animations
- Dynamic `width`/`height` based on data

### Should Be Removed (Move to SCSS)
- Static padding/margin
- Fixed colors not from theme
- Typography styles
- Container styling

---

## Implementation Approach

### Step 1: Add ChartContainer

```tsx
// Before
export const MyChart = ({ data, ...props }) => {
    return (
        <div className="my-chart" style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                {/* chart content */}
            </ResponsiveContainer>
        </div>
    );
};

// After
import { ChartContainer } from '../primitives';

export const MyChart = ({ data, ...props }) => {
    return (
        <ChartContainer className="my-chart" aspectRatio={16/9}>
            <ResponsiveContainer>
                {/* chart content */}
            </ResponsiveContainer>
        </ChartContainer>
    );
};
```

### Step 2: Add Theme Hook

```tsx
// Before
const colors = ['#4f46e5', '#22c55e', '#f59e0b'];

// After
import { useChartTheme } from '../hooks';

const { colorScale, textColor, gridColor } = useChartTheme();
```

### Step 3: Add ChartTooltip

```tsx
// Before
<Tooltip content={<CustomTooltip />} />

// After
import { ChartTooltip } from '../primitives';

<Tooltip content={<ChartTooltip />} />
```

### Step 4: Add ChartLegend

```tsx
// Before
<Legend />

// After
import { ChartLegend } from '../primitives';

<ChartLegend series={data} />
```

---

## Batch Execution Plan

### Batch 1: P0 Charts (15 charts)
**Estimate:** 4-6 hours
- Focus on charts with zero primitive/hook usage
- Establishes patterns for remaining batches

### Batch 2: Add ChartTooltip (19 charts)
**Estimate:** 2-3 hours
- Charts that have Legend but no Tooltip

### Batch 3: Add ChartLegend (14 charts)
**Estimate:** 2-3 hours
- Charts that have Tooltip but no Legend

### Batch 4: Add Hooks to Partial Charts (39 charts)
**Estimate:** 4-6 hours
- Add useChartTheme and useChartDimensions

---

## Target Architecture

```
ChartName/
├── ChartName.tsx         # Uses primitives & hooks
├── types.ts              # Props interface, optional CVA
├── index.ts              # Exports
└── styles/
    ├── _index.scss
    └── partials/
        ├── _base.scss    # Container styles
        ├── _legend.scss  # Legend overrides
        └── _tooltip.scss # Tooltip overrides
```

### Required Imports Pattern

```tsx
// Primitives
import { ChartContainer, ChartTooltip, ChartLegend, ChartGrid } from '../primitives';

// Hooks
import { useChartTheme, useChartDimensions, useSeriesVisibility } from '../hooks';

// Example usage
export const MyChart = ({ data, title, ...props }: MyChartProps) => {
    const { colorScale, theme } = useChartTheme();
    const { width, height, containerRef } = useChartDimensions();
    const { visibleSeries, toggleSeries } = useSeriesVisibility(data);

    return (
        <ChartContainer ref={containerRef} title={title}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart data={visibleSeries}>
                    <CartesianGrid stroke={theme.gridColor} />
                    <Tooltip content={<ChartTooltip />} />
                    <ChartLegend series={data} onToggle={toggleSeries} />
                    {/* ... */}
                </RechartsLineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};
```

---

## Verification Checklist

For each migrated chart, verify:

- [ ] Uses `ChartContainer` primitive
- [ ] Uses `useChartTheme` hook for colors
- [ ] Uses `useChartDimensions` for responsive sizing
- [ ] Uses `ChartTooltip` if chart has tooltips
- [ ] Uses `ChartLegend` if multi-series
- [ ] No hardcoded colors (uses theme)
- [ ] Inline styles minimized
- [ ] No build errors
- [ ] Visual regression check

---

## Best Practice Examples

Use these as reference implementations:

1. **AreaChart** - Uses theme hook, tooltip, legend
2. **BarChart** - Uses theme hook, axis tick, tooltip, legend
3. **LineChart** - Uses theme hook, tooltip, legend
4. **ScatterChart** - Uses dimensions hook, tooltip, legend

---

## Post-Migration

1. Update `CHART_REGISTRY.md` with completed status
2. Run style-guide chart demos to verify rendering
3. Update primitives documentation if patterns change

---

## Related Documents

- [Chart Registry](./CHART_REGISTRY.md)
- [Primitives Documentation](./PRIMITIVES.md)
- [Component Registry](../docs/COMPONENT_REGISTRY.md)
- [Component Implementation Plan](../docs/IMPLEMENTATION_PLAN.md)
