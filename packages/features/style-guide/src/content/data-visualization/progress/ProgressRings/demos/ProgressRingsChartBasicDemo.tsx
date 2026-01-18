import React from 'react';
import { ProgressRingsChart, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { name: 'Completed', value: 85, color: chartTheme.status.success },
    { name: 'In Progress', value: 60, color: chartTheme.status.active },
    { name: 'Pending', value: 30, color: chartTheme.status.warning },
];

export const ProgressRingsChartBasicDemo = () => {
    return (
        <DemoCard title="Progress Rings" description="Concentric rings showing progress for multiple metrics.">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ProgressRingsChart
                    data={data}
                    centerValue="85%"
                    centerLabel="Total"
                    size={240}
                />
            </div>
        </DemoCard>
    );
};

