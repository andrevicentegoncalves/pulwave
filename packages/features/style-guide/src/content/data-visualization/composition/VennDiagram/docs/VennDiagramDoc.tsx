import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const VennDiagramDoc: ComponentDoc = {
    name: 'VennDiagram',
    status: 'stable',
    version: '1.0.0',
    description: 'Visualizes set relationships using overlapping circles. Shows the size of each set and their intersections. Ideal for comparing commonalities, differences, and unique elements between groups.',

    whenToUse: [
        'Showing overlap between 2-4 groups or categories',
        'Comparing shared vs unique attributes',
        'Survey or research data with multiple criteria',
        'Feature comparison between products',
        'Logical set operations visualization',
    ],

    whenNotToUse: [
        'More than 4 sets - becomes unreadable',
        'When precise proportions matter - areas are approximate',
        'No meaningful overlap between sets',
        'Complex multi-set intersections (>3 sets overlapping)',
        'When relationships are hierarchical, not overlapping',
    ],

    usage: `
\`\`\`tsx
import { VennDiagram, ChartProvider } from '@pulwave/ui/data-visualization';

const skillsOverlap = [
    { sets: ['Frontend'], size: 120, label: 'Frontend Devs' },
    { sets: ['Backend'], size: 100, label: 'Backend Devs' },
    { sets: ['Design'], size: 60, label: 'Designers' },
    { sets: ['Frontend', 'Backend'], size: 35, label: 'Full Stack' },
    { sets: ['Frontend', 'Design'], size: 25, label: 'UI Engineers' },
    { sets: ['Backend', 'Design'], size: 10, label: 'Design Systems' },
    { sets: ['Frontend', 'Backend', 'Design'], size: 5, label: 'Unicorns' },
];

<ChartProvider>
  <VennDiagram
    sets={skillsOverlap}
    width={450}
    height={400}
    showLabels
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A Venn diagram displays overlapping circles where each circle represents a set. Overlap regions show intersections. Labels identify sets and optionally show counts.',
        overflowContent: 'Works best with 2-3 sets. 4 sets require Euler diagram layout. Beyond 4 sets, consider alternative visualizations like UpSet plots.',
        internationalization: 'Set labels should be translatable. Format counts according to locale. Circle sizes may not perfectly represent proportions.',
    },

    formatting: {
        emphasis: 'Use distinct, semi-transparent colors so overlaps are visible. Label placement should avoid overlaps. Highlight intersections on hover.',
        alignment: 'Center the diagram. Position labels clearly outside or inside circles. Consider aspect ratio for 3+ circles.',
    },

    props: [
        { name: 'sets', type: "VennSet[]", required: true, description: 'Array defining sets and their intersections with sizes.' },
        { name: 'width', type: "number", default: "400", description: 'Chart width in pixels.' },
        { name: 'height', type: "number", default: "400", description: 'Chart height in pixels.' },
        { name: 'showLabels', type: "boolean", default: "true", description: 'Display labels on sets and intersections.' },
        { name: 'colors', type: "string[]", description: 'Custom colors for each primary set.' },
        { name: 'onSetClick', type: "(set: VennSet) => void", description: 'Callback when a set region is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the set comparison (e.g., "Venn diagram showing overlap between Frontend, Backend, and Design teams")' },
            { attribute: 'aria-describedby', usage: 'Links to set membership table' },
        ],
        screenReader: 'Screen readers announce each set with its size, then each intersection with the sets involved and size. Describe what the overlap means.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between set regions' },
            { key: 'Enter', action: 'Show details for selected region' },
        ],
    },
};

export default VennDiagramDoc;
