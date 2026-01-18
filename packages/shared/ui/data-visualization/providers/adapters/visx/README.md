# VISX Adapter

This adapter provides a Recharts-compatible API for [visx](https://airbnb.io/visx/) (formerly vx), Airbnb's collection of low-level visualization primitives for React.

## Overview

visx is fundamentally different from Recharts:
- **Recharts**: Opinionated, batteries-included chart library
- **visx**: Low-level primitives for building custom visualizations

This adapter bridges the gap, allowing you to:
1. **Drop-in replacement**: Use visx with the same API as Recharts
2. **Progressive enhancement**: Start with the adapter, then use visx primitives directly for custom needs
3. **Tree-shaking**: Only bundle the visx packages you actually use

## Installation

The visx adapter is included with the data-visualization package. visx dependencies are installed automatically.

```bash
# Already included - no additional installation needed
```

## Basic Usage

### Using the Adapter (Recharts-compatible API)

```tsx
import { ChartProvider } from '@pulwave/ui/data-visualization';
import { VISXAdapter } from '@pulwave/ui/data-visualization/providers/adapters';

function MyChart() {
  return (
    <ChartProvider adapter={VISXAdapter}>
      <LineChart data={data}>
        <Line dataKey="value" stroke="#8884d8" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </ChartProvider>
  );
}
```

### Using visx Primitives Directly (Recommended for Custom Charts)

For full control and performance, use visx primitives directly:

```tsx
import { XYChart, LineSeries, Axis, Grid, Tooltip } from '@visx/xychart';
import { useChartContext } from '@pulwave/ui/data-visualization';

function CustomChart() {
  const { semanticColors, getColor } = useChartContext();

  return (
    <XYChart
      width={600}
      height={400}
      xScale={{ type: 'band' }}
      yScale={{ type: 'linear' }}
    >
      <Grid
        rows
        columns
        stroke={semanticColors.grid}
      />
      <Axis
        orientation="bottom"
        stroke={semanticColors.axis}
      />
      <Axis
        orientation="left"
        stroke={semanticColors.axis}
      />
      <LineSeries
        dataKey="line1"
        data={data}
        xAccessor={(d) => d.x}
        yAccessor={(d) => d.y}
        stroke={getColor(0)}
      />
      <Tooltip
        snapToDataX
        snapToDataY
        showVerticalCrosshair
        showHorizontalCrosshair
        renderTooltip={({ tooltipData }) => (
          <div>{tooltipData.nearestDatum.datum.y}</div>
        )}
      />
    </XYChart>
  );
}
```

## Why Use visx?

### Advantages

1. **Performance**: Lower-level = more control over rendering
2. **Flexibility**: Build exactly the chart you need
3. **Tree-shaking**: Only bundle what you use
4. **TypeScript**: First-class TypeScript support
5. **Composability**: Mix and match primitives
6. **MIT License**: Free for commercial use (from Airbnb)

### When to Use visx vs Recharts

| Use Case | Library | Why |
|----------|---------|-----|
| Standard charts (line, bar, pie) | **Recharts** | Faster development, less code |
| Custom visualizations | **visx** | Full control, better performance |
| Interactive dashboards | **Recharts** | Built-in interactivity |
| Data-heavy charts (>10k points) | **visx** | Better performance with Canvas rendering |
| Unique, branded designs | **visx** | Complete styling control |
| Rapid prototyping | **Recharts** | Get charts up quickly |

## Architecture

The visx adapter works differently than a traditional adapter because visx is compositional:

```
┌─────────────────────────────────────┐
│   ChartProvider (Theme + Config)    │
├─────────────────────────────────────┤
│                                     │
│  Recharts Approach                  │
│  ────────────────                  │
│  <BarChart> ← Container component   │
│    <Bar> ← Series component         │
│                                     │
│  visx Approach                      │
│  ──────────────                     │
│  <XYChart> ← Composition root       │
│    <BarSeries> ← Primitive          │
│    <Axis> ← Primitive               │
│    <Grid> ← Primitive               │
│                                     │
└─────────────────────────────────────┘
```

### Adapter Strategy

The adapter provides **placeholder components** that:
1. Maintain the ChartLibraryComponents interface
2. Pass through to children
3. Allow gradual migration to visx primitives

This means you can:
```tsx
// Start with familiar API
<LineChart data={data}>
  <Line dataKey="value" />
</LineChart>

// Gradually migrate to visx
<XYChart>
  <LineSeries dataKey="value" />
</XYChart>

// Use full visx power
<XYChart>
  <AnimatedLineSeries
    curve={curveNatural}
    enableEvents
    onPointerMove={handler}
  />
</XYChart>
```

## Available visx Packages

The adapter includes these visx packages:

- `@visx/xychart` - XY chart primitives (line, bar, area, scatter)
- `@visx/shape` - SVG shapes (pie, arc, line, bar, area)
- `@visx/axis` - Axis components
- `@visx/grid` - Grid components
- `@visx/legend` - Legend components
- `@visx/tooltip` - Tooltip primitives
- `@visx/scale` - D3 scales
- `@visx/group` - SVG grouping
- `@visx/responsive` - Responsive sizing
- `@visx/hierarchy` - Tree and hierarchical layouts
- `@visx/annotation` - Labels and annotations
- `@visx/curve` - Line interpolation curves
- `@visx/pattern` - SVG patterns

## Examples

### Example 1: Responsive Line Chart with visx

```tsx
import { ParentSize } from '@visx/responsive';
import { XYChart, LineSeries, Axis, Grid, Tooltip } from '@visx/xychart';
import { curveNatural } from '@visx/curve';
import { useChartContext } from '@pulwave/ui/data-visualization';

function ResponsiveLineChart({ data }) {
  const { semanticColors, getColor } = useChartContext();

  return (
    <ParentSize>
      {({ width, height }) => (
        <XYChart
          width={width}
          height={height}
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <Grid
            rows
            columns
            stroke={semanticColors.grid}
            strokeOpacity={0.3}
          />
          <Axis
            orientation="bottom"
            stroke={semanticColors.axis}
            tickStroke={semanticColors.axis}
            tickLabelProps={() => ({
              fill: semanticColors.text,
              fontSize: 12,
            })}
          />
          <Axis
            orientation="left"
            stroke={semanticColors.axis}
            tickStroke={semanticColors.axis}
            tickLabelProps={() => ({
              fill: semanticColors.text,
              fontSize: 12,
            })}
          />
          <LineSeries
            dataKey="revenue"
            data={data}
            xAccessor={(d) => new Date(d.date)}
            yAccessor={(d) => d.revenue}
            stroke={getColor(0)}
            strokeWidth={2}
            curve={curveNatural}
          />
          <Tooltip
            snapToDataX
            showVerticalCrosshair
            renderTooltip={({ tooltipData }) => (
              <div style={{
                background: semanticColors.backgroundElevated,
                color: semanticColors.text,
                padding: '8px 12px',
                borderRadius: '4px',
                border: `1px solid ${semanticColors.border}`,
              }}>
                {tooltipData.nearestDatum.datum.revenue.toLocaleString()}
              </div>
            )}
          />
        </XYChart>
      )}
    </ParentSize>
  );
}
```

### Example 2: Custom Pie Chart with visx

```tsx
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import { scaleOrdinal } from '@visx/scale';
import { LegendOrdinal } from '@visx/legend';
import { useChartContext } from '@pulwave/ui/data-visualization';

function CustomPieChart({ data, width = 400, height = 400 }) {
  const { getColors } = useChartContext();
  const colors = getColors(data.length);

  const colorScale = scaleOrdinal({
    domain: data.map(d => d.label),
    range: colors,
  });

  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div>
      <svg width={width} height={height}>
        <Group top={centerY} left={centerX}>
          <Pie
            data={data}
            pieValue={(d) => d.value}
            outerRadius={radius}
            innerRadius={radius * 0.6}
            cornerRadius={3}
            padAngle={0.005}
          >
            {(pie) =>
              pie.arcs.map((arc, i) => (
                <g key={`arc-${i}`}>
                  <path
                    d={pie.path(arc)}
                    fill={colorScale(arc.data.label)}
                  />
                </g>
              ))
            }
          </Pie>
        </Group>
      </svg>
      <LegendOrdinal
        scale={colorScale}
        labelFormat={(label) => label}
      />
    </div>
  );
}
```

## Migration Guide

### From Recharts to visx

1. **Keep using Recharts** for standard charts
2. **Use visx** for:
   - Custom visualizations
   - Performance-critical charts
   - Charts with >10k data points
   - Unique designs not supported by Recharts

3. **Progressive migration**:
   ```tsx
   // Phase 1: Use adapter (no code change)
   <ChartProvider adapter={VISXAdapter}>
     <LineChart>...</LineChart>
   </ChartProvider>

   // Phase 2: Replace with visx primitives
   <XYChart>
     <LineSeries />
   </XYChart>

   // Phase 3: Full custom implementation
   <svg>
     <path d={linePath} />
   </svg>
   ```

## Performance Tips

1. **Use `AnimatedLineSeries`** for smooth transitions
2. **Enable `enableEvents={false}`** for static charts
3. **Use Canvas rendering** for >10k points (via custom implementation)
4. **Memoize accessors** to prevent re-renders
5. **Use `ParentSize` with debounce** for responsive charts

## Resources

- [visx Documentation](https://airbnb.io/visx/docs)
- [visx Gallery](https://airbnb.io/visx/gallery)
- [visx GitHub](https://github.com/airbnb/visx)
- [XYChart Documentation](https://airbnb.io/visx/docs/xychart)

## License

visx is licensed under **MIT License** - free for commercial use.
