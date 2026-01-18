/**
 * Timeline Basic Demo
 */
import React from 'react';
import { TimelineChart as Timeline } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Timeline, ChartProvider } from '@pulwave/ui/data-visualization';

const events = [
    { id: 1, title: 'Planning', start: '2024-01-01', end: '2024-01-20', status: 'complete' },
    { id: 2, title: 'Design', start: '2024-01-15', end: '2024-02-10', status: 'complete' },
    { id: 3, title: 'Development', start: '2024-02-05', end: '2024-04-15', status: 'active' },
    { id: 4, title: 'Testing', start: '2024-03-20', end: '2024-04-30', status: 'active' },
    { id: 5, title: 'Beta Launch', start: '2024-04-25', end: '2024-04-25', status: 'pending' },
    { id: 6, title: 'Marketing', start: '2024-04-01', end: '2024-06-01', status: 'pending' },
    { id: 7, title: 'Deployment', start: '2024-05-15', end: '2024-06-01', status: 'pending' },
    { id: 8, title: 'Bug Fixes', start: '2024-03-01', end: '2024-03-15', status: 'delayed' },
];

<ChartProvider>
  <Timeline events={events} />
</ChartProvider>`;

const events = [
    { id: 1, title: 'Planning', start: '2024-01-01', end: '2024-01-20', status: 'complete' },
    { id: 2, title: 'Design', start: '2024-01-15', end: '2024-02-10', status: 'complete' },
    { id: 3, title: 'Development', start: '2024-02-05', end: '2024-04-15', status: 'active' },
    { id: 4, title: 'Testing', start: '2024-03-20', end: '2024-04-30', status: 'active' },
    { id: 5, title: 'Beta Launch', start: '2024-04-25', end: '2024-04-25', status: 'pending' },
    { id: 6, title: 'Marketing', start: '2024-04-01', end: '2024-06-01', status: 'pending' },
    { id: 7, title: 'Deployment', start: '2024-05-15', end: '2024-06-01', status: 'pending' },
    { id: 8, title: 'Bug Fixes', start: '2024-03-01', end: '2024-03-15', status: 'delayed' },
];

const TimelineBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Timeline" description="Chronological events with duration">
        <Timeline
            events={events}
        />
    </DemoCard>
);

export default TimelineBasicDemo;
