import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const ChordDiagramDoc: ComponentDoc = {
    name: 'ChordDiagram',
    status: 'stable',
    version: '1.1.0',
    description: 'Visualizes inter-relationships and flows between entities in a circular layout. Arcs represent entities (sized by total flow), and chords connect pairs showing relationship strength through width.',

    whenToUse: [
        'Showing bidirectional flows between entities (trade, migration, communication)',
        'Visualizing complex many-to-many relationships',
        'When relationship symmetry/asymmetry is important',
        'Comparing relative relationship strengths',
        'Genomics, trade economics, or network analysis contexts',
    ],

    whenNotToUse: [
        'More than 12-15 entities - becomes visually cluttered',
        'Unidirectional flows - use Sankey diagram instead',
        'When exact values matter - hard to read precisely',
        'Hierarchical relationships - use tree or sunburst',
        'Audience unfamiliar with matrix visualizations',
    ],

    usage: `
\`\`\`tsx
import { ChordDiagram, ChartProvider } from '@pulwave/ui/data-visualization';

// Trade flow matrix between regions (in billions)
const tradeMatrix = [
    [0, 5.8, 3.2, 4.1],    // North America
    [4.2, 0, 6.1, 2.3],    // Europe
    [2.8, 5.5, 0, 7.2],    // Asia
    [3.1, 1.9, 6.8, 0],    // Other
];

const regions = ['North America', 'Europe', 'Asia', 'Other'];

<ChartProvider>
  <ChordDiagram
    matrix={tradeMatrix}
    labels={regions}
    size={500}
    innerRadius={0.7}
    padAngle={0.04}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A chord diagram displays entities as arcs around a circle, with chords connecting related pairs. Arc length represents total flow, chord width represents relationship magnitude. Color typically matches source entity.',
        overflowContent: 'Best with 5-12 entities. More entities create too many chords. Consider grouping related entities or filtering to top relationships.',
        internationalization: 'Format flow values according to locale. Entity labels should be translatable. Consider reading direction for label placement.',
    },

    formatting: {
        emphasis: 'Color arcs distinctly per entity. Chords inherit source or target color (configurable). Highlight related chords on hover for clarity.',
        alignment: 'Center the diagram. Ensure labels don\'t overlap arcs. Order entities to minimize chord crossings when possible.',
    },

    props: [
        { name: 'matrix', type: "number[][]", required: true, description: 'Square adjacency matrix where matrix[i][j] represents flow from i to j.' },
        { name: 'labels', type: "string[]", required: true, description: 'Labels for each entity, matching matrix indices.' },
        { name: 'size', type: "number", default: "500", description: 'Chart diameter in pixels.' },
        { name: 'innerRadius', type: "number", default: "0.7", description: 'Inner radius as ratio of outer radius (0-1).' },
        { name: 'padAngle', type: "number", default: "0.02", description: 'Padding angle between arcs in radians.' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for entities.' },
        { name: 'onChordClick', type: "(source: number, target: number) => void", description: 'Callback when a chord is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the relationship network (e.g., "Chord diagram showing trade flows between regions")' },
            { attribute: 'aria-describedby', usage: 'Links to matrix data table' },
        ],
        screenReader: 'Screen readers announce each entity with its total flow, then each relationship pair with flow amount. Provide a matrix table alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between arcs (entities)' },
            { key: 'Enter', action: 'Focus on chords connected to selected entity' },
            { key: 'Arrow Keys', action: 'Navigate between chords' },
        ],
    },
};

export default ChordDiagramDoc;
