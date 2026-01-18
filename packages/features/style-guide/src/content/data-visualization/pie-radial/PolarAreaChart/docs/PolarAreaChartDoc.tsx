import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const PolarAreaChartDoc: ComponentDoc = {
    name: 'PolarAreaChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A chart where each segment has equal angles but radius proportional to value. Also known as a Coxcomb or Nightingale Rose chart. Ideal for cyclic data like months or comparing categories with emphasis on magnitude.',

    whenToUse: [
        'Cyclic data like monthly statistics, seasonal patterns, or hourly distributions',
        'Comparing categories where magnitude differences are important',
        'Displaying wind rose or directional data',
        'When both category and value should be emphasized equally',
        'Historical or scientific data visualization with classic aesthetic',
    ],

    whenNotToUse: [
        'Part-to-whole relationships - use a Pie Chart',
        'Precise value comparison - radial encoding is less accurate',
        'Non-cyclic categorical data - use a Bar Chart',
        'Many categories (>12) become hard to distinguish',
    ],

    usage: `
\`\`\`tsx
import { PolarAreaChart, ChartProvider } from '@pulwave/ui/data-visualization';

const monthlyData = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 145 },
    { name: 'Mar', value: 190 },
    { name: 'Apr', value: 220 },
    { name: 'May', value: 280 },
    { name: 'Jun', value: 310 },
    { name: 'Jul', value: 290 },
    { name: 'Aug', value: 250 },
    { name: 'Sep', value: 200 },
    { name: 'Oct', value: 170 },
    { name: 'Nov', value: 140 },
    { name: 'Dec', value: 130 },
];

<ChartProvider>
  <PolarAreaChart
    data={monthlyData}
    size={400}
    showLabels
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A polar area chart displays equal-angle sectors with varying radii based on values. Essential elements include sector labels, optional value indicators, and consistent radial gridlines for reference.',
        overflowContent: 'Best with 8-12 categories (like months or hours). More categories make sectors too narrow. Consider grouping or filtering for larger datasets.',
        internationalization: 'Format values according to locale. Category labels (especially month names) should be localized.',
    },

    formatting: {
        emphasis: 'Use color gradients or distinct hues for each sector. The radial nature naturally emphasizes larger values. Consider adding concentric reference circles for value comparison.',
        alignment: 'Center the chart. Start angle can be customized (top is common for time-based data). Ensure labels don\'t overlap.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with name and value properties.' },
        { name: 'size', type: "number", default: "400", description: 'Chart diameter in pixels.' },
        { name: 'innerRadius', type: "number", default: "0", description: 'Inner radius for creating a ring effect.' },
        { name: 'startAngle', type: "number", default: "0", description: 'Starting angle in degrees (0 = top).' },
        { name: 'showLabels', type: "boolean", default: "true", description: 'Display category labels on sectors.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for categories.' },
        { name: 'showGridLines', type: "boolean", default: "true", description: 'Display concentric reference circles.' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for sectors.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the chart purpose and data type' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers should announce each sector with its category name and value. The radial visualization is challenging to convey audibly; provide a data table alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Enter/Space', action: 'Highlight selected sector' },
        ],
    },
};

export default PolarAreaChartDoc;
