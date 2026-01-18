# SVG Tooltip System Migration - Remaining Charts

## Completed Charts ✅
1. VennDiagram
2. SpiralPlot
3. NestedPieChart
4. ParallelCoordinatesPlot

## Charts Remaining to Update

### Pattern for SVG Charts:
For each chart, follow these steps:

1. **Add imports** (at top of file):
```typescript
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
```

2. **Add hook** (after other hooks):
```typescript
const { tooltip, getHandlers } = useSVGTooltip();
```

3. **Replace `<title>` with handlers** (on the interactive SVG element):
   - Remove: `<title>Tooltip text</title>`
   - Add: `{...getHandlers('Tooltip text')}`

4. **Add SVGTooltip component** (before closing container):
```typescript
<SVGTooltip tooltip={tooltip} />
```

### Charts to Update:

#### 5. ChordDiagram
- **File**: `charts/hierarchical/ChordDiagram/ChordDiagram.tsx`
- **Line 158**: `<title>{`${ribbon.from} → ${ribbon.to}: ${ribbon.value}`}</title>`
- **Location**: Before `</svg>` at line ~199

#### 6. PyramidChart
- **File**: `charts/hierarchical/PyramidChart/PyramidChart.tsx`
- **Line 105**: `<title>{`${segment.name}: ${valueFormatter(segment.value)} (${segment.percentage}%)`}</title>`
- **Location**: Before `</svg>` at line ~141

#### 7. MekkoChart
- **File**: `charts/hierarchical/MekkoChart/MekkoChart.tsx`
- **Line 146**: `<title>{`${bar.name} - ${seg.name}: ${valueFormatter(seg.value)} (${seg.percentage}%)`}</title>`
- **Location**: Before `</svg>` at line ~172

#### 8. SunburstChart
- **File**: `charts/hierarchical/SunburstChart/SunburstChart.tsx`
- **Line 149**: `<title>{`${segment.path}: ${segment.value.toLocaleString()}`}</title>`
- **Location**: Before `</svg>` at line ~197

#### 9. FlowChart
- **File**: `charts/hierarchical/FlowChart/FlowChart.tsx`
- **Line 205**: `<title>{node.description}</title>`
- **Location**: Before `</svg>` at line ~210

#### 10. RadialBarChart
- **File**: `charts/radial/RadialBarChart/RadialBarChart.tsx`
- **Line 150**: `<title>{`${bar.name}: ${valueFormatter(bar.value)}`}</title>`
- **Location**: Inside ChartShell, before `</div>` at line ~199

#### 11. NetworkDiagram
- **File**: `charts/hierarchical/NetworkDiagram/NetworkDiagram.tsx`
- **Line 190**: `<title>{`${node.label || node.id}${node.group ? ` (Group ${node.group})` : ''} - Drag to move`}</title>`
- **Location**: Before `</svg>` at line ~194

#### 12. BoxPlotChart (2 instances)
- **File**: `charts/statistical/BoxPlotChart/BoxPlotChart.tsx`
- **Line 170**: `<title>{`${item[categoryKey]}: Median ${valueFormatter(item.median)}`}</title>` (vertical)
- **Line 219**: `<title>{`${item[categoryKey]}: Median ${valueFormatter(item.median)}`}</title>` (horizontal)
- **Location**: Before `</svg>` at line ~223

#### 13. BubbleMapChart
- **File**: `charts/geo/BubbleMapChart/BubbleMapChart.tsx`
- **Line 116**: `<title>{`${bubble.countryName}: ${valueFormatter(bubble[valueKey as keyof typeof bubble])}`}</title>`
- **Location**: Before `</svg>` at line ~130

#### 14. PolarAreaChart
- **File**: `charts/radial/PolarAreaChart/PolarAreaChart.tsx`
- **Line 129**: `<title>{`${sector.name}: ${valueFormatter(sector.value)}`}</title>`
- **Location**: Before `</svg>` at line ~148

#### 15. TimelineChart
- **File**: `charts/timeline/TimelineChart/TimelineChart.tsx`
- **Line 178-180**: `<title>{`${event.title}\n${event.start || event.date}${event.end && event.end !== event.start ? ` → ${event.end}` : ''}`}</title>`
- **Location**: Before `</svg>` at line ~210

### HTML Title Attributes (Different Pattern):

#### 16. WaffleChart
- **File**: `charts/compact/WaffleChart/WaffleChart.tsx`
- **Line 94**: `title={`${cell.name}: ${valueFormatter(cell.value)}`}` on `<div>`
- **Solution**: Add handlers to the div element and remove title attribute
```typescript
<div
    {...getHandlers(`${cell.name}: ${valueFormatter(cell.value)}`)}
    // Remove: title={...}
/>
```
- **Location**: Inside ChartShell, before `</ChartShell>` at line ~109

#### 17. PictogramChart
- **File**: `charts/compact/PictogramChart/PictogramChart.tsx`
- **Line 115**: `title={item.name}` on `<span>`
- **Solution**: Add handlers to the span element and remove title attribute
```typescript
<span
    {...getHandlers(item.name)}
    // Remove: title={...}
/>
```
- **Location**: Inside ChartShell, before `</ChartShell>` at line ~131

## Notes:
- All files need the same imports added at the top
- All files need the hook added after existing hooks
- SVG tooltips: spread handlers on parent group, remove `<title>` element, add `<SVGTooltip>` component
- HTML tooltips (Waffle/Pictogram): spread handlers on element, remove title attribute, add `<SVGTooltip>` component
- Make sure SVGTooltip is added AFTER the svg/chart content but BEFORE closing the container
