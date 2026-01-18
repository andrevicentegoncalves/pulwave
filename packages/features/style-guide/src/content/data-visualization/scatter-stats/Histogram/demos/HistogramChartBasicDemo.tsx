import React from 'react';
import { HistogramChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    65, 68, 70, 72, 73, 75, 75, 76, 78, 78, 79, 79, 81, 82, 85, 88, 90, 69, 70, 85,
    72, 75, 76, 76, 77, 80, 80, 81, 82, 83, 84, 85, 86, 88, 72, 74, 76, 80, 82
];

export const HistogramChartBasicDemo = () => {
    return (
        <DemoCard title="Histogram Chart" description="Shows frequency distribution of continuous data.">
            <HistogramChart
                data={data}
                bins={8}
                showMean
                showMedian
            />
        </DemoCard>
    );
};

