import { ComponentDoc } from '@pulwave/features-style-guide';
import { SwitchStatesDemo } from '../demos';

const SwitchDoc: ComponentDoc = {
    name: 'Switch',
    subtitle: 'Toggle control for binary on/off states.',
    description: 'Switch is a toggle control for binary on/off states that takes immediate effect, commonly used for settings and preferences.',
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
        'Settings with immediate effect',
        'Enable/disable features',
        'Preferences toggles',
        'Dark mode or theme switching',
        'Notification settings',
    ],

    whenNotToUse: [
        { text: 'Multiple options from a list', alternative: 'Checkbox group' },
        { text: 'Deferred action requiring form submit', alternative: 'Checkbox' },
        { text: 'Yes/no form fields', alternative: 'Checkbox with label' },
        { text: 'Multi-step selection', alternative: 'Radio buttons' },
    ],

    overview: {
        description: 'Switch toggles between two states with visual feedback and optional label.',
        variants: ['default', 'primary'],
        demos: [
            {
                name: 'Switch States',
                description: 'Various states of the switch component.',
                component: SwitchStatesDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Track', description: 'Background track showing on/off state' },
                { name: '2. Thumb', description: 'Sliding indicator element' },
                { name: '3. Label', description: 'Text describing the setting' },
            ]
        },
        emphasis: 'Clear visual difference between on and off states.',
        alignment: 'Label to left or right of switch. Switch aligns to label baseline.',
    },

    content: {
        mainElements: 'Label should describe what happens when on (e.g., "Notifications enabled").',
        overflowContent: 'Long labels wrap. Switch stays aligned to first line.',
        internationalization: 'Labels must be translatable. Switch position follows reading direction.',
    },

    designRecommendations: [
        'Use for settings that take immediate effect.',
        'Provide clear visual feedback for state change.',
        'Label should describe the "on" state positively.',
        'Group related switches in settings panels.',
    ],

    developmentConsiderations: [
        'Switch should trigger onChange immediately.',
        'Use controlled mode for form integration.',
        'Handle async state changes with loading indicator.',
        'Consider optimistic updates with error rollback.',
    ],

    props: [
        { name: 'checked', type: 'boolean', required: false, description: 'Whether the switch is on.' },
        { name: 'disabled', type: 'boolean', required: false, description: 'Whether the switch is disabled.' },
        { name: 'label', type: 'string', required: false, description: 'Label text.' },
        { name: 'onChange', type: '(checked: boolean) => void', required: false, description: 'Callback when state changes.' },
        { name: 'size', type: '"s" | "m" | "l"', required: false, description: 'Size variant.', defaultValue: '"m"' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Space', action: 'Toggle switch state' },
            { key: 'Tab', action: 'Move focus to/from switch' },
        ],
        aria: [
            { attribute: 'role="switch"', usage: 'Identifies as toggle switch' },
            { attribute: 'aria-checked', usage: 'Current on/off state' },
            { attribute: 'aria-disabled', usage: 'When switch is disabled' },
        ],
        screenReader: 'Announces: "[Label], switch, [on/off]".',
        focusIndicator: 'Focus ring around switch track.',
    },

    relatedComponents: [
        { name: 'Checkbox', description: 'For form selections', path: 'components/inputs/checkbox' },
        { name: 'ThemeToggle', description: 'Specialized dark mode switch', path: 'components/inputs/theme-toggle' },
        { name: 'Radio', description: 'Single selection from options', path: 'components/inputs/radio' },
    ],
};

export default SwitchDoc;
