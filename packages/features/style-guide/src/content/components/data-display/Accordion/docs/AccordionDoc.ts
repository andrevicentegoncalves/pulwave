import { ComponentDoc } from '@pulwave/features-style-guide';

/**
 * AccordionDoc - Documentation for Accordion component
 */
const AccordionDoc: ComponentDoc = {
    name: 'Accordion',
    subtitle: 'Expandable/collapsible content sections.',
    description: 'Accordion provides expandable and collapsible content sections, allowing users to show and hide content panels with headers, ideal for FAQs, settings, and chunked content.',
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
        'FAQs and help content',
        'Settings sections',
        'Long content that can be chunked',
        'Progressive disclosure of information',
        'Sidebar navigation with expandable sections',
    ],

    whenNotToUse: [
        { text: 'Navigation between views', alternative: 'Tabs component' },
        { text: 'Sequential steps', alternative: 'Wizard component' },
        { text: 'Hierarchical navigation', alternative: 'TreeView component' },
        { text: 'Simple show/hide toggle', alternative: 'Disclosure or Collapsible' },
    ],

    overview: {
        description: 'Accordion with single or multiple expand modes and accessible keyboard navigation.',
        variants: ['single', 'multiple'],
        demos: []
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Header', description: 'Clickable trigger showing section title' },
                { name: '2. Expand Icon', description: 'Visual indicator of expand/collapse state' },
                { name: '3. Content Panel', description: 'Collapsible content area' },
                { name: '4. Divider', description: 'Optional separator between sections' },
            ]
        },
        emphasis: 'Headers should clearly indicate expandable nature.',
        alignment: 'Full-width by default. Content aligns with header.',
    },

    content: {
        mainElements: 'Header text should be concise and descriptive.',
        overflowContent: 'Content panels scroll if exceeding max-height.',
        internationalization: 'Header and content text should be translatable.',
    },

    designRecommendations: [
        'Use clear, descriptive headers.',
        'Consider default expanded state for important sections.',
        'Keep accordion item count reasonable (5-10 max).',
        'Use consistent icon style for expand/collapse.',
    ],

    developmentConsiderations: [
        'Support both controlled and uncontrolled modes.',
        'Implement smooth height animations.',
        'Handle multiple vs single expand mode.',
        'Consider lazy loading for heavy content panels.',
    ],

    props: [
        { name: 'items', type: 'AccordionItem[]', required: true, description: 'Array of accordion items.' },
        { name: 'type', type: '"single" | "multiple"', required: false, description: 'Expand mode.', defaultValue: '"single"' },
        { name: 'defaultValue', type: 'string | string[]', required: false, description: 'Initially expanded item(s).' },
        { name: 'value', type: 'string | string[]', required: false, description: 'Controlled expanded item(s).' },
        { name: 'onValueChange', type: '(value: string | string[]) => void', required: false, description: 'Callback when expansion changes.' },
        { name: 'collapsible', type: 'boolean', required: false, description: 'Allow collapsing all items.', defaultValue: 'true' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Enter/Space', action: 'Toggle section' },
            { key: 'Arrow Up/Down', action: 'Navigate between headers' },
            { key: 'Home', action: 'Focus first header' },
            { key: 'End', action: 'Focus last header' },
        ],
        aria: [
            { attribute: 'aria-expanded', usage: 'Indicates expanded state' },
            { attribute: 'aria-controls', usage: 'Links header to content panel' },
            { attribute: 'role="button"', usage: 'On accordion headers' },
        ],
        screenReader: 'Announces header text and expanded/collapsed state.',
        focusIndicator: 'Focus ring on accordion headers.',
    },

    relatedComponents: [
        { name: 'Tabs', description: 'For horizontal content switching', path: 'components/navigation/tabs' },
        { name: 'TreeView', description: 'For hierarchical data', path: 'components/data-display/tree-view' },
        { name: 'Card', description: 'For grouped content', path: 'components/data-display/card' },
    ],
};

export default AccordionDoc;
