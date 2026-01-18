/**
 * DividerDoc - Documentation for Divider component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { DividerBasicDemo } from '../demos';

const DividerDoc: ComponentDoc = {
    name: 'Divider',
    subtitle: 'Visual separator for grouping content.',
    description: 'Divider is a visual separator used to group and organize content, available in horizontal and vertical orientations with customizable styling.',
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
        'Separating distinct content sections',
        'Grouping related items in lists or menus',
        'Creating visual breaks in long content',
        'Vertical separation in horizontal layouts',
        'Distinguishing sidebar from main content',
    ],

    whenNotToUse: [
        { text: 'Pure spacing without visible line', alternative: 'Box with margin or Stack with gap' },
        { text: 'Complex grid layouts', alternative: 'Grid with gap' },
        { text: 'Border around elements', alternative: 'Box with border prop' },
        { text: 'Decorative design elements', alternative: 'Custom styled elements' },
    ],

    overview: {
        description: 'Visual separator for content organization.',
        variants: ['horizontal', 'vertical', 'with-text'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Divider types and orientations.',
                component: DividerBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Line', description: 'Visual separator line' },
                { name: '2. Text (optional)', description: 'Label centered on divider' },
            ]
        },
        emphasis: 'Divider should be subtle - it separates, not dominates.',
        alignment: 'Horizontal dividers span full width. Vertical dividers span full height.',
    },

    content: {
        mainElements: 'Optional text label can be centered on divider.',
        overflowContent: 'Text truncates if too long for available space.',
        internationalization: 'Label text should be translatable.',
    },

    designRecommendations: [
        'Use sparingly - too many dividers create visual noise.',
        'Prefer spacing (gap) for minor separations.',
        'Keep divider color subtle (use border tokens).',
        'Match divider orientation to content flow.',
    ],

    developmentConsiderations: [
        'Horizontal dividers use hr element by default.',
        'Vertical dividers need explicit height from parent.',
        'Use role="separator" for accessibility.',
        'Consider aria-orientation for screen readers.',
    ],

    props: [
        { name: 'orientation', type: '"horizontal" | "vertical"', required: false, description: 'Divider direction.', defaultValue: '"horizontal"' },
        { name: 'variant', type: '"solid" | "dashed" | "dotted"', required: false, description: 'Line style.', defaultValue: '"solid"' },
        { name: 'children', type: 'ReactNode', required: false, description: 'Optional text label.' },
        { name: 'color', type: 'string', required: false, description: 'Line color token.' },
        { name: 'spacing', type: 'number | string', required: false, description: 'Margin around divider.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role="separator"', usage: 'Identifies element as a separator' },
            { attribute: 'aria-orientation', usage: 'Indicates horizontal or vertical' },
        ],
        screenReader: 'Announces as separator. Text label is read if present.',
        focusIndicator: 'Not applicable (decorative element).',
    },

    relatedComponents: [
        { name: 'Stack', description: 'Layout with gap spacing', path: 'components/layout/stack' },
        { name: 'Box', description: 'Layout primitive with borders', path: 'components/layout/box' },
        { name: 'SectionHeader', description: 'Section header with divider', path: 'components/layout/section-header' },
    ],
};

export default DividerDoc;
