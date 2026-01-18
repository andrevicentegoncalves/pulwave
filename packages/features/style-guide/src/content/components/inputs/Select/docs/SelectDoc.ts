/**
 * SelectDoc - Enhanced documentation for Select component
 * 
 * Following IBM Carbon / Adobe Spectrum Design System patterns with:
 * - Accessibility testing status badges
 * - Visual state matrix for all interactive states
 * - Component comparison (Select vs Dropdown vs Autocomplete)
 * - Content guidelines (main elements, overflow, i18n)
 * - Per-variant documentation with best practices
 * - Visual Do/Don't pairs with image references
 * - Style tokens and structure specs
 * 
 * @version 2.0.0 - Visual Style Guide Audit (2025-01-01)
 */

import { ComponentDoc } from '@pulwave/features-style-guide';
import {
    SelectBasicDemo,
    SelectSearchableDemo,
    SelectMultiDemo,
    SelectSizesDemo,
    SelectStatesDemo,
    SelectCustomOptionDemo
} from '../demos';
import GroupedSelectDemo from '../demos/GroupedSelectDemo';
import TreeSelectDemo from '../demos/TreeSelectDemo';
import IconSelectDemo from '../demos/IconSelectDemo';
import DatabaseSelectsDemo from '../demos/DatabaseSelectsDemo';
import GeographySelectsDemo from '../demos/GeographySelectsDemo';

