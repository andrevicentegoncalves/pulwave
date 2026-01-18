/**
 * LinkDoc - Documentation for Link component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import LinkDemo from '../demos/LinkDemo';

const LinkDoc: ComponentDoc = {
    name: 'Link',
    subtitle: 'Styled anchor links for navigation.',
    description: 'Link provides styled anchor elements with support for external links, underline options, router integration, and consistent visual styling across the application.',
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
        'For navigation to other pages or external resources',
        'For inline text links within paragraphs',
        'For actions that navigate users to a URL',
        'For breadcrumb and menu navigation',
        'For footer and legal links',
    ],

    whenNotToUse: [
        { text: 'For primary actions', alternative: 'Button component' },
        { text: 'For triggering modals or dialogs', alternative: 'Button component' },
        { text: 'For form submissions', alternative: 'Button with type submit' },
        { text: 'For toggling states', alternative: 'Switch or Button' },
    ],

    overview: {
        description: 'Link component standardizes anchor tags with consistent styling.',
        variants: ['default', 'neutral', 'subtle'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Various link styles and states.',
                component: LinkDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Text', description: 'Link label text' },
                { name: '2. Underline', description: 'Visual indicator (configurable)' },
                { name: '3. External Icon', description: 'Optional icon for external links' },
            ]
        },
        emphasis: 'Links should be distinguishable from surrounding text.',
        alignment: 'Inline with text, baseline-aligned.',
    },

    content: {
        mainElements: 'Link text should be descriptive of the destination.',
        overflowContent: 'Long link text wraps naturally with the paragraph.',
        internationalization: 'Link text should be translatable.',
    },

    designRecommendations: [
        'Use descriptive link text (avoid "click here").',
        'Indicate external links with icon or visual cue.',
        'Maintain consistent link styling throughout the app.',
        'Ensure sufficient color contrast with surrounding text.',
    ],

    developmentConsiderations: [
        'Integrate with router (React Router, Next.js Link).',
        'Handle external links with proper security attributes.',
        'Support both href and onClick for flexibility.',
        'Consider prefetching for improved navigation.',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Link content.' },
        { name: 'href', type: 'string', required: false, description: 'Link destination.' },
        { name: 'variant', type: '"default" | "neutral" | "subtle"', required: false, description: 'Visual variant.', defaultValue: '"default"' },
        { name: 'size', type: '"s" | "m" | "l"', required: false, description: 'Size.', defaultValue: '"m"' },
        { name: 'external', type: 'boolean', required: false, description: 'Show external link icon.', defaultValue: 'false' },
        { name: 'underline', type: '"always" | "hover" | "none"', required: false, description: 'Underline style.', defaultValue: '"hover"' },
        { name: 'disabled', type: 'boolean', required: false, description: 'Disabled state.', defaultValue: 'false' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus the link' },
            { key: 'Enter', action: 'Activate the link' },
        ],
        aria: [
            { attribute: 'aria-disabled', usage: 'When link is disabled' },
            { attribute: 'target="_blank"', usage: 'For external links (with rel="noopener")' },
        ],
        screenReader: 'Announces link text. External links should indicate they open in new tab.',
        focusIndicator: 'Focus outline visible on keyboard navigation.',
    },

    relatedComponents: [
        { name: 'Button', description: 'For actions', path: 'components/actions/button' },
        { name: 'Breadcrumbs', description: 'Navigation path links', path: 'components/navigation/breadcrumbs' },
        { name: 'Menu', description: 'Navigation menu with links', path: 'components/navigation/menu' },
    ],
};

export default LinkDoc;
