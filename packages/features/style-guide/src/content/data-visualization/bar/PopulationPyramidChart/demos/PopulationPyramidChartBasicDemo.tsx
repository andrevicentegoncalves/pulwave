import React from 'react';
import { PopulationPyramidChart } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { PopulationPyramidChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { age: '0-10', male: 500, female: 480 },
    { age: '11-20', male: 600, female: 580 },
    { age: '21-30', male: 800, female: 850 },
    { age: '31-40', male: 900, female: 920 },
    { age: '41-50', male: 700, female: 720 },
    { age: '51-60', male: 500, female: 520 },
    { age: '60+', male: 400, female: 450 },
];

<ChartProvider>
  <PopulationPyramidChart
    data={data}
    leftKey="male"
    rightKey="female"
    categoryKey="age"
  />
</ChartProvider>`;

const data = [
    { age: '0-10', male: 500, female: 480 },
    { age: '11-20', male: 600, female: 580 },
    { age: '21-30', male: 800, female: 850 },
    { age: '31-40', male: 900, female: 920 },
    { age: '41-50', male: 700, female: 720 },
    { age: '51-60', male: 500, female: 520 },
    { age: '60+', male: 400, female: 450 },
];

const PopulationPyramidChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Population pyramid showing age distribution."
    >
        <div style={{ height: 400, width: '100%' }}>
            <PopulationPyramidChart
                data={data}
                leftKey="male"
                rightKey="female"
                categoryKey="age"
            />
        </div>
    </DemoCard>
);

export default PopulationPyramidChartBasicDemo;
