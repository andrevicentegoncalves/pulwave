import React from 'react';
import { HeatmapChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const xLabels = ['A', 'B', 'C', 'D', 'E'];
const yLabels = ['v1', 'v2', 'v3', 'v4', 'v5'];
const data: { row: string; col: string; value: number }[] = [];
for (const x of xLabels) {
    for (const y of yLabels) {
        data.push({ col: x, row: y, value: Math.floor(Math.random() * 100) });
    }
}

export const HeatmapChartBasicDemo = () => {
    return (
        <DemoCard title="Heatmap Chart" description="Graphical representation of data where values are depicted by color.">
            <HeatmapChart
                data={data}
                xLabels={xLabels}
                yLabels={yLabels}
            />
        </DemoCard>
    );
};
