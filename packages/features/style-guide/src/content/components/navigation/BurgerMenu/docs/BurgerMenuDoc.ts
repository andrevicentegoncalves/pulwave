/**
 * BurgerMenuDoc - Documentation for BurgerMenu navigation component
 * 
 * Animated hamburger menu button for mobile navigation.
 * 
 * @version 1.0.0
 */
import * as BurgerMenuDemos from '../demos';

const BurgerMenuDoc = {
    name: 'BurgerMenu',
    description: 'Animated hamburger menu toggle button for mobile navigation. Transforms into an X when active.',
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
        'Mobile navigation toggle in headers',
        'Sidebar toggle for responsive layouts',
        'Compact navigation trigger for mobile-first designs',
    ],

    whenNotToUse: [
        { text: 'Desktop navigation', alternative: 'Standard navigation menu' },
        { text: 'Non-navigation toggles', alternative: 'Button or Switch components' },
    ],

    // Overview
    overview: {
        description: 'BurgerMenu provides a classic three-line hamburger icon that animates to an X when the menu is open. It handles proper ARIA attributes for accessibility and is designed to work with MobileHeader and sidebar components.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Click to toggle between hamburger and X states.',
                component: BurgerMenuDemos.BurgerMenuBasicDemo,
            },
            {
                name: 'States Comparison',
                description: 'Side-by-side comparison of closed and open states.',
                component: BurgerMenuDemos.BurgerMenuStatesDemo,
            }
        ]
    },

    // Props
    props: [
        { name: 'isOpen', type: 'boolean', required: true, description: 'Whether the menu is currently open' },
        { name: 'onClick', type: '() => void', required: true, description: 'Click handler to toggle menu state' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ],

    // Animation
    animation: {
        description: 'The three lines animate smoothly when transitioning between states',
        states: [
            { name: 'Closed', visual: '☰ Three horizontal lines' },
            { name: 'Open', visual: '✕ X shape formed by rotated lines' },
        ]
    },

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Enter / Space', action: 'Toggle menu state' },
            { key: 'Tab', action: 'Move focus to/from button' },
        ],
        aria: [
            { attribute: 'aria-label', usage: 'Dynamic: "Open menu" or "Close menu"' },
            { attribute: 'aria-expanded', usage: 'Reflects isOpen state' },
            { attribute: 'type="button"', usage: 'Prevents form submission' },
        ],
    },

    // In Use (Do/Don't)
    inUse: {
        dos: [
            'Place in mobile header for consistent navigation pattern',
            'Pair with MobileHeader or responsive sidebar',
            'Use consistent placement (usually top-left)',
        ],
        donts: [
            'Don\'t use on desktop without hiding at larger breakpoints',
            'Don\'t use multiple burger menus on the same page',
            'Don\'t forget to connect to actual navigation state',
        ],
        examples: [
            {
                name: 'Basic Usage',
                description: 'Toggle sidebar with hamburger menu',
                code: `const [isOpen, setIsOpen] = useState(false);
<BurgerMenu isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />`
            },
        ]
    },

    // Related Components
    relatedComponents: [
        { name: 'MobileHeader', description: 'Often contains BurgerMenu' },
        { name: 'NestedSidebar', description: 'Toggled by BurgerMenu' },
        { name: 'SidebarToggle', description: 'Desktop alternative' },
    ],
};

export default BurgerMenuDoc;
