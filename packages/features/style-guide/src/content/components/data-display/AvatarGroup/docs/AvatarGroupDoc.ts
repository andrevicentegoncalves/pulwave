import { ComponentDoc } from '@pulwave/features-style-guide';
import { AvatarGroupBasic } from '../demos';

const AvatarGroupDoc: ComponentDoc = {
    name: 'AvatarGroup',
    description: 'Stack multiple avatars together with overlapping styling and overflow count indicator for team or user group displays.',
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
        'Displaying team members in a compact space',
        'Showing participants in a conversation or meeting',
        'Listing contributors or collaborators',
        'Indicating shared ownership or assignment',
        'Compact user presence indicators',
    ],

    whenNotToUse: [
        { text: 'Single user display', alternative: 'Avatar component' },
        { text: 'Detailed user list with names', alternative: 'DataList or List component' },
        { text: 'Selectable user grid', alternative: 'CardGrid with user cards' },
        { text: 'User search and selection', alternative: 'Combobox with user options' },
    ],

    overview: {
        description: 'AvatarGroup stacks Avatar components horizontally with overlapping borders, automatically showing a +N indicator when exceeding the limit.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Group avatars with a limit to show overflow count.',
                component: AvatarGroupBasic,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Avatar Stack', description: 'Overlapping avatar images' },
                { name: '2. Overflow Indicator', description: '+N badge showing hidden count' },
            ]
        },
        sizes: [
            { name: 'Extra Small (xs)', height: '24px', description: 'Inline mentions, dense lists' },
            { name: 'Small (s)', height: '32px', description: 'Table cells, compact cards' },
            { name: 'Medium (m)', height: '40px', description: 'Default for most contexts' },
            { name: 'Large (l)', height: '48px', description: 'Headers, prominent displays' },
            { name: 'Extra Large (xl)', height: '56px', description: 'Hero sections, profiles' },
        ],
        emphasis: 'Use consistent sizing within the group. The overflow indicator inherits the group size.',
        alignment: 'Avatars overlap from left to right. Overflow indicator appears at the end.',
    },

    content: {
        mainElements: 'Contains Avatar components and an optional overflow indicator. Each avatar should have meaningful alt text.',
        overflowContent: 'When limit is exceeded, remaining avatars collapse into a +N indicator. Consider tooltip to show hidden names.',
        internationalization: 'Overflow text (+N) is automatically formatted. RTL layouts reverse the stack direction.',
    },

    props: [
        {
            name: 'children',
            type: 'ReactNode',
            description: 'The Avatar components to render',
            required: true,
        },
        {
            name: 'limit',
            type: 'number',
            description: 'Maximum number of avatars to show before truncating with +N indicator',
        },
        {
            name: 'size',
            type: "'xs' | 's' | 'm' | 'l' | 'xl'",
            description: 'Size applied to all avatars in the group',
            defaultValue: "'m'",
        },
        {
            name: 'spacing',
            type: 'number',
            description: 'Overlap spacing between avatars in pixels (negative for overlap)',
            defaultValue: '-8',
        },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus through interactive avatars' },
        ],
        aria: [
            { attribute: 'role="group"', usage: 'Container groups the avatars semantically' },
            { attribute: 'aria-label', usage: 'Describes the group (e.g., "Team members, 5 total")' },
        ],
        screenReader: 'Announces group label, then each avatar name. Overflow announces "and N more".',
        focusIndicator: 'Individual avatars show focus ring when interactive',
    },

    relatedComponents: [
        { name: 'Avatar', description: 'Individual user avatar', path: 'components/data-display/avatar' },
        { name: 'Tooltip', description: 'Show names on hover', path: 'components/feedback/tooltip' },
        { name: 'Badge', description: 'Status indicators on avatars', path: 'components/data-display/badge' },
    ],
};

export default AvatarGroupDoc;
