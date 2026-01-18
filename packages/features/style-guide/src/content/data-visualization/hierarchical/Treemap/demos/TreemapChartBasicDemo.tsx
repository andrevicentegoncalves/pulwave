import React from 'react';
import { TreemapChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    {
        name: 'Root',
        children: [
            { name: 'Axes', size: 1300 },
            { name: 'Controls', size: 900 },
            { name: 'Legends', size: 2000 },
            { name: 'Layout', size: 1000 },
            { name: 'Shapes', size: 2500 },
            { name: 'Palettes', size: 1600 },
            { name: 'Scales', size: 1200 },
        ],
    },
];

export const TreemapChartBasicDemo = () => {
    return (
        <DemoCard title="Treemap Chart" description="Displays hierarchical data as nested rectangles.">
            <TreemapChart
                data={data}
                dataKey="size"
                aspectRatio={4 / 3}
            />
        </DemoCard>
    );
};

