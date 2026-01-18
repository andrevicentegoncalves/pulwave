import { ComponentDoc } from '@pulwave/features-style-guide';
import * as ExportDataDemos from '../demos';

export const ExportDataDoc: ComponentDoc = {
    name: 'ExportData',
    subtitle: 'Export data to multiple formats.',
    description: 'ExportData is a button component to export data in various formats (CSV, JSON, Excel, PDF), typically used in table toolbars for data extraction workflows.',
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
        'Table toolbars for data extraction',
        'Report generation interfaces',
        'Dashboard data downloads',
        'Spreadsheet-compatible exports',
        'Backup and archive workflows',
    ],

    whenNotToUse: [
        { text: 'Import functionality needed', alternative: 'DataTransferButton component' },
        { text: 'Single document generation', alternative: 'Direct download link' },
        { text: 'Server-side exports', alternative: 'API endpoint with loading state' },
        { text: 'Very large datasets', alternative: 'Paginated export or background job' },
    ],

    overview: {
        description: 'A button component to export data in various formats.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Export button with default formats.',
                component: ExportDataDemos.ExportDataBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Export Button', description: 'Main trigger button with icon' },
                { name: '2. Format Dropdown', description: 'List of available export formats' },
                { name: '3. Format Icons', description: 'Visual indicators for each format' },
            ]
        },
        emphasis: 'Button uses outline variant by default. Dropdown shows format names with icons.',
        alignment: 'Aligns with other toolbar buttons. Dropdown opens below button.',
    },

    content: {
        mainElements: 'Dropdown button with export format options.',
        overflowContent: 'Format list scrolls if many formats are supported.',
        internationalization: 'Button label and format names should be translatable.',
    },

    designRecommendations: [
        'Place in table toolbar alongside filters and search.',
        'Use consistent format ordering across the application.',
        'Show loading state during export generation.',
    ],

    developmentConsiderations: [
        'Generates files client-side using appropriate libraries.',
        'Custom export handlers can override default behavior.',
        'Filename automatically includes timestamp.',
    ],

    props: [
        { name: 'data', type: 'Record<string, unknown>[]', required: true, description: 'Data to export.' },
        { name: 'filename', type: 'string', required: false, defaultValue: '"export"', description: 'Base filename for the downloaded file.' },
        { name: 'supportedFormats', type: '("csv" | "json" | "xls" | "pdf")[]', required: false, defaultValue: '["csv", "json", "xls"]', description: 'Enabled export formats.' },
        { name: 'onExport', type: '(data, format) => void', required: false, description: 'Custom export handler for specific formats.' },
        { name: 'variant', type: 'ButtonVariant', required: false, defaultValue: '"outline"', description: 'Visual style of the trigger button.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Enter/Space', action: 'Open format dropdown' },
            { key: 'Arrow Down/Up', action: 'Navigate format options' },
            { key: 'Enter', action: 'Select format and trigger export' },
            { key: 'Escape', action: 'Close dropdown' },
        ],
        aria: [
            { attribute: 'aria-haspopup="menu"', usage: 'Indicates dropdown menu' },
            { attribute: 'aria-expanded', usage: 'Dropdown open state' },
            { attribute: 'role="menuitem"', usage: 'Each format option' },
        ],
        screenReader: 'Button announces: "Export data, menu". Items announce format names.',
        focusIndicator: 'Focus ring on button and menu items.',
    },

    relatedComponents: [
        { name: 'DataTransferButton', description: 'Export and import combined', path: 'patterns/data/data-transfer-button' },
        { name: 'Button', description: 'Base button component', path: 'components/actions/button' },
        { name: 'Dropdown', description: 'Menu dropdown', path: 'components/overlays/dropdown' },
    ],
};

export default ExportDataDoc;

