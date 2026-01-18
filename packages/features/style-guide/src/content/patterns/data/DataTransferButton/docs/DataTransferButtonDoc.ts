import { ComponentDoc } from '@pulwave/features-style-guide';
import * as DataTransferButtonDemos from '../demos';

export const DataTransferButtonDoc: ComponentDoc = {
    name: 'DataTransferButton',
    subtitle: 'Export and import data workflows.',
    description: 'DataTransferButton is a composite button for handling data export and import workflows, integrated with ImportModal for file parsing and validation.',
    id: 'data-transfer-button',
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
        'Table toolbars requiring export/import functionality',
        'Data migration interfaces',
        'Backup and restore workflows',
        'Bulk data entry via file upload',
        'Admin panels with data management features',
    ],

    whenNotToUse: [
        { text: 'Export-only scenarios', alternative: 'ExportData component' },
        { text: 'Single file uploads', alternative: 'FileUpload or AvatarUpload' },
        { text: 'Real-time data sync', alternative: 'API integration' },
        { text: 'Large file processing', alternative: 'Background job with progress' },
    ],

    overview: {
        description: 'Unified export/import button with dropdown menu and import modal.',
        variants: ['default', 'export-only', 'import-only'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Export and Import capabilities for a data entity.',
                component: DataTransferButtonDemos.DataTransferBasicDemo,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Split Button', description: 'Main button with dropdown arrow' },
                { name: '2. Dropdown Menu', description: 'Export formats and import option' },
                { name: '3. Import Modal', description: 'File upload and validation interface' },
            ]
        },
        emphasis: 'Primary action (usually export) is the main button click. Secondary actions in dropdown.',
        alignment: 'Aligns with other table toolbar buttons. Modal centered on screen.',
    },

    content: {
        mainElements: 'Split button with dropdown containing export formats and import option.',
        overflowContent: 'Modal handles large file previews with scrollable content.',
        internationalization: 'Button text, format names, and modal content should be translatable.',
    },

    designRecommendations: [
        'Place in table toolbars alongside other data actions.',
        'Use consistent format options across the application.',
        'Provide clear feedback during import processing.',
    ],

    developmentConsiderations: [
        'Handles file parsing for CSV, JSON, and Excel formats.',
        'Validates imported data structure before calling onImport.',
        'Export generates downloadable files automatically.',
    ],

    props: [
        { name: 'data', type: 'Record<string, unknown>[]', required: false, description: 'Data to export.' },
        { name: 'onExport', type: '(data, format) => void', required: false, description: 'Custom export handler.' },
        { name: 'onImport', type: '(parsedData, filename) => Promise<void>', required: false, description: 'Import handler called with parsed data.' },
        { name: 'entityName', type: 'string', required: false, description: 'Name of the entity (used in filenames/modals).' },
        { name: 'supportedFormats', type: 'string[]', required: false, defaultValue: '["json", "csv", "xls"]', description: 'Supported file formats.' },
        { name: 'exportOnly', type: 'boolean', required: false, description: 'Hide import option.', defaultValue: 'false' },
        { name: 'importOnly', type: 'boolean', required: false, description: 'Hide export options.', defaultValue: 'false' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Enter/Space', action: 'Trigger primary action or open dropdown' },
            { key: 'Arrow Down', action: 'Open dropdown menu' },
            { key: 'Escape', action: 'Close dropdown or modal' },
            { key: 'Tab', action: 'Navigate within modal' },
        ],
        aria: [
            { attribute: 'aria-haspopup="menu"', usage: 'Indicates dropdown presence' },
            { attribute: 'aria-expanded', usage: 'Dropdown open state' },
            { attribute: 'role="dialog"', usage: 'Import modal is a dialog' },
        ],
        screenReader: 'Button announces: "Data transfer, menu". Dropdown items announce format names.',
        focusIndicator: 'Focus ring on button and menu items. Focus trapped in modal.',
    },

    relatedComponents: [
        { name: 'ExportData', description: 'Export-only button', path: 'patterns/data/export-data' },
        { name: 'Button', description: 'Base button component', path: 'components/actions/button' },
        { name: 'Modal', description: 'Import modal base', path: 'components/overlays/modal' },
    ],
};

export default DataTransferButtonDoc;

