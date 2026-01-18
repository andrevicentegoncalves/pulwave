import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const LineChartDoc: ComponentDoc = {
    name: 'LineChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Standard chart using lines to connect data points. Supports multiple series, area fill, and legend toggle.',

    whenToUse: [
        'Display trends or changes over time (temporal data)',
        'Show relationships between continuous variables',
        'Compare multiple data series on the same axis scale',
        'Visualize patterns, peaks, and valleys in data progression',
        'Illustrate correlations between two or more metrics over a shared time period',
    ],

    whenNotToUse: [
        'Data has large gaps or missing values - consider using a Scatter Chart instead',
        'Showing part-to-whole relationships - use a Pie Chart or Stacked Bar Chart',
        'Comparing discrete categories without a time dimension - use a Bar Chart',
        'Data points are independent and not sequential - use a Scatter Chart or Dot Plot',
        'Too many series (>7-8 lines) create visual clutter - consider Small Multiples or filtering options',
    ],

    usage: `
\`\`\`tsx
import { LineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
  { month: 'Jan', sales: 4000, revenue: 2400, expenses: 1800 },
  { month: 'Feb', sales: 3000, revenue: 1398, expenses: 2100 },
  { month: 'Mar', sales: 2000, revenue: 9800, expenses: 2290 },
  { month: 'Apr', sales: 2780, revenue: 3908, expenses: 2000 },
  { month: 'May', sales: 1890, revenue: 4800, expenses: 2181 },
  { month: 'Jun', sales: 2390, revenue: 3800, expenses: 2500 },
  { month: 'Jul', sales: 3490, revenue: 4300, expenses: 2100 },
];

<ChartProvider>
  <LineChart
    data={data}
    xKey="month"
    yKeys={['sales', 'revenue']}
    showLegend
    smooth
    showDots
    animate
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A line chart displays data points connected by straight or curved lines. Essential elements include clearly labeled axes, a legend for multiple series, grid lines for value reading, and optional data point markers.',
        overflowContent: 'When displaying many series (>7), consider using interactive filtering, small multiples, or consolidating less important series into an "Other" category. For dense time series, use zoom/pan controls or date range selectors.',
        internationalization: 'Ensure date formats follow locale conventions (MM/DD/YYYY vs DD/MM/YYYY). Numbers should use appropriate thousand separators and decimal marks. Consider right-to-left layouts for RTL languages.',
    },

    formatting: {
        emphasis: 'Use line weight and color saturation to emphasize primary data series. Keep secondary series in muted colors. Use dashed or dotted lines to distinguish projected or estimated values from actual data.',
        alignment: 'Align chart within its container with balanced padding. Position legend to minimize eye travel - top or right for vertical emphasis, bottom for horizontal. Ensure axis labels don\'t overlap or get truncated.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects. Each object represents a point with x-axis and y-axis values.' },
        { name: 'xKey', type: "string", required: true, description: 'Property name in data objects to use for X-axis values (typically time/category).' },
        { name: 'yKeys', type: "string[]", required: true, description: 'Array of property names to plot as separate line series on the Y-axis.' },
        { name: 'variant', type: "'line' | 'area'", default: "'line'", description: 'Visual style of the chart. Line shows only the line, area fills beneath it.' },
        { name: 'smooth', type: "boolean", default: "true", description: 'Enables curved (Bezier) interpolation between points instead of straight lines.' },
        { name: 'showDots', type: "boolean", default: "true", description: 'Renders circular markers at each data point on the lines.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Displays horizontal and vertical grid lines for easier value reading.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Shows legend with series names. Click items to toggle series visibility.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enables entry animations and smooth transitions when data updates.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'colors', type: "string[]", description: 'Custom color array for series. Falls back to theme colors if not provided.' },
        { name: 'strokeWidth', type: "number", default: "2", description: 'Width of the line stroke in pixels.' },
        { name: 'dotSize', type: "number", default: "4", description: 'Radius of data point dots in pixels (when showDots is true).' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image for screen readers' },
            { attribute: 'aria-label', usage: 'Provides accessible name describing the chart purpose (e.g., "Line chart showing monthly sales trends")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table or summary for screen reader users' },
        ],
        screenReader: 'Screen readers announce the chart as an image with descriptive label. Interactive legend items are announced as toggle buttons with their current state (visible/hidden). Consider providing a data table alternative for detailed information access.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to and between legend items' },
            { key: 'Enter/Space', action: 'Toggle visibility of focused legend series' },
            { key: 'Escape', action: 'Clear focus from chart interactive elements' },
        ],
    },
};

export default LineChartDoc;
