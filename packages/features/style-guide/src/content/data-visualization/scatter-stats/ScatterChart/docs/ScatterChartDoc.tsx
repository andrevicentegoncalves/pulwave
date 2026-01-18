import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const ScatterChartDoc: ComponentDoc = {
    name: 'ScatterChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Chart using dots to represent values for two numeric variables. Supports optional bubble sizing (Z-axis) and grouping for richer correlation analysis.',

    whenToUse: [
        'Identify correlations or patterns between two continuous variables',
        'Detect outliers and clusters in multivariate data',
        'Show distribution and density of data points across two dimensions',
        'Visualize relationships where no clear sequential order exists',
        'Display three dimensions using bubble size (becomes a Bubble Chart)',
    ],

    whenNotToUse: [
        'Data has a clear time sequence - use a Line Chart instead',
        'Showing categorical comparisons - use a Bar Chart or Column Chart',
        'Too many overlapping points obscure patterns (>500 points) - consider a Heatmap or Hexbin plot',
        'Exact values need to be read - use a Data Table',
        'Data requires grouping with clear separation - use a Grouped Bar Chart or Box Plot',
    ],

    usage: `
\`\`\`tsx
import { ScatterChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
  { sqft: 1200, price: 320000, bedrooms: 2, neighborhood: 'Downtown' },
  { sqft: 1500, price: 380000, bedrooms: 3, neighborhood: 'Downtown' },
  { sqft: 1800, price: 420000, bedrooms: 3, neighborhood: 'Suburbs' },
  { sqft: 2200, price: 510000, bedrooms: 4, neighborhood: 'Suburbs' },
  { sqft: 2500, price: 580000, bedrooms: 4, neighborhood: 'Suburbs' },
  { sqft: 1600, price: 390000, bedrooms: 2, neighborhood: 'Downtown' },
  { sqft: 1900, price: 445000, bedrooms: 3, neighborhood: 'Suburbs' },
  { sqft: 2100, price: 495000, bedrooms: 4, neighborhood: 'Suburbs' },
];

<ChartProvider>
  <ScatterChart
    data={data}
    xKey="sqft"
    yKey="price"
    zKey="bedrooms"
    groupKey="neighborhood"
    showGrid
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A scatter chart uses dots positioned along two axes to show relationships between variables. Essential elements include clearly labeled X and Y axes with units, a legend when using groups or categories, grid lines for reference, and tooltips showing exact values on hover.',
        overflowContent: 'When displaying hundreds of overlapping points, consider using opacity/transparency, point size reduction, or alternative visualizations like Heatmaps or Hexbin plots. For multiple groups, provide filtering controls or use small multiples to separate categories.',
        internationalization: 'Format numeric values on axes according to locale (decimal separators, thousands grouping). Ensure axis labels and tooltips adapt to text direction for RTL languages. Use culturally appropriate number abbreviations (K, M, B vs thousand, million, billion).',
    },

    formatting: {
        emphasis: 'Use size, color, and opacity to emphasize important data points or groups. Primary data should use more saturated colors, while secondary data can be muted or semi-transparent. Consider using color gradients to show a third variable (heat mapping).',
        alignment: 'Center the plot area with balanced margins for axis labels. Place the legend where it doesn\'t obscure data points - typically top-right or bottom-right. Ensure axis scales start at appropriate values (not always zero for scatter plots).',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with x, y, and optional z and group values.' },
        { name: 'xKey', type: "string", default: "'x'", description: 'Property name for horizontal axis positioning.' },
        { name: 'yKey', type: "string", default: "'y'", description: 'Property name for vertical axis positioning.' },
        { name: 'zKey', type: "string", description: 'Optional property name for bubble size. Converts to Bubble Chart when provided.' },
        { name: 'groupKey', type: "string", description: 'Optional property name for categorical grouping. Creates separate colors/series per group.' },
        { name: 'dotSize', type: "number", default: "6", description: 'Base size of scatter dots in pixels (when zKey is not used).' },
        { name: 'minBubbleSize', type: "number", default: "4", description: 'Minimum bubble radius in pixels when using zKey.' },
        { name: 'maxBubbleSize', type: "number", default: "30", description: 'Maximum bubble radius in pixels when using zKey.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display horizontal and vertical grid lines.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Show legend when groupKey is used to identify groups.' },
        { name: 'colors', type: "string[]", description: 'Custom color array for groups. Uses theme colors by default.' },
        { name: 'opacity', type: "number", default: "0.7", description: 'Opacity of scatter points (useful when points overlap).' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry animations and transitions.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Scatter plot container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes chart purpose (e.g., "Scatter chart showing correlation between property size and price")' },
            { attribute: 'aria-describedby', usage: 'References a data table or text description of key insights' },
        ],
        screenReader: 'Screen readers announce the chart as an image with the accessible label. Individual points are not typically announced. Provide a supplementary data table for detailed value access. Consider adding a text summary describing the correlation strength and any notable outliers.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to legend items (when groupKey is used)' },
            { key: 'Enter/Space', action: 'Toggle group visibility in legend' },
        ],
    },
};

export default ScatterChartDoc;
