import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const PieChartDoc: ComponentDoc = {
    name: 'PieChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Circular chart divided into sectors illustrating numerical proportion. Ideal for simple part-to-whole comparisons with a small number of categories.',

    whenToUse: [
        'Show part-to-whole relationships with 3-6 categories',
        'Display simple percentage breakdowns or composition data',
        'Illustrate market share, budget allocation, or survey results',
        'Emphasize the relative size of a single dominant category',
        'Present data where the total is meaningful and categories are mutually exclusive',
    ],

    whenNotToUse: [
        'More than 6-7 categories make slices too small - use a Bar Chart or Treemap instead',
        'Precise value comparison is needed (humans struggle comparing angles) - use a Bar Chart',
        'Changes over time need to be shown - use a Line Chart or Stacked Area Chart',
        'Multiple pie charts for comparison - use a Stacked Bar Chart or Grouped Bar Chart',
        'Values are close to each other (hard to distinguish angles) - use a Table or Bar Chart',
    ],

    usage: `
\`\`\`tsx
import { PieChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
  { category: 'Residential', value: 45000, percentage: 45 },
  { category: 'Commercial', value: 30000, percentage: 30 },
  { category: 'Industrial', value: 15000, percentage: 15 },
  { category: 'Retail', value: 10000, percentage: 10 },
];

<ChartProvider>
  <PieChart
    data={data}
    dataKey="value"
    nameKey="category"
    outerRadius="80%"
    innerRadius="0%"
    showLabels
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A pie chart consists of circular segments radiating from a central point. Each segment represents a category and its size is proportional to its value relative to the total. Include labels, percentages, and a legend for clarity.',
        overflowContent: 'When too many categories exist (>7), smaller segments become difficult to read. Consider grouping minor categories into an "Other" segment, or use an alternative visualization like a Bar Chart or Treemap.',
        internationalization: 'Ensure number formatting (percentages, decimals) follows locale conventions. Some cultures read clockwise, others counter-clockwise - maintain consistency with user expectations.',
    },

    formatting: {
        emphasis: 'Use color strategically to highlight key segments. The dominant category should use the strongest color, with supporting categories using complementary hues. Avoid overly similar colors that are hard to distinguish.',
        alignment: 'Center the pie chart within its container. Legend placement (right, bottom, or left) should complement the layout without creating excessive whitespace.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of objects representing pie segments. Each object should contain name and value properties.' },
        { name: 'dataKey', type: "string", default: "'value'", description: 'Property name in data objects containing the numeric value for each segment.' },
        { name: 'nameKey', type: "string", default: "'name'", description: 'Property name in data objects containing the label/category name for each segment.' },
        { name: 'outerRadius', type: "string | number", default: "'80%'", description: 'Outer radius of the pie. Can be percentage (relative to container) or absolute pixels.' },
        { name: 'innerRadius', type: "string | number", default: "'0%'", description: 'Inner radius for donut variant. "0%" creates full pie, "50%" creates typical donut.' },
        { name: 'startAngle', type: "number", default: "0", description: 'Starting angle in degrees (0 = top, 90 = right, 180 = bottom, 270 = left).' },
        { name: 'endAngle', type: "number", default: "360", description: 'Ending angle in degrees. Use less than 360 for semi-circle gauges.' },
        { name: 'showLabels', type: "boolean", default: "true", description: 'Display percentage or value labels on or outside segments.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Show legend with category names and colors.' },
        { name: 'labelType', type: "'value' | 'percent' | 'name'", default: "'percent'", description: 'Type of label to display on segments.' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for segments. Uses theme colors if not specified.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry animation and hover effects.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Pie chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Descriptive label for the chart (e.g., "Pie chart showing property type distribution")' },
            { attribute: 'aria-describedby', usage: 'Links to a detailed data table or text summary of values' },
            { attribute: 'aria-roledescription', usage: 'Each segment can have custom role description like "segment representing 45%"' },
        ],
        screenReader: 'Screen readers announce the chart as an image with the provided label. Each segment in the legend is announced with its name and value. Provide a supplementary data table for users who need exact values. Consider adding a text summary of key insights.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to and between legend items' },
            { key: 'Enter/Space', action: 'Highlight corresponding pie segment (if interactive filtering enabled)' },
        ],
    },
};

export default PieChartDoc;
