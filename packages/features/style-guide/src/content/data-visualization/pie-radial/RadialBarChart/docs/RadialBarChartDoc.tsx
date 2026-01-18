import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const RadialBarChartDoc: ComponentDoc = {
    name: 'RadialBarChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A bar chart plotted on a polar coordinate system where bars extend outward from a central point. Creates a visually striking alternative to standard bar charts.',

    whenToUse: [
        'Comparing categories in an aesthetically pleasing circular layout',
        'Dashboard displays where visual impact is important',
        'Ranking or comparison where radial emphasis is desired',
        'Progress indicators for multiple metrics',
        'When space is better utilized in a circular format',
    ],

    whenNotToUse: [
        'Precise value comparison is needed - standard bar charts are more accurate',
        'Many categories (>8-10) make the chart crowded',
        'When users are unfamiliar with radial visualizations',
        'Data with negative values',
    ],

    usage: `
\`\`\`tsx
import { RadialBarChart, ChartProvider } from '@pulwave/ui/data-visualization';

const performanceData = [
    { name: 'Sales', value: 85, fill: 'primary' },
    { name: 'Marketing', value: 72, fill: 'success' },
    { name: 'Support', value: 90, fill: 'warning' },
    { name: 'Development', value: 68, fill: 'error' },
];

<ChartProvider>
  <RadialBarChart
    data={performanceData}
    dataKey="value"
    size={400}
    innerRadius={60}
    showLabels
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A radial bar chart displays bars radiating outward from a center point, with bar length proportional to value. Essential elements include category labels, value indicators, and optional center content.',
        overflowContent: 'With many categories, bars become too thin. Consider grouping or filtering. Maintain readable label sizes even with longer bar lengths.',
        internationalization: 'Format values according to locale. Category labels should be translatable and not truncated.',
    },

    formatting: {
        emphasis: 'Use distinct colors for each bar or a gradient progression. Longer bars naturally draw more attention. Consider adding value labels at bar ends.',
        alignment: 'Center the chart in its container. Start position can be customized (typically top). Ensure labels don\'t overlap with adjacent bars.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with name, value, and optional fill color.' },
        { name: 'dataKey', type: "string", default: "'value'", description: 'Property name for the bar length values.' },
        { name: 'nameKey', type: "string", default: "'name'", description: 'Property name for category labels.' },
        { name: 'size', type: "number", default: "400", description: 'Chart diameter in pixels.' },
        { name: 'innerRadius', type: "number", default: "60", description: 'Radius of the inner empty circle.' },
        { name: 'showLabels', type: "boolean", default: "true", description: 'Display category labels on bars.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for categories.' },
        { name: 'startAngle', type: "number", default: "90", description: 'Starting angle for the first bar.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the chart purpose and data' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers announce each bar with its category name and value. The radial layout is described as a comparative chart. Provide a data table for detailed access.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Enter/Space', action: 'Highlight selected bar' },
        ],
    },
};

export default RadialBarChartDoc;
