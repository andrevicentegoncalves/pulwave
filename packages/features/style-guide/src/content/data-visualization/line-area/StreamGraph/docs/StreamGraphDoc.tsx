import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const StreamGraphDoc: ComponentDoc = {
    name: 'StreamGraph',
    status: 'stable',
    version: '1.1.0',
    description: 'Stacked area chart centered around a baseline, creating a fluid, flowing visualization. Ideal for showing how composition changes over time with an organic, aesthetic appearance.',

    whenToUse: [
        'Visualizing the flow and evolution of multiple categories over time',
        'Music streaming, genre trends, or content popularity over time',
        'Social media topic trends and sentiment flow',
        'Traffic or usage patterns across categories',
        'When an organic, artistic visualization is desired',
    ],

    whenNotToUse: [
        'Precise value reading is important - stacked areas obscure exact values',
        'Few categories (<3) - use a standard Area Chart',
        'Comparing individual category values directly',
        'Data with negative values - streams become confusing',
        'When baseline alignment matters for analysis',
    ],

    usage: `
\`\`\`tsx
import { StreamGraph, ChartProvider } from '@pulwave/ui/data-visualization';

const genreData = [
    { month: 'Jan', rock: 40, pop: 30, jazz: 20, classical: 10 },
    { month: 'Feb', rock: 35, pop: 35, jazz: 18, classical: 12 },
    { month: 'Mar', rock: 30, pop: 40, jazz: 15, classical: 15 },
    { month: 'Apr', rock: 25, pop: 45, jazz: 20, classical: 10 },
    { month: 'May', rock: 30, pop: 42, jazz: 18, classical: 10 },
    { month: 'Jun', rock: 35, pop: 38, jazz: 22, classical: 5 },
];

<ChartProvider>
  <StreamGraph
    data={genreData}
    xKey="month"
    dataKeys={['rock', 'pop', 'jazz', 'classical']}
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A stream graph displays stacked areas flowing around a central baseline, creating a symmetric, organic shape. Essential elements include the flowing streams, a legend for category identification, and optional tooltips for value exploration.',
        overflowContent: 'With many categories (>8), streams become too thin to interpret. Consider grouping smaller categories into "Other" or using interactive filtering.',
        internationalization: 'Format dates and values according to locale. Ensure legend labels are translatable.',
    },

    formatting: {
        emphasis: 'Use a harmonious color palette where adjacent streams have sufficient contrast. Avoid pure saturated colors; muted palettes create a more pleasing flow. Consider smooth color gradients.',
        alignment: 'Stream graphs are inherently centered around the baseline. Ensure adequate vertical space for the full stream height. Position legends to not interfere with the organic shape.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of time series data with category values.' },
        { name: 'dataKeys', type: "string[]", required: true, description: 'Property names for the category streams to display.' },
        { name: 'xKey', type: "string", required: true, description: 'Property name for the X-axis time values.' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for streams.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for stream identification.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable smooth entry animations.' },
        { name: 'offset', type: "'wiggle' | 'silhouette' | 'expand' | 'none'", default: "'wiggle'", description: 'Stream baseline calculation method.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Stream graph is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the stream graph purpose and categories shown' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Stream graphs are highly visual and challenging to convey audibly. Provide a data table alternative that shows category values over time. Focus on overall trends rather than exact values.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Enter/Space', action: 'Toggle stream visibility in legend' },
        ],
    },
};

export default StreamGraphDoc;
