import { ComponentDoc } from '@pulwave/features-style-guide';
import * as AccessibilityDemos from '../demos';

const doc: ComponentDoc = {
    name: 'Accessibility Hooks',
    subtitle: 'Programmatic accessibility utilities.',
    description: 'Hooks and utilities for improving application accessibility, including screen reader announcements, live regions, and focus management for dynamic content.',
    id: 'accessibility-hooks',
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
        'Announcing dynamic content changes to screen readers',
        'Form submission success/error feedback',
        'Loading state announcements',
        'Navigation changes in single-page applications',
        'Real-time updates (notifications, chat messages)',
    ],

    whenNotToUse: [
        { text: 'Static page content', alternative: 'Semantic HTML is sufficient' },
        { text: 'Visual-only feedback', alternative: 'Combine with visual indicators' },
        { text: 'Continuous updates', alternative: 'Use aria-live regions directly' },
        { text: 'Error messages on inputs', alternative: 'aria-describedby with error element' },
    ],

    overview: {
        description: 'Programmatic screen reader announcements for dynamic content.',
        variants: ['polite', 'assertive'],
        demos: [
            {
                name: 'Screen Reader Announcements',
                description: 'Use the useAnnounce hook to trigger screen reader announcements.',
                component: AccessibilityDemos.AnnounceDemo,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. useAnnounce Hook', description: 'Returns announce function' },
                { name: '2. Announce Function', description: 'Triggers screen reader message' },
                { name: '3. Live Region', description: 'Hidden element for announcements' },
            ]
        },
        emphasis: 'Announcements are auditory only. Combine with visual feedback.',
        alignment: 'Not applicable (utility hook).',
    },

    content: {
        mainElements: 'Hook-based API for triggering screen reader announcements.',
        overflowContent: 'Not applicable.',
        internationalization: 'Announcement messages should be translated.',
    },

    designRecommendations: [
        'Always pair audio announcements with visual feedback.',
        'Use "polite" priority for non-urgent updates.',
        'Use "assertive" priority sparingly (errors, critical updates).',
        'Keep messages concise and informative.',
    ],

    developmentConsiderations: [
        'Hook creates and manages live regions automatically.',
        'Messages are queued and spoken sequentially.',
        'Works with all major screen readers.',
        'Cleanup handled automatically on unmount.',
    ],

    props: [
        { name: 'announce', type: '(message: string, priority?: "polite" | "assertive") => void', required: true, description: 'Triggers a screen reader announcement.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'aria-live="polite"', usage: 'Non-urgent announcements (default)' },
            { attribute: 'aria-live="assertive"', usage: 'Urgent/error announcements' },
            { attribute: 'role="status"', usage: 'Status updates' },
            { attribute: 'role="alert"', usage: 'Error messages' },
        ],
        screenReader: 'Announcements read by screen reader based on priority level.',
        focusIndicator: 'Not applicable (non-visual utility).',
    },

    relatedComponents: [
        { name: 'Alert', description: 'Visual alert component', path: 'components/feedback/alert' },
        { name: 'Toast', description: 'Toast notifications', path: 'components/feedback/toast' },
        { name: 'Spinner', description: 'Loading indicators', path: 'components/feedback/spinner' },
    ],
};

export default doc;

