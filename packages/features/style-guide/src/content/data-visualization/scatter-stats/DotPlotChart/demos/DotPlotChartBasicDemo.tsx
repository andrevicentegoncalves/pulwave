import React from 'react';
import { DotPlotChart, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { category: 'Device A', value: 85, color: chartTheme.status.info },
    { category: 'Device B', value: 72, color: chartTheme.status.success },
    { category: 'Device C', value: 93, color: chartTheme.status.warning },
    { category: 'Device D', value: 64, color: chartTheme.status.error },
];

export const DotPlotChartBasicDemo = () => {
    return (
        <DemoCard title="Dot Plot Chart" description="Comparison chart using dots to represent values across categories.">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                padding: '1rem',
                minHeight: '350px',
                width: '100%',
                overflow: 'auto'
            }}>
                <DotPlotChart
                    data={data}
                    layout="horizontal"
                    valueFormatter={(v) => `${v}%`}
                    height={250}
                />
            </div>
        </DemoCard>
    );
};

