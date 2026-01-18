import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const DonutChartDoc: ComponentDoc = {
    name: 'DonutChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A pie chart with a hole in the center, used to display proportional data. Supports optional central value and subtext for better context.',
    usage: `
\`\`\`tsx
import { DonutChart, ChartProvider } from '@pulwave/ui/data-visualization';

<ChartProvider>
  <DonutChart
    data={[{ name: 'A', value: 10 }]}
    centerValue="10"
    centerSubtext="Items"
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A donut chart is a pie chart with a hollow center, displaying proportional data as circular segments. Key elements include clearly distinguishable segments with labels or percentages, a legend for category identification, and optional center text showing totals or key metrics.',
        overflowContent: 'When displaying more than 7 categories, smaller segments become illegible. Group minor categories into an "Other" segment, use a drill-down interaction to reveal details, or switch to a Bar Chart or Treemap for better readability.',
        internationalization: 'Format percentages and numbers according to locale conventions (decimal separators, thousands grouping). Ensure color schemes work across cultures (avoid red/green combinations in certain regions). Consider starting angle conventions for different reading directions.',
    },

    formatting: {
        emphasis: 'Use color intensity and segment size to draw attention to key categories. The most important segment should use the most vibrant color. Maintain sufficient contrast between adjacent segments. Consider subtle animations or hover effects to highlight selections.',
        alignment: 'Center the donut within its container. Position the legend to balance the composition - right side for wider layouts, bottom for narrow containers. Ensure center text (if used) is clearly readable and doesn\'t compete with segment labels.',
    },

    whenToUse: [
        'Display proportional data with limited categories (3-7 segments recommended)',
        'Show a central metric or total value in the hole',
        'Compare parts of a whole',
        'Display percentages or ratios',
    ],
    whenNotToUse: [
        'More than 7 categories - consider a bar chart instead',
        'Precise value comparison is needed - use bar chart',
        'Showing trends over time - use line or area chart',
    ],
    props: [
        { name: 'data', type: "Array<{name, value, color}>", required: true, description: 'Data segments.' },
        { name: 'centerValue', type: "ReactNode", description: 'Main value displayed in the center hole.' },
        { name: 'centerSubtext', type: "ReactNode", description: 'Subtext displayed below the center value.' },
        { name: 'innerRadius', type: "string | number", default: "'60%'", description: 'Relative or absolute radius of the hole.' },
        { name: 'outerRadius', type: "string | number", default: "'80%'", description: 'Relative or absolute outer radius.' },
    ],
    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart is marked as an image for screen readers' },
            { attribute: 'aria-label', usage: 'Provides accessible name describing the chart purpose' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table for complete accessibility' },
        ],
        screenReader: 'Screen readers announce the chart as an image with the provided aria-label. Each segment is announced via the legend with its name, value, and percentage. The center value (if present) should be announced separately. Consider providing a data table alternative for complex data.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and between legend items' },
            { key: 'Enter/Space', action: 'Highlight corresponding segment (if interactive)' },
        ],
    },
};

export default DonutChartDoc;
