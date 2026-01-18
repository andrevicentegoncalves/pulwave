/**
 * GanttChart Basic Demo
 */
import React from 'react';
import { GanttChart, chartTheme } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { GanttChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';

const data = [
    { id: 'task1', name: 'Research', start: new Date('2024-01-01'), end: new Date('2024-01-07'), color: chartTheme.categorical[6] },
    { id: 'task2', name: 'Design', start: new Date('2024-01-05'), end: new Date('2024-01-15'), color: chartTheme.categorical[0] },
    { id: 'task3', name: 'Development', start: new Date('2024-01-12'), end: new Date('2024-02-05'), color: chartTheme.categorical[2] },
    { id: 'task4', name: 'Testing', start: new Date('2024-01-28'), end: new Date('2024-02-10'), color: chartTheme.categorical[3] },
];

<ChartProvider>
  <GanttChart data={data} />
</ChartProvider>`;

const data = [
    { id: 'task1', name: 'Research', start: new Date('2024-01-01'), end: new Date('2024-01-07'), color: chartTheme.categorical[6], status: 'done' },
    { id: 'task2', name: 'Design', start: new Date('2024-01-05'), end: new Date('2024-01-15'), color: chartTheme.categorical[0], status: 'done' },
    { id: 'task3', name: 'Development', start: new Date('2024-01-12'), end: new Date('2024-02-05'), color: chartTheme.categorical[2], status: 'done' },
    { id: 'task4', name: 'Testing', start: new Date('2024-01-28'), end: new Date('2024-02-10'), color: chartTheme.categorical[3], status: 'done' },
    { id: 'task5', name: 'Documentation', start: new Date('2024-02-01'), end: new Date('2024-02-12'), color: chartTheme.categorical[1], status: 'done' },
    { id: 'task6', name: 'Deployment', start: new Date('2024-02-10'), end: new Date('2024-02-15'), color: chartTheme.categorical[4], status: 'done' },
];

const GanttChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Gantt Chart" description="Project timeline with overlapping phases">
        <GanttChart
            data={data}
        />
    </DemoCard>
);

export default GanttChartBasicDemo;
