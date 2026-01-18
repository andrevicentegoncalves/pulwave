import { ComponentDoc } from '@pulwave/features-style-guide';

export const TimelineDoc: ComponentDoc = {
    name: 'Timeline',
    subtitle: 'Chronological display of events or activities.',
    description: 'Timeline displays a chronological sequence of events or activities, ideal for activity feeds, history logs, audit trails, or process flows.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'For displaying chronological events',
        'For activity or change logs',
        'For showing process history',
        'Audit trails and version history',
        'User activity feeds',
    ],

    whenNotToUse: [
        { text: 'For step-by-step processes', alternative: 'Stepper component' },
        { text: 'For list data without time context', alternative: 'DataList component' },
        { text: 'For progress indication', alternative: 'Progress component' },
    ],

    overview: {
        description: 'Timeline displays chronological events with connectors.',
        variants: ['vertical', 'horizontal'],
        demos: []
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Connector Line', description: 'Visual line connecting events' },
                { name: '2. Node/Marker', description: 'Point indicator for each event' },
                { name: '3. Content', description: 'Event title, description, timestamp' },
                { name: '4. Icon (optional)', description: 'Event type indicator' },
            ]
        },
        emphasis: 'Events should be clearly distinguishable. Active/current events highlighted.',
        alignment: 'Content can align left, right, or alternate.',
    },

    content: {
        mainElements: 'Each event should have timestamp and description.',
        overflowContent: 'Long descriptions truncate or expand on interaction.',
        internationalization: 'Dates and timestamps should be localized.',
    },

    designRecommendations: [
        'Use clear visual hierarchy for event types.',
        'Show timestamps in relative or absolute format.',
        'Consider virtualization for long timelines.',
        'Group events by date for easier scanning.',
    ],

    developmentConsiderations: [
        'Support infinite scroll for long timelines.',
        'Handle date formatting and localization.',
        'Consider lazy loading for performance.',
        'Support keyboard navigation through events.',
    ],

    props: [
        { name: 'items', type: 'TimelineItem[]', required: true, description: 'Timeline items.' },
        { name: 'orientation', type: '"vertical" | "horizontal"', required: false, description: 'Layout orientation.', defaultValue: '"vertical"' },
        { name: 'align', type: '"left" | "right" | "alternate"', required: false, description: 'Content alignment.', defaultValue: '"left"' },
        { name: 'showConnector', type: 'boolean', required: false, description: 'Show connecting line.', defaultValue: 'true' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between timeline items' },
            { key: 'Arrow Up/Down', action: 'Navigate items (vertical)' },
            { key: 'Arrow Left/Right', action: 'Navigate items (horizontal)' },
        ],
        aria: [
            { attribute: 'role="list"', usage: 'Container role' },
            { attribute: 'role="listitem"', usage: 'Individual events' },
            { attribute: 'aria-label', usage: 'Describes the timeline purpose' },
        ],
        screenReader: 'Timeline items announced as a list with timestamps.',
        focusIndicator: 'Focus ring on interactive timeline items.',
    },

    relatedComponents: [
        { name: 'Stepper', description: 'Step-based navigation', path: 'components/navigation/stepper' },
        { name: 'DataList', description: 'Non-chronological lists', path: 'components/data-display/data-list' },
        { name: 'Card', description: 'Event content containers', path: 'components/data-display/card' },
    ],
};

export default TimelineDoc;

