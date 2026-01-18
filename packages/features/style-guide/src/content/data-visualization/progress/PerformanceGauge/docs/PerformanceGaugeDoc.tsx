import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const PerformanceGaugeDoc: ComponentDoc = {
    name: 'PerformanceGauge',
    status: 'stable',
    version: '1.0.0',
    description: 'A gauge chart for visualizing a single value within colored performance zones. Ideal for KPIs, scores, or any metric with defined good/bad ranges.',

    whenToUse: [
        'Dashboard KPIs with performance zones (good/warning/critical)',
        'Scores or ratings with defined thresholds',
        'Real-time metrics like CPU usage, response times',
        'Financial metrics with target ranges',
        'Any single value where context of "how good/bad" matters',
    ],

    whenNotToUse: [
        'Comparing multiple metrics - use multiple gauges or bar chart',
        'Showing trends over time - use line chart',
        'Precise value reading - use numeric display or bar',
        'More than 3-4 zones - becomes visually complex',
    ],

    usage: `
\`\`\`tsx
import { PerformanceGauge, ChartProvider } from '@pulwave/ui/data-visualization';

<ChartProvider>
  <PerformanceGauge
    value={75}
    min={0}
    max={100}
    ranges={[
        { min: 0, max: 40, color: 'error', label: 'Critical' },
        { min: 40, max: 70, color: 'warning', label: 'Needs Improvement' },
        { min: 70, max: 100, color: 'success', label: 'Good' }
    ]}
    showValue
    valueLabel="Customer Satisfaction"
    size={200}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A performance gauge displays a needle or indicator pointing to the current value on a segmented arc. Colored zones provide instant context for performance level. Essential elements include the arc, needle, value display, and zone labels.',
        overflowContent: 'Limit to 3-4 zones. More zones become hard to distinguish. Consider using a numeric display with conditional formatting for complex thresholds.',
        internationalization: 'Format values and labels according to locale. Zone labels should be translatable. Consider that color meanings vary by culture.',
    },

    formatting: {
        emphasis: 'Use semantic colors for zones (green=good, yellow=warning, red=critical) when culturally appropriate. The needle should be clearly visible against all zones.',
        alignment: 'Center the gauge. Position the value label prominently below the arc. Ensure zone labels don\'t overlap.',
    },

    props: [
        { name: 'value', type: "number", required: true, description: 'Current value the needle points to.' },
        { name: 'min', type: "number", default: "0", description: 'Minimum value of the gauge scale.' },
        { name: 'max', type: "number", default: "100", description: 'Maximum value of the gauge scale.' },
        { name: 'ranges', type: "Array<{min, max, color, label?}>", required: true, description: 'Configuration for colored performance zones.' },
        { name: 'showValue', type: "boolean", default: "true", description: 'Display the numeric value below the gauge.' },
        { name: 'valueLabel', type: "string", description: 'Label text displayed above or beside the value.' },
        { name: 'size', type: "number", default: "200", description: 'Gauge diameter in pixels.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable needle animation.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Gauge is marked as an image for screen readers' },
            { attribute: 'aria-label', usage: 'Describes the metric, value, and zone (e.g., "Customer Satisfaction gauge at 75%, in Good zone")' },
            { attribute: 'aria-valuemin', usage: 'Indicates minimum scale value' },
            { attribute: 'aria-valuemax', usage: 'Indicates maximum scale value' },
            { attribute: 'aria-valuenow', usage: 'Indicates current value' },
        ],
        screenReader: 'Screen readers announce the metric name, current value, and which zone it falls into. Zone descriptions help users understand context.',
        keyboard: [
            { key: 'N/A', action: 'Gauges are typically non-interactive display elements' },
        ],
    },
};

export default PerformanceGaugeDoc;
