import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const TimelineDoc: ComponentDoc = {
    name: 'Timeline',
    status: 'stable',
    version: '1.0.0',
    description: 'Linear visualization showing events along a chronological axis. Ideal for project milestones, historical events, and activity logs. Events are positioned proportionally or evenly based on date.',

    whenToUse: [
        'Project milestones and roadmaps',
        'Historical event sequences',
        'User activity or audit logs',
        'Release history or changelog',
        'Biography or company history',
    ],

    whenNotToUse: [
        'Tasks with durations (start and end) - use Gantt chart',
        'Overlapping concurrent events',
        'Very many events (>50) without grouping',
        'When quantitative data matters more than sequence',
        'Non-chronological data',
    ],

    usage: `
\`\`\`tsx
import { TimelineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const projectMilestones = [
    { date: '2024-01-15', event: 'Project Kickoff', type: 'milestone', description: 'Initial team meeting and scope definition' },
    { date: '2024-02-01', event: 'Design Complete', type: 'milestone', description: 'UI/UX designs approved' },
    { date: '2024-03-15', event: 'Beta Launch', type: 'release', description: 'Private beta with select users' },
    { date: '2024-05-01', event: 'Public Launch', type: 'release', description: 'General availability' },
];

<ChartProvider>
  <TimelineChart
    data={projectMilestones}
    dateKey="date"
    eventKey="event"
    orientation="horizontal"
    showConnectors
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A timeline displays events as points along a chronological axis. Essential elements include event markers, dates, labels, and optional connectors between events.',
        overflowContent: 'For many events, consider grouping by year/phase, filtering, or using zoom. Vertical timelines scroll better for many events.',
        internationalization: 'Format dates according to locale. Event descriptions should be translatable. Consider text direction for RTL languages.',
    },

    formatting: {
        emphasis: 'Color-code events by type or importance. Milestones often use larger markers. Use icons to indicate event categories.',
        alignment: 'Horizontal timelines read left-to-right. Vertical timelines work for many events. Alternate event details above/below the line for clarity.',
    },

    props: [
        { name: 'data', type: "Event[]", required: true, description: 'Array of event objects with date and description.' },
        { name: 'dateKey', type: "string", default: "'date'", description: 'Property name for event dates.' },
        { name: 'eventKey', type: "string", default: "'event'", description: 'Property name for event labels.' },
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Timeline layout direction.' },
        { name: 'showConnectors', type: "boolean", default: "true", description: 'Show lines connecting events.' },
        { name: 'proportional', type: "boolean", default: "false", description: 'Space events proportionally by date (true) or evenly (false).' },
        { name: 'onEventClick', type: "(event: Event) => void", description: 'Callback when an event is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="list"', usage: 'Timeline is marked as a list of events' },
            { attribute: 'aria-label', usage: 'Describes the timeline (e.g., "Timeline showing project milestones from January to May 2024")' },
        ],
        screenReader: 'Screen readers announce events in chronological order with date and description. Use semantic list markup.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between events' },
            { key: 'Enter', action: 'Show event details' },
            { key: 'Arrow Keys', action: 'Navigate previous/next event' },
        ],
    },
};

export default TimelineDoc;
