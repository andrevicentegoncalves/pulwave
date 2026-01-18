/**
 * PopoverDoc - Documentation for Popover overlay component
 * 
 * Popover is a contextual content overlay that appears relative to a trigger.
 * More flexible than Tooltip for rich content, distinct from Dropdown for non-action content.
 * 
 * @version 1.0.0
 */
import * as PopoverDemos from '../demos';

const PopoverDoc = {
    name: 'Popover',
    description: 'Contextual content overlay that appears relative to a trigger element. Perfect for rich tooltips, mini-forms, and floating content.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-01',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'Rich tooltip content with interactive elements',
        'Mini-forms or quick actions',
        'Additional information panels',
        'User profile previews or cards',
        'Date pickers and color pickers',
    ],

    whenNotToUse: [
        { text: 'Simple text hints', alternative: 'Tooltip' },
        { text: 'Action menus', alternative: 'Dropdown' },
        { text: 'Large forms or dialogs', alternative: 'Modal or Drawer' },
        { text: 'Navigation menus', alternative: 'Menu' },
    ],

    componentComparison: [
        {
            component: 'Popover',
            description: 'Floating content panel.',
            useWhen: 'Rich content needs to appear contextually.',
            characteristics: ['Content-agnostic', 'Multiple placements', 'Interactive content'],
        },
        {
            component: 'Tooltip',
            description: 'Simple text hint.',
            useWhen: 'Brief, non-interactive information.',
            characteristics: ['Text only', 'Hover trigger', 'Non-interactive'],
        },
        {
            component: 'Dropdown',
            description: 'Action menu.',
            useWhen: 'List of actions or options.',
            characteristics: ['Menu items', 'Click trigger', 'Action-oriented'],
        },
    ],

    overview: {
        description: 'Popover displays floating content relative to a trigger element. It supports multiple placements, trigger types (click, hover, focus), and can contain any content including forms and interactive elements.',
        variants: ['12 placement options'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard popover with click trigger.',
                component: PopoverDemos.PopoverDemo,
            },
            {
                name: 'Placements',
                description: 'Popovers can be positioned on any side of the trigger.',
                component: PopoverDemos.PopoverPlacementsDemo,
            },
            {
                name: 'Triggers',
                description: 'Support for click, hover, and focus triggers.',
                component: PopoverDemos.PopoverTriggersDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: 'Trigger', description: 'Element that activates the popover' },
                { name: 'Content', description: 'Floating panel with content' },
                { name: 'Arrow', description: 'Optional arrow pointing to trigger' },
            ]
        },
        placements: [
            { name: 'top / top-start / top-end', description: 'Above the trigger' },
            { name: 'bottom / bottom-start / bottom-end', description: 'Below the trigger' },
            { name: 'left / left-start / left-end', description: 'Left of the trigger' },
            { name: 'right / right-start / right-end', description: 'Right of the trigger' },
        ],
        triggers: [
            { name: 'click', description: 'Opens on click (default)' },
            { name: 'hover', description: 'Opens on mouse enter' },
            { name: 'focus', description: 'Opens on focus' },
            { name: 'manual', description: 'Controlled programmatically' },
        ],
    },

    props: [
        { name: 'isOpen', type: 'boolean', description: 'Controlled open state' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Default open state (uncontrolled)' },
        { name: 'onOpenChange', type: '(isOpen: boolean) => void', description: 'Open state change callback' },
        { name: 'trigger', type: 'ReactNode', required: true, description: 'Trigger element' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Popover content' },
        { name: 'placement', type: 'PopoverPlacement', default: "'bottom'", description: 'Popover position' },
        { name: 'triggerType', type: "'click' | 'hover' | 'focus' | 'manual'", default: "'click'", description: 'What activates popover' },
        { name: 'showArrow', type: 'boolean', default: 'true', description: 'Show arrow indicator' },
        { name: 'offset', type: 'number', default: '8', description: 'Distance from trigger in pixels' },
        { name: 'closeOnClickOutside', type: 'boolean', default: 'true', description: 'Close on outside click' },
        { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Escape', action: 'Close popover' },
            { key: 'Tab', action: 'Navigate within popover content' },
        ],
        aria: [
            { attribute: 'role="tooltip"', usage: 'Popover container' },
            { attribute: 'aria-describedby', usage: 'Links trigger to popover' },
        ],
    },

    inUse: {
        dos: [
            'Use for contextual content that needs more than plain text',
            'Keep content focused and relevant',
            'Ensure popover doesn\'t block important UI',
            'Use hover trigger for preview content only',
        ],
        donts: [
            "Don't put entire forms in popovers - use Modal/Drawer",
            "Don't use for simple text hints - use Tooltip",
            "Don't use for action menus - use Dropdown",
            "Don't make popovers too large",
        ],
        examples: [
            { title: 'Info Popover', description: 'Additional info on hover', code: '<Popover trigger={<Icon name="info" />} triggerType="hover"><p>More details...</p></Popover>' },
        ]
    },

    relatedComponents: [
        { name: 'Tooltip', description: 'Simple text hints' },
        { name: 'Dropdown', description: 'Action menus' },
        { name: 'Modal', description: 'Full dialogs' },
        { name: 'Drawer', description: 'Sliding panels' },
    ],
};

export default PopoverDoc;
