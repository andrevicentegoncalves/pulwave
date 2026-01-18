import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const ParliamentChartDoc: ComponentDoc = {
    name: 'ParliamentChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Semicircle dot chart visualizing seat distributions in legislative bodies. Each dot represents a seat, colored by party/faction. Instantly communicates majority, coalition possibilities, and representation.',

    whenToUse: [
        'Legislative seat distribution visualization',
        'Election results with seat allocation',
        'Board or committee composition',
        'Any assembly or group composition by faction',
        'When the visual resemblance to a parliament chamber helps understanding',
    ],

    whenNotToUse: [
        'Non-discrete data (continuous values) - use pie or bar',
        'More than ~10 parties - becomes hard to distinguish',
        'When exact seat counts matter more than visual impact',
        'Very large assemblies (>500 seats) - dots become too small',
        'Data not about group composition',
    ],

    usage: `
\`\`\`tsx
import { ParliamentChart, ChartProvider } from '@pulwave/ui/data-visualization';

const electionResults = [
    { party: 'Progressive Party', seats: 145, color: '#3B82F6' },
    { party: 'Conservative Union', seats: 132, color: '#EF4444' },
    { party: 'Green Alliance', seats: 48, color: '#10B981' },
    { party: 'Liberal Democrats', seats: 35, color: '#F59E0B' },
    { party: 'Independent', seats: 15, color: '#6B7280' },
];

<ChartProvider>
  <ParliamentChart
    data={electionResults}
    nameKey="party"
    valueKey="seats"
    layout="semicircle"
    showMajorityLine
    totalSeats={375}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A parliament chart displays dots arranged in semicircular rows. Each dot is one seat, colored by group. Essential elements include the dot grid, legend, and optionally a majority line.',
        overflowContent: 'Works well up to ~500 seats. Very large assemblies need larger display or grouped representation. Consider tooltips for precise seat counts.',
        internationalization: 'Party names should be translatable. Seat count labels should be formatted per locale. The semicircle layout is universally understood.',
    },

    formatting: {
        emphasis: 'Use party brand colors where available. Arrange parties logically (left-to-right politically, or by seat count). A majority line helps visualize coalition math.',
        alignment: 'Center the semicircle. Place legend below or beside. Ensure color contrast between adjacent parties.',
    },

    props: [
        { name: 'data', type: "Party[]", required: true, description: 'Array of party/group objects with name, seats, and color.' },
        { name: 'nameKey', type: "string", required: true, description: 'Property name for party/group labels.' },
        { name: 'valueKey', type: "string", default: "'seats'", description: 'Property name for seat counts.' },
        { name: 'layout', type: "'semicircle' | 'full'", default: "'semicircle'", description: 'Semicircle (parliament) or full circle arrangement.' },
        { name: 'showMajorityLine', type: "boolean", default: "false", description: 'Display a line at the majority threshold.' },
        { name: 'totalSeats', type: "number", description: 'Total seats (calculated from data if not provided).' },
        { name: 'onPartyClick', type: "(party: Party) => void", description: 'Callback when a party section is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the composition (e.g., "Parliament chart showing 375 seats across 5 parties")' },
            { attribute: 'aria-describedby', usage: 'Links to seat distribution table' },
        ],
        screenReader: 'Screen readers announce each party with name, seat count, and percentage. Indicate if any party has majority. Describe coalition possibilities.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between party groups' },
            { key: 'Enter', action: 'Show party details' },
        ],
    },
};

export default ParliamentChartDoc;
