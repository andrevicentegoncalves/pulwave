import { ComponentDoc } from '@pulwave/features-style-guide';

export const SidebarLayoutDoc: ComponentDoc = {
    name: 'SidebarLayout',
    subtitle: 'Layout with a lateral navigation area.',
    description: 'SidebarLayout provides a main structure for applications that require a persistent sidebar beside the main content area, supporting collapsible and fixed modes.',
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
        'Applications with global navigation sidebar',
        'Admin dashboards with persistent menu',
        'IDE-style interfaces with tool panels',
        'Email or messaging applications',
        'Multi-pane applications',
    ],

    whenNotToUse: [
        { text: 'Temporary overlays', alternative: 'Drawer component' },
        { text: 'Context-specific navigation', alternative: 'SectionLayout' },
        { text: 'Mobile-only interfaces', alternative: 'Bottom navigation or tabs' },
        { text: 'Simple pages without navigation', alternative: 'PageLayout' },
    ],

    overview: {
        description: 'Main application layout with persistent sidebar navigation.',
        variants: ['default', 'collapsed', 'fixed'],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Sidebar', description: 'Persistent navigation sidebar' },
                { name: '2. Main Content', description: 'Primary content area' },
                { name: '3. Collapse Toggle', description: 'Optional sidebar toggle control' },
            ]
        },
        emphasis: 'Sidebar provides primary navigation. Content area is the focus.',
        alignment: 'Sidebar fixed left. Content fills remaining viewport.',
    },

    content: {
        mainElements: 'Persistent sidebar with navigation and main content area.',
        overflowContent: 'Each area manages its own scroll. Fixed mode prevents body scroll.',
        internationalization: 'RTL layout reverses sidebar position. All text translatable.',
    },

    designRecommendations: [
        'Use a Sidebar component in the sidebar slot.',
        'Support collapsed state for more content space.',
        'Consider fixed height for dashboard applications.',
        'Provide clear visual separation between sidebar and content.',
    ],

    developmentConsiderations: [
        'Use "fixed" prop for non-scrolling body with internal scroll areas.',
        'Control state via "sidebarCollapsed" and "sidebarHidden" props.',
        'Sidebar width transitions smoothly on collapse.',
        'Mobile responsive: sidebar becomes drawer on small screens.',
    ],

    props: [
        { name: 'sidebar', type: 'ReactNode', required: true, description: 'Content for the sidebar.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Main area content.' },
        { name: 'sidebarCollapsed', type: 'boolean', required: false, description: 'Controlled collapsed state.', defaultValue: 'false' },
        { name: 'sidebarHidden', type: 'boolean', required: false, description: 'Completely hide the sidebar.', defaultValue: 'false' },
        { name: 'fixed', type: 'boolean', required: false, description: 'Full height layout mode (no body scroll).', defaultValue: 'false' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between sidebar and content areas' },
            { key: 'Arrow Keys', action: 'Navigate within sidebar items' },
            { key: 'Enter', action: 'Activate sidebar item or toggle' },
        ],
        aria: [
            { attribute: 'role="navigation"', usage: 'Sidebar is a navigation landmark' },
            { attribute: 'role="main"', usage: 'Content area is main landmark' },
            { attribute: 'aria-expanded', usage: 'Sidebar collapsed/expanded state' },
            { attribute: 'aria-hidden', usage: 'When sidebar is hidden' },
        ],
        screenReader: 'Landmarks provide clear structure. Collapse state announced.',
        focusIndicator: 'Focus ring on all interactive elements.',
    },

    relatedComponents: [
        { name: 'Sidebar', description: 'Navigation sidebar component', path: 'components/navigation/sidebar' },
        { name: 'SectionLayout', description: 'Section with nested sidebar', path: 'patterns/layout/section-layout' },
        { name: 'Drawer', description: 'Temporary side panel', path: 'components/overlays/drawer' },
    ],
};

export default SidebarLayoutDoc;
