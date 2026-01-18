import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const GaugeChartDoc: ComponentDoc = {
    name: 'GaugeChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A radial gauge chart used to indicate a single value within a minimum and maximum range. Ideal for KPI dashboards and speedometer-style displays.',

    whenToUse: [
        'Display a single metric as a percentage of a target or maximum',
        'Show KPI performance against goals (e.g., completion rate, utilization)',
        'Visualize scores, ratings, or progress indicators',
        'Dashboard "at-a-glance" status metrics where space is limited',
        'Emphasize whether a value is in safe, warning, or critical zones',
    ],

    whenNotToUse: [
        'Comparing multiple metrics - use a Bar Chart or Bullet Chart instead',
        'Showing trends over time - use a Line Chart or Sparkline',
        'Exact value precision is needed - use a Data Table or large numeric display',
        'Space is very limited (gauges need adequate size) - use a simple number or Progress Bar',
        'Displaying more than 3-4 thresholds/zones (becomes visually complex) - use a Bullet Chart',
    ],

    usage: `
\`\`\`tsx
import { GaugeChart, ChartProvider } from '@pulwave/ui/data-visualization';

const performanceData = {
  value: 78,
  target: 85,
  min: 0,
  max: 100,
};

<ChartProvider>
  <GaugeChart
    value={performanceData.value}
    min={performanceData.min}
    max={performanceData.max}
    label="Occupancy Rate"
    variant="half"
    showValue
    showTarget
    targetValue={performanceData.target}
    thresholds={[
      { value: 50, color: 'error' },
      { value: 70, color: 'warning' },
      { value: 90, color: 'success' },
    ]}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A gauge chart displays a single value along a radial arc with minimum and maximum endpoints. Essential elements include the current value (numeric display), arc segments showing zones (safe, warning, critical), a needle or arc fill indicator, and optional target markers.',
        overflowContent: 'Gauges are designed for single metrics. If multiple related metrics need display, use a series of small gauge charts (gauge grid), or consider alternative visualizations like Bullet Charts or Progress Bars that use space more efficiently.',
        internationalization: 'Format displayed values according to locale (decimals, currency symbols, units). Ensure labels are translatable and don\'t get truncated. Consider cultural color associations (red for danger may not be universal). Support both imperial and metric units where applicable.',
    },

    formatting: {
        emphasis: 'Use color zones to indicate performance levels (green for good, yellow for warning, red for critical). The current value should be the most prominent element. Consider using gradient fills for smooth transitions between zones rather than hard boundaries.',
        alignment: 'Center the gauge within its container. Position the value label prominently in or below the center. Place the metric name and unit labels where they don\'t interfere with the arc. Maintain consistent sizing when displaying multiple gauges in a dashboard.',
    },

    props: [
        { name: 'value', type: "number", required: true, description: 'Current value to display on the gauge.' },
        { name: 'min', type: "number", default: "0", description: 'Minimum value of the gauge scale.' },
        { name: 'max', type: "number", default: "100", description: 'Maximum value of the gauge scale.' },
        { name: 'color', type: "string", description: 'Primary fill color for the gauge arc. Overridden by threshold colors if thresholds are defined.' },
        { name: 'label', type: "string", description: 'Descriptive label displayed below or beside the gauge value.' },
        { name: 'variant', type: "'half' | 'full' | 'arc'", default: "'half'", description: 'Visual style: half (semi-circle), full (complete circle), arc (partial arc).' },
        { name: 'showValue', type: "boolean", default: "true", description: 'Display the numeric value in the center of the gauge.' },
        { name: 'valueFormat', type: "(value: number) => string", description: 'Custom formatter for the displayed value (e.g., add %, $, or decimal places).' },
        { name: 'showTarget', type: "boolean", default: "false", description: 'Show a target marker on the gauge arc.' },
        { name: 'targetValue', type: "number", description: 'Target value position (requires showTarget: true).' },
        { name: 'thresholds', type: "Array<{ value: number, color: string }>", description: 'Array defining color zones. Each threshold sets color from its value to the next.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable sweep animation on initial render and value updates.' },
        { name: 'arcWidth', type: "number", default: "12", description: 'Thickness of the gauge arc in pixels.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Gauge is marked as an image element' },
            { attribute: 'aria-label', usage: 'Describes gauge purpose and current value (e.g., "Occupancy rate gauge showing 78 percent")' },
            { attribute: 'aria-valuemin', usage: 'Indicates minimum value of the gauge range' },
            { attribute: 'aria-valuemax', usage: 'Indicates maximum value of the gauge range' },
            { attribute: 'aria-valuenow', usage: 'Indicates current gauge value for assistive technology' },
        ],
        screenReader: 'Screen readers announce the gauge with its label, current value, and range (min/max). The gauge is perceived as a static image rather than an interactive control. If the gauge represents a progress indicator, ensure the aria-valuenow updates dynamically.',
        keyboard: [
            { key: 'N/A', action: 'Gauges are typically non-interactive and do not support keyboard navigation' },
        ],
    },
};

export default GaugeChartDoc;
