import { DataTransferBasicDemo } from '@pulwave/features-style-guide';

import {
    ButtonMatrixDemo,
    ButtonSizesDemo,
    ButtonStatesDemo,
    ButtonShapesDemo,
    FullWidthButtonsDemo,
    ButtonWithIconsDemo,
    IconOnlyButtonsDemo,
    SplitButtonDemo,
    ButtonGroupDemo
} from '../demos';
/**
 * ButtonDoc - Enhanced documentation for Button component
 * 
 * Following IBM Carbon Design System patterns with full documentation.
 */
const ButtonDoc = {
    name: 'Button',
    description: 'Buttons trigger actions and communicate what will happen when clicked.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-04',

    // Accessibility Status
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    // When to use
    whenToUse: [
        'Primary actions like form submission',
        'Secondary actions like cancel or reset',
        'Navigation between steps',
        'Triggering modals or dialogs',
        'Destructive actions like delete (with danger variant)',
    ],

    whenNotToUse: [
        { text: 'Navigating to another page', alternative: 'Link component' },
        { text: 'Toggling a setting on/off', alternative: 'Switch or Checkbox' },
        { text: 'Selecting from options', alternative: 'Radio buttons or Select' },
        { text: 'Text-only inline actions', alternative: 'Text Button' },
    ],

    // Overview
    overview: {
        description: 'The Button component uses a "Kind" (intent) and "Variant" (visual style) system to provide flexible, consistent buttons.',
        variants: ['Filled', 'Outlined', 'Ghost', 'Soft', 'Link'],
        demos: [
            {
                name: 'Button Matrix',
                description: 'A comprehensive view of all Button kinds and variants.',
                component: ButtonMatrixDemo,
            },
            {
                name: 'Sizes',
                description: 'Buttons come in six sizes: xs, s, m, l, xl, and 2xl.',
                component: ButtonSizesDemo,
            },
            {
                name: 'Shapes',
                description: 'Buttons can be rounded (default), pill-shaped, square, or circular.',
                component: ButtonShapesDemo,
            },
            {
                name: 'States',
                description: 'Visual feedback for hover, active, focus, and disabled states.',
                component: ButtonStatesDemo,
            },
            {
                name: 'With Icons',
                description: 'Icons can be placed before (leading) or after (trailing) the text label.',
                component: ButtonWithIconsDemo,
            },
            {
                name: 'Icon Only',
                description: 'Use for compact actions. Always provide an aria-label.',
                component: IconOnlyButtonsDemo,
            },
            {
                name: 'Split Button',
                description: 'A button that offers a primary action and a dropdown for related actions.',
                component: SplitButtonDemo,
            },
            {
                name: 'Button Group',
                description: 'Group related buttons together.',
                component: ButtonGroupDemo,
            },
            {
                name: 'Full Width',
                description: 'Buttons can expand to fill their container.',
                component: FullWidthButtonsDemo,
            }
        ]
    },

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Background shape with border radius' },
                { name: '2. Label', description: 'Text content describing the action' },
                { name: '3. Leading Icon', description: 'Optional icon before label' },
                { name: '4. Trailing Icon', description: 'Optional icon after label' },
            ]
        },
        sizes: [
            { name: 'Extra Small (xs)', height: '24px', description: 'Compact tables, dense toolbars' },
            { name: 'Small (s)', height: '32px', description: 'Secondary actions, inline forms' },
            { name: 'Medium (m)', height: '40px', description: 'Default for most use cases' },
            { name: 'Large (l)', height: '48px', description: 'Primary CTAs, touch-friendly' },
            { name: 'Extra Large (xl)', height: '56px', description: 'Hero section CTAs, marketing' },
            { name: '2X Large (2xl)', height: '64px', description: 'Massive hero buttons, landing pages' },
        ],
        emphasis: 'Use primary for main actions (1 per view), secondary for supporting actions, tertiary for low-emphasis actions.',
        alignment: 'Right-align action buttons in dialogs and forms. Center single CTAs in marketing contexts.',
    },

    // Content Guidelines
    content: {
        mainElements: 'Use action verbs: "Save", "Submit", "Delete". Keep labels to 1-3 words. Use sentence case.',
        overflowContent: 'Button text should not truncate. If text is too long, rewrite it.',
        internationalization: 'Allow 30% extra width for translations. Avoid icons-only for actions that need clarity.',
        furtherGuidance: 'Pair with confirmation dialogs for destructive actions.',
    },

    // Universal Behaviors
    universalBehaviors: {
        states: 'Button has six states: enabled, hover, focus, active, disabled, and loading.',
        interactions: {
            mouse: 'Click to trigger action. Hover shows elevated state.',
            keyboard: 'Enter or Space activates. Tab navigates to/from button.',
        },
        loading: 'Shows spinner and disables clicks. Maintains width to prevent layout shift.',
    },

    // Per-Variant Documentation
    variantDocs: [
        {
            name: 'Primary',
            description: 'High-emphasis button for main actions. Use sparingly—only 1 per major view section.',
            bestPractices: [
                'Use for the main action in a form or dialog',
                'Limit to one primary button per view section',
                'Position prominently (right side or centered)',
            ],
        },
        {
            name: 'Secondary',
            description: 'Medium-emphasis for secondary actions that support the primary action.',
            bestPractices: [
                'Use alongside primary buttons',
                'Good for "Cancel" or "Back" actions',
                'Can have multiple per section',
            ],
        },
        {
            name: 'Tertiary',
            description: 'Low-emphasis button for less important actions.',
            bestPractices: [
                'Use for optional or dismissible actions',
                'Good for "Learn more" or "Skip"',
                'Works well in cards and inline contexts',
            ],
        },
        {
            name: 'Ghost',
            description: 'Minimal visual presence, only shows on hover.',
            bestPractices: [
                'Use in toolbars and icon-only contexts',
                'Good for table row actions',
                'Combine with icons for clarity',
            ],
        },
        {
            name: 'Danger',
            description: 'Indicates destructive actions that cannot be undone.',
            bestPractices: [
                'Use for delete, remove, or destroy actions',
                'Always pair with confirmation dialog',
                'Position away from primary actions',
            ],
        },
    ],

    // Modifiers
    modifiers: [
        {
            name: 'With Leading Icon',
            description: 'Icon before the label for visual context (e.g., download, add).',
        },
        {
            name: 'With Trailing Icon',
            description: 'Icon after the label, typically for navigation arrows.',
        },
        {
            name: 'Icon Only',
            description: 'No text label, requires proper aria-label. Use shape="circle" for a perfect circle.',
        },
        {
            name: 'Full Width',
            description: 'Expands to fill container. Use in mobile or stacked layouts.',
        },
        {
            name: 'Loading',
            description: 'Shows spinner while action is processing. Disables interaction.',
        },
    ],

    // Props
    // (Props moved to bottom)

    // Style Tokens
    styleTokens: [
        {
            variant: 'Primary',
            states: [
                { state: 'Enabled', textToken: '--color-on-primary', backgroundToken: '--color-primary', borderToken: '--color-primary' },
                { state: 'Hover', textToken: '--color-on-primary', backgroundToken: '--color-primary-hover', borderToken: '--color-primary-hover' },
                { state: 'Active', textToken: '--color-on-primary', backgroundToken: '--color-primary-active', borderToken: '--color-primary-active' },
                { state: 'Disabled', textToken: '--color-on-surface-disabled', backgroundToken: '--color-surface-disabled', borderToken: '--color-border-disabled' },
            ],
        },
        {
            variant: 'Secondary',
            states: [
                { state: 'Enabled', textToken: '--color-primary', backgroundToken: '--color-surface-default', borderToken: '--color-primary' },
                { state: 'Hover', textToken: '--color-primary', backgroundToken: '--color-surface-hover', borderToken: '--color-primary' },
                { state: 'Disabled', textToken: '--color-on-surface-disabled', backgroundToken: '--color-surface-disabled', borderToken: '--color-border-disabled' },
            ],
        },
    ],

    // Structure
    structure: [
        { part: 'Padding (horizontal)', token: '--spacing-4', value: '16px' },
        { part: 'Padding (vertical)', token: '--spacing-2', value: '8px' },
        { part: 'Icon gap', token: '--spacing-2', value: '8px' },
        { part: 'Border radius', token: '--border-radius-m', value: '8px' },
        { part: 'Border width', token: '--border-width-xs', value: '1px' },
    ],

    // Anatomy
    anatomy: {
        parts: [
            { name: 'Container', description: 'Clickable button element' },
            { name: 'Label', description: 'Action text' },
            { name: 'Icon', description: 'Optional leading/trailing icon' },
        ]
    },

    // Do's and Don'ts
    inUse: {
        dos: [
            'Use action verbs (Save, Submit, Delete)',
            'Maintain consistent sizing within a section',
            'Use primary sparingly - 1 per major section',
            'Provide loading state for async actions',
            'Include aria-label for icon-only buttons',
        ],
        donts: [
            'Don\'t use multiple primary buttons together',
            'Don\'t disable without explanation',
            'Don\'t use generic labels like "Click here"',
            'Don\'t mix sizes in button groups',
            'Don\'t use danger variant for non-destructive actions',
        ],
        examples: [
            {
                name: 'Specialized Buttons',
                description: 'Buttons can be extended for complex workflows, such as this Data Transfer button (Export/Import).',
                code: `import { DataTransferButton } from '@ui';

const Example = () => (
    <DataTransferButton data={data} filename="export" />
);`,
                component: DataTransferBasicDemo,
            },
        ]
    },

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus to/from button' },
            { key: 'Enter', action: 'Activate the button' },
            { key: 'Space', action: 'Activate the button' },
        ],
        aria: [
            { attribute: 'role="button"', usage: 'Implicit for button elements' },
            { attribute: 'aria-disabled', usage: 'When disabled prop is true' },
            { attribute: 'aria-busy', usage: 'When loading prop is true' },
            { attribute: 'aria-label', usage: 'Required for icon-only buttons' },
        ],
        screenReader: 'Announces: "[label], button". When disabled: "[label], button, dimmed".',
        focusIndicator: '2px solid focus ring using --color-focus-ring token',
    },

    // Design Recommendations
    designRecommendations: [
        'Ensure minimum touch target of 44x44px on mobile',
        'Maintain 8px minimum gap between button groups',
        'Use consistent button alignment within forms',
        'Provide visual feedback for all interactive states',
    ],

    developmentConsiderations: [
        'Use native button element for keyboard accessibility',
        'Prevent double-clicks during loading state',
        'Maintain button width during loading to prevent layout shift',
        'Use type="submit" for form submission buttons',
    ],

    // Related Components
    relatedComponents: [
        { name: 'Link', description: 'Use for navigation to other pages', path: 'components/actions/link' },
        { name: 'IconButton', description: 'Use for icon-only actions with tooltip', path: 'components/actions/button' },
        { name: 'ButtonGroup', description: 'Use for related button sets', path: 'components/actions/segmented-control' },
        { name: 'FAB', description: 'Use for primary floating actions', path: 'components/actions/floating-action-button' },
    ],

    // Responsive Behavior
    responsiveBehavior: [
        { breakpoint: 'Desktop (>1024px)', behavior: 'Standard sizing, inline button groups' },
        { breakpoint: 'Tablet (768-1024px)', behavior: 'Touch-friendly sizing, maintain inline' },
        { breakpoint: 'Mobile (<768px)', behavior: 'Full-width for primary actions, stacked button groups' },
    ],
    // Props
    props: [
        { name: 'kind', type: 'ButtonKind', default: 'primary', description: 'Semantic intent: primary, secondary, neutral, danger, success, warning, info.' },
        { name: 'variant', type: 'ButtonVariant', default: 'filled', description: 'Visual style: filled, outlined, ghost, soft, link. Also supports legacy variants manually.' },
        { name: 'shape', type: 'ButtonShape', default: 'default', description: 'Button shape: default (rounded), pill, circle, square.' },
        { name: 'size', type: 'ButtonSize', default: 'm', description: 'Size token: xs, s, m, l, xl, 2xl.' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Whether the button spans full container width.' },
        { name: 'leftIcon', type: 'ReactNode', default: '-', description: 'Icon rendered before the label.' },
        { name: 'rightIcon', type: 'ReactNode', default: '-', description: 'Icon rendered after the label.' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner and disables interaction.' },
    ],



};

export default ButtonDoc;
