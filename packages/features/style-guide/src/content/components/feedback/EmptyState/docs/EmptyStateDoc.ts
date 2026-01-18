import { ComponentDoc } from '@pulwave/features-style-guide';
import { EmptyStateBasicDemo } from '../demos';

const EmptyStateDoc: ComponentDoc = {
    name: 'EmptyState',
    subtitle: 'Placeholder guidance when no data is available.',
    description: 'EmptyState guides users when there is no data to display, providing context and actionable next steps to help users understand the situation and proceed.',
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
        'No data to display in lists or tables',
        'Search returned no results',
        'First-time user onboarding states',
        'Filtered view with no matches',
        'After successful completion (inbox zero)',
    ],

    whenNotToUse: [
        { text: 'Loading state', alternative: 'Spinner or Skeleton' },
        { text: 'Error state', alternative: 'Alert component' },
        { text: 'Confirmation needed', alternative: 'Modal or Toast' },
        { text: 'Temporary message', alternative: 'Toast or Alert' },
    ],

    overview: {
        description: 'EmptyState with icon, title, description, and action.',
        variants: ['default', 'card'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard empty state with action button.',
                component: EmptyStateBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Icon', description: 'Visual illustration or icon' },
                { name: '2. Title', description: 'Main heading explaining the state' },
                { name: '3. Description', description: 'Supporting text with guidance' },
                { name: '4. Action', description: 'Optional button or link for next step' },
            ]
        },
        emphasis: 'Icon and title provide immediate recognition of the empty state.',
        alignment: 'Center-aligned by default, positioned within the empty content area.',
    },

    content: {
        mainElements: 'Title should be clear and descriptive. Description should offer helpful guidance.',
        overflowContent: 'Keep content concise. Long descriptions should be avoided.',
        internationalization: 'All text content should be translatable.',
    },

    designRecommendations: [
        'Use friendly, helpful language that guides users forward.',
        'Include relevant icon that matches the context.',
        'Provide actionable button when possible.',
        'Keep messaging positive and constructive.',
    ],

    developmentConsiderations: [
        'Use appropriate size for the container context.',
        'Handle action callbacks properly.',
        'Consider conditional rendering based on data state.',
        'Support both inline and card variants.',
    ],

    props: [
        { name: 'title', type: 'string', required: true, description: 'Main heading text.' },
        { name: 'description', type: 'string', required: false, description: 'Supporting text.' },
        { name: 'icon', type: 'ReactNode', required: false, description: 'Icon element.' },
        { name: 'action', type: 'ReactNode', required: false, description: 'Button or link action.' },
        { name: 'variant', type: '"default" | "card"', required: false, description: 'Visual style variant.', defaultValue: '"default"' },
        { name: 'size', type: '"s" | "m" | "l"', required: false, description: 'Size of the component.', defaultValue: '"m"' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus action button if present' },
            { key: 'Enter/Space', action: 'Activate action button' },
        ],
        aria: [
            { attribute: 'role="status"', usage: 'Identifies as status information' },
            { attribute: 'aria-label', usage: 'Describes the empty state for screen readers' },
        ],
        screenReader: 'Announces empty state content including title and description.',
        focusIndicator: 'Focus ring on action button when present.',
    },

    relatedComponents: [
        { name: 'Spinner', description: 'Loading state indicator', path: 'components/feedback/spinner' },
        { name: 'Skeleton', description: 'Content placeholder', path: 'components/feedback/skeleton' },
        { name: 'Alert', description: 'Error state messaging', path: 'components/feedback/alert' },
    ],
};

export default EmptyStateDoc;
