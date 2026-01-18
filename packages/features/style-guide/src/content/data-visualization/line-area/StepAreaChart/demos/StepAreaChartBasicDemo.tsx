import React from 'react';
import { StepAreaChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 550 },
    { name: 'Apr', value: 450 },
    { name: 'May', value: 600 },
    { name: 'Jun', value: 500 },
];

export const StepAreaChartBasicDemo = () => {
    return (
        <DemoCard title="Step Area Chart" description="Area chart using step (staircase) interpolation.">
            <StepAreaChart
                data={data}
                dataKey="value"
                stepType="stepAfter"
                color="#8B5CF6"
            />
        </DemoCard>
    );
};

