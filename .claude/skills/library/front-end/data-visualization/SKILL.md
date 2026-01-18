---
name: data-visualization
description: Guidelines for choosing and implementing data visualization libraries (D3.js vs Recharts) in the Pulwave design system.
version: 1.0.0
tags: [Charts, D3, Recharts, Data Visualization, SVG]
---

# Data Visualization: Library Selection Guide

## Library Decision Matrix

### Use Recharts When:
- ✅ Building **standard charts** (bar, line, pie, area, scatter)
- ✅ Need **React integration** with props, state, and lifecycle
- ✅ Speed matters—charts needed quickly
- ✅ Team has varying skill levels
- ✅ Theming via props is sufficient
- ✅ Responsive charts with minimal configuration

**Current Pulwave Usage:**
- `LineChart`, `BarChart`, `AreaChart`, `PieChart`, `RadarChart`, etc.

### Use D3.js When:
- ✅ Building **custom/unique visualizations** (force graphs, hierarchies, custom maps)
- ✅ Need **pixel-perfect control** over every SVG element
- ✅ Complex **animations and transitions** beyond enter/exit
- ✅ Advanced **data transformations** (scales, projections, layouts)
- ✅ Performance-critical with **large datasets** (Canvas rendering)
- ✅ Geographic projections (`d3-geo`)

**Pulwave Charts That Could Benefit from D3:**
- `WorldMapChart`, `GeoChart` → Use `d3-geo` for projections
- `FlowChart` → Use `d3-force` for auto-layout
- `SankeyChart` → D3 has built-in Sankey layout
- Custom animations beyond Recharts capabilities

### Hybrid Approach (Recommended)
Use D3 for **data transformations and calculations**, render with **React/SVG**.

**Example:**
```tsx
import { scaleLinear, geoMercator } from 'd3';

// Use D3 for calculations
const xScale = scaleLinear().domain([0, 100]).range([0, width]);
const projection = geoMercator().fitSize([width, height], geoData);

// Render with React
return (
  <svg>
    {data.map(d => (
      <circle cx={xScale(d.x)} cy={d.y} r={5} />
    ))}
  </svg>
);
```

## Chart Type Recommendations

| Chart Type | Library | Rationale |
|------------|---------|-----------|
| **Line/Bar/Area** | Recharts | Built-in, performant, responsive |
| **Pie/Donut** | Recharts | Simple API, good defaults |
| **Scatter/Bubble** | Recharts | Good for standard use cases |
| **Geographic Maps** | D3 (`d3-geo`) | Projections, topojson support |
| **Network/Flow** | D3 (`d3-force`) | Auto-layout algorithms |
| **Hierarchies** | D3 (`d3-hierarchy`) | Tree, treemap, sunburst layouts |
| **Sankey/Chord** | D3 | Built-in layouts |
| **Gantt** | Custom SVG + D3 scales | Timeline calculations |
| **Heatmap** | Recharts or Custom | Depends on complexity |
| **Violin Plot** | Custom SVG + D3 stats | Statistical distributions |

## Implementation Patterns

### Pattern 1: Pure Recharts
```tsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<LineChart data={data}>
  <XAxis dataKey="name" />
  <YAxis />
  <Line dataKey="value" stroke="var(--color-primary)" />
</LineChart>
```

### Pattern 2: D3 Calculations + React Rendering
```tsx
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';

const xScale = scaleLinear().domain([0, maxX]).range([0, width]);
const yScale = scaleLinear().domain([0, maxY]).range([height, 0]);
const pathGenerator = line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y));

<svg>
  <path d={pathGenerator(data)} stroke="var(--color-primary)" />
</svg>
```

### Pattern 3: D3 for Geographic Projections
```tsx
import { geoMercator, geoPath } from 'd3-geo';

const projection = geoMercator().fitSize([width, height], geoData);
const pathGenerator = geoPath().projection(projection);

<svg>
  {features.map(feature => (
    <path d={pathGenerator(feature)} fill="var(--color-surface)" />
  ))}
</svg>
```

## Performance Considerations

### Recharts Optimization
- Use `isAnimationActive={false}` for large datasets
- Implement data pagination/windowing
- Memoize data transformations

### D3 Optimization
- Use Canvas for >1000 data points
- Implement virtual scrolling for large datasets
- Debounce resize handlers
- Use `requestAnimationFrame` for animations

## Design System Integration

### Color Tokens
Always use semantic colors from `ChartProvider`:
```tsx
const { semanticColors } = useChartContext();

// Recharts
<Line stroke={semanticColors.primary} />

// D3/Custom SVG
<path fill={semanticColors.primary} />
```

### Theming
- Use CSS custom properties: `var(--chart-primary)`, `var(--chart-grid-color)`
- Respect dark mode via `semanticColors`
- Follow BEM naming: `.chart--{type}__{element}`

## Migration Strategy

### Evaluate Current Chart
1. **Is it a standard chart?** → Keep Recharts
2. **Does it need custom layout?** → Consider D3
3. **Is performance an issue?** → Benchmark both
4. **Does team know D3?** → Factor in learning curve

### Gradual Migration
- Start with data transformations (scales, projections)
- Keep Recharts for rendering initially
- Migrate to full D3 only if justified

## Red Flags

### Don't Use D3 If:
- ❌ Chart type available in Recharts
- ❌ Team unfamiliar with D3 and chart is time-sensitive
- ❌ Chart doesn't need customization beyond props

### Don't Use Recharts If:
- ❌ Need custom force-directed layout
- ❌ Geographic projections required
- ❌ Extremely custom animations needed
- ❌ Chart type not supported (Sankey, Chord, etc.)

## Resources

- **D3 Gallery**: https://observablehq.com/@d3/gallery
- **Recharts Docs**: https://recharts.org/
- **D3 Modules**: https://github.com/d3/d3/blob/main/API.md
- **Visx** (D3 + React): https://airbnb.io/visx/

## Decision Checklist

Before implementing a new chart:
- [ ] Is this a standard chart type?
- [ ] What's the expected data size?
- [ ] Do we need custom layout algorithms?
- [ ] Is the team familiar with the chosen library?
- [ ] Does it integrate with our design tokens?
- [ ] Have we checked for existing implementations?

## Full Compiled Guide

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples
