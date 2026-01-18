import React from 'react';
import { ThresholdAreaChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { name: 'Jan', value: 2500 },
    { name: 'Feb', value: 2800 },
    { name: 'Mar', value: 3100 },
    { name: 'Apr', value: 2900 },
    { name: 'May', value: 3500 },
    { name: 'Jun', value: 3800 },
    { name: 'Jul', value: 2400 },
];

export const ThresholdAreaChartBasicDemo = () => {
    return (
        <DemoCard title="Threshold Area Chart" description="Shows values relative to a threshold (dotted line). data points above are green, below are red.">
            <ThresholdAreaChart
                data={data}
                threshold={3000}
                thresholdLabel="Target: 3000"
                aboveColor="#10B981"
                belowColor="#EF4444"
            />
        </DemoCard>
    );
};

