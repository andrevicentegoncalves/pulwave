import { ComponentDoc } from '@pulwave/features-style-guide';
import { SplitPaneBasic } from '../demos';

const SplitPaneDoc: ComponentDoc = {
    name: 'SplitPane',
    subtitle: 'Resizable panels for complex layouts.',
    description: 'SplitPane creates resizable split layouts with draggable dividers, supporting horizontal and vertical orientations for IDE-style or dashboard interfaces.',
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
        'IDE-style layouts with sidebars and terminals',
        'Master-detail views with resizable panels',
        'Dashboard layouts with adjustable sections',
        'Comparison views side-by-side',
        'Code editor with preview pane',
    ],

    whenNotToUse: [
        { text: 'Fixed-width sidebars', alternative: 'CSS Grid or Flexbox layout' },
        { text: 'Responsive collapsible panels', alternative: 'Drawer or collapsible sidebar' },
        { text: 'Tab-based navigation', alternative: 'Tabs component' },
        { text: 'Mobile layouts', alternative: 'Stack or drawer pattern' },
    ],

    overview: {
        description: 'Resizable split layouts with draggable dividers.',
        variants: ['horizontal', 'vertical'],
        demos: [
            {
                name: 'IDE Layout',
                description: 'Nested split panes creating a Sidebar + Main + Terminal layout.',
                component: SplitPaneBasic,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. First Panel', description: 'Primary content area' },
                { name: '2. Divider', description: 'Draggable resize handle' },
                { name: '3. Second Panel', description: 'Secondary content area' },
            ]
        },
        emphasis: 'Divider should be visually subtle but discoverable. Cursor changes on hover.',
        alignment: 'Panels fill available space. Divider positioned between panels.',
    },

    content: {
        mainElements: 'Two panel areas separated by a draggable divider.',
        overflowContent: 'Each panel handles its own overflow. Consider ScrollArea for content.',
        internationalization: 'Layout direction follows document direction (LTR/RTL).',
    },

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'The two panels as children elements.' },
        { name: 'direction', type: '"horizontal" | "vertical"', required: false, defaultValue: '"horizontal"', description: 'Direction of the split.' },
        { name: 'defaultSize', type: 'number', required: false, defaultValue: '50', description: 'Initial size of the first panel (percentage).' },
        { name: 'minSize', type: 'number', required: false, defaultValue: '0', description: 'Minimum size of the first panel (percentage).' },
        { name: 'maxSize', type: 'number', required: false, defaultValue: '100', description: 'Maximum size of the first panel (percentage).' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Arrow Keys', action: 'Resize panels when divider is focused' },
            { key: 'Tab', action: 'Navigate to/from divider' },
            { key: 'Home/End', action: 'Set panel to min/max size' },
        ],
        aria: [
            { attribute: 'role="separator"', usage: 'Divider is a separator' },
            { attribute: 'aria-orientation', usage: 'Indicates split direction' },
            { attribute: 'aria-valuenow', usage: 'Current panel size' },
            { attribute: 'aria-valuemin/max', usage: 'Size constraints' },
        ],
        screenReader: 'Divider announces: "Resize handle, [current]%, min [min]%, max [max]%".',
        focusIndicator: 'Focus ring on divider when focused',
    },

    relatedComponents: [
        { name: 'Grid', description: 'Fixed grid layouts', path: 'components/layout/grid' },
        { name: 'Drawer', description: 'Collapsible side panels', path: 'components/overlays/drawer' },
        { name: 'ScrollArea', description: 'For panel overflow', path: 'components/layout/scroll-area' },
    ],
};

export default SplitPaneDoc;
