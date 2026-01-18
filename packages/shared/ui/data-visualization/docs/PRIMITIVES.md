# Chart Primitives & Common Components

This document provides a comprehensive reference for the chart primitives, utilities, hooks, and common components available in the `@pulwave/ui/data-visualization` package.

---

## Quick Reference

| Type | Name | Purpose |
|------|------|---------|
| **Utility** | `getAxisTickStyle()` | Consistent tick styling from theme |
| **Utility** | `getAxisDefaults()` | Default axis configuration |
| **Utility** | `getChartMargins()` | Standardized chart margins |
| **Component** | `<ChartGrid />` | Themed CartesianGrid wrapper |
| **Component** | `<ChartAxisTick />` | Custom tick with truncation |
| **Component** | `<ChartTooltip />` | Standardized tooltip |
| **Component** | `<ChartLegend />` | Standardized legend |
| **Hook** | `useSeriesVisibility()` | Legend toggle state management |
| **Hook** | `useChartTheme()` | Access chart theme colors |
| **Provider** | `<ChartProvider />` | Theme context for charts |

---

## Utilities

### `getAxisTickStyle(semanticColors)`

Returns consistent tick styling based on the current theme's semantic colors.

```tsx
import { getAxisTickStyle } from './utils/chartDefaults';

const tickStyle = getAxisTickStyle(semanticColors);
// Returns: { fill: 'var(--color-text-secondary)', fontSize: 12 }

<XAxis tick={tickStyle} />
<YAxis tick={tickStyle} />
```

**Parameters:**
- `semanticColors: SemanticColors` - Theme colors from `useChartContext()`

**Returns:**
```ts
{
  fill: string;    // Text color for tick labels
  fontSize: number; // Font size (12px)
}
```

---

### `getAxisDefaults(semanticColors)`

Returns default axis configuration including tick styling and axis line colors.

```tsx
import { getAxisDefaults } from './utils/chartDefaults';

const axisDefaults = getAxisDefaults(semanticColors);

<XAxis {...axisDefaults} />
```

**Returns:**
```ts
{
  tick: { fill: string; fontSize: number };
  axisLine: { stroke: string };
  tickLine: { stroke: string };
}
```

---

### `getChartMargins(options?)`

Returns standardized chart margins with optional variants for horizontal layouts or dual axes.

```tsx
import { getChartMargins } from './utils/chartDefaults';

// Default margins
const margins = getChartMargins();
// { top: 20, right: 30, left: 20, bottom: 5 }

// Horizontal layout (rotated)
const hMargins = getChartMargins({ horizontal: true });
// { top: 20, right: 30, left: 100, bottom: 5 }

// Dual Y-axes
const dualMargins = getChartMargins({ dualAxis: true });
// { top: 20, right: 60, left: 20, bottom: 5 }

// With legend space
const withLegend = getChartMargins({ showLegend: true });
// { top: 20, right: 30, left: 20, bottom: 40 }
```

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `horizontal` | boolean | false | Extra left margin for horizontal bars |
| `dualAxis` | boolean | false | Extra right margin for second Y-axis |
| `showLegend` | boolean | false | Extra bottom margin for legend |

---

## Components

### `<ChartGrid />`

A themed wrapper around Recharts' `CartesianGrid` that automatically uses design system colors.

```tsx
import { ChartGrid } from './primitives/ChartGrid';

<ComposedChart>
  <ChartGrid />
  {/* ... */}
</ComposedChart>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `strokeDasharray` | string | "3 3" | Grid line pattern |
| `horizontal` | boolean | true | Show horizontal lines |
| `vertical` | boolean | false | Show vertical lines |

---

### `<ChartAxisTick />`

Custom axis tick component with text truncation support for long labels.

```tsx
import { ChartAxisTick } from './primitives/ChartAxisTick';

<XAxis 
  tick={(props) => (
    <ChartAxisTick {...props} maxLength={15} />
  )} 
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | number | 20 | Max characters before truncation |
| `angle` | number | 0 | Label rotation angle |
| `textAnchor` | string | "middle" | Text alignment |

---

