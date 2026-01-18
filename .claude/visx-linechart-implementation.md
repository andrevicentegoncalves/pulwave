# visx LineChart Implementation - Complete

## Summary

Successfully implemented a **complete visx LineChart** with area variant support. The toggle now properly switches between Recharts and visx implementations for LineChart.

---

## What Was Built

### 1. **visx LineChart Implementation**

**Location**: `packages/shared/ui/data-visualization/charts/visx/cartesian/LineChart/`

**Files Created**:
- `LineChart.tsx` - Full visx implementation using `@visx/xychart`
- `types.ts` - Same props interface as Recharts LineChart
- `index.ts` - Barrel export
- `styles/_index.scss` - Styles

**Key Features**:
- ✅ Uses visx primitives (`XYChart`, `LineSeries`, `AreaSeries`, `GlyphSeries`, `Axis`, `Grid`, `Tooltip`)
- ✅ Same props API as Recharts LineChart (no breaking changes)
- ✅ Supports line and area variants
- ✅ Smooth/linear curve options
- ✅ Optional data point dots via `GlyphSeries`
- ✅ Multiple series support
- ✅ Grid, axes, tooltip, legend
- ✅ Semantic colors from design system
- ✅ Responsive sizing

### 2. **Updated VISXAdapter**

**File**: `packages/shared/ui/data-visualization/providers/adapters/visx/VISXAdapter.ts`

**Changes**:
```tsx
// Before: Used placeholder component
import { VISXLineChart } from './components/LineChart';  // Empty stub

// After: Uses real visx implementation
import { LineChart } from '../../../charts/visx/cartesian/LineChart';

export const VISXAdapter: ChartLibraryComponents = {
    LineChart,  // Now points to real visx component
    // ...
};
```

### 3. **Updated visx/cartesian Index**

**File**: `packages/shared/ui/data-visualization/charts/visx/cartesian/index.ts`

**Changes**:
```tsx
export { BarChart } from './BarChart';
export type { BarChartProps } from './BarChart';

export { LineChart } from './LineChart';  // Added
export type { LineChartProps } from './LineChart';  // Added
```

### 4. **Updated LineChart Demo**

**File**: `packages/features/style-guide/src/content/data-visualization/line-area/LineChart/demos/LineChartBasicDemo.tsx`

**Changes**:
```tsx
// Before: Direct chart rendering
<DemoCard>
    <LineChart data={data} ... />
</DemoCard>

// After: Wrapped in ChartLibraryDemo for toggle support
<DemoCard>
    <ChartLibraryDemo>
        <LineChart data={data} ... />
    </ChartLibraryDemo>
</DemoCard>
```

---

## Implementation Details

### visx LineChart Architecture

```tsx
<XYChart>
    <Grid />              {/* Grid lines */}
    <Axis />              {/* X and Y axes */}

    {/* For each series: */}
    <LineSeries />        {/* or AreaSeries for variant="area" */}
    <GlyphSeries />       {/* Dots (if showDots=true) */}

    <Tooltip />           {/* Interactive tooltip */}
</XYChart>

<LegendOrdinal />        {/* Legend (if showLegend=true) */}
```

### Key Differences from BarChart

1. **Series Components**:
   - BarChart uses `BarSeries`
   - LineChart uses `LineSeries` or `AreaSeries`

2. **Dots/Glyphs**:
   - LineChart adds `GlyphSeries` for data point markers
   - BarChart doesn't need glyphs

3. **Curve Type**:
   - LineChart supports smooth (monotoneX) vs linear interpolation
   - BarChart doesn't have curve options

4. **Area Fill**:
   - LineChart has area variant with gradient fill
   - BarChart has solid fills

---

## How It Works

### Toggle Flow

```
User clicks toggle → StickyLibraryToggle
    ↓
Updates library state → ChartLibraryContext
    ↓
All ChartLibraryDemo components re-render
    ↓
ChartProvider receives new adapter (key={library} forces remount)
    ↓
Charts render with new library:
    - library === 'recharts' → uses charts/cartesian/LineChart
    - library === 'visx' → uses charts/visx/cartesian/LineChart
```

---

## Testing

### Manual Test Steps

1. Navigate to Style Guide → Data Visualization → Line & Area → LineChart
2. Observe sticky toggle at top (Recharts selected by default)
3. Click toggle switch to visx
4. **Expected**: Line chart re-renders using visx implementation
5. **Verify**: Different visual appearance (visx styling)
6. Switch back to Recharts
7. **Expected**: Chart switches back to Recharts implementation

### Visual Differences

**Recharts**:
- SVG class: `recharts-surface`
- Recharts-specific styling
- Recharts animation

**visx**:
- Different SVG structure (visx primitives)
- visx-specific styling
- visx animation
- Crisper rendering

---

## Completed Charts

### Implemented (Full visx support)
- ✅ **BarChart** - visx implementation complete
- ✅ **LineChart** - visx implementation complete

