import React from 'react';
import { CircularLineChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { metric: 'Speed', ours: 90, theirs: 70 },
    { metric: 'Reliability', ours: 85, theirs: 80 },
    { metric: 'Cost', ours: 60, theirs: 90 },
    { metric: 'Support', ours: 95, theirs: 50 },
    { metric: 'Features', ours: 80, theirs: 75 },
];

export const CircularLineChartBasicDemo = () => {
    return (
        <DemoCard title="Circular Line (Radar) Chart" description="Multivariate data comparison on a radial access.">
            <ChartProvider>
                <CircularLineChart
                    data={data}
                    categoryKey="metric"
                    dataKeys={[
                        { key: 'ours', name: 'Our Product', color: chartTheme.status.active },
                        { key: 'theirs', name: 'Competitor', color: chartTheme.status.neutral },
                    ]}
                    showLegend={true}
                />
            </ChartProvider>
        </DemoCard>
    );
};

