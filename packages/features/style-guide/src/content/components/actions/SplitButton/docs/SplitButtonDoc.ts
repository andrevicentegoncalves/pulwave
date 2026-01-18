import { ComponentDoc } from '@pulwave/features-style-guide';
import { SplitButtonBasicDemo } from '../demos';

export const SplitButtonDoc: ComponentDoc = {
    name: 'SplitButton',
    description: 'A button that groups a primary action with a list of secondary actions via a dropdown menu.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-14',

    // Accessibility Status
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    // When to use
    whenToUse: [
        'Primary action with related secondary actions',
        'Save with "Save As..." or "Save and Close" options',
        'Send with "Schedule Send" or "Send Later" options',
        'Actions that have sensible alternatives',
    ],

    whenNotToUse: [
        { text: 'Single action with no alternatives', alternative: 'Button' },
        { text: 'Navigation or menu actions', alternative: 'Dropdown' },
        { text: 'Toggling between views', alternative: 'SegmentedControl' },
    ],

    // Overview
    overview: {
        description: 'SplitButton combines a primary action button with a dropdown trigger for secondary actions. The main button executes the primary action, while the chevron opens a menu of alternatives.',
        variants: ['primary', 'secondary', 'neutral'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Primary action with secondary options in dropdown.',
                component: SplitButtonBasicDemo,
            }
        ]
    },

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: '1. Main Button', description: 'Primary action button with label' },
                { name: '2. Divider', description: 'Visual separator between buttons' },
                { name: '3. Trigger Button', description: 'Chevron button that opens dropdown' },
                { name: '4. Dropdown Menu', description: 'List of secondary actions' },
            ]
        },
        sizes: [
            { name: 'Small (s)', height: '32px', description: 'Compact contexts' },
            { name: 'Medium (m)', height: '40px', description: 'Default for most cases' },
            { name: 'Large (l)', height: '48px', description: 'Touch-friendly' },
        ],
    },

    // Universal Behaviors
    universalBehaviors: {
        states: 'Both buttons share the same kind/variant. Disabled state applies to both.',
        interactions: {
            mouse: 'Click main button for primary action. Click chevron to open menu.',
            keyboard: 'Tab focuses main button, then trigger. Enter/Space activates. Arrow keys navigate menu.',
        },
    },

    // Props
    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Label for the main action button.' },
        { name: 'onClick', type: '() => void', required: true, description: 'Handler for the main action button.' },
        { name: 'options', type: 'Array<{ label, onClick, icon?, disabled? }>', required: true, description: 'List of secondary actions for the dropdown.' },
        { name: 'kind', type: 'ButtonKind', default: "'primary'", description: 'Semantic intent (primary, secondary, neutral, etc).' },
        { name: 'variant', type: 'ButtonVariant', default: "'filled'", description: 'Visual style (filled, outlined, ghost, soft).' },
        { name: 'size', type: "'s' | 'm' | 'l'", default: "'m'", description: 'Size of both buttons.' },
        { name: 'align', type: "'left' | 'right' | 'center'", default: "'right'", description: 'Dropdown menu alignment.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both buttons.' },
        { name: 'leftIcon', type: 'ReactNode', description: 'Icon before the main button label.' },
    ],

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus between main button and trigger' },
            { key: 'Enter / Space', action: 'Activate focused button or menu item' },
            { key: 'Arrow Down', action: 'Open dropdown / navigate menu items' },
            { key: 'Escape', action: 'Close dropdown menu' },
        ],
        aria: [
            { attribute: 'aria-label="More actions"', usage: 'Applied to the dropdown trigger' },
            { attribute: 'aria-haspopup="menu"', usage: 'Indicates trigger opens a menu' },
            { attribute: 'aria-expanded', usage: 'Reflects dropdown open state' },
        ],
        screenReader: 'Announces: "[label], button" for main. "More actions, button, menu" for trigger.',
    },

    // Related Components
    relatedComponents: [
        { name: 'Button', description: 'Use for single actions without alternatives', path: 'components/actions/button' },
        { name: 'Dropdown', description: 'Use for action menus without primary button', path: 'components/overlays/dropdown' },
        { name: 'ButtonGroup', description: 'Use for multiple related buttons', path: 'components/actions/segmented-control' },
    ],
};

export default SplitButtonDoc;
