/**
 * ScatterChart Basic Demo
 */
import React from 'react';
import { ScatterChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { ScatterChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { x: 45, y: 80, z: 150 },
    { x: 52, y: 120, z: 165 },
    { x: 58, y: 95, z: 175 },
    { x: 65, y: 140, z: 180 },
    { x: 70, y: 110, z: 190 },
    { x: 75, y: 160, z: 185 },
    { x: 82, y: 130, z: 195 },
    { x: 88, y: 170, z: 200 },
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
    { x: 130, y: 220, z: 300 },
    { x: 160, y: 350, z: 450 },
    { x: 145, y: 180, z: 320 },
    { x: 125, y: 320, z: 240 },
    { x: 155, y: 270, z: 380 },
    { x: 135, y: 150, z: 290 },
    { x: 165, y: 380, z: 420 },
    { x: 105, y: 240, z: 210 },
    { x: 175, y: 290, z: 460 },
    { x: 115, y: 330, z: 230 },
    { x: 142, y: 200, z: 310 },
    { x: 158, y: 360, z: 390 },
    { x: 128, y: 140, z: 270 },
    { x: 138, y: 310, z: 340 },
];

<ChartProvider>
  <ScatterChart
    data={data}
    height={300}
  />
</ChartProvider>`;

const data = [
    { x: 45, y: 80, z: 150 },
    { x: 52, y: 120, z: 165 },
    { x: 58, y: 95, z: 175 },
    { x: 65, y: 140, z: 180 },
    { x: 70, y: 110, z: 190 },
    { x: 75, y: 160, z: 185 },
    { x: 82, y: 130, z: 195 },
    { x: 88, y: 170, z: 200 },
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
    { x: 130, y: 220, z: 300 },
    { x: 160, y: 350, z: 450 },
    { x: 145, y: 180, z: 320 },
    { x: 125, y: 320, z: 240 },
    { x: 155, y: 270, z: 380 },
    { x: 135, y: 150, z: 290 },
    { x: 165, y: 380, z: 420 },
    { x: 105, y: 240, z: 210 },
    { x: 175, y: 290, z: 460 },
    { x: 115, y: 330, z: 230 },
    { x: 142, y: 200, z: 310 },
    { x: 158, y: 360, z: 390 },
    { x: 128, y: 140, z: 270 },
    { x: 138, y: 310, z: 340 },
];

const ScatterChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Scatter Chart" description="Correlation">
        <ScatterChart
            data={data}
            height={300}
        />
    </DemoCard>
);

export default ScatterChartBasicDemo;
