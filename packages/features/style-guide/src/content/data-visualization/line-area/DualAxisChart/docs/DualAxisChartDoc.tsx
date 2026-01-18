import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const DualAxisChartDoc: ComponentDoc = {
    name: 'DualAxisChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Chart with two Y-axes to compare data sets with different scales. Useful for correlating two different trends like Price vs Volume, or Revenue vs Growth Rate.',

    whenToUse: [
        'Comparing two metrics with vastly different scales on the same time axis',
        'Correlating price and volume in financial charts',
        'Showing revenue (absolute) alongside growth rate (percentage)',
        'Temperature vs precipitation in weather data',
        'Any two-metric comparison where normalizing to one scale would lose meaning',
    ],

    whenNotToUse: [
        'More than two metrics - dual axes become confusing with more data',
        'Metrics share the same scale - use a standard multi-series Line Chart',
        'No meaningful correlation between the two metrics exists',
        'When precise comparison between the two series is needed',
        'Risk of misleading viewers by manipulating axis scales',
    ],

    usage: `
\`\`\`tsx
import { DualAxisChart, ChartProvider } from '@pulwave/ui/data-visualization';

const financialData = [
    { date: '2024-01', price: 150, volume: 1200000 },
    { date: '2024-02', price: 155, volume: 980000 },
    { date: '2024-03', price: 148, volume: 1450000 },
    { date: '2024-04', price: 162, volume: 1100000 },
    { date: '2024-05', price: 170, volume: 1350000 },
    { date: '2024-06', price: 168, volume: 1280000 },
];

<ChartProvider>
  <DualAxisChart
    data={financialData}
    xKey="date"
    leftKey="price"
    rightKey="volume"
    leftLabel="Price ($)"
    rightLabel="Volume"
    leftType="line"
    rightType="bar"
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A dual-axis chart displays two independent Y-axes - one on the left and one on the right - sharing a common X-axis. Essential elements include clearly labeled and colored axes matching their series, a legend identifying both series, and distinct visual treatment for each series.',
        overflowContent: 'Dual-axis charts should only display two series. If more metrics are needed, consider using small multiples or a dashboard with multiple charts. Ensure tooltips clearly show which value belongs to which axis.',
        internationalization: 'Format all numbers according to locale conventions. Axis labels should be translatable. Consider that axis placement (left/right) may need adjustment for RTL languages.',
    },

    formatting: {
        emphasis: 'Use distinct colors and visual styles for each axis. Consider using a line for one series and bars for the other to clearly differentiate them. Axis labels and colors should match their respective series.',
        alignment: 'Align both Y-axes to start at appropriate baselines (often zero for both). Be cautious about scale manipulation that could create misleading visual correlations. Clearly label both axes with their units.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with values for both axes.' },
        { name: 'xKey', type: "string", required: true, description: 'Property name for the shared X-axis values.' },
        { name: 'leftKey', type: "string", required: true, description: 'Property name for the left Y-axis series.' },
        { name: 'rightKey', type: "string", required: true, description: 'Property name for the right Y-axis series.' },
        { name: 'leftLabel', type: "string", description: 'Label for the left Y-axis (including units).' },
        { name: 'rightLabel', type: "string", description: 'Label for the right Y-axis (including units).' },
        { name: 'leftType', type: "'line' | 'bar' | 'area'", default: "'line'", description: 'Visual representation for the left axis series.' },
        { name: 'rightType', type: "'line' | 'bar' | 'area'", default: "'bar'", description: 'Visual representation for the right axis series.' },
        { name: 'leftColor', type: "string", description: 'Color for the left axis series.' },
        { name: 'rightColor', type: "string", description: 'Color for the right axis series.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend identifying both series.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display grid lines (typically aligned to left axis).' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image for screen readers' },
            { attribute: 'aria-label', usage: 'Describes both metrics being compared (e.g., "Dual axis chart comparing price and volume over time")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers should announce both series with their respective units and scales. Clearly indicate which value belongs to which axis. Provide a data table with both values for complete accessibility.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Enter/Space', action: 'Toggle series visibility in legend' },
        ],
    },
};

export default DualAxisChartDoc;
