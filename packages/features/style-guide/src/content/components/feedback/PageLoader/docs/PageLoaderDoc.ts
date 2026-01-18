/**
 * PageLoaderDoc - Documentation for PageLoader feedback component
 * 
 * Full-screen loading indicator for page transitions.
 * 
 * @version 1.0.0
 */
const PageLoaderDoc = {
    name: 'PageLoader',
    description: 'Full-screen or container-based loading indicator with spinner and optional message. Used for page transitions and async content loading.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-01',

    // Accessibility Testing Status
    accessibilityStatus: {
        keyboard: 'n/a' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    // When to Use
    whenToUse: [
        'Initial page/app loading states',
        'Route transitions with async data',
        'Full-page content loading (lazy-loaded routes)',
        'Auth verification before rendering protected content',
    ],

    whenNotToUse: [
        { text: 'Inline content loading', alternative: 'Skeleton component' },
        { text: 'Button loading states', alternative: 'Button with loading prop' },
        { text: 'List item loading', alternative: 'Skeleton rows' },
        { text: 'Background processes', alternative: 'Toast or progress bar' },
    ],

    // Overview
    overview: {
        description: 'PageLoader centers a spinner with an optional message in the viewport. It can be full-screen (100vh) or container-relative. Uses the Spinner component internally and applies subtle background color to indicate the loading state.',
        variants: ['fullScreen', 'container'],
        demos: []
    },

    // Props
    props: [
        { name: 'message', type: 'string', default: "'Loading…'", description: 'Text displayed below the spinner' },
        { name: 'fullScreen', type: 'boolean', default: 'true', description: 'Whether to take up the full viewport height' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ],

    // Accessibility
    accessibility: {
        screenReader: 'The message text is announced. Consider adding aria-live="polite" for dynamic loading states.',
        focusManagement: 'Focus should be managed by the parent component. PageLoader itself doesn\'t trap focus.',
        aria: [
            { attribute: 'role="status"', usage: 'Recommended for announcing loading state' },
            { attribute: 'aria-live="polite"', usage: 'For dynamic loading announcements' },
        ],
    },

    // In Use (Do/Don't)
    inUse: {
        dos: [
            'Use for initial page load and route transitions',
            'Provide meaningful loading messages when possible',
            'Use fullScreen=true for app-level loading',
            'Use fullScreen=false for content area loading',
        ],
        donts: [
            'Don\'t use for partial content updates (use Skeleton)',
            'Don\'t display indefinitely without timeout handling',
            'Don\'t use multiple PageLoaders simultaneously',
        ],
        examples: [
            {
                name: 'Basic Usage',
                description: 'Full-screen loader with custom message',
                code: `<PageLoader message="Preparing your dashboard..." />`
            },
            {
                name: 'Container Loader',
                description: 'Within a content area',
                code: `<PageLoader fullScreen={false} message="Loading data..." />`
            },
        ]
    },

    // Related Components
    relatedComponents: [
        { name: 'Spinner', description: 'Used internally for the loading animation' },
        { name: 'Skeleton', description: 'For inline/partial content loading' },
        { name: 'Progress', description: 'For determinate loading progress' },
    ],
};

export default PageLoaderDoc;
