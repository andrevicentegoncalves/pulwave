/**
 * TooltipDoc - Documentation for Tooltip component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import TooltipPlacementDemo from '../demos/TooltipPlacementDemo';

const TooltipDoc: ComponentDoc = {
    name: 'Tooltip',
    subtitle: 'Contextual text hints on hover or focus.',
    description: 'Tooltip displays brief contextual text hints on hover or focus, providing additional information about elements without cluttering the interface.',
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
        'Explaining icon-only buttons',
        'Providing additional context for UI elements',
        'Showing full text for truncated content',
        'Clarifying form field requirements',
        'Explaining disabled element states',
    ],

    whenNotToUse: [
        { text: 'Critical information users must see', alternative: 'Inline text or Alert' },
        { text: 'Interactive content needed', alternative: 'Popover component' },
        { text: 'Complex content or images', alternative: 'Popover or Modal' },
        { text: 'Mobile touch-only interfaces', alternative: 'Inline hints or labels' },
    ],

    overview: {
        description: 'Tooltip displays brief text on hover/focus with configurable placement.',
        variants: ['top', 'right', 'bottom', 'left'],
        demos: [
            {
                name: 'Placements',
                description: 'Tooltips can be positioned on any side.',
                component: TooltipPlacementDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Trigger', description: 'Element that activates tooltip on hover/focus' },
                { name: '2. Arrow', description: 'Pointer connecting tooltip to trigger' },
                { name: '3. Content', description: 'Text or simple content displayed' },
            ]
        },
        emphasis: 'Tooltip content should be concise and informative.',
        alignment: 'Positions automatically to avoid viewport edges.',
    },

    content: {
        mainElements: 'Keep tooltip text brief (1-2 sentences max).',
        overflowContent: 'Long text wraps. Avoid multi-line tooltips when possible.',
        internationalization: 'Tooltip text should be translatable.',
    },

    designRecommendations: [
        'Keep tooltip text concise and scannable.',
        'Use consistent placement throughout the application.',
        'Avoid tooltips on touch-only devices.',
        'Ensure sufficient contrast with background.',
    ],

    developmentConsiderations: [
        'Use aria-describedby for accessible tooltips.',
        'Consider delay before showing (300-500ms typical).',
        'Handle viewport collision detection.',
        'Support both hover and focus triggers.',
    ],

    props: [
        { name: 'content', type: 'ReactNode', required: true, description: 'Tooltip content to display.' },
        { name: 'placement', type: '"top" | "right" | "bottom" | "left"', required: false, description: 'Preferred placement.', defaultValue: '"top"' },
        { name: 'delay', type: 'number', required: false, description: 'Delay before showing (ms).', defaultValue: '300' },
        { name: 'children', type: 'ReactElement', required: true, description: 'Trigger element.' },
        { name: 'disabled', type: 'boolean', required: false, description: 'Disable tooltip display.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus trigger shows tooltip' },
            { key: 'Escape', action: 'Hide tooltip if open' },
        ],
        aria: [
            { attribute: 'role="tooltip"', usage: 'Identifies tooltip content' },
            { attribute: 'aria-describedby', usage: 'Links trigger to tooltip content' },
        ],
        screenReader: 'Announces tooltip content when trigger receives focus.',
        focusIndicator: 'Focus on trigger element, not the tooltip itself.',
    },

    relatedComponents: [
        { name: 'Popover', description: 'Interactive overlay content', path: 'components/overlays/popover' },
        { name: 'Badge', description: 'Static inline labels', path: 'components/data-display/badge' },
        { name: 'Button', description: 'Common tooltip trigger', path: 'components/actions/button' },
    ],
};

export default TooltipDoc;
