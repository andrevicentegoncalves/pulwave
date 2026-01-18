import React from 'react';
import { BulletChart, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

export const BulletChartBasicDemo = () => {
    return (
        <DemoCard title="Bullet Chart" description="KPI visualization showing progress against ranges and targets.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <BulletChart
                    title="Revenue"
                    subtitle="YTD (USD)"
                    value={275}
                    target={250}
                    valueFormatter={(v) => `$${v}k`}
                    ranges={[
                        { max: 150, color: chartTheme.status.error, label: 'Poor' },
                        { max: 225, color: chartTheme.status.warning, label: 'Average' },
                        { max: 300, color: chartTheme.status.success, label: 'Good' },
                    ]}
                />

                <BulletChart
                    title="Customer Satisfaction"
                    value={4.2}
                    maxValue={5}
                    target={4.5}
                    ranges={[
                        { max: 3, color: chartTheme.status.error },
                        { max: 4, color: chartTheme.status.warning },
                        { max: 5, color: chartTheme.status.success },
                    ]}
                />
            </div>
        </DemoCard>
    );
};

