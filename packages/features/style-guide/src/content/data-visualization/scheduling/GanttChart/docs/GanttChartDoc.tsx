import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const GanttChartDoc: ComponentDoc = {
    name: 'GanttChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Horizontal bar chart illustrating project schedules with tasks plotted along a timeline. Shows task durations, dependencies, milestones, and progress. Essential for project management and resource planning.',

    whenToUse: [
        'Project planning and schedule visualization',
        'Resource allocation and capacity planning',
        'Tracking task progress against deadlines',
        'Showing task dependencies and critical path',
        'Sprint or release planning in software development',
    ],

    whenNotToUse: [
        'Simple task lists without timing - use to-do list',
        'Very many tasks (>50) without grouping - becomes overwhelming',
        'Real-time task tracking - use Kanban board',
        'When exact timing isn\'t important',
        'Ad-hoc work without defined schedules',
    ],

    usage: `
\`\`\`tsx
import { GanttChart, ChartProvider } from '@pulwave/ui/data-visualization';

const projectTasks = [
    { id: '1', name: 'Requirements', start: '2024-01-01', end: '2024-01-15', group: 'Planning', progress: 100 },
    { id: '2', name: 'Design', start: '2024-01-10', end: '2024-01-25', group: 'Planning', progress: 80, dependencies: ['1'] },
    { id: '3', name: 'Development', start: '2024-01-20', end: '2024-02-15', group: 'Execution', progress: 40, dependencies: ['2'] },
    { id: '4', name: 'Testing', start: '2024-02-10', end: '2024-02-25', group: 'Execution', progress: 0, dependencies: ['3'] },
    { id: '5', name: 'Launch', start: '2024-02-25', end: '2024-02-25', group: 'Milestones', type: 'milestone' },
];

<ChartProvider>
  <GanttChart
    data={projectTasks}
    showGroups
    showDependencies
    showProgress
    todayMarker
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A Gantt chart displays tasks as horizontal bars on a time axis. Essential elements include task bars, timeline header (days/weeks/months), dependencies (arrows), milestones (diamonds), and progress indicators.',
        overflowContent: 'For large projects, use collapsible groups, zoom levels (day/week/month), and filtering. Consider showing critical path to focus on key tasks.',
        internationalization: 'Format dates according to locale. Task names should be translatable. Week start day may vary by region.',
    },

    formatting: {
        emphasis: 'Color-code tasks by group, status, or resource. Show progress as fill within the bar. Highlight overdue tasks. Today marker helps orient the view.',
        alignment: 'Tasks list on left, timeline on right. Align bars precisely to dates. Dependency arrows should be clear but not overwhelming.',
    },

    props: [
        { name: 'data', type: "Task[]", required: true, description: 'Array of task objects with id, name, start, end, and optional group/dependencies.' },
        { name: 'startDate', type: "string", description: 'Override the timeline start date.' },
        { name: 'endDate', type: "string", description: 'Override the timeline end date.' },
        { name: 'showGroups', type: "boolean", default: "true", description: 'Visually group tasks by category.' },
        { name: 'showDependencies', type: "boolean", default: "true", description: 'Show dependency arrows between tasks.' },
        { name: 'showProgress', type: "boolean", default: "true", description: 'Display progress fill within task bars.' },
        { name: 'todayMarker', type: "boolean", default: "true", description: 'Show a vertical line for today.' },
        { name: 'onTaskClick', type: "(task: Task) => void", description: 'Callback when a task bar is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the project timeline (e.g., "Gantt chart showing 5 tasks from Jan 1 to Feb 25, 2024")' },
            { attribute: 'aria-describedby', usage: 'Links to task list table' },
        ],
        screenReader: 'Screen readers announce each task with name, start date, end date, duration, progress, and dependencies. Group tasks logically.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between tasks' },
            { key: 'Arrow Up/Down', action: 'Navigate task list' },
            { key: 'Arrow Left/Right', action: 'Scroll timeline' },
            { key: 'Enter', action: 'Open task details' },
        ],
    },
};

export default GanttChartDoc;
