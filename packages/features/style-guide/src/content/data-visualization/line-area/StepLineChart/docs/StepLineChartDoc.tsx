import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const StepLineChartDoc: ComponentDoc = {
    name: 'StepLineChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Line chart using step interpolation for discrete value changes. Values remain constant between data points, creating a staircase pattern. Ideal for inventory levels, pricing, or state transitions.',

    whenToUse: [
        'Inventory or stock levels that change in discrete steps',
        'Pricing that remains fixed until changed',
        'State or status transitions (on/off, active/inactive)',
        'Queue lengths or capacity utilization',
        'Any metric that holds constant between explicit changes',
    ],

    whenNotToUse: [
        'Continuous data with smooth transitions - use Line Chart or Spline',
        'When interpolation between points is meaningful',
        'High-frequency data where steps would be too dense to read',
    ],

    usage: `
\`\`\`tsx
import { StepLineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const inventoryData = [
    { date: '2024-01-01', stock: 100 },
    { date: '2024-01-05', stock: 85 },
    { date: '2024-01-08', stock: 150 },
    { date: '2024-01-12', stock: 120 },
    { date: '2024-01-15', stock: 95 },
];

<ChartProvider>
  <StepLineChart
    data={inventoryData}
    xKey="date"
    series={[{ key: 'stock', name: 'Inventory Level', color: 'primary' }]}
    stepType="stepAfter"
    showGrid
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A step line chart displays horizontal segments at each value level with vertical transitions between them. The step type determines when the transition occurs - before, after, or at the midpoint.',
        overflowContent: 'For many rapid changes, steps may become too dense. Consider aggregating data or highlighting only significant changes.',
        internationalization: 'Format dates and values according to locale. Ensure axis labels support localization.',
    },

    formatting: {
        emphasis: 'Use clear step colors that contrast with the grid. Consider showing data points at each step to indicate exact change moments. Highlight significant level changes with annotations.',
        alignment: 'Align step transitions with the grid when possible. Position legends away from dense step areas.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with x-axis and series values.' },
        { name: 'series', type: "SeriesConfig[]", required: true, description: 'Configuration for each step series.' },
        { name: 'xKey', type: "string", default: "'name'", description: 'Property name for X-axis values.' },
        { name: 'stepType', type: "'step' | 'stepBefore' | 'stepAfter'", default: "'stepAfter'", description: 'When the step transition occurs: stepAfter (value holds then changes), stepBefore (changes then holds), step (changes at midpoint).' },
        { name: 'showDots', type: "boolean", default: "false", description: 'Display markers at each data point.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display grid lines.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for series identification.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry animations.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the step chart purpose (e.g., "Step chart showing inventory level changes")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers should announce each step level and when it changes. The discrete nature of steps maps well to sequential announcements.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Enter/Space', action: 'Toggle series visibility in legend' },
        ],
    },
};

export default StepLineChartDoc;
