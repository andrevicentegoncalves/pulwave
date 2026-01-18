import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const HeatmapChartDoc: ComponentDoc = {
    name: 'HeatmapChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Grid visualization where cell color intensity represents data values. Excellent for spotting patterns across two categorical dimensions, displaying correlation matrices, and showing time-based activity patterns.',

    whenToUse: [
        'Correlation matrices in statistics/ML',
        'Activity patterns over time (GitHub contributions, sales by hour/day)',
        'Geographic density without a map',
        'Feature comparison matrices',
        'Finding hotspots in two-dimensional data',
    ],

    whenNotToUse: [
        'Precise value comparison needed - hard to read exact values from colors',
        'Few data points - use bar or scatter chart',
        'Continuous data on both axes - use contour plot',
        'Geographic data - use choropleth map',
        'When color blindness accommodation is critical without redundant encoding',
    ],

    usage: `
\`\`\`tsx
import { HeatmapChart, ChartProvider } from '@pulwave/ui/data-visualization';

const activityData = [
    { day: 'Mon', hour: '9AM', value: 45 },
    { day: 'Mon', hour: '10AM', value: 72 },
    { day: 'Mon', hour: '11AM', value: 88 },
    { day: 'Tue', hour: '9AM', value: 32 },
    { day: 'Tue', hour: '10AM', value: 65 },
    { day: 'Tue', hour: '11AM', value: 91 },
    // ... more combinations
];

<ChartProvider>
  <HeatmapChart
    data={activityData}
    xKey="hour"
    yKey="day"
    valueKey="value"
    colorScale="sequential"
    showValues
    cellRadius={4}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A heatmap displays cells in a grid where color encodes value. Essential elements include the grid, axis labels, color legend, and optional cell values.',
        overflowContent: 'Works well up to ~50x50 cells. Larger matrices benefit from clustering or aggregation. Consider zooming for detailed exploration.',
        internationalization: 'Format values according to locale. Axis labels should be translatable. Color scales work across languages.',
    },

    formatting: {
        emphasis: 'Sequential scales (light to dark) for single-direction data. Diverging scales (red-white-blue) for data with meaningful midpoint. Ensure color blind-friendly palettes.',
        alignment: 'Labels on edges. Consider rotating X-axis labels if long. Cell size should be consistent.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of objects with x, y, and value properties.' },
        { name: 'xKey', type: "string", default: "'x'", description: 'Property name for X-axis categories.' },
        { name: 'yKey', type: "string", default: "'y'", description: 'Property name for Y-axis categories.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for cell intensity value.' },
        { name: 'colorScale', type: "'sequential' | 'diverging'", default: "'sequential'", description: 'Color scale type.' },
        { name: 'showValues', type: "boolean", default: "false", description: 'Display numeric values in cells.' },
        { name: 'cellRadius', type: "number", default: "0", description: 'Border radius for cells (0 for square).' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for the scale.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the pattern (e.g., "Heatmap showing activity by day and hour, highest on Tuesday 11AM")' },
            { attribute: 'aria-describedby', usage: 'Links to data table' },
        ],
        screenReader: 'Screen readers announce each cell with x-position, y-position, and value. Summarize overall patterns. Provide tabular data alternative.',
        keyboard: [
            { key: 'Arrow Keys', action: 'Navigate between cells' },
            { key: 'Tab', action: 'Move to next interactive element' },
        ],
    },
};

export default HeatmapChartDoc;
