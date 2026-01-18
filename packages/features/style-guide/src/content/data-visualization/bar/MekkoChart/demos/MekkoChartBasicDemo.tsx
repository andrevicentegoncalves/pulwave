import React from 'react';
import { MekkoChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    {
        name: 'Region A',
        total: 1000,
        segments: [
            { name: 'Product X', value: 400 },
            { name: 'Product Y', value: 600 }
        ]
    },
    {
        name: 'Region B',
        total: 2000,
        segments: [
            { name: 'Product X', value: 1200 },
            { name: 'Product Y', value: 800 }
        ]
    },
    {
        name: 'Region C',
        total: 500,
        segments: [
            { name: 'Product X', value: 100 },
            { name: 'Product Y', value: 400 }
        ]
    }
];

export const MekkoChartBasicDemo = () => {
    return (
        <DemoCard title="Mekko Chart" description="Variable width bar chart visualizing market share and product mix.">
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <MekkoChart
                    data={data}
                    height={400}
                    width={600}
                    valueFormatter={(v) => `$${v}`}
                />
            </div>
        </DemoCard>
    );
};