const SelectDoc: ComponentDoc = {
    name: 'Select',
    description: 'Unified dropdown selection component supporting single, multiple, tree, and icon modes.',
    status: 'stable',
    version: '2.0.0',
    lastUpdated: '2025-01-01',

    // ========================================================================
    // ACCESSIBILITY TESTING STATUS (Carbon-style)
    // ========================================================================
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    // ========================================================================
    // WHEN TO USE / WHEN NOT TO USE
    // ========================================================================
    whenToUse: [
        'Selecting from 5-50 options in a compact space',
        'Hierarchical data selection with tree mode',
        'Multi-select scenarios with tags display',
        'Searchable option lists with 10+ items',
        'Grouped options for related choices',
    ],

    whenNotToUse: [
        { text: 'Fewer than 3 options', alternative: 'Radio buttons' },
        { text: 'Binary on/off choices', alternative: 'Switch or Checkbox' },
        { text: 'Deeply nested hierarchies (5+ levels)', alternative: 'Cascading menus or dedicated UI' },
        { text: 'Free-form text input needed', alternative: 'Autocomplete input' },
        { text: 'Inline editing context', alternative: 'Editable cells' },
    ],

    // ========================================================================
    // SELECT VS SIMILAR COMPONENTS (NEW - per Audit)
    // ========================================================================
    componentComparison: [
        {
            component: 'Select',
            description: 'Choose one option from a predefined list. Options are hidden until activated.',
            useWhen: 'User picks from 5-50 predefined options, space is limited, form context.',
            characteristics: ['Single selection', 'Predefined options only', 'Compact trigger'],
        },
        {
            component: 'Dropdown',
            description: 'Trigger actions or navigation from a menu. Not for data input.',
            useWhen: 'User needs to trigger an action, not submit form data.',
            characteristics: ['Action-oriented', 'Navigation or commands', 'No form binding'],
        },
        {
            component: 'Autocomplete',
            description: 'Search and filter through options with text input. Can create new values.',
            useWhen: 'Large option lists (50+), users may need to create new values.',
            characteristics: ['Free-text input', 'Async search support', 'Can create new options'],
        },
        {
            component: 'Combobox',
            description: 'Combine text input with dropdown suggestions. Hybrid of select and input.',
            useWhen: 'User may type or select, accepts both predefined and custom values.',
            characteristics: ['Editable trigger', 'Mixed input modes', 'Flexible validation'],
        },
    ],

    // ========================================================================
    // OVERVIEW
    // ========================================================================
    overview: {
        description: 'The Select component is the unified select component for all selection needs. It consolidates single, multi, tree, and icon select patterns into one flexible API.',
        variants: ['default', 'multi', 'tree', 'icon', 'searchable', 'grouped'],
        demos: [
            {
                name: 'Basic Select',
                description: 'Standard single-select dropdown.',
                component: SelectBasicDemo
            },
            {
                name: 'Sizes',
                description: 'Select supports xs, s, m, and l sizes.',
                component: SelectSizesDemo
            },
            {
                name: 'States',
                description: 'Visual feedback for hover, focus, open, and disabled states.',
                component: SelectStatesDemo
            },
            {
                name: 'Searchable',
                description: 'Select with search filtering capabilities.',
                component: SelectSearchableDemo
            },
            {
                name: 'Multi-Select',
                description: 'Select multiple options.',
                component: SelectMultiDemo
            },
            {
                name: 'Grouped Options',
                description: 'Options organized into categories.',
                component: GroupedSelectDemo
            },
            {
                name: 'Tree Select',
                description: 'Hierarchical selection mode.',
                component: TreeSelectDemo
            },
            {
                name: 'Icon Select',
                description: 'Options with leading icons.',
                component: IconSelectDemo
            },
            {
                name: 'Custom Option',
                description: 'Custom rendering for options.',
                component: SelectCustomOptionDemo
            },
            {
                name: 'Database Objects',
                description: 'Complex object selection example.',
                component: DatabaseSelectsDemo
            },
            {
                name: 'Geography',
                description: 'Country and location selection example.',
                component: GeographySelectsDemo
            }
        ]
    },

    // ========================================================================
    // FORMATTING (Carbon-style)
    // ========================================================================
    formatting: {
        // Enhanced anatomy with visual diagram reference
        anatomy: {
            diagramDescription: 'Visual diagram showing numbered component parts in both closed and open states.',
            closedState: [
                { number: 1, name: 'Label', description: 'Text that informs users what to expect in the list of options', required: true },
                { number: 2, name: 'Trigger', description: 'Clickable field button displaying current selection or placeholder', required: true },
                { number: 3, name: 'Trigger Icon', description: 'Optional leading icon providing context (e.g., Globe for countries)', required: false },
                { number: 4, name: 'Value/Placeholder', description: 'Selected value text or placeholder hint', required: true },
                { number: 5, name: 'Chevron', description: 'Dropdown indicator on right side, rotates when open', required: true },
                { number: 6, name: 'Helper Text', description: 'Assistive text below the trigger for guidance', required: false },
            ],
            openState: [
                { number: 7, name: 'Dropdown Container', description: 'Floating panel containing all dropdown elements', required: true },
                { number: 8, name: 'Search Input', description: 'Filter input at top of dropdown (when searchable)', required: false },
                { number: 9, name: 'Option', description: 'Selectable item with optional icon, checkbox, and text', required: true },
                { number: 10, name: 'Option Icon', description: 'Leading icon for visual recognition (flags, category icons)', required: false },
                { number: 11, name: 'Checkbox', description: 'Selection indicator for multi-select mode', required: false },
                { number: 12, name: 'Group Header', description: 'Section label when options are grouped', required: false },
                { number: 13, name: 'Footer', description: 'Action buttons (Apply/Cancel) for deferred multi-select', required: false },
            ],
            // Legacy parts format (for backward compatibility)
            parts: [
                { name: '1. Trigger', description: 'Clickable input area displaying current selection' },
                { name: '2. Trigger Icon', description: 'Optional icon before placeholder text' },
                { name: '3. Chevron', description: 'Dropdown indicator on right side' },
                { name: '4. Dropdown', description: 'Floating panel containing options' },
                { name: '5. Search', description: 'Filter input at top of dropdown' },
                { name: '6. Option', description: 'Selectable item with optional icon and checkbox' },
                { name: '7. Footer', description: 'Action buttons for multi-select (Apply/Cancel)' }
            ]
        },
        sizes: [
            { name: 'Extra Small (xs)', height: '24px', description: 'Compact tables, dense UIs', touchTarget: '24px' },
            { name: 'Small (s)', height: '32px', description: 'Secondary forms, filters', touchTarget: '32px' },
            { name: 'Medium (m)', height: '40px', description: 'Default for forms', touchTarget: '40px' },
            { name: 'Large (l)', height: '48px', description: 'Touch-friendly, primary actions', touchTarget: '48px' },
        ],
        emphasis: 'Use the default border style for most cases. Use the solid background variant for high-contrast contexts or when placed on patterned backgrounds.',
        alignment: 'Align the trigger to the form field grid. Dropdown should align to left edge of trigger and may extend beyond if content requires.',
    },

    // ========================================================================
    // STATE MATRIX (NEW - per Audit - IBM Carbon/Adobe Spectrum pattern)
    // ========================================================================
    stateMatrix: {
        description: 'Visual reference showing all interactive states side-by-side for quick comparison without interaction.',
        states: [
            {
                name: 'Enabled',
                description: 'Default resting state, ready for interaction',
                visualIndicators: ['Default border color', 'Normal text color', 'Chevron visible'],
                borderToken: '--color-border-default',
                backgroundToken: '--color-surface-default',
            },
            {
                name: 'Hover',
                description: 'Cursor is over the trigger, indicating interactivity',
                visualIndicators: ['Darker border', 'Subtle background tint', 'Cursor: pointer'],
                borderToken: '--color-border-hover',
                backgroundToken: '--color-surface-hover',
            },
            {
                name: 'Focus',
                description: 'Keyboard focus on trigger, accessibility indicator',
                visualIndicators: ['Focus ring (2px)', 'Primary border color', 'High contrast outline'],
                borderToken: '--color-primary',
                backgroundToken: '--color-surface-default',
                focusRing: '2px solid var(--color-focus-ring) with 2px offset',
            },
            {
                name: 'Active (Open)',
                description: 'Dropdown is expanded, options visible',
                visualIndicators: ['Primary border', 'Chevron rotated 180°', 'Dropdown shadow visible'],
                borderToken: '--color-primary',
                backgroundToken: '--color-surface-default',
            },
            {
                name: 'Disabled',
                description: 'Interaction is not available',
                visualIndicators: ['Muted colors', 'Cursor: not-allowed', 'Reduced opacity'],
                borderToken: '--color-border-disabled',
                backgroundToken: '--color-surface-disabled',
                textToken: '--color-on-surface-disabled',
            },
            {
                name: 'Error',
                description: 'Validation failed, requires user attention',
                visualIndicators: ['Red/error border', 'Error icon', 'Error message below'],
                borderToken: '--color-error',
                backgroundToken: '--color-surface-default',
                helperTextColor: '--color-error',
            },
            {
                name: 'Read-only',
                description: 'Value visible but not editable, can be copied',
                visualIndicators: ['No border', 'No chevron', 'Cursor: default'],
                borderToken: 'transparent',
                backgroundToken: 'transparent',
            },
        ],
    },

    // ========================================================================
    // CONTENT GUIDELINES (Carbon-style)
    // ========================================================================
    content: {
        mainElements: 'Labels should be concise (1-3 words preferred). Option text should clearly distinguish between choices. Use sentence case for all labels.',
        overflowContent: 'Long option text truncates with ellipsis. Tooltip shows full text on hover. Consider grouping or search for long lists (>15 options).',
        internationalization: 'Dropdown width adjusts to content. RTL layouts mirror the component. Placeholder text should be translatable.',
        furtherGuidance: 'For country/language selectors, use flag icons. For status selections, use color-coded badges.',
    },

    // ========================================================================
    // UNIVERSAL BEHAVIORS (Carbon-style)
    // ========================================================================
    universalBehaviors: {
        states: 'Select has six states: enabled, hover, focus, active (open), disabled, and error. Each state has distinct visual feedback.',
        interactions: {
            mouse: 'Click trigger to open. Click option to select. Click outside or chevron to close.',
            keyboard: 'Space/Enter opens dropdown. Arrow keys navigate. Escape closes. Type to jump to matching option.',
        },
        loading: 'Shows spinner in trigger when loading. Options are disabled during load. Use skeleton for initial load.',
    },

    // ========================================================================
    // PER-VARIANT DOCUMENTATION (Carbon-style)
    // ========================================================================
    variantDocs: [
        {
            name: 'Default Select',
            description: 'Single selection from a flat list of options. The most common select pattern.',
            bestPractices: [
                'Use for 5-15 mutually exclusive options',
                'Provide a clear placeholder',
                'Consider enabling search for 10+ options',
                'Always pair with a visible label',
            ],
        },
        {
            name: 'Multi-Select',
            description: 'Allows selecting multiple options displayed as removable tags.',
            bestPractices: [
                'Show selected count when many items selected',
                'Provide "Select All" for convenience',
                'Use footer with Apply/Cancel for deferred selection',
                'Limit visible tags, show "+N more" for overflow',
            ],
        },
        {
            name: 'Tree Select',
            description: 'Hierarchical selection with expandable parent nodes.',
            bestPractices: [
                'Limit nesting to 3-4 levels maximum',
                'Use recursive selection for categories',
                'Show breadcrumb path for deep selections',
                'Provide search for large trees',
            ],
        },
        {
            name: 'Icon Select',
            description: 'Options displayed with leading icons for quick visual recognition.',
            bestPractices: [
                'Use consistent icon sizes (20px)',
                'Ensure icons are meaningful and distinct',
                'Pair icons with text labels always',
                'Use for countries (flags), categories (icons)',
            ],
        },
    ],

    // ========================================================================
    // MODIFIERS (Carbon-style)
    // ========================================================================
    modifiers: [
        {
            name: 'With Trigger Icon',
            description: 'Display an icon (like Globe, Phone) before the placeholder to provide context about the selection type.',
        },
        {
            name: 'With Auto-Locate',
            description: 'Add a special action button at the top of the dropdown for automatic detection (e.g., auto-detect country from IP).',
        },
        {
            name: 'Searchable',
            description: 'Add a search/filter input at the top of the dropdown for filtering large option lists.',
        },
        {
            name: 'Grouped Options',
            description: 'Organize options into labeled sections for better scannability.',
        },
    ],

    // ========================================================================
    // PROPS
    // ========================================================================
    props: [
        { name: 'options', type: 'SelectOption[]', default: '[]', required: true, description: 'Array of options with value, label, and optional icon' },
        { name: 'value', type: 'T | T[]', default: '—', required: false, description: 'Selected value(s)' },
        { name: 'onChange', type: '(value: T | T[]) => void', default: '—', required: true, description: 'Change handler' },
        { name: 'multiple', type: 'boolean', default: 'false', required: false, description: 'Enable multi-select mode' },
        { name: 'tree', type: 'boolean', default: 'false', required: false, description: 'Enable tree/hierarchical mode' },
        { name: 'searchable', type: 'boolean', default: 'false', required: false, description: 'Enable search filtering' },
        { name: 'size', type: "'xs' | 's' | 'm' | 'l'", default: "'m'", required: false, description: 'Size variant' },
        { name: 'placeholder', type: 'string', default: "'Select...'", required: false, description: 'Placeholder text' },
        { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disabled state' },
        { name: 'loading', type: 'boolean', default: 'false', required: false, description: 'Loading state' },
        { name: 'fullWidth', type: 'boolean', default: 'false', required: false, description: 'Full width mode' },
        { name: 'triggerIcon', type: 'ReactNode', default: '—', required: false, description: 'Icon shown before placeholder in trigger' },
        { name: 'onAutoLocate', type: '() => void', default: '—', required: false, description: 'Callback for auto-locate action' },
        { name: 'grouped', type: 'boolean', default: 'false', required: false, description: 'Enable grouped options display' },
        { name: 'showSelectAll', type: 'boolean', default: 'false', required: false, description: 'Show select all option (multi mode)' },
        { name: 'showFooter', type: 'boolean', default: 'false', required: false, description: 'Show footer with actions (multi mode)' },
    ],

    // ========================================================================
    // STYLE TOKENS (Carbon-style Code tab)
    // ========================================================================
    styleTokens: [
        {
            variant: 'Default',
            states: [
                { state: 'Enabled', textToken: '--color-on-surface-default', backgroundToken: '--color-surface-default', borderToken: '--color-border-default' },
                { state: 'Hover', textToken: '--color-on-surface-default', backgroundToken: '--color-surface-hover', borderToken: '--color-border-hover' },
                { state: 'Focus', textToken: '--color-on-surface-default', backgroundToken: '--color-surface-default', borderToken: '--color-primary' },
                { state: 'Active', textToken: '--color-on-surface-default', backgroundToken: '--color-surface-default', borderToken: '--color-primary' },
                { state: 'Disabled', textToken: '--color-on-surface-disabled', backgroundToken: '--color-surface-disabled', borderToken: '--color-border-disabled' },
            ],
        },
    ],

    // ========================================================================
    // STRUCTURE (spacing tokens)
    // ========================================================================
    structure: [
        { part: 'Trigger padding', token: '--spacing-3 --spacing-4', value: '12px 16px' },
        { part: 'Option padding', token: '--spacing-2 --spacing-3', value: '8px 12px' },
        { part: 'Icon size', token: '--icon-size-m', value: '20px' },
        { part: 'Dropdown gap', token: '--spacing-2', value: '8px' },
        { part: 'Border radius', token: '--border-radius-m', value: '8px' },
    ],

    // ========================================================================
    // ANATOMY (kept for compatibility)
    // ========================================================================
    anatomy: {
        parts: [
            { name: 'Trigger', description: 'Clickable input area with optional triggerIcon' },
            { name: 'Dropdown', description: 'Floating panel with options list' },
            { name: 'AutoLocate', description: 'Optional locate button at top of dropdown' },
            { name: 'Search', description: 'Filter input for searching options' },
            { name: 'Option', description: 'Selectable item with optional icon' },
            { name: 'Footer', description: 'Action buttons for multi-select (Apply/Cancel)' }
        ]
    },

    // ========================================================================
    // DO / DON'T (ENHANCED - Visual pairs per Audit)
    // ========================================================================
    inUse: {
        // Enhanced Do/Don't with visual pair structure (Adobe Spectrum pattern)
        visualGuidelines: [
            {
                name: 'Always include a visible label',
                do: {
                    description: 'Pair every Select with a visible label positioned above the trigger.',
                    imageDescription: 'Select with "Country of birth" label above, showing "United States" selected.',
                    rationale: 'Labels inform users what to expect and are required for accessibility.',
                },
                dont: {
                    description: 'Never use a Select without a visible label.',
                    imageDescription: 'Select showing "United States" with no label — ambiguous to users.',
                    rationale: 'A Select without a label is ambiguous and not accessible.',
                },
            },
            {
                name: 'Use sentence case for labels and options',
                do: {
                    description: 'Write labels and options in sentence case (first word capitalized).',
                    imageDescription: 'Label "Country of birth" with placeholder "Select a country..."',
                    rationale: 'Sentence case is more readable and follows content guidelines.',
                },
                dont: {
                    description: 'Avoid title case or ALL CAPS in labels.',
                    imageDescription: 'Label "Country Of Birth" with placeholder "Select A Country..."',
                    rationale: 'Title case is harder to read and inconsistent with form patterns.',
                },
            },
            {
                name: 'Choose an appropriate width',
                do: {
                    description: 'Make the trigger wide enough to display selected values without truncation.',
                    imageDescription: 'Select showing full text "United States of America" without truncation.',
                    rationale: 'Full visibility of selection improves clarity and reduces confusion.',
                },
                dont: {
                    description: 'Avoid narrow triggers that truncate common option values.',
                    imageDescription: 'Select showing "United Sta..." with ellipsis cutting off text.',
                    rationale: 'Truncation makes users uncertain about their selection.',
                },
            },
            {
                name: 'Keep options concise',
                do: {
                    description: 'Use short, clear option labels that fit on one line.',
                    imageDescription: 'Options: "Small", "Medium", "Large" — clean and scannable.',
                    rationale: 'Concise options are easier to scan and compare.',
                },
                dont: {
                    description: 'Avoid long option text that wraps to multiple lines.',
                    imageDescription: 'Options: "Small (works best for mobile phones)", "Large (select this one for printing)"',
                    rationale: 'Verbose options slow down scanning and clutter the menu.',
                },
            },
            {
                name: 'Use helper text for context, not redundancy',
                do: {
                    description: 'Add helper text that provides additional context about the selection.',
                    imageDescription: 'Helper text: "Select the best way to contact you in case there\'s an issue."',
                    rationale: 'Helpful context guides users to make the right choice.',
                },
                dont: {
                    description: 'Don\'t repeat the label in the helper text.',
                    imageDescription: 'Label "Contact method" with helper text "Choose your contact method."',
                    rationale: 'Redundant helper text wastes space and adds no value.',
                },
            },
            {
                name: 'Mark required/optional appropriately',
                do: {
                    description: 'Mark the minority of fields (whichever is less common in the form).',
                    imageDescription: 'Form with most fields required, only "Nickname (optional)" marked.',
                    rationale: 'Marking the minority reduces visual noise and cognitive load.',
                },
                dont: {
                    description: 'Don\'t mark all fields, or use asterisks for optional fields.',
                    imageDescription: 'Form with "Name (required)", "Email (required)", "Country"',
                    rationale: 'Marking everything adds clutter; asterisks should only mean required.',
                },
            },
            {
                name: 'Use icons for visual context, not as sole identifiers',
                do: {
                    description: 'Pair icons with text labels for options that benefit from visual cues.',
                    imageDescription: 'Country options with flag icons AND text labels: 🇺🇸 United States',
                    rationale: 'Icons enhance recognition when paired with text.',
                },
                dont: {
                    description: 'Don\'t use icons alone without text labels.',
                    imageDescription: 'Options showing only flag icons with no country names',
                    rationale: 'Icons alone are ambiguous and fail accessibility requirements.',
                },
            },
            {
                name: 'Write error messages that show solutions',
                do: {
                    description: 'Write error text that guides users to fix the issue.',
                    imageDescription: 'Error: "Select a contact method to continue."',
                    rationale: 'Solution-oriented messages reduce frustration.',
                },
                dont: {
                    description: 'Don\'t use vague or technical error messages.',
                    imageDescription: 'Error: "Invalid field" or "Required"',
                    rationale: 'Vague errors leave users guessing how to resolve them.',
                },
            },
        ],
        // Legacy format (for backward compatibility)
        dos: [
            'Always include a visible label above the Select',
            'Use sentence case for labels and options',
            'Use for 5-50 options in a compact space',
            'Enable search for lists with 10+ options',
            'Use tree mode for hierarchical data (max 3-4 levels)',
            'Use multiple mode for tag-like selections',
            'Add triggerIcon for context (e.g., Globe for countries)',
            'Write error messages that guide users to solutions',
        ],
        donts: [
            'Don\'t use for fewer than 3 options (use RadioGroup instead)',
            'Don\'t use without a visible label — it\'s not accessible',
            'Don\'t nest too deep in tree mode (max 3-4 levels)',
            'Don\'t use title case or ALL CAPS for labels',
            'Don\'t use icons without text labels',
            'Don\'t repeat the label text in helper text',
            'Don\'t mark all fields as required — mark the minority',
            'Don\'t use vague error messages like "Invalid field"',
        ],
        examples: [
            { title: 'Countries', description: 'Country selection with flags', code: '<CountriesSelect onChange={...} />' },
            { title: 'Phone Codes', description: 'Phone code with flag', code: '<PhoneSelect onChange={...} />' },
            { title: 'Multi-select', description: 'Multiple selection with tags', code: '<Select multiple options={...} />' },
            { title: 'Tree Select', description: 'Hierarchical selection', code: '<Select tree multiple options={...} />' }
        ]
    },

    // ========================================================================
    // ACCESSIBILITY
    // ========================================================================
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus to/from the select trigger' },
            { key: 'Enter / Space', action: 'Open dropdown when trigger is focused' },
            { key: 'Arrow Down', action: 'Move to next option / Open dropdown' },
            { key: 'Arrow Up', action: 'Move to previous option' },
            { key: 'Home', action: 'Move to first option' },
            { key: 'End', action: 'Move to last option' },
            { key: 'Escape', action: 'Close dropdown without selection' },
            { key: 'Enter', action: 'Select focused option and close' },
            { key: 'Type characters', action: 'Jump to matching option' },
        ],
        aria: [
            { attribute: 'role="listbox"', usage: 'Applied to the dropdown options container' },
            { attribute: 'role="option"', usage: 'Applied to each selectable option' },
            { attribute: 'aria-selected', usage: 'Indicates currently selected option(s)' },
            { attribute: 'aria-expanded', usage: 'Indicates if dropdown is open' },
            { attribute: 'aria-haspopup="listbox"', usage: 'Applied to trigger button' },
            { attribute: 'aria-label / aria-labelledby', usage: 'Required for accessible name' },
            { attribute: 'aria-multiselectable', usage: 'Set to true for multiple mode' },
        ],
        screenReader: 'Announces: "[Label], [selected value], combo box, collapsed/expanded". On option focus: "[option label], [X of Y]".',
        focusIndicator: '2px solid focus ring with 2px offset, using --color-focus-ring token',
    },

    // ========================================================================
    // DESIGN & DEVELOPMENT RECOMMENDATIONS (A11y tab)
    // ========================================================================
    designRecommendations: [
        'Always pair with a visible label positioned above the select',
        'Ensure minimum touch target of 44x44px on mobile devices',
        'Use icons to provide visual context, not as the only identifier',
        'Provide clear visual distinction between selected and unselected states',
    ],

    developmentConsiderations: [
        'Use native button element for trigger to ensure keyboard accessibility',
        'Implement proper focus trap within dropdown when open',
        'Support type-ahead to jump to matching options',
        'Handle portal rendering to avoid overflow clipping issues',
    ],

    // ========================================================================
    // EXTENSIONS
    // ========================================================================
    extensions: {
        description: 'Specialized components extending Select for specific use cases.',
        demos: []
    },

    // ========================================================================
    // RELATED COMPONENTS
    // ========================================================================
    relatedComponents: [
        { name: 'Autocomplete', description: 'Use when users need to search and create new options' },
        { name: 'RadioGroup', description: 'Use for fewer than 5 mutually exclusive options' },
        { name: 'Checkbox', description: 'Use for multiple independent boolean choices' },
        { name: 'Switch', description: 'Use for on/off toggles with immediate effect' },
        { name: 'ComboBox', description: 'Use when combining free-text input with suggestions' },
    ],

    // ========================================================================
    // RESPONSIVE BEHAVIOR
    // ========================================================================
    responsiveBehavior: [
        { breakpoint: 'Desktop (>1024px)', behavior: 'Dropdown opens below trigger, max-height 320px with scroll' },
        { breakpoint: 'Tablet (768-1024px)', behavior: 'Same as desktop, touch-friendly hit targets' },
        { breakpoint: 'Mobile (<768px)', behavior: 'Full-width trigger, bottom sheet dropdown on small screens' },
    ],
};

export default SelectDoc;

