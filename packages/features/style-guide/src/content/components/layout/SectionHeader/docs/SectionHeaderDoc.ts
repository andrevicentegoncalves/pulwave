import { ComponentDoc } from '@pulwave/features-style-guide';
import { SectionHeaderBasicDemo } from '../demos';

export const SectionHeaderDoc: ComponentDoc = {
    name: 'SectionHeader',
    subtitle: 'Standardized header for content sections.',
    description: 'SectionHeader displays a title with an optional icon, providing consistent visual hierarchy for content sections throughout the application.',
    sourcePath: 'packages/ui/components/SectionHeader/SectionHeader.tsx',
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
        'Introducing content sections on a page',
        'Settings panels with grouped options',
        'Dashboard sections with distinct categories',
        'Form sections requiring visual separation',
        'Documentation or help pages with topics',
    ],

    whenNotToUse: [
        { text: 'Page-level titles', alternative: 'Page title in header/layout' },
        { text: 'Card headers', alternative: 'Card component with header prop' },
        { text: 'Table headers', alternative: 'DataTable with header row' },
        { text: 'Collapsible sections', alternative: 'Accordion component' },
    ],

    overview: {
        description: 'SectionHeader displays a title with an optional icon for visual context.',
        variants: ['default', 'with-icon'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Section header with icon and title.',
                component: SectionHeaderBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Icon', description: 'Visual identifier for the section' },
                { name: '2. Title', description: 'Section heading text' },
            ]
        },
        emphasis: 'Icon provides visual context. Title should be concise and descriptive.',
        alignment: 'Icon and title aligned horizontally. Left-aligned by default.',
    },

    content: {
        mainElements: 'Icon paired with title text in a horizontal layout.',
        overflowContent: 'Title should not truncate. Keep titles concise.',
        internationalization: 'Title text should be translatable. Icons are universal.',
    },

    designRecommendations: [
        'Use at the top of content sections to introduce the topic.',
        'Pair with an icon that represents the section content.',
        'Keep titles concise.',
    ],

    developmentConsiderations: [
        'Uses the `Icon` primitive for consistent sizing.',
        'Accepts any Lucide icon component.',
    ],

    props: [
        { name: 'title', type: 'string', required: true, description: 'The heading text for the section.' },
        { name: 'icon', type: 'ComponentType', required: true, description: 'Icon component from lucide-react.' },
        { name: 'size', type: '"s" | "m" | "l"', required: false, description: 'Size of the icon and title.', defaultValue: '"l"' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role="heading"', usage: 'Semantic heading for the section' },
            { attribute: 'aria-level', usage: 'Heading level (2, 3, etc.)' },
        ],
        screenReader: 'Announces: "[title], heading level [N]". Icon is decorative.',
        focusIndicator: 'Not focusable unless interactive',
    },

    relatedComponents: [
        { name: 'SectionLayout', description: 'Section container', path: 'patterns/layout/section-layout' },
        { name: 'Accordion', description: 'Collapsible sections', path: 'components/data-display/accordion' },
        { name: 'Icon', description: 'Icon component', path: 'components/data-display/icon' },
    ],
};

export default SectionHeaderDoc;

