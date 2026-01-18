import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const ViolinPlotDoc: ComponentDoc = {
    name: 'ViolinPlot',
    status: 'stable',
    version: '1.0.0',
    description: 'Combines box plot summary with kernel density estimation to show data distribution shape. Ideal for comparing distributions across categorical groups, revealing multimodality, and understanding data spread.',

    whenToUse: [
        'Comparing distribution shapes across categories',
        'Revealing multimodal distributions (multiple peaks)',
        'When more detail than box plot is needed',
        'Statistical analysis with moderate to large samples',
        'A/B testing results with distribution comparison',
    ],

    whenNotToUse: [
        'Small sample sizes (<30 per category) - use strip plot or box plot',
        'Audience unfamiliar with density estimation',
        'When exact values or outliers are the focus - use box plot',
        'Simple median comparison - use bar or dot plot',
        'Discrete or categorical data - use histogram or bar chart',
    ],

    usage: `
\`\`\`tsx
import { ViolinPlot, ChartProvider } from '@pulwave/ui/data-visualization';

const responseTimeData = [
    {
        endpoint: '/api/users',
        values: [45, 52, 48, 51, 49, 120, 55, 47, 53, 48, 50, 52, 46, 54, 49]
    },
    {
        endpoint: '/api/orders',
        values: [78, 82, 85, 79, 81, 84, 80, 77, 83, 86, 82, 79, 81, 84, 80]
    },
    {
        endpoint: '/api/products',
        values: [32, 35, 33, 120, 34, 31, 36, 33, 35, 32, 34, 33, 31, 35, 34]
    },
];

<ChartProvider>
  <ViolinPlot
    data={responseTimeData}
    categoryKey="endpoint"
    valuesKey="values"
    showBoxPlot
    showPoints
    layout="vertical"
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A violin plot displays a mirrored density curve (the "violin" shape) with an optional embedded box plot. Essential elements include the density curves, median line, quartile box, and category labels.',
        overflowContent: 'Works well with 3-8 categories. More categories make violins too narrow. Consider faceting or filtering for many groups. Half-violin variants can show paired comparisons.',
        internationalization: 'Format statistical values according to locale. Category labels should be translatable. Consider cultural associations with violin shape metaphor.',
    },

    formatting: {
        emphasis: 'Use consistent colors across violins. The embedded box plot should be subtle but visible. Highlight median prominently. Color by category or leave uniform.',
        alignment: 'Vertical layout is standard; horizontal works for many categories or long labels. Ensure sufficient width for density curve visibility.',
    },

    props: [
        { name: 'data', type: "ViolinData[]", required: true, description: 'Array of category objects with raw value arrays.' },
        { name: 'categoryKey', type: "string", default: "'category'", description: 'Property name for category labels.' },
        { name: 'valuesKey', type: "string", default: "'values'", description: 'Property name for the array of numeric values.' },
        { name: 'layout', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Chart orientation.' },
        { name: 'showBoxPlot', type: "boolean", default: "true", description: 'Display embedded box plot with median and quartiles.' },
        { name: 'showPoints', type: "boolean", default: "false", description: 'Overlay jittered data points on the violin.' },
        { name: 'bandwidth', type: "number", description: 'Kernel density estimation bandwidth. Auto-calculated if not provided.' },
        { name: 'colors', type: "string[]", description: 'Custom colors for each violin.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the distribution comparison (e.g., "Violin plot comparing response time distributions across API endpoints")' },
            { attribute: 'aria-describedby', usage: 'Links to statistical summary table' },
        ],
        screenReader: 'Screen readers announce each category with median, quartiles, and range. Describe distribution shape (normal, skewed, bimodal) when relevant. Provide a statistical summary table.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart elements' },
        ],
    },
};

export default ViolinPlotDoc;
