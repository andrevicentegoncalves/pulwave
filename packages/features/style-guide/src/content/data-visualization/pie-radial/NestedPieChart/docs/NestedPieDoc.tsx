import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const NestedPieDoc: ComponentDoc = {
    name: 'NestedPieChart',
    status: 'stable',
    version: '1.0.0',
    description: 'Displays multiple data series as concentric rings. Each ring represents a different dimension or time period, allowing hierarchical or temporal comparisons.',

    whenToUse: [
        'Comparing proportions across multiple time periods (year over year)',
        'Showing hierarchical data with parent-child relationships',
        'Displaying multiple related dimensions in a compact space',
        'Comparing composition changes between two or more groups',
    ],

    whenNotToUse: [
        'More than 3-4 rings become too dense to read',
        'Categories vary significantly between rings',
        'Precise value comparison is needed - use grouped bars',
        'When ring relationship is not meaningful or could confuse users',
    ],

    usage: `
\`\`\`tsx
import { NestedPieChart, ChartProvider } from '@pulwave/ui/data-visualization';

const salesByYear = [
    {
        label: '2023',
        data: [
            { name: 'Product A', value: 4000 },
            { name: 'Product B', value: 3000 },
            { name: 'Product C', value: 2000 },
        ]
    },
    {
        label: '2024',
        data: [
            { name: 'Product A', value: 5000 },
            { name: 'Product B', value: 3500 },
            { name: 'Product C', value: 2500 },
        ]
    }
];

<ChartProvider>
  <NestedPieChart
    rings={salesByYear}
    size={400}
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A nested pie chart displays multiple concentric donut rings, each representing a different series. Essential elements include ring labels, segment labels or percentages, and a legend identifying categories.',
        overflowContent: 'Limit to 3-4 rings maximum. Inner rings become very small and hard to read. Consider using small multiples of pie charts for more rings.',
        internationalization: 'Format all values according to locale. Ring and segment labels should be translatable.',
    },

    formatting: {
        emphasis: 'Use consistent category colors across all rings for easy comparison. The outer ring should represent the primary or most recent data. Inner rings can use slightly muted versions of the same colors.',
        alignment: 'Center the chart within its container. Position ring labels clearly - either as ring headers or in a legend.',
    },

    props: [
        { name: 'rings', type: "Array<{label: string, data: object[]}>", required: true, description: 'Array of ring configurations, each with a label and data array.' },
        { name: 'size', type: "number", default: "400", description: 'Chart diameter in pixels.' },
        { name: 'innerRadius', type: "number", default: "30", description: 'Inner radius of the innermost ring.' },
        { name: 'ringGap', type: "number", default: "4", description: 'Gap between concentric rings in pixels.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for categories.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Display labels on segments.' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for categories.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes all rings and their data purpose' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers should announce each ring\'s label and its segments. Due to complexity, a data table alternative is strongly recommended.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Enter/Space', action: 'Highlight category across all rings' },
        ],
    },
};

export default NestedPieDoc;
