/**
 * Text Component Documentation
 */
import { ComponentDoc } from '@pulwave/features-style-guide';

export const TextDoc: ComponentDoc = {
    name: 'Text',
    subtitle: 'Typography primitive for consistent text rendering.',
    description: 'The Text component is a primitive for rendering typography with consistent styles, weights, and colors. It enforces the design system\'s typographic scale and semantic usage.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        screenReader: 'pass' as const,
        colorContrast: 'pass' as const,
        focusManagement: 'pass' as const,
    },

    whenToUse: [
        'For any text content that needs to adhere to the design system',
        'To apply consistent semantic styles (headings, body text, captions)',
        'To handle text truncation or line clamping in a standardized way',
        'Rendering display text, titles, and body copy',
        'Labels, prices, and action text',
    ],

    whenNotToUse: [
        { text: 'For clickable text that performs an action', alternative: 'Link or Button component' },
        { text: 'For styled form labels', alternative: 'Label component' },
        { text: 'For rich text with formatting', alternative: 'RichText component or HTML' },
    ],

    overview: {
        description: 'Text unifies typography usage across the application. It supports all defined typography categories (display, title, body, label) and provides utilities for truncation, alignment, and color.',
        variants: ['headline', 'title', 'body', 'action', 'label', 'eyebrow', 'price'],
        demos: []
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Wrapper Element', description: 'Semantic HTML element (span, p, h1-h6)' },
                { name: '2. Typography Styles', description: 'Category and size-based styling' },
                { name: '3. Color Token', description: 'Semantic color application' },
            ]
        },
        emphasis: 'Category determines semantic meaning and default styling.',
        alignment: 'Supports left, center, right, and justify alignment.',
    },

    content: {
        mainElements: 'Text content with semantic styling.',
        overflowContent: 'Supports truncation and line clamping.',
        internationalization: 'Content should be translatable, supports RTL.',
    },

    designRecommendations: [
        'Use semantic categories (headline, title, body) consistently.',
        'Prefer category defaults over custom weights.',
        'Use semantic color tokens for text colors.',
        'Apply truncation for constrained layouts.',
        'Match element (as prop) to semantic meaning.',
    ],

    developmentConsiderations: [
        'Choose appropriate HTML element via as prop.',
        'Use category and size for consistent typography.',
        'Apply color tokens for theme compatibility.',
        'Handle truncation and line clamping for overflow.',
        'Ensure proper heading hierarchy for accessibility.',
    ],

    props: [
        { name: 'as', type: 'ElementType', defaultValue: '"span"', description: 'The HTML element to render (e.g., p, h1, span, div).' },
        { name: 'category', type: '"headline" | "title" | "body" | "action" | "label" | "eyebrow" | "price"', defaultValue: '"body"', description: 'The typographic category to apply.' },
        { name: 'size', type: '"3xl" | "2xl" | "xl" | "l" | "m" | "s" | "xs"', defaultValue: '"m"', description: 'The size within the category scale.' },
        { name: 'weight', type: '"normal" | "medium" | "semibold" | "bold"', description: 'Override the default weight for the selected category.' },
        { name: 'color', type: 'string', defaultValue: '"default"', description: 'Text color using semantic design tokens.' },
        { name: 'align', type: '"left" | "center" | "right" | "justify"', description: 'Text alignment utility.' },
        { name: 'truncate', type: 'boolean', defaultValue: 'false', description: 'If true, truncates text with an ellipsis on a single line.' },
        { name: 'lineClamp', type: 'number', description: 'Limits text to a specific number of lines.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role', usage: 'Automatically set based on as prop (e.g., heading)' },
            { attribute: 'aria-level', usage: 'Set for heading elements' },
        ],
        screenReader: 'Text content read naturally based on semantic element.',
        focusIndicator: 'Not applicable (non-interactive element).',
    },

    relatedComponents: [
        { name: 'Link', description: 'Clickable text navigation', path: 'components/navigation/link' },
        { name: 'Heading', description: 'Semantic heading component', path: 'components/typography/heading' },
        { name: 'Label', description: 'Form label component', path: 'components/inputs/label' },
    ],
};

export default TextDoc;
