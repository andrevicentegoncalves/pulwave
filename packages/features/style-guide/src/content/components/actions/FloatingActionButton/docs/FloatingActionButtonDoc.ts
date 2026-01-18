import { ComponentDoc } from '@pulwave/features-style-guide';
import * as FloatingActionButtonDemos from '../demos';

export const FloatingActionButtonDoc: ComponentDoc = {
    name: 'Floating Action Button',
    subtitle: 'Primary action button floating above content.',
    description: 'Floating Action Button (FAB) is a primary action button that floats above content, providing access to the most common action on a screen with optional speed-dial actions.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    // Accessibility Status
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    // When to use
    whenToUse: [
        'For the primary action on a mobile screen',
        'For actions that need to remain visible while scrolling',
        'For creating new content (e.g., Compose, Add Item)',
        'Speed-dial menus with related quick actions',
        'Persistent call-to-action that floats over content',
    ],

    whenNotToUse: [
        { text: 'For minor or secondary actions', alternative: 'Button (Secondary/Tertiary)' },
        { text: 'On desktop screens where space allows standard buttons', alternative: 'Standard Button' },
        { text: 'For destructive actions', alternative: 'Button (Danger)' },
    ],

    // Overview
    overview: {
        description: 'The Floating Action Button (FAB) acts as a call-to-action for the primary task. It can trigger a single action or expand to reveal related speed-dial actions.',
        demos: [
            {
                name: 'Basic Usage',
                description: 'A standard FAB that can handle click events or toggle a menu of actions.',
                component: FloatingActionButtonDemos.FloatingActionButtonBasicDemo,
            }
        ]
    },

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Circular elevation surface' },
                { name: '2. Icon', description: 'Symbol representing the action' },
                { name: '3. Label (Extended)', description: 'Optional text for extended FABs' },
            ]
        },
        sizes: [
            { name: 'Standard', height: '56px', description: 'Default size for most use cases' },
            { name: 'Mini', height: '40px', description: 'For tighter layouts or secondary FABs' },
        ],
        positioning: 'Fixed position, typically bottom-right. Should float above all content layers.'
    },

    // Content Guidelines
    content: {
        mainElements: 'Use a clear, recognizable icon (e.g., Plus, Edit). Avoid obscure symbols.',
        overflowContent: 'Extended FABs should keep labels short (1-2 words).',
    },

    // Universal Behaviors
    universalBehaviors: {
        states: 'Enabled, Hover, Pressed, Disabled.',
        interactions: {
            mouse: 'Hover elevates the button. Click triggers action.',
            keyboard: 'Focusable via Tab. Enter/Space activates.',
        },
        motion: 'FABs should enter/exit with scale animation. Speed dials expand with a stagger effect.'
    },

    // Props
    props: [
        {
            name: 'actions',
            type: 'FABAction[]',
            required: false,
            description: 'Array of secondary actions to reveal when clicked. If empty, acts as a simple button.',
        },
        {
            name: 'position',
            type: "'bottom-right' | 'bottom-left' | 'bottom-center'",
            defaultValue: "'bottom-right'",
            description: 'Screen position of the FAB.',
        },
        {
            name: 'icon',
            type: 'ReactNode',
            description: 'Primary icon to display when collapsed.',
        },
        {
            name: 'label',
            type: 'string',
            description: 'Optional label for extended variant or accessibility.',
        },
    ],

    // Style Tokens
    styleTokens: [
        {
            variant: 'Primary',
            states: [
                { state: 'Default', textToken: '--color-on-primary', backgroundToken: '--color-primary' },
                { state: 'Hover', backgroundToken: '--color-primary-hover' },
            ]
        }
    ],

    designRecommendations: [
        'Use a clear, recognizable icon (Plus, Edit, etc.).',
        'Position consistently across the application.',
        'Avoid placing over critical content areas.',
        'Limit speed-dial actions to 3-6 items.',
    ],

    developmentConsiderations: [
        'Handle z-index to ensure FAB floats above content.',
        'Implement proper focus management for speed-dial.',
        'Support keyboard navigation for all actions.',
        'Consider scroll behavior for showing/hiding.',
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus FAB button' },
            { key: 'Enter/Space', action: 'Activate or expand speed-dial' },
            { key: 'Escape', action: 'Close speed-dial menu' },
            { key: 'Arrow Up/Down', action: 'Navigate speed-dial actions' },
        ],
        aria: [
            { attribute: 'aria-label', usage: 'Describes the FAB action' },
            { attribute: 'aria-expanded', usage: 'Indicates speed-dial state' },
            { attribute: 'aria-haspopup="menu"', usage: 'When FAB has speed-dial actions' },
        ],
        screenReader: 'Announces FAB label and expanded state.',
        focusIndicator: 'Focus ring around the FAB button.',
    },

    relatedComponents: [
        { name: 'Button', description: 'Standard action buttons', path: 'components/actions/button' },
        { name: 'Dropdown', description: 'Menu with actions', path: 'components/overlays/dropdown' },
        { name: 'Tooltip', description: 'Action labels on hover', path: 'components/feedback/tooltip' },
    ],
};

export default FloatingActionButtonDoc;