### `<ChartTooltip />`

Standardized tooltip component with theme-aware styling.

```tsx
import { ChartTooltip } from './primitives/ChartTooltip';

<ComposedChart>
  <Tooltip content={<ChartTooltip />} />
</ComposedChart>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `formatter` | function | Custom value formatter |
| `labelFormatter` | function | Custom label formatter |

---

### `<ChartLegend />`

Interactive legend component with series visibility toggle support.

```tsx
import { ChartLegend } from './primitives/ChartLegend';

<ComposedChart>
  <Legend content={<ChartLegend onClick={handleToggle} />} />
</ComposedChart>
```

---

## Hooks

### `useSeriesVisibility(initialKeys)`

Manages visibility state for chart series, enabling interactive legend toggles.

```tsx
import { useSeriesVisibility } from './hooks/useSeriesVisibility';

const MyChart = ({ data, series }) => {
  const seriesKeys = series.map(s => s.key);
  const { hiddenSeries, toggleSeries, isVisible } = useSeriesVisibility(seriesKeys);

  return (
    <ComposedChart>
      {series.map(s => (
        isVisible(s.key) && <Line key={s.key} dataKey={s.key} />
      ))}
      <Legend 
        onClick={(e) => toggleSeries(e.dataKey)} 
      />
    </ComposedChart>
  );
};
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `hiddenSeries` | Set<string> | Currently hidden series keys |
| `toggleSeries` | (key: string) => void | Toggle a series visibility |
| `isVisible` | (key: string) => boolean | Check if series is visible |
| `showAll` | () => void | Show all series |
| `hideAll` | () => void | Hide all series |

---

### `useChartTheme()`

Access the current chart theme configuration including colors and grid styles.

```tsx
import { useChartTheme } from './hooks/useChartTheme';

const { gridStyle, colors, semanticColors } = useChartTheme();
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `gridStyle` | object | Grid stroke color and opacity |
| `colors` | string[] | Chart color palette |
| `semanticColors` | object | Theme semantic colors |

---

### `useChartContext()`

Access the chart context including semantic colors and configuration.

```tsx
import { useChartContext } from './providers/ChartProvider';

const { semanticColors, config } = useChartContext();
```

---

## Provider

### `<ChartProvider />`

Wraps chart components to provide theme context and configuration.

```tsx
import { ChartProvider } from '@pulwave/ui/data-visualization';

<ChartProvider>
  <LineChart data={data} />
</ChartProvider>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Chart components |
| `config` | ChartConfig | Optional configuration override |

---

## Usage Pattern

The recommended pattern for building charts with primitives:

```tsx
import {
  ChartProvider,
  useChartContext,
  useChartTheme,
  useSeriesVisibility,
} from '@pulwave/ui/data-visualization';
import { getAxisTickStyle, getChartMargins } from './utils/chartDefaults';

export const MyChart = ({ data, series }) => {
  const { semanticColors } = useChartContext();
  const { gridStyle } = useChartTheme();
  const { isVisible, toggleSeries } = useSeriesVisibility(series.map(s => s.key));
  
  const tickStyle = getAxisTickStyle(semanticColors);
  const margins = getChartMargins({ showLegend: true });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data} margin={margins}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="name" tick={tickStyle} />
        <YAxis tick={tickStyle} />
        <Tooltip content={<ChartTooltip />} />
        <Legend onClick={(e) => toggleSeries(e.dataKey)} />
        
        {series.map(s => (
          isVisible(s.key) && (
            <Line key={s.key} dataKey={s.key} stroke={s.color} />
          )
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
```

---

## File Structure

```
packages/ui/data-visualization/
├── components/          # 56+ chart components
├── hooks/
│   ├── useChartTheme.ts
│   └── useSeriesVisibility.ts
├── primitives/
│   ├── ChartAxisTick.tsx
│   ├── ChartGrid.tsx
│   ├── ChartLegend.tsx
│   └── ChartTooltip.tsx
├── providers/
│   └── ChartProvider.tsx
├── utils/
│   └── chartDefaults.ts
├── index.ts
└── PRIMITIVES.md        # This file
```
