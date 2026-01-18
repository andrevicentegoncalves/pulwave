import React from 'react';
import { StepLineChart } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { StepLineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { time: '9:00', value: 100 },
    { time: '10:00', value: 150 },
    { time: '11:00', value: 150 },
    { time: '12:00', value: 200 },
    { time: '13:00', value: 180 },
];

<ChartProvider>
  <StepLineChart
    data={data}
    xKey="time"
    dataKey="value"
    stepType="stepAfter"
  />
</ChartProvider>`;

const data = [
    { time: '9:00', value: 100 },
    { time: '10:00', value: 150 },
    { time: '11:00', value: 150 },
    { time: '12:00', value: 200 },
    { time: '13:00', value: 180 },
];

const StepLineChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Step line chart showing value changes over time."
    >
        <div style={{ height: 400, width: '100%' }}>
            <StepLineChart
                data={data}
                xKey="time"
                dataKey="value"
                stepType="stepAfter"
            />
        </div>
    </DemoCard>
);

export default StepLineChartBasicDemo;
