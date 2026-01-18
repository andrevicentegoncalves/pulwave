/**
 * VisuallyHiddenDoc - Documentation for VisuallyHidden accessibility utility
 * 
 * VisuallyHidden hides content visually while keeping it accessible to screen readers.
 * 
 * @version 1.0.0
 */
import {
    VisuallyHiddenIconButtonDemo,
    VisuallyHiddenSkipLinkDemo,
    VisuallyHiddenContextDemo
} from '../demos';

const VisuallyHiddenDoc = {
    name: 'VisuallyHidden',
    description: 'Accessibility utility that hides content visually while keeping it accessible to screen readers. Essential for icon-only buttons, skip links, and form labels.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-01',

    // Accessibility Testing Status
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'n/a' as const,
        screenReader: 'pass' as const,
    },

    // When to Use
    whenToUse: [
        'Icon-only buttons that need accessible names',
        'Skip links at the top of pages',
        'Form labels when visual design doesn\'t show them',
        'Additional context for screen reader users',
    ],

    whenNotToUse: [
        { text: 'Decorative content', alternative: 'Use aria-hidden="true" instead' },
        { text: 'Content that should be visible', alternative: 'Use visible labels' },
        { text: 'Hiding entire sections', alternative: 'Use display:none or hidden attribute' },
    ],

    // Overview
    overview: {
        description: 'VisuallyHidden uses CSS techniques to hide content from sighted users while remaining accessible to screen readers. Unlike display:none or visibility:hidden, screen readers can still read the content.',
        variants: ['default', 'focusable'],
        demos: [
            {
                name: 'Icon Buttons',
                description: 'Accessible labels for icon-only buttons.',
                component: VisuallyHiddenIconButtonDemo
            },
            {
                name: 'Skip Link',
                description: 'Focusable hidden content for keyboard navigation.',
                component: VisuallyHiddenSkipLinkDemo
            },
            {
                name: 'Context',
                description: 'Additional context for screen readers.',
                component: VisuallyHiddenContextDemo
            }
        ]
    },

    // Props
    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Content to hide visually' },
        { name: 'focusable', type: 'boolean', default: 'false', description: 'Make content visible when focused (for skip links)' },
        { name: 'className', type: 'string', description: 'Additional CSS class' },
        { name: 'style', type: 'CSSProperties', description: 'Additional inline styles' },
    ],

    // Key Features
    keyFeatures: [
        'Content hidden from sighted users',
        'Accessible to screen readers',
        'Focusable variant for skip links',
        'Semantic HTML preserved',
    ],

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus skip links when focusable=true' },
        ],
        screenReader: 'Content is read aloud in normal reading order',
        wcagCompliance: [
            '1.3.1 Info and Relationships - Maintains semantic structure',
            '2.4.1 Bypass Blocks - Use for skip links',
            '2.4.4 Link Purpose - Provides accessible names for icon links',
        ],
    },

    // In Use (Do/Don't)
    inUse: {
        dos: [
            'Use for icon-only buttons to provide accessible names',
            'Use with focusable=true for skip links',
            'Keep content concise and descriptive',
            'Use for form labels when visual labels are hidden',
        ],
        donts: [
            'Don\'t use to hide decorative content (use aria-hidden)',
            'Don\'t hide content that should be visible to everyone',
            'Don\'t use for large blocks of content',
        ],
        examples: [
            {
                name: 'Icon Button',
                description: 'Add accessible label to icon-only button',
                code: `<Button>
  <Icon name="search" />
  <VisuallyHidden>Search</VisuallyHidden>
</Button>`
            },
            {
                name: 'Skip Link',
                description: 'Create a skip link that appears on focus',
                code: `<VisuallyHidden focusable>
  <a href="#main-content">Skip to main content</a>
</VisuallyHidden>`
            },
        ]
    },

    // Related Components
    relatedComponents: [
        { name: 'FocusTrap', description: 'Often used together in modals' },
        { name: 'Button', description: 'Use for icon-only button labels' },
        { name: 'Icon', description: 'Pair with icons for accessibility' },
    ],
};

export default VisuallyHiddenDoc;
