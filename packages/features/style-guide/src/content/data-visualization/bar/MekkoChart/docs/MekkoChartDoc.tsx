import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const MekkoChartDoc: ComponentDoc = {
    name: 'MekkoChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Variable width bar chart where both width and height encode data. Also known as a Marimekko chart. Excellent for market share analysis.',

    whenToUse: [
        'Market share analysis where segment size and composition both matter',
        'Two-dimensional categorical comparisons (e.g., market size × market share)',
        'Portfolio analysis showing both absolute size and relative breakdown',
        'Complex part-to-whole relationships with varying segment sizes',
        'Comparing distributions across groups of different sizes',
    ],

    whenNotToUse: [
        'Simple categorical comparisons - use a standard Bar Chart',
        'Time series data - use a Line Chart or Area Chart',
        'Single dimension comparison - use a regular Stacked Bar Chart',
        'Too many segments (>8-10 columns become hard to read)',
        'When precise value comparison is critical - variable widths make this difficult',
    ],

    usage: `
\`\`\`tsx
import { MekkoChart, ChartProvider } from '@pulwave/ui/data-visualization';

const marketData = [
    { segment: 'Enterprise', marketSize: 45, share: 35, revenue: 2500 },
    { segment: 'Mid-Market', marketSize: 30, share: 45, revenue: 1800 },
    { segment: 'SMB', marketSize: 25, share: 20, revenue: 900 },
];

<ChartProvider>
  <MekkoChart
    data={marketData}
    categoryKey="segment"
    widthKey="marketSize"
    valueKey="share"
    showLabels
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A Mekko chart uses variable-width bars where the width represents one dimension (e.g., market size) and the stacked segments within each bar represent another dimension (e.g., market share). Labels, legends, and tooltips help interpret the two-dimensional data.',
        overflowContent: 'With many categories or segments, consider filtering or grouping smaller segments into "Other". Interactive tooltips are essential for detailed value exploration.',
        internationalization: 'Ensure all labels and values follow locale formatting. Consider that reading direction may affect perception of proportional widths in RTL languages.',
    },

    formatting: {
        emphasis: 'Use a consistent color palette for segments across all bars. The most important segments should use more saturated colors. Consider using gradient fills within segments for visual appeal.',
        alignment: 'Maintain proportional spacing between bars. Align labels consistently - either centered within segments or above the chart. Use tooltips for detailed breakdowns.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with category, width, and value properties.' },
        { name: 'categoryKey', type: "string", required: true, description: 'Property name for the category labels (column names).' },
        { name: 'widthKey', type: "string", required: true, description: 'Property name for the dimension that controls bar width.' },
        { name: 'valueKey', type: "string", required: true, description: 'Property name for the segment values within each bar.' },
        { name: 'seriesKey', type: "string", description: 'Property name for grouping data into stacked segments.' },
        { name: 'width', type: "number", default: "600", description: 'Chart width in pixels.' },
        { name: 'height', type: "number", default: "400", description: 'Chart height in pixels.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Display value labels within segments.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for segment categories.' },
        { name: 'colors', type: "string[]", description: 'Custom color array for segments.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image for screen readers' },
            { attribute: 'aria-label', usage: 'Describes the chart purpose and summarizes the two-dimensional data relationship' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table for comprehensive data access' },
        ],
        screenReader: 'Screen readers announce each category with its proportional width and segment breakdown. Due to the complexity of two-dimensional encoding, a data table alternative is strongly recommended for full accessibility.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and interactive legend items' },
            { key: 'Enter/Space', action: 'Toggle visibility of legend segments' },
        ],
    },
};

export default MekkoChartDoc;
