import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const WaffleChartDoc: ComponentDoc = {
    name: 'WaffleChart',
    status: 'stable',
    version: '1.0.0',
    description: 'Grid of cells where filled cells represent proportional values. A more readable alternative to pie charts for showing percentages. Each cell typically represents 1%, making mental math easy.',

    whenToUse: [
        'Showing percentages in a more readable format than pie charts',
        'Progress toward a goal (e.g., 73% complete)',
        'Part-to-whole comparisons with 2-4 categories',
        'Infographics and dashboards',
        'When "X out of 100" framing helps understanding',
    ],

    whenNotToUse: [
        'Many categories (>4) - becomes hard to distinguish',
        'Precise values matter more than visual impact',
        'Very small percentages (<2%) - hard to see',
        'When pie chart\'s compact form is preferred',
        'Non-percentage data without natural total',
    ],

    usage: `
\`\`\`tsx
import { WaffleChart, ChartProvider } from '@pulwave/ui/data-visualization';

const budgetAllocation = [
    { name: 'Engineering', value: 45, color: '#3B82F6' },
    { name: 'Marketing', value: 25, color: '#10B981' },
    { name: 'Operations', value: 20, color: '#F59E0B' },
    { name: 'Other', value: 10, color: '#6B7280' },
];

<ChartProvider>
  <WaffleChart
    data={budgetAllocation}
    total={100}
    rows={10}
    cols={10}
    showLegend
    showPercentages
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A waffle chart displays a grid of cells (typically 10×10 = 100) where filled cells represent values. Each cell = 1% makes the visual intuitive.',
        overflowContent: 'Standard 10×10 grid for percentages. Use 5×20 or other configurations for different totals. Consider icons instead of squares for pictogram effect.',
        internationalization: 'Category names should be translatable. Format percentages according to locale. Grid layout is universal.',
    },

    formatting: {
        emphasis: 'Use distinct colors per category. Fill cells in reading order (left-to-right, top-to-bottom). Larger categories typically come first.',
        alignment: 'Square grid is most common. Ensure adequate spacing between cells. Legend should be clearly associated.',
    },

    props: [
        { name: 'data', type: "Array<{name, value, color?}>", required: true, description: 'Array of category objects with values summing to total.' },
        { name: 'total', type: "number", default: "100", description: 'Total value the grid represents.' },
        { name: 'rows', type: "number", default: "10", description: 'Number of rows in the grid.' },
        { name: 'cols', type: "number", default: "10", description: 'Number of columns in the grid.' },
        { name: 'icon', type: "string", description: 'Optional icon to use instead of squares.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display category legend.' },
        { name: 'showPercentages', type: "boolean", default: "false", description: 'Show percentage labels in legend.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the breakdown (e.g., "Waffle chart showing budget: 45% Engineering, 25% Marketing, 20% Operations, 10% Other")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed breakdown table' },
        ],
        screenReader: 'Screen readers announce each category with name and percentage. State total cells and breakdown. The grid metaphor translates well to audio.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend' },
        ],
    },
};

export default WaffleChartDoc;
