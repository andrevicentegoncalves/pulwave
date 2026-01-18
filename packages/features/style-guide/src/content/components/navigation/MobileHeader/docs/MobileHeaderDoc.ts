/**
 * MobileHeaderDoc - Documentation for MobileHeader navigation component
 * 
 * Mobile-only header with menu toggle and user actions.
 * 
 * @version 1.0.0
 */
import * as MobileHeaderDemos from '../demos';

const MobileHeaderDoc = {
    name: 'MobileHeader',
    description: 'Fixed mobile header with navigation toggle, user avatar, and logout action. Only visible on mobile breakpoints (≤ 767px).',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-01',

    // Accessibility Testing Status
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    // When to Use
    whenToUse: [
        'Mobile-first applications requiring persistent navigation access',
        'Apps with sidebar navigation that needs a mobile toggle',
        'Responsive layouts transitioning from desktop sidebar to mobile drawer',
    ],

    whenNotToUse: [
        { text: 'Desktop-only applications', alternative: 'Standard header or AppBar' },
        { text: 'Simple landing pages', alternative: 'Minimal header' },
    ],

    // Overview
    overview: {
        description: 'MobileHeader provides a fixed-position header for mobile devices with a menu toggle (typically BurgerMenu), user avatar with profile link, and logout button. It follows the mobile navigation pattern of having key actions always accessible.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Mobile header with menu toggle and user actions.',
                component: MobileHeaderDemos.MobileHeaderBasicDemo,
            },
            {
                name: 'Minimal',
                description: 'Header with only the menu toggle.',
                component: MobileHeaderDemos.MobileHeaderMinimalDemo,
            }
        ]
    },

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: 'Header Container', description: 'Fixed position container spanning full width' },
                { name: 'Left Section', description: 'Menu toggle button area' },
                { name: 'Right Section', description: 'User avatar and logout actions' },
                { name: 'Avatar', description: 'Clickable user profile image' },
                { name: 'Logout Button', description: 'Power icon button for signing out' },
            ]
        },
    },

    // Props
    props: [
        { name: 'toggleSidebar', type: '() => void', required: true, description: 'Handler to toggle the navigation sidebar' },
        { name: 'avatarUrl', type: 'string', description: 'URL for user avatar image' },
        { name: 'onProfileClick', type: '() => void', description: 'Handler for avatar click (navigate to profile)' },
        { name: 'onLogout', type: '() => void', description: 'Handler for logout button click' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ],

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between interactive elements' },
            { key: 'Enter / Space', action: 'Activate buttons or avatar' },
        ],
        aria: [
            { attribute: 'aria-label="Toggle navigation menu"', usage: 'Menu button' },
            { attribute: 'aria-label="Logout"', usage: 'Logout button' },
            { attribute: 'role="button"', usage: 'Avatar image' },
        ],
    },

    // Responsive Behavior
    responsiveBehavior: [
        { breakpoint: 'Mobile (≤ 767px)', behavior: 'Visible, fixed at top' },
        { breakpoint: 'Tablet & Desktop (> 767px)', behavior: 'Hidden, sidebar takes over navigation' },
    ],

    // In Use (Do/Don't)
    inUse: {
        dos: [
            'Use with responsive sidebar that slides in on mobile',
            'Provide logout and profile actions for quick access',
            'Keep the header minimal to maximize content space',
        ],
        donts: [
            'Don\'t show on desktop - use CSS media queries to hide',
            'Don\'t add too many actions - keep it focused on navigation',
        ],
        examples: [
            {
                name: 'Basic Usage',
                description: 'Mobile header with sidebar toggle and user actions',
                code: `<MobileHeader
  toggleSidebar={() => setSidebarOpen(!open)}
  avatarUrl={user.avatar}
  onProfileClick={() => navigate('/profile')}
  onLogout={handleLogout}
/>`
            },
        ]
    },

    // Related Components
    relatedComponents: [
        { name: 'BurgerMenu', description: 'Menu toggle icon used internally' },
        { name: 'NestedSidebar', description: 'Sidebar controlled by MobileHeader' },
        { name: 'Avatar', description: 'User avatar display' },
    ],
};

export default MobileHeaderDoc;
