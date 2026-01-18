import { ComponentDoc } from '@pulwave/features-style-guide';

export const PageLayoutDoc: ComponentDoc = {
    name: 'PageLayout',
    subtitle: 'Standard page structure with header and content.',
    description: 'PageLayout composes HeaderLayout and ContentLayout to provide a consistent structure for application pages including breadcrumbs, titles, actions, and width-constrained content.',
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
        'Top-level application pages',
        'Detail pages with navigation context',
        'Settings and configuration pages',
        'Dashboard and report pages',
        'Any page requiring header and content structure',
    ],

    whenNotToUse: [
        { text: 'Full-screen applications', alternative: 'Custom layout or SidebarLayout' },
        { text: 'Modal content', alternative: 'Modal component' },
        { text: 'Embedded widgets', alternative: 'No layout wrapper' },
        { text: 'Landing pages', alternative: 'Custom marketing layout' },
    ],

    overview: {
        description: 'Composed layout combining HeaderLayout and ContentLayout.',
        variants: ['narrow', 'wide', 'dashboard', 'fluid'],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. HeaderLayout', description: 'Page header with breadcrumbs and actions' },
                { name: '2. ContentLayout', description: 'Width-constrained content area' },
                { name: '3. Page Content', description: 'Child elements within content area' },
            ]
        },
        emphasis: 'Header establishes context. Content is the main focus.',
        alignment: 'Full-width header. Content centered with max-width.',
    },

    content: {
        mainElements: 'Header section with breadcrumbs/title/actions and main content area.',
        overflowContent: 'Content area handles overflow. Header is always visible.',
        internationalization: 'All text elements should be translatable. RTL layout supported.',
    },

    designRecommendations: [
        'Use for top-level pages that require a header.',
        'Keep breadcrumbs consistent across similar page depths.',
        'Use "wide" or "dashboard" variant based on content density.',
        'Limit header actions to prevent visual clutter.',
    ],

    developmentConsiderations: [
        'Breadcrumbs should be provided as an array of items.',
        'The "actions" prop can render any React element.',
        'Use the "variant" prop to control content max-width.',
        'Combine with SectionLayout for sidebar pages.',
    ],

    props: [
        { name: 'title', type: 'string', required: true, description: 'Main page title.' },
        { name: 'subtitle', type: 'string', required: false, description: 'Optional supporting subtitle.' },
        { name: 'breadcrumbs', type: 'BreadcrumbItem[]', required: false, description: 'Navigation breadcrumb items.' },
        { name: 'actions', type: 'ReactNode', required: false, description: 'Header action elements.' },
        { name: 'variant', type: '"narrow" | "wide" | "dashboard" | "fluid"', required: false, description: 'Content width constraint variant.', defaultValue: '"wide"' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Page content.' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate through header and content' },
            { key: 'Enter', action: 'Activate breadcrumb links or actions' },
        ],
        aria: [
            { attribute: 'role="main"', usage: 'Content area is main landmark' },
            { attribute: 'aria-labelledby', usage: 'Content labeled by page title' },
        ],
        screenReader: 'Page structure provides clear navigation landmarks.',
        focusIndicator: 'Focus ring on all interactive elements.',
    },

    relatedComponents: [
        { name: 'HeaderLayout', description: 'Header component', path: 'patterns/layout/header-layout' },
        { name: 'ContentLayout', description: 'Content wrapper', path: 'patterns/layout/content-layout' },
        { name: 'SectionLayout', description: 'Layout with sidebar', path: 'patterns/layout/section-layout' },
    ],
};

export default PageLayoutDoc;
