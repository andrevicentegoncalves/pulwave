import { ComponentDoc } from '@pulwave/features-style-guide';
import * as RatingStarsDemos from '../demos';

export const RatingStarsDoc: ComponentDoc = {
    name: 'RatingStars',
    description: 'A read-only visual component to display ratings using star icons, supporting fractional values and commonly used in product cards, reviews, and feedback displays.',
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
        'Product ratings in e-commerce cards',
        'Review summaries and feedback displays',
        'Service or experience ratings',
        'Content quality indicators',
        'User reputation or skill level displays',
    ],

    whenNotToUse: [
        { text: 'Interactive rating input', alternative: 'Rating input component with hover states' },
        { text: 'Binary like/dislike', alternative: 'Toggle buttons or icons' },
        { text: 'Progress or completion', alternative: 'Progress component' },
        { text: 'Numeric score without visual', alternative: 'Badge or Text component' },
    ],

    overview: {
        description: 'Displays a star rating based on a numeric value with support for half-star precision.',
        variants: ['default', 'compact'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Displays a star rating based on a numeric value.',
                component: RatingStarsDemos.RatingStarsBasicDemo,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Star Icons', description: 'Filled, half-filled, or empty stars' },
                { name: '2. Numeric Value', description: 'Optional text showing exact rating' },
            ]
        },
        emphasis: 'Filled stars should be visually prominent. Half-stars indicate precision.',
        alignment: 'Inline display with optional numeric value to the right.',
    },

    content: {
        mainElements: 'Star icons representing the rating value. Optional numeric display for precision.',
        overflowContent: 'Not applicable - fixed number of stars based on max prop.',
        internationalization: 'Numeric display follows locale formatting. Stars are universal symbols.',
    },

    props: [
        { name: 'value', type: 'number', required: true, description: 'Rating value to display (supports decimals for half-stars).' },
        { name: 'max', type: 'number', required: false, defaultValue: '5', description: 'Maximum number of stars to display.' },
        { name: 'size', type: "'s' | 'm' | 'l'", required: false, defaultValue: "'m'", description: 'Size of the star icons.' },
        { name: 'color', type: "RatingStarsColor", required: false, defaultValue: "'warning'", description: 'Color theme for filled stars.' },
        { name: 'showNumeric', type: 'boolean', required: false, defaultValue: 'false', description: 'Display numeric value alongside stars.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus the rating display if interactive' },
        ],
        aria: [
            { attribute: 'role="img"', usage: 'Rating display as a single image' },
            { attribute: 'aria-label', usage: 'Full description: "[value] out of [max] stars"' },
        ],
        screenReader: 'Announces: "[value] out of [max] stars" or "[value] star rating".',
        focusIndicator: 'Focus ring around entire rating display',
    },

    relatedComponents: [
        { name: 'Icon', description: 'For custom rating icons', path: 'components/data-display/icon' },
        { name: 'Progress', description: 'For progress-style ratings', path: 'components/data-display/progress' },
        { name: 'Badge', description: 'For numeric score display', path: 'components/data-display/badge' },
    ],
};

export default RatingStarsDoc;

