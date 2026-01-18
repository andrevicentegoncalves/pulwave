/**
 * DropdownDoc - Documentation for Dropdown overlay component
 * 
 * Dropdown is an overlay component for action menus and navigation.
 * Unlike Select, it's NOT for form data input.
 * 
 * @version 1.0.0
 */
import * as DropdownDemos from '../demos';

const DropdownDoc = {
    name: 'Dropdown',
    description: 'Overlay component for action menus and navigation. Use for triggering actions, not for form data selection.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-01',

    // Accessibility Testing Status
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    // When to Use
    whenToUse: [
        'Triggering actions from a compact menu',
        'Navigation with multiple options',
        'Overflow actions that don\'t fit in the toolbar',
        'Context menus and action sheets',
    ],

    whenNotToUse: [
        { text: 'Form data selection', alternative: 'Select component' },
        { text: 'Multiple selection', alternative: 'Select with multiple prop' },
        { text: 'Searchable lists', alternative: 'Select with searchable prop' },
        { text: 'Hierarchical selection', alternative: 'Select with tree prop' },
    ],

    // Component Comparison
    componentComparison: [
        {
            component: 'Dropdown',
            description: 'Trigger actions or navigation from a floating menu.',
            useWhen: 'User needs to perform an action, not submit form data.',
            characteristics: ['Action-oriented', 'No form binding', 'Immediate execution'],
        },
        {
            component: 'Select',
            description: 'Choose a value for form submission.',
            useWhen: 'User selects data that will be submitted with a form.',
            characteristics: ['Data selection', 'Form integration', 'Value binding'],
        },
        {
            component: 'Menu',
            description: 'Navigation menu typically in sidebars or headers.',
            useWhen: 'Primary navigation structure needed.',
            characteristics: ['Navigation', 'Persistent visibility', 'Hierarchical'],
        },
    ],

    // Overview
    overview: {
        description: 'Dropdown is a compound component consisting of a trigger element and a floating menu. It provides a way to display a list of actions or options that appear on trigger click.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Simple action menu with items.',
                component: DropdownDemos.DropdownBasicDemo,
            },
            {
                name: 'With Icons',
                description: 'Dropdown items with leading icons.',
                component: DropdownDemos.DropdownWithIconsDemo,
            },
            {
                name: 'Grouped Items',
                description: 'Organize items with labels and dividers.',
                component: DropdownDemos.DropdownGroupedDemo,
            },
            {
                name: 'Alignment',
                description: 'Dropdown menu can align left or right.',
                component: DropdownDemos.DropdownAlignmentDemo,
            }
        ]
    },

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: 'Dropdown', description: 'Root container managing open state' },
                { name: 'Trigger', description: 'Element that opens the menu on click' },
                { name: 'Menu', description: 'Floating panel containing items' },
                { name: 'Item', description: 'Clickable action item with optional icon' },
                { name: 'Label', description: 'Non-interactive section header' },
                { name: 'Divider', description: 'Visual separator between groups' },
            ]
        },
        alignment: [
            { name: 'left', description: 'Menu aligns to left edge of trigger (default)' },
            { name: 'right', description: 'Menu aligns to right edge of trigger' },
        ],
    },

    // Props
    props: [
        { name: 'trigger', type: 'ReactNode', required: true, description: 'Element that triggers the dropdown' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Dropdown content (items, labels, dividers)' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable dropdown interaction' },
        { name: 'align', type: "'left' | 'right'", default: "'left'", description: 'Menu alignment relative to trigger' },
        { name: 'className', type: 'string', description: 'Additional CSS class' },
    ],

    // Sub-components
    subComponents: [
        {
            name: 'DropdownItem',
            description: 'Clickable action item',
            props: [
                { name: 'children', type: 'ReactNode', required: true, description: 'Item content' },
                { name: 'onClick', type: '() => void', description: 'Click handler' },
                { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable item' },
                { name: 'icon', type: 'ReactNode', description: 'Leading icon' },
            ]
        },
        {
            name: 'DropdownLabel',
            description: 'Non-interactive section header',
            props: [
                { name: 'children', type: 'ReactNode', required: true, description: 'Label text' },
            ]
        },
        {
            name: 'DropdownDivider',
            description: 'Visual separator between groups',
            props: [
                { name: 'variant', type: "'default' | 'light'", default: "'default'", description: 'Divider style' },
            ]
        },
    ],

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Enter / Space', action: 'Open menu / Activate item' },
            { key: 'Escape', action: 'Close menu' },
            { key: 'Arrow Down/Up', action: 'Navigate items' },
            { key: 'Tab', action: 'Move focus out of menu' },
        ],
        aria: [
            { attribute: 'role="menu"', usage: 'Menu container' },
            { attribute: 'role="menuitem"', usage: 'Each item' },
            { attribute: 'aria-haspopup', usage: 'Trigger element' },
            { attribute: 'aria-expanded', usage: 'Menu state' },
        ],
    },

    // In Use (Do/Don't)
    inUse: {
        dos: [
            'Use for action menus and overflow actions',
            'Keep menu items to 7 or fewer for scannability',
            'Group related actions with dividers and labels',
            'Use icons consistently for visual hierarchy',
        ],
        donts: [
            'Don\'t use for form data selection - use Select instead',
            'Don\'t nest dropdowns within dropdowns',
            'Don\'t use for primary navigation - use Menu instead',
            'Don\'t include too many items (max 10-12)',
        ],
        examples: [
            { title: 'Actions Menu', description: 'Edit, Delete, Archive actions', code: '<Dropdown trigger={<Button>Actions</Button>}><DropdownItem>Edit</DropdownItem></Dropdown>' },
        ]
    },

    // Related Components
    relatedComponents: [
        { name: 'Select', description: 'For form data selection' },
        { name: 'Menu', description: 'For primary navigation' },
        { name: 'Tooltip', description: 'For informational overlays' },
        { name: 'Modal', description: 'For dialogs requiring user action' },
    ],
};

export default DropdownDoc;
