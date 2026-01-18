import { ComponentDoc } from '@pulwave/features-style-guide';
import * as SidebarToggleDemos from '../demos';

export const SidebarToggleDoc: ComponentDoc = {
    name: 'SidebarToggle',
    subtitle: 'A button to collapse or expand the sidebar.',
    description: 'The SidebarToggle component controls the visibility or expanded state of a sidebar navigation menu, allowing users to maximize content area when needed.',
    sourcePath: 'packages/ui/components/inputs/SidebarToggle/SidebarToggle.tsx',
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
        'Collapsible sidebar navigation',
        'Desktop layouts with expandable side panels',
        'Admin interfaces with flexible workspace',
        'Dashboard layouts optimizing content space',
        'Applications with persistent navigation',
    ],

    whenNotToUse: [
        { text: 'Mobile navigation', alternative: 'BurgerMenu or drawer' },
        { text: 'Temporary sidebars', alternative: 'Drawer component' },
        { text: 'Non-collapsible sidebars', alternative: 'Fixed sidebar without toggle' },
        { text: 'Bottom navigation', alternative: 'Tab bar or bottom sheet' },
    ],

    overview: {
        description: 'The SidebarToggle component is used to toggle the visibility or expanded state of a sidebar navigation menu.',
        variants: ['default', 'compact'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard usage in a sidebar footer or header.',
                component: SidebarToggleDemos.SidebarToggleBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Button Container', description: 'Clickable area' },
                { name: '2. Chevron Icon', description: 'Direction indicator' },
            ]
        },
        emphasis: 'Icon direction should clearly indicate the action (expand or collapse).',
        alignment: 'Position at sidebar footer or header. Align with sidebar edge.',
    },

    content: {
        mainElements: 'Button with chevron icon indicating expand/collapse direction.',
        overflowContent: 'Not applicable - fixed size toggle.',
        internationalization: 'Aria-label should be translated. Icon direction follows sidebar position.',
    },

    props: [
        {
            name: 'isExpanded',
            type: 'boolean',
            required: true,
            description: 'Current expansion state of the sidebar.',
        },
        {
            name: 'onToggle',
            type: '() => void',
            required: true,
            description: 'Callback function triggered when the toggle is clicked.',
        },
        {
            name: 'className',
            type: 'string',
            required: false,
            description: 'Additional CSS classes for custom positioning or styling.',
        },
    ],

    accessibility: {
        keyboard: [
            { key: 'Enter/Space', action: 'Toggle sidebar state' },
            { key: 'Tab', action: 'Focus the toggle' },
        ],
        aria: [
            { attribute: 'aria-expanded', usage: 'Indicates current sidebar state' },
            { attribute: 'aria-controls', usage: 'References the sidebar element ID' },
            { attribute: 'aria-label', usage: '"Collapse sidebar" or "Expand sidebar"' },
        ],
        screenReader: 'Announces: "[Collapse/Expand] sidebar, button". State changes announced.',
        focusIndicator: 'Focus ring around toggle button',
    },

    relatedComponents: [
        { name: 'NestedSidebar', description: 'Main sidebar component', path: 'components/navigation/nested-sidebar' },
        { name: 'BurgerMenu', description: 'Mobile menu toggle', path: 'components/navigation/burger-menu' },
        { name: 'Drawer', description: 'Temporary side panel', path: 'components/overlays/drawer' },
    ],
};

export default SidebarToggleDoc;

