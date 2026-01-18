import { ComponentDoc } from '@pulwave/features-style-guide';
import * as LocaleSelectorDemos from '../demos';

export const LocaleSelectorDoc: ComponentDoc = {
    name: 'LocaleSelector',
    description: 'A dedicated dropdown for selecting languages or regions, utilizing CircleFlag for visual recognition and intuitive locale switching.',
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
        'Language/region selection in headers or footers',
        'Internationalized applications with multiple locales',
        'User preference settings for language',
        'Content region selection for localized data',
        'Onboarding flows requiring locale choice',
    ],

    whenNotToUse: [
        { text: 'Country selection for addresses', alternative: 'CountrySelect or Combobox' },
        { text: 'Currency selection', alternative: 'Select with currency options' },
        { text: 'Timezone selection', alternative: 'TimezoneSelect component' },
        { text: 'Generic dropdown needs', alternative: 'Select or Dropdown' },
    ],

    overview: {
        description: 'Dropdown to select a locale with flag icons for visual recognition.',
        variants: ['default', 'compact'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Dropdown to select a locale.',
                component: LocaleSelectorDemos.LocaleSelectorBasicDemo,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Trigger Button', description: 'Shows current selection with flag' },
                { name: '2. Flag Icon', description: 'CircleFlag for visual locale identification' },
                { name: '3. Label', description: 'Locale name (optional)' },
                { name: '4. Dropdown Menu', description: 'List of available locales' },
            ]
        },
        emphasis: 'Flag provides instant visual recognition. Label clarifies for accessibility.',
        alignment: 'Position in header/footer for global visibility. Right-aligned is common convention.',
    },

    content: {
        mainElements: 'Trigger button with flag and optional label. Dropdown lists available locales.',
        overflowContent: 'Long locale lists should be scrollable. Consider grouping by region.',
        internationalization: 'Locale names should display in their native language. RTL layout supported.',
    },

    props: [
        { name: 'value', type: 'string', required: true, description: 'Selected locale code (e.g., "en-US", "pt-BR").' },
        { name: 'onChange', type: '(value: string) => void', required: true, description: 'Callback when locale selection changes.' },
        { name: 'locales', type: 'LocaleOption[]', required: false, description: 'Custom list of available locales.' },
        { name: 'size', type: "ButtonSize", required: false, defaultValue: "'m'", description: 'Size of the trigger button.' },
        { name: 'variant', type: "ButtonVariant", required: false, defaultValue: "'ghost'", description: 'Visual variant of the trigger button.' },
        { name: 'showLabel', type: 'boolean', required: false, defaultValue: 'true', description: 'Show text label next to flag icon.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Enter/Space', action: 'Open/close dropdown' },
            { key: 'Arrow Up/Down', action: 'Navigate locale options' },
            { key: 'Escape', action: 'Close dropdown' },
            { key: 'Home/End', action: 'Jump to first/last option' },
        ],
        aria: [
            { attribute: 'role="combobox"', usage: 'Trigger button role' },
            { attribute: 'aria-expanded', usage: 'Indicates dropdown state' },
            { attribute: 'aria-haspopup="listbox"', usage: 'Indicates popup type' },
            { attribute: 'aria-label', usage: 'Describes the selector purpose' },
        ],
        screenReader: 'Announces: "Language selector, [current locale]". Options announce locale names.',
        focusIndicator: 'Focus ring on trigger and highlighted option in dropdown',
    },

    relatedComponents: [
        { name: 'CircleFlag', description: 'Flag icons', path: 'components/data-display/circle-flag' },
        { name: 'Select', description: 'Generic select dropdown', path: 'components/inputs/select' },
        { name: 'Dropdown', description: 'Custom dropdown menus', path: 'components/overlays/dropdown' },
    ],
};

export default LocaleSelectorDoc;

