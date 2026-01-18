# Chart Library Adapters - Usage Guide

The data visualization package supports multiple charting libraries through an adapter pattern. This allows you to switch between Recharts and visx (or add custom libraries) without changing your chart components.

## Available Adapters

| Adapter | Library | Best For | License |
|---------|---------|----------|---------|
| **RechartsAdapter** (default) | [Recharts](https://recharts.org/) | Standard charts, rapid development | MIT |
| **VISXAdapter** | [visx](https://airbnb.io/visx/) | Custom visualizations, performance | MIT |

## Quick Start

### Using Recharts (Default)

```tsx
import { ChartProvider } from '@pulwave/ui/data-visualization';

function App() {
  return (
    <ChartProvider>
      {/* All charts use Recharts by default */}
      <LineChart data={data}>
        <Line dataKey="value" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </ChartProvider>
  );
}
```

### Switching to visx

```tsx
import { ChartProvider } from '@pulwave/ui/data-visualization';
import { VISXAdapter } from '@pulwave/ui/data-visualization/providers/adapters';

function App() {
  return (
    <ChartProvider adapter={VISXAdapter}>
      {/* All charts now use visx */}
      <LineChart data={data}>
        <Line dataKey="value" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </ChartProvider>
  );
}
```

## Per-Chart Adapter Selection

You can use different adapters for different parts of your app:

```tsx
import { ChartProvider } from '@pulwave/ui/data-visualization';
import { VISXAdapter } from '@pulwave/ui/data-visualization/providers/adapters';

function Dashboard() {
  return (
    <div>
      {/* Standard charts with Recharts */}
      <ChartProvider>
        <BarChart data={salesData}>
          <Bar dataKey="sales" />
        </BarChart>
      </ChartProvider>

      {/* Custom visualization with visx */}
      <ChartProvider adapter={VISXAdapter}>
        <CustomTimelineChart data={timelineData} />
      </ChartProvider>
    </div>
  );
}
```

## Using visx Primitives Directly

For maximum power and flexibility, use visx primitives directly:

```tsx
import { XYChart, LineSeries, Axis, Grid, Tooltip } from '@visx/xychart';
import { useChartContext } from '@pulwave/ui/data-visualization';

function CustomChart({ data }) {
  const { semanticColors, getColor } = useChartContext();

  return (
    <XYChart
      width={600}
      height={400}
      xScale={{ type: 'time' }}
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
        tickLabelProps={() => ({
          fill: semanticColors.text,
          fontSize: 12,
        })}
      />
      <Axis
        orientation="left"
        stroke={semanticColors.axis}
      />
      <LineSeries
        dataKey="revenue"
        data={data}
        xAccessor={(d) => new Date(d.date)}
        yAccessor={(d) => d.revenue}
        stroke={getColor(0)}
        strokeWidth={2}
      />
      <Tooltip
        snapToDataX
        showVerticalCrosshair
        renderTooltip={({ tooltipData }) => (
          <div style={{
            background: semanticColors.backgroundElevated,
            color: semanticColors.text,
            padding: '8px',
            borderRadius: '4px',
          }}>
            Revenue: ${tooltipData.nearestDatum.datum.revenue.toLocaleString()}
          </div>
        )}
      />
    </XYChart>
  );
}
```

## Decision Matrix

### When to Use Recharts

✅ **Use Recharts when:**
- Building standard charts (line, bar, pie, area)
- Rapid prototyping
- Team prefers declarative API
- Don't need deep customization
- Working with simple datasets (<10k points)

### When to Use visx

✅ **Use visx when:**
- Building custom visualizations
- Need maximum performance (>10k data points)
- Require fine-grained control
- Creating unique, branded designs
- Want tree-shakeable bundles
- Team comfortable with lower-level APIs

### When to Use visx Primitives Directly

✅ **Use visx primitives when:**
- Adapter doesn't provide needed functionality
- Building completely custom chart types
- Need access to D3 scales and utilities
- Want to compose complex interactions
- Optimizing for bundle size

## Accessing Chart Context

Both adapters have access to the same theme and configuration:

```tsx
import { useChartContext } from '@pulwave/ui/data-visualization';

function CustomComponent() {
  const {
    semanticColors,    // Theme colors
    getColor,          // Get palette color by index
    getColors,         // Get multiple colors
    typography,        // Font settings
    spacing,           // Spacing scale
    config,            // Chart configuration
    theme,             // 'light' | 'dark' | 'auto'
  } = useChartContext();

  return (
    <div style={{ color: semanticColors.text }}>
      Custom component with theme
    </div>
  );
}
```

## Configuration Options

### ChartProvider Props

```tsx
interface ChartProviderProps {
  children: ReactNode;

  /** Theme mode */
  theme?: 'light' | 'dark' | 'auto';

  /** Color scheme for data series */
  colorScheme?: 'categorical' | 'sequential' | 'diverging' | 'success' | 'warning' | 'error';

  /** Chart configuration */
  config?: {
    animate?: boolean;
    animationDuration?: number;
    animationEasing?: string;
    responsive?: boolean;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
  };

  /** Chart library adapter */
  adapter?: ChartLibraryComponents;
}
```

### Example with Configuration

```tsx
<ChartProvider
  theme="dark"
  colorScheme="diverging"
  config={{
    animate: true,
    animationDuration: 600,
    showGrid: true,
    showTooltip: true,
  }}
  adapter={VISXAdapter}
>
  <MyCharts />
</ChartProvider>
```

## Performance Comparison

Based on real-world usage:

| Scenario | Recharts | visx | Winner |
|----------|----------|------|--------|
| Standard bar chart (100 points) | ⚡ Fast | ⚡ Fast | Tie |
| Line chart (1k points) | ⚡ Fast | ⚡⚡ Faster | visx |
| Multiple charts on page | ⚡ Good | ⚡⚡ Better | visx |
| Large dataset (10k+ points) | 🐌 Slow | ⚡⚡ Fast | visx |
| Development speed | ⚡⚡⚡ Fastest | ⚡ Slower | Recharts |
| Bundle size | 📦 Larger | 📦 Smaller* | visx |

*With tree-shaking

## Migration Strategy

### Progressive Migration to visx

```tsx
// Step 1: Start with adapter (no code change)
<ChartProvider adapter={VISXAdapter}>
  <LineChart>...</LineChart>
</ChartProvider>

// Step 2: Replace with visx XYChart
<XYChart>
  <LineSeries />
  <Axis orientation="bottom" />
</XYChart>

// Step 3: Full custom implementation
<svg>
  <g transform={...}>
    <path d={linePath} />
  </g>
</svg>
```

### Keeping Both Libraries

```tsx
// Use Recharts for most charts
import { LineChart, BarChart } from 'recharts';

// Use visx for custom visualizations
import { XYChart, LineSeries } from '@visx/xychart';

function Dashboard() {
  return (
    <>
      {/* Standard charts */}
      <ChartProvider>
        <LineChart data={data}>...</LineChart>
      </ChartProvider>

      {/* Custom viz */}
      <ChartProvider adapter={VISXAdapter}>
        <CustomHeatmap />
      </ChartProvider>
    </>
  );
}
```

## TypeScript Support

Both adapters are fully typed:

```tsx
import type { ChartLibraryComponents } from '@pulwave/ui/data-visualization/providers';

// Create custom adapter
const MyAdapter: ChartLibraryComponents = {
  ResponsiveContainer: MyContainer,
  LineChart: MyLineChart,
  // ... implement all required components
};
```

## Resources

### Recharts
- [Documentation](https://recharts.org/en-US/)
- [Examples](https://recharts.org/en-US/examples)
- [API Reference](https://recharts.org/en-US/api)

### visx
- [Documentation](https://airbnb.io/visx/docs)
- [Gallery](https://airbnb.io/visx/gallery)
- [GitHub](https://github.com/airbnb/visx)
- [XYChart Guide](https://airbnb.io/visx/docs/xychart)

## Troubleshooting

### React Version Conflict

If you see peer dependency warnings with visx and React 19:

```bash
npm install @visx/xychart @visx/responsive --legacy-peer-deps
```

visx officially supports React 16-18, but works with React 19 (used in Pulwave).

### Type Errors

Make sure to import types from the correct location:

```tsx
// ✅ Correct
import type { ChartLibraryComponents } from '@pulwave/ui/data-visualization/providers';

// ❌ Wrong
import type { ChartLibraryComponents } from 'recharts';
```

### Missing visx Components

The visx adapter uses placeholder components for some features. For full functionality, use visx primitives directly:

```tsx
// Instead of adapter
<Tooltip />

// Use visx directly
<Tooltip
  snapToDataX
  renderTooltip={...}
/>
```
