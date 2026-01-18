import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const SparklineDoc: ComponentDoc = {
    name: 'SparklineChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Small, simple line chart without axes or coordinates. Ideal for tables, inline text, or dashboards with limited space where showing trend direction is sufficient.',

    whenToUse: [
        'Inline trend indicators within table cells',
        'Quick trend visualization in KPI cards or dashboards',
        'Showing direction of change without precise values',
        'Space-constrained contexts where a full chart is too large',
        'Comparing trends across multiple rows in a data table',
    ],

    whenNotToUse: [
        'Precise values need to be read - use a full Line Chart with axes',
        'Comparison between multiple series - use a Line Chart',
        'When context like dates or scale matters',
        'Large datasets requiring scrolling or zoom',
    ],

    usage: `
\`\`\`tsx
import { SparklineChart } from '@pulwave/ui/data-visualization';

// Simple array of values
<SparklineChart
    data={[10, 20, 15, 25, 30, 28, 35]}
    color="success"
    width={120}
    height={32}
    variant="line"
/>

// With reference line showing target or average
<SparklineChart
    data={[10, 20, 15, 25, 30]}
    color="primary"
    width={100}
    height={24}
    referenceLine={20}
/>
\`\`\`
`,

    content: {
        mainElements: 'A sparkline is a minimalist chart showing only the data line without axes, labels, or legends. Optional elements include a reference line, end-point marker, or min/max indicators.',
        overflowContent: 'Sparklines are designed for short data series (7-30 points typically). For longer series, consider downsampling or showing only recent data.',
        internationalization: 'Sparklines are primarily visual and language-independent. If tooltips are added, ensure number formatting follows locale conventions.',
    },

    formatting: {
        emphasis: 'Use color to indicate positive/negative trend (green for growth, red for decline). The line weight should be visible but not overpowering. Consider adding end-point dots for value emphasis.',
        alignment: 'Align sparklines consistently within tables - typically vertically centered in cells. Maintain consistent widths when comparing multiple sparklines.',
    },

    props: [
        { name: 'data', type: "number[]", required: true, description: 'Array of numeric values to display as the sparkline.' },
        { name: 'color', type: "string", default: "'primary'", description: 'Color for the line/area. Uses semantic colors (success, error, etc.).' },
        { name: 'variant', type: "'line' | 'area'", default: "'line'", description: 'Visual variant - line shows only the stroke, area fills below.' },
        { name: 'width', type: "number", default: "100", description: 'Chart width in pixels.' },
        { name: 'height', type: "number", default: "32", description: 'Chart height in pixels.' },
        { name: 'showEndDot', type: "boolean", default: "false", description: 'Display a dot at the last data point.' },
        { name: 'referenceLine', type: "number", description: 'Optional horizontal reference line value (e.g., target or average).' },
        { name: 'animate', type: "boolean", default: "false", description: 'Enable entry animation (typically disabled for performance in tables).' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Sparkline is marked as a decorative/informational image' },
            { attribute: 'aria-label', usage: 'Describes the trend (e.g., "Trend: increasing from 10 to 35")' },
            { attribute: 'aria-hidden', usage: 'Can be hidden if the trend is described elsewhere in the row' },
        ],
        screenReader: 'Screen readers should announce the overall trend direction and optionally the start/end values. For tables with sparklines, ensure the data is also available in text format in another column.',
        keyboard: [
            { key: 'N/A', action: 'Sparklines are typically non-interactive decorative elements' },
        ],
    },
};

export default SparklineDoc;
