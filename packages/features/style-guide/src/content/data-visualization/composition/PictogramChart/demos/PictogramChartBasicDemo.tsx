import React from 'react';
import { PictogramChart, chartTheme } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { PictogramChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Apples', value: 45, color: chartTheme.status.error },
    { name: 'Bananas', value: 60, color: chartTheme.status.warning },
    { name: 'Oranges', value: 35, color: '#FFA500' },
    { name: 'Grapes', value: 25, color: chartTheme.status.active },
    { name: 'Strawberries', value: 20, color: '#FF1493' },
    { name: 'Blueberries', value: 15, color: '#4169E1' },
];

<ChartProvider>
  <PictogramChart
    data={data}
    iconPerUnit={5}
    icon="●"
    iconSize={20}
    layout="row"
    showValues
    showLegend={false}
  />
</ChartProvider>`;

const data = [
    { name: 'Apples', value: 45, color: chartTheme.status.error },
    { name: 'Bananas', value: 60, color: chartTheme.status.warning },
    { name: 'Oranges', value: 35, color: '#FFA500' },
    { name: 'Grapes', value: 25, color: chartTheme.status.active },
    { name: 'Strawberries', value: 20, color: '#FF1493' },
    { name: 'Blueberries', value: 15, color: '#4169E1' },
];

const PictogramChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Pictogram Chart"
        description="Each dot represents 5 units"
    >
        <div style={{ width: '100%' }}>
            <PictogramChart
                data={data}
                iconPerUnit={5}
                icon="●"
                iconSize={20}
                layout="row"
                showValues
                showLegend={false}
            />
        </div>
    </DemoCard>
);

export default PictogramChartBasicDemo;
