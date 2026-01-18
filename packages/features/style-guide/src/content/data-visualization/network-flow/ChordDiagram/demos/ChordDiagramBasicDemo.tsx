import React from 'react';
import { ChordDiagram } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { from: 'Region A', to: 'Region B', value: 15 },
    { from: 'Region A', to: 'Region C', value: 20 },
    { from: 'Region B', to: 'Region C', value: 10 },
    { from: 'Region B', to: 'Region A', value: 5 },
    { from: 'Region C', to: 'Region A', value: 25 },
];

export const ChordDiagramBasicDemo = () => {
    return (
        <DemoCard title="Chord Diagram" description="Displays relationships between entities in a circular layout.">
            <ChordDiagram
                data={data}
                size={500}
            />
        </DemoCard>
    );
};

