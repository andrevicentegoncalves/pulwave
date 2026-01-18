import { ComponentDoc } from '@pulwave/features-style-guide';
import * as ThemeToggleDemos from '../demos';

export const ThemeToggleDoc: ComponentDoc = {
    name: 'ThemeToggle',
    subtitle: 'A switch to toggle between light and dark modes.',
    description: 'The ThemeToggle component provides a user-friendly way to switch the application theme between light and dark modes with animated icon transitions.',
    sourcePath: 'packages/ui/components/inputs/ThemeToggle/ThemeToggle.tsx',
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
        'Application header or navigation for theme control',
        'User settings or preferences panel',
        'Persistent theme preference toggle',
        'Mobile-friendly dark mode access',
        'Accessibility-focused theme options',
    ],

    whenNotToUse: [
        { text: 'Multiple theme options (>2)', alternative: 'Select dropdown with theme options' },
        { text: 'System preference only', alternative: 'Auto-detect with no manual toggle' },
        { text: 'Page-specific theme', alternative: 'Settings panel with preview' },
        { text: 'Complex appearance settings', alternative: 'Dedicated settings page' },
    ],

    overview: {
        description: 'The ThemeToggle component provides a user-friendly way to switch the application theme.',
        variants: ['default', 'compact'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard usage in the application header.',
                component: ThemeToggleDemos.ThemeToggleBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Toggle Button', description: 'Clickable button container' },
                { name: '2. Sun Icon', description: 'Displayed in dark mode (switch to light)' },
                { name: '3. Moon Icon', description: 'Displayed in light mode (switch to dark)' },
            ]
        },
        emphasis: 'Icons should be clearly visible against both light and dark backgrounds. Animation provides visual feedback.',
        alignment: 'Position in header or settings area. Typically right-aligned with other controls.',
    },

    content: {
        mainElements: 'Toggle button with animated sun/moon icons indicating current and target theme.',
        overflowContent: 'Not applicable - fixed size toggle.',
        internationalization: 'Aria-label should be translated. Icons are universal symbols.',
    },

    props: [
        {
            name: 'isDark',
            type: 'boolean',
            required: true,
            description: 'Current theme state. true for dark mode, false for light mode.',
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
            description: 'Additional CSS classes to apply for positioning or styling.',
        },
    ],

    accessibility: {
        keyboard: [
            { key: 'Enter/Space', action: 'Toggle theme' },
            { key: 'Tab', action: 'Focus the toggle' },
        ],
        aria: [
            { attribute: 'role="switch"', usage: 'Indicates toggle behavior' },
            { attribute: 'aria-checked', usage: 'Current state (true for dark mode)' },
            { attribute: 'aria-label', usage: '"Toggle dark mode" or "Toggle light mode"' },
        ],
        screenReader: 'Announces: "Dark mode, switch, [on/off]". Toggle announces state change.',
        focusIndicator: 'Focus ring around toggle button',
    },

    relatedComponents: [
        { name: 'Switch', description: 'Generic toggle switch', path: 'components/inputs/switch' },
        { name: 'Button', description: 'For icon-based actions', path: 'components/actions/button' },
    ],
};

export default ThemeToggleDoc;

