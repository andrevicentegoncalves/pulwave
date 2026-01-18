/**
 * VennDiagram Basic Demo
 */
import React from 'react';
import { VennDiagram } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { VennDiagram, ChartProvider } from '@pulwave/ui/data-visualization';

const sets = [
    { id: 'A', label: 'Set A', value: 100 },
    { id: 'B', label: 'Set B', value: 80 },
];

const intersections = [
    { sets: ['A', 'B'], value: 30 },
];

<ChartProvider>
  <VennDiagram
    sets={sets}
    intersections={intersections}
  />
</ChartProvider>`;

const sets = [
    { id: 'A', value: 100, label: 'Set A' },
    { id: 'B', value: 80, label: 'Set B' },
];

const intersections = [
    { sets: ['A', 'B'], value: 30 },
];

const VennDiagramBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Venn Diagram" description="Set overlaps visualization">
        <VennDiagram
            sets={sets}
            intersections={intersections}
        />
    </DemoCard>
);

export default VennDiagramBasicDemo;
