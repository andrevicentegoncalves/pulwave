import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const PerformanceGaugeDoc: ComponentDoc = {
    name: 'PerformanceGauge',
    status: 'stable',
    version: '1.0.0',
    description: 'A gauge chart optimized for displaying KPIs and performance metrics with target markers. Shows how close a single value is to a goal, making it ideal for dashboard widgets and executive summaries.',

    whenToUse: [
        'KPI dashboards showing single metrics',
        'Progress toward goals with targets',
        'Real-time performance monitoring',
        'Executive summary widgets',
        'When visual metaphor of a speedometer helps',
    ],

    whenNotToUse: [
        'Multiple metrics comparison - use bar chart',
        'Trend over time - use line chart',
        'Precise value reading is critical',
        'Space is very limited - use simple number',
        'When percentage/ratio isn\'t meaningful',
    ],

    usage: `
\`\`\`tsx
import { PerformanceGauge, ChartProvider } from '@pulwave/ui/data-visualization';

<ChartProvider>
  <PerformanceGauge
    value={75}
    min={0}
    max={100}
    target={80}
    label="Sales Target"
    showValue
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A semi-circular or arc-shaped gauge with a needle or filled arc indicating the current value. Essential elements include the scale arc, value indicator, optional target marker, and value label.',
        overflowContent: 'Single value display, no overflow concerns. Consider mini-gauge variants for compact dashboard tiles.',
        internationalization: 'Format values according to locale. Label should be translatable. Color zones may need cultural consideration.',
    },

    formatting: {
        emphasis: 'Use color zones (red/yellow/green) to indicate performance levels. Highlight target line distinctly. Show numeric value prominently.',
        alignment: 'Center the gauge in its container. Ensure adequate padding for labels. Consider semi-circle (180°) or partial arc (270°) layouts.',
    },

    props: [
        { name: 'value', type: "number", required: true, description: 'Current performance value to display.' },
        { name: 'min', type: "number", default: "0", description: 'Minimum value on the scale.' },
        { name: 'max', type: "number", default: "100", description: 'Maximum value on the scale.' },
        { name: 'target', type: "number", description: 'Optional target value to show as a marker.' },
        { name: 'label', type: "string", description: 'Label text to display below the gauge.' },
        { name: 'showValue', type: "boolean", default: "true", description: 'Display numeric value in the center.' },
        { name: 'colorZones', type: "Array<{from, to, color}>", description: 'Color zones for different value ranges.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="meter"', usage: 'Semantic meter role for gauge' },
            { attribute: 'aria-valuenow', usage: 'Current value' },
            { attribute: 'aria-valuemin', usage: 'Minimum value' },
            { attribute: 'aria-valuemax', usage: 'Maximum value' },
            { attribute: 'aria-label', usage: 'Describes the metric (e.g., "Sales performance: 75 of 100, target 80")' },
        ],
        screenReader: 'Announce metric name, current value, target (if set), and performance status. State percentage of target achieved.',
        keyboard: [
            { key: 'Tab', action: 'Focus the gauge' },
        ],
    },
};

export default PerformanceGaugeDoc;
