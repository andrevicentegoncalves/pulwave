import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const RoseChartDoc: ComponentDoc = {
    name: 'RoseChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A pie-like chart where segment radius varies with value (Nightingale rose chart). Famously used by Florence Nightingale to visualize mortality data. Ideal for cyclic data where area represents value.',

    whenToUse: [
        'Cyclic data like monthly, seasonal, or hourly patterns',
        'When area encoding emphasizes magnitude differences better than angles',
        'Historical or scientific data visualizations',
        'Wind rose or directional data',
        'When aesthetic impact is important alongside data communication',
    ],

    whenNotToUse: [
        'Part-to-whole relationships - use Pie Chart',
        'Precise value comparison - area perception is less accurate',
        'Non-cyclic categorical data - use Bar Chart',
        'Many categories (>12) become hard to distinguish',
    ],

    usage: `
\`\`\`tsx
import { RoseChart, ChartProvider } from '@pulwave/ui/data-visualization';

const monthlyMortality = [
    { name: 'January', value: 2761 },
    { name: 'February', value: 2120 },
    { name: 'March', value: 1205 },
    { name: 'April', value: 477 },
    { name: 'May', value: 508 },
    { name: 'June', value: 802 },
    { name: 'July', value: 382 },
    { name: 'August', value: 503 },
    { name: 'September', value: 1156 },
    { name: 'October', value: 1648 },
    { name: 'November', value: 1685 },
    { name: 'December', value: 2761 },
];

<ChartProvider>
  <RoseChart
    data={monthlyMortality}
    size={400}
    showLabels
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A rose chart displays equal-angle sectors with varying radii based on values, where the area represents magnitude. Essential elements include sector labels, optional gridlines, and a legend.',
        overflowContent: 'Best with 8-12 categories. More categories make sectors too narrow. Consider grouping smaller values.',
        internationalization: 'Format values according to locale. Month or category names should be localized.',
    },

    formatting: {
        emphasis: 'Use distinct colors or a gradient progression. Larger areas naturally draw attention. Consider concentric reference circles.',
        alignment: 'Center the chart. Start angle typically at top for time-based data. Ensure labels don\'t overlap.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with name and value.' },
        { name: 'size', type: "number", default: "400", description: 'Chart diameter in pixels.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for sector radius values.' },
        { name: 'nameKey', type: "string", default: "'name'", description: 'Property name for sector labels.' },
        { name: 'showLabels', type: "boolean", default: "true", description: 'Display category labels.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for categories.' },
        { name: 'startAngle', type: "number", default: "0", description: 'Starting angle in degrees.' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for sectors.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the chart purpose and data type' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers announce each sector with its name and value. Provide a data table for detailed access as area encoding is visual.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend' },
            { key: 'Enter/Space', action: 'Highlight selected sector' },
        ],
    },
};

export default RoseChartDoc;
