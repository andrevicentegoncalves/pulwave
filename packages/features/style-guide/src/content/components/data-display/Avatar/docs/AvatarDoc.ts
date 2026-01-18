/**
 * AvatarDoc - Documentation for Avatar component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { AvatarFallbackDemo, AvatarSizesDemo } from '../demos';

const AvatarDoc: ComponentDoc = {
    name: 'Avatar',
    description: 'Circular avatar displaying user images, initials, or icon fallback.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2024-12-30',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'Displaying user profile pictures',
        'Showing author attribution',
        'User lists and mentions',
        'Comment threads and chat interfaces',
    ],

    whenNotToUse: [
        { text: 'Decorative images', alternative: 'Image component' },
        { text: 'Logo display', alternative: 'Image with appropriate sizing' },
        { text: 'Editable profile photos', alternative: 'AvatarUpload component' },
    ],

    overview: {
        description: 'The Avatar component shows a circular representation of a user with graceful fallbacks from image to initials to icon.',
        variants: ['image', 'initials', 'icon'],
        demos: [
            {
                name: 'Fallback Behavior',
                description: 'Avatar gracefully falls back from image to initials to icon.',
                component: AvatarFallbackDemo,
            },
            {
                name: 'Sizes',
                description: 'Available avatar sizes.',
                component: AvatarSizesDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Circular container with consistent sizing' },
                { name: '2. Image', description: 'User photo when available' },
                { name: '3. Initials', description: 'First letters of name when no image' },
                { name: '4. Icon', description: 'Generic user icon as final fallback' },
            ]
        },
        sizes: [
            { name: 'Extra Small (xs)', height: '24px', description: 'Inline mentions, compact lists' },
            { name: 'Small (s)', height: '32px', description: 'Comment threads, chat' },
            { name: 'Medium (m)', height: '40px', description: 'Default, user cards' },
            { name: 'Large (l)', height: '56px', description: 'Profile headers' },
            { name: 'Extra Large (xl)', height: '72px', description: 'Profile pages' },
        ],
    },

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role="img"', usage: 'Implicit for img element' },
            { attribute: 'alt', usage: 'Provide descriptive text for screen readers' },
        ],
        screenReader: 'Announce user name via alt text or aria-label',
    },

    relatedComponents: [
        { name: 'AvatarUpload', description: 'Editable avatar with upload capability' },
        { name: 'Badge', description: 'Add status indicator to avatar' },
    ],
};

export default AvatarDoc;
