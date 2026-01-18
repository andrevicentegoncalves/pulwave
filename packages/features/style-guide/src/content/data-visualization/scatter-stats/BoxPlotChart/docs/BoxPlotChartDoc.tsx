import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const BoxPlotChartDoc: ComponentDoc = {
    name: 'BoxPlotChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Statistical chart visualization of data distribution based on a five-number summary (minimum, Q1, median, Q3, maximum). Ideal for comparing distributions and identifying outliers.',

    whenToUse: [
        'Comparing distributions across multiple categories',
        'Identifying outliers and data spread',
        'Statistical analysis of continuous data',
        'Showing median, quartiles, and range in one view',
        'Quality control and process analysis',
    ],

    whenNotToUse: [
        'Sample size is very small (<5 data points)',
        'Exact values matter more than distribution - use data table',
        'Showing trends over time - use line chart',
        'Audience unfamiliar with statistical concepts',
    ],

    usage: `
\`\`\`tsx
import { BoxPlotChart, ChartProvider } from '@pulwave/ui/data-visualization';

const salaryData = [
    {
        department: 'Engineering',
        min: 65000,
        q1: 80000,
        median: 95000,
        q3: 120000,
        max: 180000,
        outliers: [45000, 220000]
    },
    {
        department: 'Sales',
        min: 45000,
        q1: 60000,
        median: 75000,
        q3: 95000,
        max: 150000
    },
    {
        department: 'Marketing',
        min: 50000,
        q1: 65000,
        median: 80000,
        q3: 100000,
        max: 130000
    },
];

<ChartProvider>
  <BoxPlotChart
    data={salaryData}
    categoryKey="department"
    layout="vertical"
    showOutliers
    showGrid
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A box plot displays the five-number summary: minimum, first quartile (Q1), median, third quartile (Q3), and maximum. The "box" shows the interquartile range (IQR), the line inside shows the median, and whiskers extend to min/max or 1.5×IQR.',
        overflowContent: 'With many categories, boxes become narrow. Consider filtering or using horizontal layout for many categories. Violin plots offer more detail for large datasets.',
        internationalization: 'Format statistical values according to locale. Category labels should be translatable.',
    },

    formatting: {
        emphasis: 'Use consistent colors across boxes. Outliers should be visually distinct (different color or symbol). The median line should be clearly visible.',
        alignment: 'Vertical layout is standard; horizontal is better for many categories or long labels. Maintain consistent box widths.',
    },

    props: [
        { name: 'data', type: "BoxPlotData[]", required: true, description: 'Array of statistical distribution data with min, q1, median, q3, max, and optional outliers.' },
        { name: 'categoryKey', type: "string", default: "'category'", description: 'Property name for category labels.' },
        { name: 'layout', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Chart orientation. Vertical has categories on X-axis; horizontal on Y-axis.' },
        { name: 'showOutliers', type: "boolean", default: "true", description: 'Display outlier points beyond the whiskers.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display grid lines for value reference.' },
        { name: 'boxWidth', type: "number", default: "30", description: 'Width of each box in pixels.' },
        { name: 'colors', type: "string[]", description: 'Custom colors for boxes.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the statistical comparison (e.g., "Box plot comparing salary distributions by department")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed statistical table' },
        ],
        screenReader: 'Screen readers should announce each category with its five-number summary. Due to statistical complexity, provide a data table alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart elements' },
        ],
    },
};

export default BoxPlotChartDoc;
