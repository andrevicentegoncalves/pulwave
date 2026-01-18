import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const HistogramChartDoc: ComponentDoc = {
    name: 'HistogramChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Chart that groups continuous numerical data into bins to show frequency distribution. Essential for understanding data shape, identifying outliers, and detecting patterns like normal distribution or skewness.',

    whenToUse: [
        'Understanding the distribution shape of continuous data',
        'Identifying outliers, gaps, or unusual patterns',
        'Comparing actual distribution to expected (e.g., normal)',
        'Quality control and process analysis',
        'Exploratory data analysis of numeric variables',
    ],

    whenNotToUse: [
        'Categorical data - use bar chart',
        'Comparing distributions across categories - use violin or box plot',
        'Time series data - use line chart',
        'When exact values matter more than distribution shape',
        'Very small datasets (<20 values) - use dot plot',
    ],

    usage: `
\`\`\`tsx
import { HistogramChart, ChartProvider } from '@pulwave/ui/data-visualization';

const responseTimesMs = [
    45, 52, 48, 51, 49, 55, 47, 53, 48, 50, 52, 46, 54, 49, 51,
    120, 85, 78, 62, 58, 55, 61, 57, 59, 63, 67, 71, 68, 72, 69
];

<ChartProvider>
  <HistogramChart
    data={responseTimesMs}
    bins={12}
    showDensity
    showMean
    showMedian
    xAxisLabel="Response Time (ms)"
    yAxisLabel="Frequency"
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A histogram displays rectangular bars where width represents the bin range and height represents frequency. Essential elements include bars, axis labels, and optional reference lines for mean/median.',
        overflowContent: 'Bin count affects interpretation - too few hides patterns, too many creates noise. Sturges formula (1 + log2(n)) is a good starting point. Very large datasets may benefit from density estimation.',
        internationalization: 'Format axis values according to locale. Consider that statistical terms (mean, median) should be translatable.',
    },

    formatting: {
        emphasis: 'Use consistent bar color. Highlight mean and median lines distinctly if shown. Density curve should be semi-transparent to not obscure bars.',
        alignment: 'Bars should touch (no gaps) to emphasize continuity. Y-axis typically starts at 0. Consider log scale for highly skewed data.',
    },

    props: [
        { name: 'data', type: "number[]", required: true, description: 'Array of raw numerical values to bin.' },
        { name: 'bins', type: "number", default: "10", description: 'Number of bins/buckets for grouping data.' },
        { name: 'showDensity', type: "boolean", default: "false", description: 'Overlay a kernel density estimation curve.' },
        { name: 'showMean', type: "boolean", default: "true", description: 'Display a vertical line at the mean value.' },
        { name: 'showMedian', type: "boolean", default: "false", description: 'Display a vertical line at the median value.' },
        { name: 'xAxisLabel', type: "string", description: 'Label for the X-axis (value range).' },
        { name: 'yAxisLabel', type: "string", default: "'Frequency'", description: 'Label for the Y-axis.' },
        { name: 'color', type: "string", description: 'Color for histogram bars.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the distribution (e.g., "Histogram showing response time distribution with mean at 58ms")' },
            { attribute: 'aria-describedby', usage: 'Links to statistical summary' },
        ],
        screenReader: 'Screen readers should announce the bin ranges and frequencies. Include summary statistics (mean, median, range) for context. Provide a frequency table alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart elements' },
        ],
    },
};

export default HistogramChartDoc;
