import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const DivergingBarDoc: ComponentDoc = {
    name: 'DivergingBarChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Bar chart that can handle both negative and positive values, diverging from a central axis. Useful for profit/loss, sentiment, or deviation analysis.',

    whenToUse: [
        'Visualizing data with both positive and negative values around a baseline',
        'Survey responses on a Likert scale (strongly disagree to strongly agree)',
        'Profit and loss analysis showing gains and losses',
        'Year-over-year change comparisons (growth vs decline)',
        'Sentiment analysis showing positive vs negative feedback',
        'Deviation from a target or baseline value',
    ],

    whenNotToUse: [
        'All values are positive - use a standard Bar Chart instead',
        'Comparing unrelated categories without a meaningful zero point',
        'Time series data - consider a Line Chart with a zero baseline',
        'Part-to-whole relationships - use a Stacked Bar or Pie Chart',
    ],

    usage: `
\`\`\`tsx
import { DivergingBarChart, ChartProvider } from '@pulwave/ui/data-visualization';

const sentimentData = [
    { category: 'Product Quality', value: 45 },
    { category: 'Customer Service', value: -12 },
    { category: 'Delivery Speed', value: 28 },
    { category: 'Pricing', value: -35 },
    { category: 'Website UX', value: 15 },
];

<ChartProvider>
  <DivergingBarChart
    data={sentimentData}
    categoryKey="category"
    valueKey="value"
    positiveColor="success"
    negativeColor="error"
    layout="horizontal"
    showLabels
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A diverging bar chart displays bars extending both left/down (negative) and right/up (positive) from a central zero baseline. Essential elements include the baseline axis, category labels, and contrasting colors for positive and negative values.',
        overflowContent: 'When categories exceed available space, consider scrolling, pagination, or filtering. Long category labels should be truncated with tooltips or displayed on hover.',
        internationalization: 'Ensure number formatting follows locale conventions. Be mindful that "positive" and "negative" color associations may vary across cultures. Support RTL layouts where categories may need to flow right-to-left.',
    },

    formatting: {
        emphasis: 'Use distinct, high-contrast colors for positive and negative values. The zero baseline should be clearly visible but not overpowering. Consider using semantic colors (green for positive, red for negative) when culturally appropriate.',
        alignment: 'Horizontal layout works best for long category names. Vertical layout is better for time-based categories. Center-align the baseline for visual balance.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects containing category and value pairs.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for the numeric value (can be positive or negative).' },
        { name: 'categoryKey', type: "string", default: "'name'", description: 'Property name for the category labels.' },
        { name: 'positiveColor', type: "string", default: "'success'", description: 'Color for bars with positive values.' },
        { name: 'negativeColor', type: "string", default: "'error'", description: 'Color for bars with negative values.' },
        { name: 'layout', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Chart orientation. Horizontal extends bars left/right; vertical extends up/down.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Display value labels on or near the bars.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'barRadius', type: "number", default: "4", description: 'Corner radius of the bars.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry animations.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image for screen readers' },
            { attribute: 'aria-label', usage: 'Provides accessible description of the chart purpose and data summary' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table for screen reader users' },
        ],
        screenReader: 'Screen readers announce the chart type and summary. Individual bars are described with their category name, value, and whether positive or negative. Consider providing a data table alternative for detailed access.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and between interactive legend items' },
            { key: 'Enter/Space', action: 'Toggle visibility of focused series (if legend is interactive)' },
        ],
    },
};

export default DivergingBarDoc;
