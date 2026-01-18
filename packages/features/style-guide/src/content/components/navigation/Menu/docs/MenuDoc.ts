import MenuBasicDemo from '../demos/MenuBasicDemo';
import { ComponentDoc } from '@pulwave/features-style-guide';

const MenuDoc: ComponentDoc = {
    name: 'Menu',
    subtitle: 'Vertical navigation menu with nested items.',
    description: 'Vertical navigation menu with nested items, supporting categories and collapsed modes.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        screenReader: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
    },

    whenToUse: [
        'For primary or secondary sidebar navigation',
        'Group related items into categories for better discoverability',
        'Application navigation with hierarchical structure',
        'Dashboard sidebar menus',
        'Admin panel navigation',
    ],

    whenNotToUse: [
        { text: 'Top level navigation', alternative: 'Navbar component' },
        { text: 'Simple list of links', alternative: 'Link List' },
        { text: 'Deep hierarchies (3+ levels)', alternative: 'NestedSidebar component' },
        { text: 'Content switching in same area', alternative: 'Tabs component' },
    ],

    overview: {
        description: 'The Menu component provides a structured vertical navigation list, supporting nested categories, active state highlighting, and collapsed mode.',
        variants: ['default', 'collapsed'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Vertical navigation menu with nested items.',
                component: MenuBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Menu Container', description: 'Wrapper for all menu items' },
                { name: '2. Category Header', description: 'Optional group label' },
                { name: '3. Menu Item', description: 'Individual navigation link' },
                { name: '4. Item Icon', description: 'Optional leading icon' },
                { name: '5. Item Label', description: 'Text content for the item' },
                { name: '6. Expand Indicator', description: 'Shows nested items presence' },
            ]
        },
        emphasis: 'Active item clearly highlighted with background color.',
        alignment: 'Items left-aligned with consistent padding.',
    },

    content: {
        mainElements: 'Menu item labels should be concise and action-oriented.',
        overflowContent: 'Long labels truncate in collapsed mode.',
        internationalization: 'Menu labels should be translatable.',
    },

    designRecommendations: [
        'Use icons consistently across all items.',
        'Group related items under categories.',
        'Limit nesting depth for usability.',
        'Show active state clearly.',
        'Consider collapsed mode for space efficiency.',
    ],

    developmentConsiderations: [
        'Handle keyboard navigation within menu.',
        'Support controlled active state.',
        'Implement proper focus management.',
        'Handle menu item click callbacks.',
        'Support responsive collapsed mode.',
    ],

    props: [
        { name: 'items', type: 'MenuItem[]', required: true, description: 'Array of menu items (regular items or categories with sub-items).' },
        { name: 'activeItem', type: 'string', required: true, description: 'ID of the currently active item.' },
        { name: 'onItemClick', type: '(id: string) => void', required: true, description: 'Callback fired when an item is clicked.' },
        { name: 'isCollapsed', type: 'boolean', defaultValue: 'false', description: 'If true, renders the menu in a collapsed state (icons only).' },
        { name: 'className', type: 'string', description: 'Additional CSS classes for the menu container.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between menu items' },
            { key: 'Enter/Space', action: 'Activate menu item' },
            { key: 'Arrow Up/Down', action: 'Navigate within menu' },
            { key: 'Arrow Right', action: 'Expand nested items' },
            { key: 'Arrow Left', action: 'Collapse nested items' },
        ],
        aria: [
            { attribute: 'role="navigation"', usage: 'Identifies navigation region' },
            { attribute: 'role="menu"', usage: 'For menu container' },
            { attribute: 'role="menuitem"', usage: 'For individual items' },
            { attribute: 'aria-current', usage: 'Indicates active item' },
            { attribute: 'aria-expanded', usage: 'For expandable categories' },
        ],
        screenReader: 'Menu items announced with label and active state.',
        focusIndicator: 'Focus ring on focused menu items.',
    },

    relatedComponents: [
        { name: 'NestedSidebar', description: 'Deep hierarchical navigation', path: 'components/navigation/nested-sidebar' },
        { name: 'Tabs', description: 'Content switching', path: 'components/navigation/tabs' },
        { name: 'Link', description: 'Individual navigation link', path: 'components/navigation/link' },
    ],
};

export default MenuDoc;

