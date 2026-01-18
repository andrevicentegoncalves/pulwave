/**
 * Treemap Basic Demo
 */
import React from 'react';
import { TreemapChart as Treemap } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { TreemapChart as Treemap, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Category A', size: 300 },
    { name: 'Category B', size: 200 },
    { name: 'Category C', size: 150 },
    { name: 'Category D', size: 100 },
    { name: 'Category E', size: 80 },
    { name: 'Category F', size: 50 },
];

<ChartProvider>
  <Treemap
    data={data}
    height={300}
  />
</ChartProvider>`;

// Flat array with 'size' key (default dataKey)
const data = [
    { name: 'Category A', size: 300 },
    { name: 'Category B', size: 200 },
    { name: 'Category C', size: 150 },
    { name: 'Category D', size: 100 },
    { name: 'Category E', size: 80 },
    { name: 'Category F', size: 50 },
];

const TreemapBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Treemap" description="Hierarchical data as nested rectangles">
        <Treemap
            data={data}
            height={300}
        />
    </DemoCard>
);

export default TreemapBasicDemo;
