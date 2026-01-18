# Data Visualization Registry

> **Last Updated:** 2026-01-06  
> **Total Charts:** 60 | [99 UI Components](../docs/COMPONENT_REGISTRY.md)  
> **Package:** `@ui/data-visualization`

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Compliant/Used |
| ❌ | Needs Work/Not Used |
| — | Not Applicable |

---

## Architecture Compliance Summary

| Criteria | Compliant | Non-Compliant |
|----------|-----------|---------------|
| **Compound Pattern** | 0 | 60 |
| **CVA** | 0 | 60 |
| **No Inline Styles** | 7 | 53 |
| **ChartContainer Primitive** | 0 | 60 |
| **useChartTheme Hook** | 6 | 54 |
| **useChartDimensions Hook** | 5 | 55 |

---

## Available Primitives & Hooks

### Primitives
| Primitive | Purpose | Usage |
|-----------|---------|-------|
| `ChartContainer` | Responsive wrapper | 0/60 charts |
| `ChartTooltip` | Unified tooltip | 26/60 charts |
| `ChartLegend` | Legend component | 30/60 charts |
| `ChartGrid` | Grid lines | 0/60 charts |
| `ChartAxisTick` | Custom axis ticks | 1/60 charts |

### Hooks
| Hook | Purpose | Usage |
|------|---------|-------|
| `useChartDimensions` | Responsive sizing | 5/60 charts |
| `useChartTheme` | Theme colors | 6/60 charts |
| `useSeriesVisibility` | Toggle series | 3/60 charts |

---

## Chart Inventory

### Bar Charts (6)

| Chart | Compound | CVA | No Inline | Container | Tooltip | Legend | Theme Hook | Status |
|-------|----------|-----|-----------|-----------|---------|--------|------------|--------|
| BarChart | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ⏳ Uses hooks |
| BulletChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| DivergingBarChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| MekkoChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| PopulationPyramidChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| StackedBarChart | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |

---

### Line & Area Charts (9)

| Chart | Compound | CVA | No Inline | Container | Tooltip | Legend | Theme Hook | Status |
|-------|----------|-----|-----------|-----------|---------|--------|------------|--------|
| AccumulatedLineChart | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |
| AreaChart | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ⏳ Uses hooks |
| CircularLineChart | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |
| DualAxisChart | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |
| LineChart | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ⏳ Uses hooks |
| SplineLineChart | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |
| StepAreaChart | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |
| StepLineChart | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |
| ThresholdAreaChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |

---

### Pie & Radial Charts (9)

| Chart | Compound | CVA | No Inline | Container | Tooltip | Legend | Theme Hook | Status |
|-------|----------|-----|-----------|-----------|---------|--------|------------|--------|
| DonutChart | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs primitives |
| GaugeChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| NestedPieChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| PerformanceGauge | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| PieChart | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |
| PolarAreaChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| ProgressRingsChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| RadialBarChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| RoseChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |

---

### Scatter & Statistical Charts (6)

| Chart | Compound | CVA | No Inline | Container | Tooltip | Legend | Theme Hook | Status |
|-------|----------|-----|-----------|-----------|---------|--------|------------|--------|
| BoxPlotChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| DotPlotChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| HistogramChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| LollipopChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| ScatterChart | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |
| ViolinPlot | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |

---

### Hierarchical Charts (4)

| Chart | Compound | CVA | No Inline | Container | Tooltip | Legend | Theme Hook | Status |
|-------|----------|-----|-----------|-----------|---------|--------|------------|--------|
| BubblePackChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| OrgChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| SunburstChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| TreemapChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |

---

### Network & Flow Charts (5)

| Chart | Compound | CVA | No Inline | Container | Tooltip | Legend | Theme Hook | Status |
|-------|----------|-----|-----------|-----------|---------|--------|------------|--------|
| ChordDiagram | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| FlowChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| NetworkDiagram | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| SankeyDiagram | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| VennDiagram | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |

---

### Geographic Charts (5)

| Chart | Compound | CVA | No Inline | Container | Tooltip | Legend | Theme Hook | Status |
|-------|----------|-----|-----------|-----------|---------|--------|------------|--------|
| BubbleMapChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| CountryMapChart | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ⏳ Stub |
| GeoChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| GeoMapChart | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ⏳ Partial |
| WorldMapChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |

---

### Special Charts (16)

| Chart | Compound | CVA | No Inline | Container | Tooltip | Legend | Theme Hook | Status |
|-------|----------|-----|-----------|-----------|---------|--------|------------|--------|
| CandlestickChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| FunnelChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| GanttChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| HeatmapChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| ParallelCoordinatesPlot | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| ParliamentChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| PictogramChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| PyramidChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| RadarChart | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ⏳ Partial |
| SparklineChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| SpiralPlot | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |
| StreamGraph | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| TimelineChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| WaffleChart | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ⏳ Partial |
| WaterfallChart | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ⏳ Partial |
| WordCloudChart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Needs all |

---

## Priority Migration List

### P0: Charts Needing All Updates (15)
These use no primitives or hooks:
- BulletChart, CandlestickChart, ChordDiagram, DotPlotChart, FlowChart
- GanttChart, GaugeChart, GeoChart, NetworkDiagram, OrgChart
- PerformanceGauge, PyramidChart, SparklineChart, SpiralPlot, WordCloudChart, WorldMapChart

### P1: Charts Using Some Primitives (39)
Should add: ChartContainer, useChartTheme, useChartDimensions

### P2: Best Practice Charts (6)
Already use hooks - serve as examples:
- AreaChart, BarChart, LineChart, RadarChart, ScatterChart, WaterfallChart

---

## Target Architecture

```
ChartName/
├── ChartName.tsx         # Uses primitives & hooks
├── types.ts              # CVA for variants
├── index.ts              # Exports
└── styles/
    ├── _index.scss
    └── partials/
        ├── _base.scss
        └── _elements.scss
```

### Required Imports
```tsx
import { ChartContainer, ChartTooltip, ChartLegend } from '../primitives';
import { useChartTheme, useChartDimensions } from '../hooks';
```

---

## Related Documentation

- [UI Component Registry](../docs/COMPONENT_REGISTRY.md)
- [Component Guidelines](../docs/COMPONENT_GUIDELINES.md)
- [Primitives Documentation](./PRIMITIVES.md)