### Not Implemented (Still placeholders)
- ❌ AreaChart (separate from LineChart variant)
- ❌ ScatterChart
- ❌ PieChart
- ❌ RadarChart
- ❌ All other chart types

**Behavior**: When toggling to visx for unimplemented charts, they will render nothing (placeholder components). Only BarChart and LineChart show visx versions.

---

## Props Interface Compatibility

The visx LineChart accepts the exact same props as Recharts LineChart:

```tsx
interface LineChartProps {
    data: any[];
    xKey: string;
    yKeys: string[];
    yKeyNames?: Record<string, string>;
    width?: string | number;
    height?: number;
    variant?: 'line' | 'area';
    smooth?: boolean;
    showDots?: boolean;
    strokeWidth?: number;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    legendPosition?: 'top' | 'bottom';
    colors?: string[];
    animate?: boolean;
    xAxisFormatter?: (value: any) => string;
    yAxisFormatter?: (value: any) => string;
    // ... other props
}
```

This ensures **zero breaking changes** when switching libraries.

---

## Code Examples

### Using visx LineChart

```tsx
import { LineChart } from '@pulwave/ui/data-visualization';

// In style guide demo with library toggle
<ChartLibraryDemo>
  <LineChart
    data={[
      { month: 'Jan', sales: 400, revenue: 300 },
      { month: 'Feb', sales: 300, revenue: 450 },
      { month: 'Mar', sales: 600, revenue: 520 },
    ]}
    xKey="month"
    yKeys={['sales', 'revenue']}
    variant="line"
    smooth={true}
    showDots={true}
    height={300}
  />
</ChartLibraryDemo>
```

When toggle is set to **visx**:
- Uses: `charts/visx/cartesian/LineChart/LineChart.tsx`
- Renders with: `@visx/xychart` primitives (LineSeries, GlyphSeries)

When toggle is set to **Recharts**:
- Uses: `charts/cartesian/LineChart/LineChart.tsx`
- Renders with: Recharts Line components

### Area Variant

```tsx
<LineChart
    data={data}
    xKey="month"
    yKeys={['value']}
    variant="area"  // Switches to AreaSeries in visx
    height={300}
/>
```

---

## Next Steps

### Implement More Charts

To add visx support for other charts, follow the LineChart pattern:

1. **Create chart in visx folder**:
   ```
   charts/visx/[category]/[ChartName]/
   ├── [ChartName].tsx
   ├── types.ts
   ├── index.ts
   └── styles/_index.scss
   ```

2. **Use appropriate visx primitives**:
   - AreaChart → `AreaSeries` (standalone, not LineChart variant)
   - ScatterChart → `GlyphSeries`
   - PieChart → visx `Pie` from `@visx/shape`
   - RadarChart → `@visx/radar` primitives

3. **Update VISXAdapter.ts**:
   ```tsx
   import { AreaChart } from '../../../charts/visx/cartesian/AreaChart';
   export const VISXAdapter: ChartLibraryComponents = {
       AreaChart,
       // ...
   };
   ```

4. **Update demo components** to use `ChartLibraryDemo` wrapper

### Priority Order

1. **AreaChart** - Similar to LineChart but standalone
2. **ScatterChart** - Uses `GlyphSeries` with scatter layout
3. **PieChart** - Different primitives (`@visx/shape`)
4. **RadarChart** - Uses `@visx/radar`

---

## Files Modified/Created

### Created
```
charts/visx/cartesian/LineChart/
├── LineChart.tsx                # NEW - visx implementation
├── types.ts                     # NEW
├── index.ts                     # NEW
└── styles/_index.scss           # NEW
```

### Modified
```
charts/visx/cartesian/index.ts                              # Added LineChart export
providers/adapters/visx/VISXAdapter.ts                      # Uses real LineChart
features/style-guide/src/content/data-visualization/
└── line-area/LineChart/demos/LineChartBasicDemo.tsx        # Wrapped in ChartLibraryDemo
```

---

## Benefits

### For Users
- ✅ **Real comparison** between Recharts and visx LineChart
- ✅ **Smooth switching** with key-based remounting
- ✅ **Consistent UI** across both libraries
- ✅ **Visual differences** clearly visible

### For Developers
- ✅ **No breaking changes** to existing code
- ✅ **Incremental implementation** - add charts one by one
- ✅ **Clean separation** - each library has its own folder
- ✅ **Same props interface** - easy to maintain

### For Maintainability
- ✅ **Clear structure** - visx/ folder mirrors cartesian/radial/
- ✅ **Type safety** - Full TypeScript support
- ✅ **Adapter pattern** - Easy to add more libraries later
- ✅ **Documentation** - This file + inline comments

---

**Implementation Status**: ✅ Complete
**Testing Status**: ⏳ Ready for manual testing
**Documentation**: ✅ Complete

*Last updated: 2026-01-18*
