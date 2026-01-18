import { ComponentDoc } from '@pulwave/features-style-guide';
import * as StatCardDemos from '../demos';

const StatCardDoc: ComponentDoc = {
    name: 'StatCard',
    subtitle: 'A simple card for displaying statistics.',
    description: 'The StatCard component is a simplified version of the KpiCard, focused on displaying a single statistic clearly without trends or comparisons.',
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
        'Simple numeric displays without trends',
        'Summary sections with multiple stats',
        'Profile or account overview metrics',
        'Quick glance statistics in sidebars',
        'Compact dashboard widgets',
    ],

    whenNotToUse: [
        { text: 'Metrics with trend indicators', alternative: 'KpiCard component' },
        { text: 'Complex data with multiple values', alternative: 'DataList or custom card' },
        { text: 'Interactive or clickable stats', alternative: 'Card with Link' },
        { text: 'Time-series data', alternative: 'Sparkline or LineChart' },
    ],

    overview: {
        description: 'The StatCard component is a simplified version of the KpiCard, focused on displaying a single statistic clearly.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Displaying simple statistics.',
                component: StatCardDemos.StatCardBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Card Container', description: 'Minimal elevated surface' },
                { name: '2. Label', description: 'Describes the statistic' },
                { name: '3. Value', description: 'The numeric or text value' },
            ]
        },
        emphasis: 'Value should be prominent with larger font size. Label is secondary, smaller text.',
        alignment: 'Center or left-align based on context. Stack vertically with label above value.',
    },

    content: {
        mainElements: 'Label describes what the value represents. Value is the primary content.',
        overflowContent: 'Values should not truncate. Use abbreviations for large numbers (1.2K, 5M).',
        internationalization: 'Format numbers according to locale. Labels should be translatable.',
    },

    props: [
        {
            name: 'label',
            type: 'string',
            required: true,
            description: 'The descriptive label for the statistic.',
        },
        {
            name: 'value',
            type: 'string | number',
            required: true,
            description: 'The statistic value to display prominently.',
        },
        {
            name: 'className',
            type: 'string',
            required: false,
            description: 'Additional CSS classes for custom styling.',
        },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus the card if interactive' },
        ],
        aria: [
            { attribute: 'role="article"', usage: 'Semantic container for the stat' },
            { attribute: 'aria-label', usage: 'Full description: "[label]: [value]"' },
        ],
        screenReader: 'Announces: "[label], [value]".',
        focusIndicator: 'Focus ring around card when interactive',
    },

    relatedComponents: [
        { name: 'KpiCard', description: 'For metrics with trends', path: 'components/data-display/kpi-card' },
        { name: 'Card', description: 'Generic card container', path: 'components/data-display/card' },
        { name: 'Badge', description: 'Inline stat indicators', path: 'components/data-display/badge' },
    ],
};

export default StatCardDoc;

