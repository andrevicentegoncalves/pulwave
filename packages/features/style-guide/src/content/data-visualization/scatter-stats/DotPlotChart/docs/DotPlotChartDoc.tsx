import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const DotPlotChartDoc: ComponentDoc = {
    name: 'DotPlotChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A simple chart using dots to show values for categories. Also called Cleveland dot plot. Ideal for comparing values across categories without the visual weight of bars.',

    whenToUse: [
        'Comparing values across many categories (more readable than bars)',
        'Highlighting specific data points or rankings',
        'Clean, minimal aesthetic is desired',
        'Showing before/after or two-value comparisons (dumbbell chart variant)',
        'Small to medium datasets where individual values matter',
    ],

    whenNotToUse: [
        'Part-to-whole relationships - use bar or pie chart',
        'Dense data with many overlapping values',
        'Showing trends over time - use line chart',
        'When the bar visual weight helps emphasize magnitude',
    ],

    usage: `
\`\`\`tsx
import { DotPlotChart, ChartProvider } from '@pulwave/ui/data-visualization';

const satisfactionData = [
    { department: 'Engineering', score: 85 },
    { department: 'Sales', score: 72 },
    { department: 'Marketing', score: 78 },
    { department: 'Support', score: 90 },
    { department: 'Finance', score: 68 },
    { department: 'HR', score: 82 },
];

<ChartProvider>
  <DotPlotChart
    data={satisfactionData}
    categoryKey="department"
    valueKey="score"
    layout="horizontal"
    dotSize={10}
    showGrid
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A dot plot places a single dot at the value position for each category. Essential elements include category labels, the value axis with grid lines, and dots of consistent size.',
        overflowContent: 'Works well with many categories (20+) in horizontal layout. For very many categories, consider grouping or filtering.',
        internationalization: 'Format values according to locale. Category labels should be translatable.',
    },

    formatting: {
        emphasis: 'Use a single color for consistency, or color-code by group. Ensure dots are large enough to be easily visible. Connect dots with lines for dumbbell/lollipop effect.',
        alignment: 'Horizontal layout with categories on Y-axis is most common. Sort categories meaningfully (alphabetically, by value, etc.).',
    },

    props: [
        { name: 'data', type: "Array<{category, value}>", required: true, description: 'Array of data objects with category and value.' },
        { name: 'categoryKey', type: "string", default: "'category'", description: 'Property name for category labels.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for dot position values.' },
        { name: 'layout', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Chart orientation. Horizontal places categories on Y-axis.' },
        { name: 'dotSize', type: "number", default: "12", description: 'Diameter of dots in pixels.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display grid lines for value reference.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Display value labels next to dots.' },
        { name: 'color', type: "string", description: 'Color for all dots.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the comparison (e.g., "Dot plot comparing satisfaction scores by department")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers announce each category with its value. The simple format translates well to audio. Provide a data table for detailed access.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart elements' },
        ],
    },
};

export default DotPlotChartDoc;
