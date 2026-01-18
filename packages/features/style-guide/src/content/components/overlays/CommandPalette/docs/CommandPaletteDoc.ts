import { ComponentDoc } from '@pulwave/features-style-guide';
import { CommandPaletteDemo } from '../demos';

export const CommandPaletteDoc: ComponentDoc = {
    name: 'Command Palette',
    description: 'A fast, composable command menu for React, providing keyboard-first navigation through commands, actions, and search. Powered by cmdk.',
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
        'Power user navigation and quick actions',
        'Application-wide search functionality',
        'Keyboard-first workflows and shortcuts',
        'Spotlight-style command interfaces',
        'Quick file or page navigation',
    ],

    whenNotToUse: [
        { text: 'Simple search within a page', alternative: 'SearchInput component' },
        { text: 'Navigation menu', alternative: 'Menu or NestedSidebar' },
        { text: 'Form input selection', alternative: 'Combobox or Select' },
        { text: 'Mobile-first interfaces', alternative: 'Bottom sheet or drawer' },
    ],

    overview: {
        description: 'The Command Palette provides a modal interface for quick navigation and actions, activated via keyboard shortcut (Cmd/Ctrl+K).',
        variants: ['default'],
        demos: [
            {
                name: 'Interactive Demo',
                description: 'Press Cmd+K to open the command palette.',
                component: CommandPaletteDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Dialog Overlay', description: 'Dimmed backdrop when open' },
                { name: '2. Search Input', description: 'Text input for filtering commands' },
                { name: '3. Command Groups', description: 'Categorized sections of commands' },
                { name: '4. Command Items', description: 'Individual actionable items' },
                { name: '5. Keyboard Hints', description: 'Shortcut indicators for actions' },
            ]
        },
        emphasis: 'Search input should be immediately focused. Highlight the currently selected item. Show keyboard shortcuts inline.',
        alignment: 'Center the palette horizontally, position in upper third vertically. Full width on mobile.',
    },

    content: {
        mainElements: 'Search input at top, grouped commands below. Each command has icon, label, and optional shortcut hint.',
        overflowContent: 'Long lists should be scrollable with keyboard navigation. Consider virtualization for large command sets.',
        internationalization: 'Command labels and group names should be translatable. Search should support locale-specific matching.',
    },

    props: [
        { name: 'isOpen', type: 'boolean', required: true, description: 'Controls the open state of the dialog.' },
        { name: 'onClose', type: '() => void', required: true, description: 'Callback when dialog requests to close.' },
        { name: 'children', type: 'ReactNode', description: 'The command content (groups and items).' },
        { name: 'placeholder', type: 'string', defaultValue: '"Search..."', description: 'Placeholder text for the search input.' },
        { name: 'shortcut', type: 'string', defaultValue: '"k"', description: 'Keyboard shortcut key (with Cmd/Ctrl).' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Cmd/Ctrl+K', action: 'Open the command palette' },
            { key: 'Escape', action: 'Close the palette' },
            { key: 'Arrow Up/Down', action: 'Navigate between commands' },
            { key: 'Enter', action: 'Execute selected command' },
            { key: 'Tab', action: 'Move between groups' },
        ],
        aria: [
            { attribute: 'role="dialog"', usage: 'Modal dialog container' },
            { attribute: 'aria-modal="true"', usage: 'Indicates modal behavior' },
            { attribute: 'role="combobox"', usage: 'Search input with listbox' },
            { attribute: 'aria-activedescendant', usage: 'Tracks selected command' },
        ],
        screenReader: 'Announces: "Command palette, [N] results". Navigation announces command names and shortcuts.',
        focusIndicator: 'Visual highlight on selected command. Focus trapped within dialog.',
    },

    relatedComponents: [
        { name: 'Combobox', description: 'For form-based selection', path: 'components/inputs/combobox' },
        { name: 'Modal', description: 'Generic modal dialog', path: 'components/feedback/modal' },
        { name: 'SearchInput', description: 'Inline search', path: 'components/inputs/search-input' },
    ],
};

export default CommandPaletteDoc;
