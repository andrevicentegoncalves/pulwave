import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const WaterfallChartDoc: ComponentDoc = {
    name: 'WaterfallChart',
    status: 'stable',
    version: '1.0.0',
    description: 'Shows cumulative effect of positive and negative changes from a starting to ending value. Floating bars visualize how intermediate steps contribute to the final result. Essential for financial analysis and variance explanation.',

    whenToUse: [
        'Financial statements (revenue to profit breakdown)',
        'Budget variance analysis',
        'Inventory or balance changes over time',
        'Understanding how components sum to a total',
        'Any "bridge" analysis from start to end state',
    ],

    whenNotToUse: [
        'Comparing unrelated categories - use bar chart',
        'Time series trends - use line chart',
        'When sequence doesn\'t matter',
        'Many intermediate steps (>10) - becomes cluttered',
        'When positive/negative context isn\'t meaningful',
    ],

    usage: `
\`\`\`tsx
import { WaterfallChart, ChartProvider } from '@pulwave/ui/data-visualization';

const profitBridge = [
    { name: 'Q1 Revenue', value: 500000 },
    { name: 'Product Sales', delta: 250000 },
    { name: 'Services', delta: 125000 },
    { name: 'COGS', delta: -180000 },
    { name: 'Operating Expenses', delta: -145000 },
    { name: 'Taxes', delta: -75000 },
    { name: 'Net Profit', total: true },
];

<ChartProvider>
  <WaterfallChart
    data={profitBridge}
    showConnectors
    positiveColor="#10B981"
    negativeColor="#EF4444"
    totalColor="#3B82F6"
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A waterfall chart displays floating bars that show cumulative changes. Bars "bridge" from one level to the next. Essential elements include start/end bars (grounded), change bars (floating), and connector lines.',
        overflowContent: 'Works best with 5-10 steps. More steps require wider charts. Consider grouping small changes into "Other" categories.',
        internationalization: 'Format currency/values according to locale. Labels should be translatable. Color meanings (green=positive, red=negative) may vary culturally.',
    },

    formatting: {
        emphasis: 'Use green for positive changes, red for negative, and a neutral color (blue/gray) for totals. Connector lines help track cumulative level.',
        alignment: 'Bars should clearly float from their starting level. Ensure adequate width for labels. Consider horizontal layout for many steps.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of steps with value (absolute), delta (change), or total flag.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property for absolute values (start/end).' },
        { name: 'deltaKey', type: "string", default: "'delta'", description: 'Property for incremental changes.' },
        { name: 'showConnectors', type: "boolean", default: "true", description: 'Show lines connecting bar endpoints.' },
        { name: 'positiveColor', type: "string", default: "'#10B981'", description: 'Color for positive changes.' },
        { name: 'negativeColor', type: "string", default: "'#EF4444'", description: 'Color for negative changes.' },
        { name: 'totalColor', type: "string", default: "'#3B82F6'", description: 'Color for total/summary bars.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the bridge (e.g., "Waterfall chart showing revenue to profit with net profit of $475,000")' },
            { attribute: 'aria-describedby', usage: 'Links to breakdown table' },
        ],
        screenReader: 'Screen readers announce each step with name, change amount (positive/negative), and running total. Summarize the overall change.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between bars' },
            { key: 'Enter', action: 'Show step details' },
        ],
    },
};

export default WaterfallChartDoc;
