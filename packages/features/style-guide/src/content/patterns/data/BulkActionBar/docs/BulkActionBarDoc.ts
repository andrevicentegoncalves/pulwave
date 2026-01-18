import { ComponentDoc } from '@pulwave/features-style-guide';
import { BulkActionBarBasicDemo } from '../demos';

export const BulkActionBarDoc: ComponentDoc = {
    name: 'BulkActionBar',
    subtitle: 'Contextual actions for multi-selection.',
    description: 'BulkActionBar is a floating action bar that appears when items are selected, providing contextual actions for bulk operations on data tables or lists.',
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
        'DataTable with multi-select functionality',
        'Bulk operations like delete, export, or assign',
        'Managing selections across paginated lists',
        'Applying actions to multiple items simultaneously',
        'Administrative interfaces with batch processing',
    ],

    whenNotToUse: [
        { text: 'Single item actions', alternative: 'Row action buttons or dropdown menu' },
        { text: 'Global page actions', alternative: 'Page header actions' },
        { text: 'Non-selection contexts', alternative: 'Floating action button (FAB)' },
        { text: 'Mobile-first designs', alternative: 'Bottom sheet with actions' },
    ],

    overview: {
        description: 'A floating action bar that provides contextual actions for selected items.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Action bar that appears when items are selected.',
                component: BulkActionBarBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Selection Count', description: 'Displays number of selected items' },
                { name: '2. Clear Button', description: 'Clears all selections' },
                { name: '3. Action Buttons', description: 'Contextual bulk actions' },
            ]
        },
        emphasis: 'Uses elevated surface to stand out. Selection count provides context.',
        alignment: 'Fixed at bottom of viewport. Centered horizontally with padding.',
    },

    content: {
        mainElements: 'Selection counter, clear button, and action buttons in a floating bar.',
        overflowContent: 'Actions should be limited. Use overflow menu for many actions.',
        internationalization: 'Selection text should be translatable. RTL support included.',
    },

    designRecommendations: [
        'Limit visible actions to 3-4. Use overflow menu for additional actions.',
        'Use consistent action icons across the application.',
        'Provide visual feedback when actions are processing.',
    ],

    developmentConsiderations: [
        'Uses React Portal by default for proper stacking context.',
        'Animates in/out based on `open` state.',
        'Actions should handle async operations with loading states.',
    ],

    props: [
        { name: 'open', type: 'boolean', required: true, description: 'Controls visibility of the bar.' },
        { name: 'selectedCount', type: 'number', required: true, description: 'Number of selected items to display.' },
        { name: 'onClearSelection', type: '() => void', required: true, description: 'Callback triggered when clear button is clicked.' },
        { name: 'actions', type: 'ReactNode', required: true, description: 'Action buttons to display in the bar.' },
        { name: 'usePortal', type: 'boolean', required: false, description: 'Whether to render via React Portal.', defaultValue: 'true' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between actions' },
            { key: 'Escape', action: 'Clear selection and close bar' },
            { key: 'Enter/Space', action: 'Activate focused action' },
        ],
        aria: [
            { attribute: 'role="toolbar"', usage: 'Identifies the action bar as a toolbar' },
            { attribute: 'aria-label', usage: 'Describes the selection context' },
            { attribute: 'aria-live="polite"', usage: 'Announces selection count changes' },
        ],
        screenReader: 'Announces: "[N] items selected. Actions available: [action names]".',
        focusIndicator: 'Focus ring on action buttons. Focus trapped within bar when open.',
    },

    relatedComponents: [
        { name: 'DataTable', description: 'Table with selection support', path: 'components/data-display/data-table' },
        { name: 'Checkbox', description: 'Selection control', path: 'components/inputs/checkbox' },
        { name: 'Button', description: 'Action buttons', path: 'components/actions/button' },
    ],
};

export default BulkActionBarDoc;
