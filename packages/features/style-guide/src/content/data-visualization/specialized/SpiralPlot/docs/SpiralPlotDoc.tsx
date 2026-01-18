import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const SpiralPlotDoc: ComponentDoc = {
    name: 'SpiralPlot',
    status: 'stable',
    version: '1.0.0',
    description: 'Time series arranged in a spiral where each loop represents a cycle (year, week). Excellent for spotting seasonal patterns across multiple years in a compact view. Inner rings are older, outer rings are recent.',

    whenToUse: [
        'Multi-year seasonal pattern analysis',
        'Comparing same period across years (Q4 vs Q4)',
        'Climate or weather cyclical data',
        'Sales seasonality over several years',
        'When compact long-term view is needed',
    ],

    whenNotToUse: [
        'Precise value reading - spiral distorts perception',
        'Non-cyclic data - use standard line chart',
        'Short time series (<2 cycles)',
        'When exact temporal position matters',
        'Audience unfamiliar with spiral layouts',
    ],

    usage: `
\`\`\`tsx
import { SpiralPlot, ChartProvider } from '@pulwave/ui/data-visualization';

const monthlyRevenue = [
    { date: '2022-01-01', value: 120000 },
    { date: '2022-02-01', value: 115000 },
    { date: '2022-03-01', value: 135000 },
    // ... continues through multiple years
    { date: '2024-12-01', value: 185000 },
];

<ChartProvider>
  <SpiralPlot
    data={monthlyRevenue}
    dateKey="date"
    valueKey="value"
    spirals={3}
    periodLabel="Year"
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A spiral plot displays data points along a spiral path where each rotation = one cycle (typically year). Color/size encodes values. Essential elements include the spiral path, data markers, and period labels.',
        overflowContent: 'Works best with 2-5 cycles (spirals). More cycles make inner rings too compressed. Consider filtering or aggregating very dense data.',
        internationalization: 'Format dates and values according to locale. Period labels should be translatable. Spiral direction may need consideration for RTL.',
    },

    formatting: {
        emphasis: 'Use color intensity or marker size to encode values. Highlight anomalies. Consider radial gridlines for period markers (months, quarters).',
        alignment: 'Start point typically at top (12 o\'clock). Ensure inner spirals are still readable. Provide interactive tooltips for precise values.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of chronological time series data.' },
        { name: 'dateKey', type: "string", required: true, description: 'Property name for date/time values.' },
        { name: 'valueKey', type: "string", required: true, description: 'Property name for the metric values.' },
        { name: 'spirals', type: "number", default: "3", description: 'Number of complete rotations (cycles/years).' },
        { name: 'periodLabel', type: "string", default: "'Year'", description: 'Label for what each rotation represents.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display color scale legend.' },
        { name: 'colorScale', type: "'sequential' | 'diverging'", default: "'sequential'", description: 'Color scale for value encoding.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the pattern (e.g., "Spiral plot showing 3 years of monthly revenue with Q4 peaks")' },
            { attribute: 'aria-describedby', usage: 'Links to time series table' },
        ],
        screenReader: 'Screen readers should announce data by period with values. Describe seasonal patterns. Provide a conventional time series table alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart' },
            { key: 'Arrow Keys', action: 'Navigate along the spiral path' },
        ],
    },
};

export default SpiralPlotDoc;
