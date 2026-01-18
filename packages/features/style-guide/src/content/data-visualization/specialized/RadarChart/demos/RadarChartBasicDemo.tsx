/**
 * RadarChart Basic Demo
 */
import React from 'react';
import { RadarChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { RadarChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { subject: 'Math', A: 120, B: 110 },
    { subject: 'Chinese', A: 98, B: 130 },
    { subject: 'English', A: 86, B: 130 },
    { subject: 'Geography', A: 99, B: 100 },
    { subject: 'Physics', A: 85, B: 90 },
];

<ChartProvider>
  <RadarChart
    data={data}
    angleKey="subject"
    dataKeys={['A', 'B']}
    dataKeyNames={{ A: 'Student A', B: 'Student B' }}
    height={350}
  />
</ChartProvider>`;

const data = [
    { subject: 'Math', A: 120, B: 110 },
    { subject: 'Chinese', A: 98, B: 130 },
    { subject: 'English', A: 86, B: 130 },
    { subject: 'Geography', A: 99, B: 100 },
    { subject: 'Physics', A: 85, B: 90 },
    { subject: 'History', A: 65, B: 85 },
    { subject: 'Chemistry', A: 78, B: 95 },
    { subject: 'Biology', A: 92, B: 88 },
];

const RadarChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Radar Chart" description="Multivariate comparison">
        <RadarChart
            data={data}
            angleKey="subject"
            dataKeys={['A', 'B']}
            dataKeyNames={{ A: 'Student A', B: 'Student B' }}
            height={350}
        />
    </DemoCard>
);

export default RadarChartBasicDemo;
