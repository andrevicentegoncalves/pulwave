import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const StackedBarDoc: ComponentDoc = {
    name: 'StackedBarChart',
    status: 'stable',
    version: '1.0.0',
    description: 'Bar chart where segments are placed on top of each other to show composition. Supports vertical and horizontal layouts. Ideal for part-to-whole comparisons across categories.',

    whenToUse: [
        'Showing part-to-whole relationships across categories',
        'Comparing composition breakdown across different groups',
        'Budget allocation or resource distribution visualization',
        'Revenue breakdown by product line or region over time',
        'Survey response breakdowns showing percentage distributions',
    ],

    whenNotToUse: [
        'Comparing individual segment values precisely - use Grouped Bar Chart',
        'Many segments (>6-7) make it hard to compare middle segments',
        'When individual segment comparison is more important than total',
        'Time series with many data points - consider Area Chart',
    ],

    usage: `
\`\`\`tsx
import { StackedBarChart, ChartProvider } from '@pulwave/ui/data-visualization';

const revenueData = [
    { month: 'Jan', sales: 4000, marketing: 2400, operations: 1800 },
    { month: 'Feb', sales: 3000, marketing: 1398, operations: 2210 },
    { month: 'Mar', sales: 5000, marketing: 3800, operations: 2500 },
    { month: 'Apr', sales: 4780, marketing: 3908, operations: 2100 },
];

const series = [
    { key: 'sales', name: 'Sales', color: 'primary' },
    { key: 'marketing', name: 'Marketing', color: 'success' },
    { key: 'operations', name: 'Operations', color: 'warning' },
];

<ChartProvider>
  <StackedBarChart
    data={revenueData}
    categoryKey="month"
    series={series}
    layout="vertical"
    showLegend
    showLabels
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A stacked bar chart displays bars divided into colored segments, with each segment representing a component of the total. Essential elements include axis labels, a legend identifying each segment, and optional value labels.',
        overflowContent: 'When many categories exist, consider scrolling, pagination, or date range filtering. For many segments, group smaller ones into "Other" or use interactive filtering.',
        internationalization: 'Format numbers and percentages according to locale. Ensure color meanings are culturally appropriate. Support RTL layouts for category labels.',
    },

    formatting: {
        emphasis: 'Use a consistent color palette across all segments. The baseline segment (bottom in vertical, left in horizontal) should anchor the visual. Consider using 100% stacked mode for percentage comparisons.',
        alignment: 'Vertical layout works well for time series. Horizontal layout is better for long category names. Ensure consistent spacing between bars.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects containing category and series values.' },
        { name: 'series', type: "SeriesConfig[]", required: true, description: 'Configuration for each stacked series including key, name, and color.' },
        { name: 'categoryKey', type: "string", default: "'name'", description: 'Property name for the category labels.' },
        { name: 'layout', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Chart orientation. Vertical stacks upward; horizontal stacks rightward.' },
        { name: 'stackId', type: "string", default: "'stack'", description: 'Identifier for grouping stacked bars together.' },
        { name: 'barRadius', type: "number", default: "4", description: 'Corner radius applied to bar segments.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for segment identification.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Display value labels within segments.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry and update animations.' },
        { name: 'stackMode', type: "'normal' | 'percent'", default: "'normal'", description: 'Normal stacking shows absolute values; percent mode normalizes to 100%.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image for screen readers' },
            { attribute: 'aria-label', usage: 'Describes the chart purpose and data summary' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table for screen reader users' },
        ],
        screenReader: 'Screen readers announce each category with its total value and segment breakdown. Individual segments are described with their name, value, and percentage of total.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and between interactive legend items' },
            { key: 'Enter/Space', action: 'Toggle visibility of focused legend series' },
            { key: 'Arrow keys', action: 'Navigate between segments within the chart (when focused)' },
        ],
    },
};

export default StackedBarDoc;
