import { ComponentDoc } from '@pulwave/features-style-guide';

export const HeaderLayoutDoc: ComponentDoc = {
    name: 'HeaderLayout',
    subtitle: 'Page header with breadcrumbs and actions.',
    description: 'HeaderLayout provides a standardized header structure for pages, including title, subtitle, breadcrumbs, and optional action buttons for consistent page headers.',
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
        'Top of content pages with navigation context',
        'Admin pages with page-level actions',
        'Detail pages with back navigation',
        'Dashboard sections with titles',
        'Settings pages with descriptive headers',
    ],

    whenNotToUse: [
        { text: 'Card headers', alternative: 'Card component with header prop' },
        { text: 'Section headers', alternative: 'SectionHeader component' },
        { text: 'Modal headers', alternative: 'Modal built-in header' },
        { text: 'Minimal pages', alternative: 'Simple heading element' },
    ],

    overview: {
        description: 'Standardized page header with breadcrumbs, title, and actions.',
        variants: ['default', 'with-subtitle', 'with-actions'],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Breadcrumbs', description: 'Navigation path above title' },
                { name: '2. Title', description: 'Main page heading (H1)' },
                { name: '3. Subtitle', description: 'Optional descriptive text' },
                { name: '4. Actions', description: 'Page-level action buttons' },
            ]
        },
        emphasis: 'Title is the dominant element. Actions are secondary.',
        alignment: 'Title left-aligned. Actions right-aligned on same row.',
    },

    content: {
        mainElements: 'Breadcrumbs, title, optional subtitle, and action buttons.',
        overflowContent: 'Long titles truncate with ellipsis. Actions wrap on mobile.',
        internationalization: 'Title and breadcrumbs should be translatable. RTL supported.',
    },

    designRecommendations: [
        'Always provide a title for accessibility.',
        'Limit actions to 3 items; use a dropdown menu for more.',
        'Ensure contrast remains high for title text.',
        'Keep subtitles concise and informative.',
    ],

    developmentConsiderations: [
        'The breadcrumb separator is handled internally.',
        'Renders H1 tag for the title automatically.',
        'Actions slot accepts any React elements.',
    ],

    props: [
        { name: 'title', type: 'string', required: true, description: 'Main page title.' },
        { name: 'subtitle', type: 'string', required: false, description: 'Supporting subtitle text.' },
        { name: 'breadcrumbs', type: 'BreadcrumbItem[]', required: false, description: 'Array of breadcrumb navigation items.' },
        { name: 'actions', type: 'ReactNode', required: false, description: 'Slot for page-level action components.' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate through breadcrumbs and actions' },
            { key: 'Enter', action: 'Activate breadcrumb link or action' },
        ],
        aria: [
            { attribute: 'aria-label="Breadcrumb"', usage: 'Identifies breadcrumb navigation' },
            { attribute: 'role="heading"', usage: 'Title is a heading' },
            { attribute: 'aria-level="1"', usage: 'Title is level 1 heading' },
        ],
        screenReader: 'Breadcrumbs announce as navigation. Title announces as page heading.',
        focusIndicator: 'Focus ring on breadcrumb links and action buttons.',
    },

    relatedComponents: [
        { name: 'PageLayout', description: 'Full page structure', path: 'patterns/layout/page-layout' },
        { name: 'Breadcrumb', description: 'Standalone breadcrumbs', path: 'components/navigation/breadcrumb' },
        { name: 'Button', description: 'Action buttons', path: 'components/actions/button' },
    ],
};

export default HeaderLayoutDoc;
