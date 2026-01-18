import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const FunnelChartDoc: ComponentDoc = {
    name: 'FunnelChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Visualizes sequential stages in a process where data progressively reduces, showing drop-off rates between stages. Essential for sales pipelines, conversion funnels, and any process with attrition.',

    whenToUse: [
        'Sales pipeline and lead conversion analysis',
        'Marketing funnel visualization (awareness → action)',
        'User journey drop-off analysis',
        'Recruitment or application process stages',
        'Any sequential process with expected reduction',
    ],

    whenNotToUse: [
        'Stages don\'t have sequential relationship - use bar chart',
        'Values can increase between stages - use flow or bar chart',
        'Many stages (>8) - becomes hard to read',
        'Precise comparison between stages needed - use bar chart',
        'When showing the process flow matters more than values - use flow chart',
    ],

    usage: `
\`\`\`tsx
import { FunnelChart, ChartProvider } from '@pulwave/ui/data-visualization';

const salesPipeline = [
    { stage: 'Website Visitors', value: 10000 },
    { stage: 'Leads Generated', value: 3200 },
    { stage: 'Qualified Leads', value: 1800 },
    { stage: 'Proposals Sent', value: 600 },
    { stage: 'Negotiations', value: 280 },
    { stage: 'Closed Won', value: 120 },
];

<ChartProvider>
  <FunnelChart
    data={salesPipeline}
    nameKey="stage"
    valueKey="value"
    showConversionRate
    labelPosition="right"
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A funnel displays horizontal segments that narrow progressively. Segment height represents the stage value. Labels show stage names, values, and optionally conversion rates.',
        overflowContent: 'Best with 4-7 stages. More stages make individual segments too thin. Consider grouping related stages if there are many.',
        internationalization: 'Format values and percentages according to locale. Stage labels should be translatable. Consider RTL layout for RTL languages.',
    },

    formatting: {
        emphasis: 'Use color gradient from top to bottom, or color by conversion health (green for good rates, red for problem areas). The narrowing shape naturally emphasizes drop-off.',
        alignment: 'Center-align the funnel. Place labels consistently (left, right, or center). Show conversion rates between stages for context.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of stage objects in sequential order.' },
        { name: 'nameKey', type: "string", default: "'name'", description: 'Property name for stage labels.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for stage values.' },
        { name: 'labelPosition', type: "'left' | 'right' | 'center'", default: "'right'", description: 'Position of stage labels.' },
        { name: 'showConversionRate', type: "boolean", default: "false", description: 'Display conversion percentage between stages.' },
        { name: 'showTooltip', type: "boolean", default: "true", description: 'Display detailed tooltip on hover.' },
        { name: 'colors', type: "string[]", description: 'Custom colors for each stage.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the funnel (e.g., "Sales funnel showing conversion from 10,000 visitors to 120 closed deals")' },
            { attribute: 'aria-describedby', usage: 'Links to conversion data table' },
        ],
        screenReader: 'Screen readers announce each stage with its name, value, and conversion rate from previous stage. Summarize overall conversion at end.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between funnel stages' },
            { key: 'Enter', action: 'Show stage details' },
        ],
    },
};

export default FunnelChartDoc;
