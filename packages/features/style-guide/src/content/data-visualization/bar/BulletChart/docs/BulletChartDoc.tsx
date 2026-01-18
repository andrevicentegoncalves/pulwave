import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const BulletChartDoc: ComponentDoc = {
    name: 'BulletChart',
    status: 'stable',
    version: '1.0.0',
    description: 'A variation of a bar graph used to display performance data in a rich, compact format. Ideal for dashboards where space is limited but rich context is needed.',

    whenToUse: [
        'Display a single metric with target and qualitative performance ranges',
        'Dashboard KPIs requiring compact but information-rich visualization',
        'Comparing actual performance against a target with context zones',
        'Replacing gauges when horizontal space is preferred over radial',
        'Showing budget vs actual or goal vs achievement scenarios',
    ],

    whenNotToUse: [
        'Comparing multiple unrelated metrics - use multiple Bullet Charts or a Bar Chart',
        'Showing trends over time - use a Line Chart or Sparkline instead',
        'When qualitative ranges are not meaningful - use a simple Progress Bar',
        'Complex multi-dimensional data - use a more sophisticated chart type',
    ],

    usage: `
\`\`\`tsx
import { BulletChart, ChartProvider } from '@pulwave/ui/data-visualization';

const performanceData = {
    value: 85,
    target: 90,
    maxValue: 100,
    ranges: [
        { max: 60, color: 'error' },
        { max: 80, color: 'warning' },
        { max: 100, color: 'success' }
    ]
};

<ChartProvider>
  <BulletChart
    value={performanceData.value}
    target={performanceData.target}
    maxValue={performanceData.maxValue}
    ranges={performanceData.ranges}
    title="Sales Performance"
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A bullet chart displays a primary measure (the bar), a comparative measure (the target line), and qualitative ranges (the background bands). The compact form packs significant context into minimal space.',
        overflowContent: 'Bullet charts are designed for single metrics. When displaying multiple bullets, stack them vertically with consistent scales for easy comparison.',
        internationalization: 'Ensure value formatting follows locale conventions. Labels should be translatable without truncation. Consider color meanings across cultures.',
    },

    formatting: {
        emphasis: 'The primary bar should be the most visually prominent element. Background ranges should use subtle, desaturated colors. The target marker should be thin but visible.',
        alignment: 'Stack multiple bullet charts vertically for comparison. Maintain consistent scales when comparing related metrics. Right-align labels for cleaner layouts.',
    },

    props: [
        { name: 'value', type: "number", required: true, description: 'Current/actual value displayed as the primary bar.' },
        { name: 'target', type: "number", description: 'Target or comparative value shown as a vertical marker line.' },
        { name: 'maxValue', type: "number", default: "100", description: 'Maximum value for the scale.' },
        { name: 'minValue', type: "number", default: "0", description: 'Minimum value for the scale.' },
        { name: 'ranges', type: "Array<{max: number, color: string}>", description: 'Qualitative background ranges defining performance zones (poor/satisfactory/good).' },
        { name: 'title', type: "string", description: 'Chart title or metric name displayed alongside the chart.' },
        { name: 'subtitle', type: "string", description: 'Secondary text such as units or time period.' },
        { name: 'height', type: "number", default: "40", description: 'Height of the bullet chart in pixels.' },
        { name: 'showValue', type: "boolean", default: "true", description: 'Display the numeric value alongside the bar.' },
        { name: 'valueFormat', type: "(value: number) => string", description: 'Custom formatter for the displayed value.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Bullet chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the metric, current value, and target (e.g., "Sales performance: 85% of 90% target")' },
            { attribute: 'aria-valuemin', usage: 'Indicates minimum scale value' },
            { attribute: 'aria-valuemax', usage: 'Indicates maximum scale value' },
            { attribute: 'aria-valuenow', usage: 'Indicates current value' },
        ],
        screenReader: 'Screen readers announce the metric name, current value, target value, and performance context. The qualitative ranges provide additional context about whether the value is in a good, acceptable, or poor zone.',
        keyboard: [
            { key: 'N/A', action: 'Bullet charts are typically non-interactive display elements' },
        ],
    },
};

export default BulletChartDoc;
