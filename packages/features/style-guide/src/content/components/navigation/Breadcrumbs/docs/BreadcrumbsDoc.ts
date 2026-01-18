/**
 * BreadcrumbsDoc - Documentation for Breadcrumbs component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import BreadcrumbsDemo from '../demos/BreadcrumbsDemo';

const BreadcrumbsDoc: ComponentDoc = {
    name: 'Breadcrumbs',
    subtitle: 'Navigation trail showing page hierarchy.',
    description: 'Breadcrumbs display a navigation trail showing the hierarchical path to the current page, helping users understand their location and navigate to parent pages.',
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
        'Hierarchical navigation structures',
        'When users need to understand their site location',
        'Providing quick access to parent pages',
        'Deep navigation paths (3+ levels)',
        'Admin dashboards and document management',
    ],

    whenNotToUse: [
        { text: 'Flat site structures', alternative: 'Tabs component' },
        { text: 'Step-by-step progress', alternative: 'Stepper component' },
        { text: 'Single-level navigation', alternative: 'Back button' },
        { text: 'Non-hierarchical browsing', alternative: 'History back' },
    ],

    overview: {
        description: 'Breadcrumbs display the path to the current resource.',
        variants: ['default', 'collapsed'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard breadcrumb navigation.',
                component: BreadcrumbsDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Items', description: 'Clickable navigation links' },
                { name: '2. Separators', description: 'Visual dividers between items' },
                { name: '3. Current Page', description: 'Non-clickable current location' },
                { name: '4. Collapse Indicator', description: 'Ellipsis for truncated paths' },
            ]
        },
        emphasis: 'Current page is visually distinct (non-interactive).',
        alignment: 'Left-aligned, typically below header.',
    },

    content: {
        mainElements: 'Item labels should match page titles for clarity.',
        overflowContent: 'Long paths collapse middle items with ellipsis menu.',
        internationalization: 'Labels should be translatable. Separator respects RTL.',
    },

    designRecommendations: [
        'Keep breadcrumb labels concise (1-3 words).',
        'Match labels to actual page titles.',
        'Use collapse for paths longer than 4-5 items.',
        'Position consistently below header/above content.',
    ],

    developmentConsiderations: [
        'Items array should include href for navigation.',
        'Last item is current page (no href needed).',
        'Use maxItems to control collapse behavior.',
        'Handle click events for SPA navigation.',
    ],

    props: [
        { name: 'items', type: 'BreadcrumbItem[]', required: true, description: 'Array of breadcrumb items with label and href.' },
        { name: 'size', type: '"s" | "m" | "l"', required: false, description: 'Size variant.', defaultValue: '"m"' },
        { name: 'separator', type: 'ReactNode', required: false, description: 'Custom separator element.', defaultValue: '"/"' },
        { name: 'maxItems', type: 'number', required: false, description: 'Maximum items to show (collapses middle).' },
        { name: 'onItemClick', type: '(item: BreadcrumbItem) => void', required: false, description: 'Click handler for items.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between breadcrumb items' },
            { key: 'Enter', action: 'Activate focused breadcrumb link' },
        ],
        aria: [
            { attribute: 'nav aria-label="Breadcrumb"', usage: 'Landmark for navigation region' },
            { attribute: 'aria-current="page"', usage: 'Marks current page item' },
            { attribute: 'ol role="list"', usage: 'Semantic list structure' },
        ],
        screenReader: 'Announces: "Breadcrumb navigation, [N] items. [Item], link."',
        focusIndicator: 'Visible focus ring on clickable items.',
    },

    relatedComponents: [
        { name: 'Stepper', description: 'Step-by-step progress', path: 'components/navigation/stepper' },
        { name: 'Tabs', description: 'Tab navigation', path: 'components/navigation/tabs' },
        { name: 'Menu', description: 'Dropdown navigation', path: 'components/navigation/menu' },
    ],
};

export default BreadcrumbsDoc;
