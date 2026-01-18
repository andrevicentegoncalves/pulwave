import { ComponentDoc } from '@pulwave/features-style-guide';
import { SectionLayoutBasicDemo } from '../demos';

export const SectionLayoutDoc: ComponentDoc = {
    name: 'SectionLayout',
    subtitle: 'Main layout for application sections.',
    description: 'SectionLayout provides a consistent structure for application sections, including a collapsible sidebar, mobile navigation toggle, and breadcrumbs area for complex module interfaces.',
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
        'Application modules with nested navigation',
        'Settings pages with category sidebar',
        'Admin panels with section navigation',
        'Documentation sites with topic sidebar',
        'Dashboard modules with sub-sections',
    ],

    whenNotToUse: [
        { text: 'Simple single-page views', alternative: 'PageLayout' },
        { text: 'Global sidebar navigation', alternative: 'SidebarLayout' },
        { text: 'Tab-based navigation', alternative: 'Tabs with PageLayout' },
        { text: 'Temporary sidebars', alternative: 'Drawer component' },
    ],

    overview: {
        description: 'SectionLayout structure for application modules with sidebar navigation.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'SectionLayout with sidebar and content.',
                component: SectionLayoutBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Sidebar', description: 'Collapsible navigation sidebar' },
                { name: '2. Mobile Toggle', description: 'Hamburger menu for mobile' },
                { name: '3. Breadcrumbs', description: 'Navigation path above content' },
                { name: '4. Content Area', description: 'Main content region' },
            ]
        },
        emphasis: 'Sidebar provides navigation context. Content is the main focus.',
        alignment: 'Sidebar fixed left. Content fills remaining space.',
    },

    content: {
        mainElements: 'Collapsible sidebar with nested navigation and main content area.',
        overflowContent: 'Sidebar scrolls independently. Content area handles its own overflow.',
        internationalization: 'RTL layout reverses sidebar position. All text translatable.',
    },

    designRecommendations: [
        'Use as the top-level layout for major application modules.',
        'Pass a NestedSidebar or Menu component to the sidebar prop.',
        'Ensure breadcrumbs provide clear navigational context.',
        'Keep sidebar items organized in logical groups.',
    ],

    developmentConsiderations: [
        'Handles mobile responsiveness automatically.',
        'Manages sidebar expansion state internally.',
        'Pass className to customize the outer container.',
        'Sidebar collapses to icons on smaller screens.',
    ],

    props: [
        { name: 'sidebar', type: 'ReactElement', required: true, description: 'Sidebar component (e.g., NestedSidebar).' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Main content area.' },
        { name: 'breadcrumbs', type: 'ReactNode', required: false, description: 'Breadcrumbs component to display in header.' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between sidebar and content' },
            { key: 'Arrow Keys', action: 'Navigate within sidebar menu' },
            { key: 'Escape', action: 'Close mobile sidebar' },
            { key: 'Enter', action: 'Activate sidebar item' },
        ],
        aria: [
            { attribute: 'role="navigation"', usage: 'Sidebar is a navigation landmark' },
            { attribute: 'role="main"', usage: 'Content area is main landmark' },
            { attribute: 'aria-expanded', usage: 'Sidebar expansion state' },
        ],
        screenReader: 'Sidebar announces as navigation. Content announces as main region.',
        focusIndicator: 'Focus ring on sidebar items and all interactive elements.',
    },

    relatedComponents: [
        { name: 'SidebarLayout', description: 'Global sidebar layout', path: 'patterns/layout/sidebar-layout' },
        { name: 'NestedSidebar', description: 'Nested navigation menu', path: 'components/navigation/nested-sidebar' },
        { name: 'PageLayout', description: 'Simple page layout', path: 'patterns/layout/page-layout' },
    ],
};

export default SectionLayoutDoc;

