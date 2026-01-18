import React from 'react';
import { PerformanceGauge, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const ranges = [
    { min: 0, max: 40, color: chartTheme.status.error, label: 'Poor' },
    { min: 40, max: 70, color: chartTheme.status.warning, label: 'Average' },
    { min: 70, max: 100, color: chartTheme.status.success, label: 'Excellent' },
];

export const PerformanceGaugeBasicDemo = () => {
    return (
        <DemoCard title="Performance Gauge" description="Semi-circle gauge for displaying a single metric against defined ranges.">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <PerformanceGauge
                    value={75}
                    ranges={ranges}
                    valueLabel="Efficiency"
                />
            </div>
        </DemoCard>
    );
};

