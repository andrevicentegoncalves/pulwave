import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const LollipopChartDoc: ComponentDoc = {
    name: 'LollipopChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A chart consisting of a line and a dot for each data point. A great alternative to bar charts for emphasizing values with many data points, combining the precision of dot plots with connecting lines.',

    whenToUse: [
        'When you have many categories (more readable than bars)',
        'Ranking data where individual values matter',
        'Clean, minimal aesthetic is preferred over bar chart weight',
        'Comparing single values across categories',
        'Data journalism and infographic contexts',
    ],

    whenNotToUse: [
        'Part-to-whole relationships - use stacked bar or pie',
        'Time series trends - use line chart',
        'When visual weight of bars helps emphasize magnitude',
        'Very dense data with many overlapping values',
    ],

    usage: `
\`\`\`tsx
import { LollipopChart, ChartProvider } from '@pulwave/ui/data-visualization';

const productivityData = [
    { team: 'Engineering', score: 92 },
    { team: 'Design', score: 88 },
    { team: 'Marketing', score: 76 },
    { team: 'Sales', score: 84 },
    { team: 'Support', score: 79 },
    { team: 'HR', score: 71 },
];

<ChartProvider>
  <LollipopChart
    data={productivityData}
    categoryKey="team"
    valueKey="score"
    layout="horizontal"
    dotSize={10}
    showGrid
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A lollipop chart displays a stem (line) from the axis to a dot at the value. Essential elements include the axis, dots, stems, and category labels. The dot draws attention to the precise value.',
        overflowContent: 'Works well with many categories (30+) in horizontal layout. Categories on Y-axis with dots on right is most readable. Sort by value for easy ranking comparison.',
        internationalization: 'Format values according to locale. Category labels should be translatable. Consider right-to-left layouts for RTL languages.',
    },

    formatting: {
        emphasis: 'Use consistent dot color. Stem should be subtle (thin, lighter color) to not compete with dots. Consider color-coding dots by group if needed.',
        alignment: 'Horizontal layout (categories on Y-axis) is most readable for many items. Sort categories meaningfully - by value is common for rankings.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with category and value.' },
        { name: 'categoryKey', type: "string", default: "'category'", description: 'Property name for category labels.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for dot positions.' },
        { name: 'layout', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Chart orientation. Horizontal places categories on Y-axis.' },
        { name: 'dotSize', type: "number", default: "12", description: 'Diameter of dots in pixels.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display grid lines for value reference.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Display value labels next to dots.' },
        { name: 'color', type: "string", description: 'Color for dots and stems.' },
        { name: 'stemWidth', type: "number", default: "2", description: 'Width of connecting stem lines.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the ranking comparison (e.g., "Lollipop chart showing team productivity scores")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers announce each category with its value. The simple format translates well to audio. Provide a sorted data table for detailed access.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart elements' },
        ],
    },
};

export default LollipopChartDoc;
