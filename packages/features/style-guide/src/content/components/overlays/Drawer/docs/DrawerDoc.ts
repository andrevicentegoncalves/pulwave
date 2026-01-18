/**
 * DrawerDoc - Documentation for Drawer overlay component
 * 
 * Drawer is a sliding panel overlay for navigation, filters, and contextual content.
 * Supports left, right, and bottom positions.
 * 
 * @version 1.0.0
 */
import * as DrawerDemos from '../demos';

const DrawerDoc = {
    name: 'Drawer',
    description: 'Sliding panel overlay for navigation, filters, and contextual content. Supports left, right, and bottom positions.',
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
        'Mobile navigation menus',
        'Filter panels that slide in from the side',
        'Detail views without leaving context',
        'Action sheets on mobile devices (bottom position)',
        'Settings or preferences panels',
    ],

    whenNotToUse: [
        { text: 'Quick confirmations', alternative: 'Modal or Confirmation Modal' },
        { text: 'Short messages', alternative: 'Toast' },
        { text: 'Hover information', alternative: 'Tooltip' },
        { text: 'Action menus', alternative: 'Dropdown' },
    ],

    // Component Comparison
    componentComparison: [
        {
            component: 'Drawer',
            description: 'Sliding panel from screen edge.',
            useWhen: 'Content needs to slide in while keeping page visible.',
            characteristics: ['Slides from edge', 'Larger content', 'Partial overlay'],
        },
        {
            component: 'Modal',
            description: 'Centered dialog overlay.',
            useWhen: 'Content requires full attention and centered focus.',
            characteristics: ['Centered', 'Blocking', 'Full overlay'],
        },
        {
            component: 'Dropdown',
            description: 'Small floating menu.',
            useWhen: 'Quick action selection from a trigger.',
            characteristics: ['Small', 'Positioned near trigger', 'Auto-closing'],
        },
    ],

    // Overview
    overview: {
        description: 'Drawer provides a sliding panel overlay that appears from the edge of the screen. Perfect for mobile navigation, filter panels, and secondary content that needs to be easily accessible without navigating away.',
        variants: ['left', 'right', 'bottom'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard right-side drawer.',
                component: DrawerDemos.DrawerDemo,
            },
            {
                name: 'Positions',
                description: 'Drawers can slide from left, right, or bottom.',
                component: DrawerDemos.DrawerPositionsDemo,
            },
            {
                name: 'Sizes',
                description: 'Predefined sizes for different content needs.',
                component: DrawerDemos.DrawerSizesDemo,
            },
            {
                name: 'Responsive',
                description: 'Different behavior on mobile vs desktop.',
                component: DrawerDemos.DrawerResponsiveDemo,
            }
        ]
    },

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: 'Backdrop', description: 'Semi-transparent overlay behind drawer' },
                { name: 'Container', description: 'Main drawer panel with slide animation' },
                { name: 'Header', description: 'Optional title and close button' },
                { name: 'Body', description: 'Scrollable content area' },
                { name: 'Footer', description: 'Optional action buttons area' },
            ]
        },
        positions: [
            { name: 'left', description: 'Slides in from left edge' },
            { name: 'right', description: 'Slides in from right edge (default)' },
            { name: 'bottom', description: 'Slides up from bottom (sheet style)' },
        ],
        sizes: [
            { name: 's', description: 'Small: 288px width / 30vh height' },
            { name: 'm', description: 'Medium: 384px width / 50vh height (default)' },
            { name: 'l', description: 'Large: 512px width / 75vh height' },
            { name: 'full', description: 'Full width or height' },
        ],
    },

    // Props
    props: [
        { name: 'isOpen', type: 'boolean', required: true, description: 'Whether the drawer is open' },
        { name: 'onClose', type: '() => void', description: 'Callback when drawer should close' },
        { name: 'title', type: 'string', description: 'Drawer title displayed in header' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Drawer content' },
        { name: 'footer', type: 'ReactNode', description: 'Footer content (usually action buttons)' },
        { name: 'position', type: "'left' | 'right' | 'bottom'", default: "'right'", description: 'Position from which drawer slides in' },
        { name: 'size', type: "'s' | 'm' | 'l' | 'full'", default: "'m'", description: 'Drawer size' },
        { name: 'closeOnBackdropClick', type: 'boolean', default: 'true', description: 'Close when clicking backdrop' },
        { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key' },
        { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'Show close button in header' },
        { name: 'className', type: 'string', description: 'Additional CSS class' },
    ],

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Escape', action: 'Close drawer' },
            { key: 'Tab', action: 'Navigate focusable elements (trapped)' },
            { key: 'Shift + Tab', action: 'Navigate backwards' },
        ],
        aria: [
            { attribute: 'role="dialog"', usage: 'Drawer container' },
            { attribute: 'aria-modal="true"', usage: 'Indicates modal behavior' },
            { attribute: 'aria-labelledby', usage: 'References title element' },
        ],
        focusManagement: [
            'Focus is trapped within drawer when open',
            'First focusable element receives focus on open',
            'Focus returns to trigger element on close',
        ],
    },

    // In Use (Do/Don't)
    inUse: {
        dos: [
            'Use right position for detail panels and settings',
            'Use left position for navigation on desktop',
            'Use bottom position for mobile action sheets',
            'Include a clear close button or action',
            'Keep content focused and relevant',
        ],
        donts: [
            "Don't use for simple confirmations - use Modal",
            "Don't nest drawers within drawers",
            "Don't put critical actions only in drawers",
            "Don't make drawers too wide on mobile",
        ],
        examples: [
            { title: 'Filter Panel', description: 'Filters sliding in from right', code: '<Drawer isOpen={open} position="right" title="Filters"><FilterForm /></Drawer>' },
            { title: 'Mobile Nav', description: 'Navigation from left', code: '<Drawer isOpen={open} position="left" title="Menu"><NavLinks /></Drawer>' },
            { title: 'Action Sheet', description: 'Bottom sheet for mobile', code: '<Drawer isOpen={open} position="bottom" size="s"><Actions /></Drawer>' },
            { title: 'Responsive Drawer', description: 'Right drawer on desktop, bottom sheet on mobile', code: '<Drawer isOpen={open} responsive position="right"><Content /></Drawer>' },
        ]
    },

    // Related Components
    relatedComponents: [
        { name: 'Modal', description: 'Centered dialog for focused content' },
        { name: 'Dropdown', description: 'Small action menus' },
        { name: 'Sidebar', description: 'Persistent navigation panel' },
        { name: 'FocusTrap', description: 'Focus management utility used internally' },
    ],
};

export default DrawerDoc;
