import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const AreaChartDoc: ComponentDoc = {
    name: 'AreaChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Line chart with filled area below the line. Supports stacking and percentage modes.',

    whenToUse: [
        'Emphasize the magnitude or volume of change over time',
        'Show cumulative totals across multiple categories (stacked mode)',
        'Visualize part-to-whole relationships over time (percentage stacking)',
        'Display data where the quantity or volume is as important as the trend',
        'Highlight differences between multiple overlapping series',
    ],

    whenNotToUse: [
        'Too many overlapping series obscure each other (>4-5) - use Line Chart or Small Multiples',
        'Precise values need to be read at specific points - use a Line Chart with markers',
        'Comparing discrete categories without time - use a Stacked Bar Chart',
        'Data has negative values in stacked mode (stacking breaks) - use standard Line Chart',
        'Baseline is not zero (filled area misleads perception) - use Line Chart instead',
    ],

    usage: `
\`\`\`tsx
import { AreaChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
  { quarter: 'Q1', revenue: 12000, expenses: 8000, profit: 4000 },
  { quarter: 'Q2', revenue: 15000, expenses: 9000, profit: 6000 },
  { quarter: 'Q3', revenue: 18000, expenses: 11000, profit: 7000 },
  { quarter: 'Q4', revenue: 22000, expenses: 13000, profit: 9000 },
];

<ChartProvider>
  <AreaChart
    data={data}
    xKey="quarter"
    yKeys={['revenue', 'expenses', 'profit']}
    stacking="normal"
    smooth
    fillOpacity={0.6}
    showGrid
    showLegend
    animate
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'An area chart displays quantitative data using filled areas below lines connecting data points. Essential elements include clearly labeled axes, a legend for multiple series, shaded areas with appropriate opacity, and optional data point markers at line boundaries.',
        overflowContent: 'When stacking more than 5 series, the chart becomes difficult to read. Consider filtering options, small multiples showing separate charts per series, or switching to a Streamgraph for better flow visualization. For overlapping areas, reduce opacity to show all layers.',
        internationalization: 'Format dates and numbers according to locale conventions. Ensure axis labels and tooltips respect text direction for RTL languages. Use locale-appropriate date formats (MM/DD/YYYY vs DD/MM/YYYY) and number formatting (comma vs period separators).',
    },

    formatting: {
        emphasis: 'Use color saturation and area opacity to create visual hierarchy. Primary series should have stronger colors and higher opacity, while supporting series can be more muted. In stacked mode, place the most important series at the bottom for better baseline reading.',
        alignment: 'Center the chart with balanced padding. Position the legend where it minimizes eye travel and doesn\'t obscure data - typically top or right. For stacked percentage charts, always show the 100% baseline clearly. Ensure Y-axis starts at zero for accurate area perception.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects. Each object represents a time point with multiple series values.' },
        { name: 'xKey', type: "string", required: true, description: 'Property name for X-axis values (typically time or sequential categories).' },
        { name: 'yKeys', type: "string[]", required: true, description: 'Array of property names for Y-axis series. Each creates a separate area layer.' },
        { name: 'stacking', type: "'none' | 'normal' | 'percent'", default: "'none'", description: 'Stacking mode: none (overlapping), normal (cumulative values), percent (normalized to 100%).' },
        { name: 'smooth', type: "boolean", default: "true", description: 'Enable curved (Bezier) interpolation for smoother area edges.' },
        { name: 'fillOpacity', type: "number", default: "0.3", description: 'Opacity of the filled area (0 = transparent, 1 = solid). Lower values help with overlapping visibility.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display horizontal and vertical grid lines.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Show interactive legend. Click items to toggle series visibility.' },
        { name: 'showDots', type: "boolean", default: "false", description: 'Show data point markers on the line edges.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry animations and smooth transitions.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for series. Uses theme colors if not provided.' },
        { name: 'gradient', type: "boolean", default: "false", description: 'Apply gradient fill from color to transparent at baseline.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Area chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Provides descriptive label (e.g., "Area chart showing quarterly revenue breakdown")' },
            { attribute: 'aria-describedby', usage: 'Links to data table or detailed text summary' },
        ],
        screenReader: 'Screen readers announce the chart as an image with the provided label. Interactive legend items are announced as toggle buttons with their visibility state. Provide a supplementary data table for detailed value access, especially for stacked charts where individual values are harder to perceive visually.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to and between legend items' },
            { key: 'Enter/Space', action: 'Toggle visibility of the focused series' },
            { key: 'Escape', action: 'Clear focus from chart interactive elements' },
        ],
    },
};

export default AreaChartDoc;
