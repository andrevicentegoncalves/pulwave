import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const AccumulatedLineChartDoc: ComponentDoc = {
    name: 'AccumulatedLineChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Line chart that displays accumulated/running total values over time. Useful for tracking cumulative growth, revenue, or progress toward goals.',

    whenToUse: [
        'Tracking cumulative totals over time (e.g., year-to-date revenue)',
        'Progress toward a goal or target',
        'Showing running totals of transactions or events',
        'Comparing cumulative performance across periods',
        'Visualizing compound growth or accumulation patterns',
    ],

    whenNotToUse: [
        'Comparing individual period values - use a standard Line Chart',
        'Non-sequential data - accumulated lines require ordered time series',
        'When the raw values matter more than running totals',
        'Multiple series comparison - stacked totals can be confusing',
    ],

    usage: `
\`\`\`tsx
import { AccumulatedLineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 14000 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 25000 },
];

<ChartProvider>
  <AccumulatedLineChart
    data={revenueData}
    xKey="month"
    valueKey="revenue"
    showMarkers
    showGrid
    targetValue={100000}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'An accumulated line chart displays a running total that increases (or decreases) over time. Essential elements include clearly labeled axes with cumulative values, optional target lines, and tooltips showing both the period value and running total.',
        overflowContent: 'For long time series, consider date range filtering or zoom controls. Ensure the Y-axis scale accommodates the final accumulated value with room for visual breathing space.',
        internationalization: 'Format numbers and dates according to locale conventions. Large accumulated values should use appropriate abbreviations (K, M, B) with locale-specific formatting.',
    },

    formatting: {
        emphasis: 'The accumulated line should be clearly visible with a distinct color. Consider showing both the accumulated value and period-over-period change. Target lines should be dashed or dotted to distinguish from the main line.',
        alignment: 'Start the Y-axis at zero to accurately represent cumulative magnitude. Position annotations for milestones or targets clearly without obscuring the line.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of sequential time series data objects.' },
        { name: 'xKey', type: "string", default: "'name'", description: 'Property name for X-axis values (typically dates or periods).' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for the values to accumulate.' },
        { name: 'showMarkers', type: "boolean", default: "true", description: 'Display markers at each data point.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display grid lines for easier value reading.' },
        { name: 'targetValue', type: "number", description: 'Optional target line value to display.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'color', type: "string", description: 'Color for the accumulated line.' },
        { name: 'smooth', type: "boolean", default: "true", description: 'Enable curved line interpolation.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry animations.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image for screen readers' },
            { attribute: 'aria-label', usage: 'Describes the cumulative chart purpose (e.g., "Accumulated revenue chart showing year-to-date totals")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers announce the chart type and current accumulated total. Individual data points can be described with both period value and running total. Consider providing a table showing both raw and accumulated values.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart interactive elements' },
            { key: 'Arrow keys', action: 'Navigate between data points (when supported)' },
        ],
    },
};

export default AccumulatedLineChartDoc;
