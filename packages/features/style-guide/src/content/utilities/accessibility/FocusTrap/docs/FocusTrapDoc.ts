/**
 * FocusTrapDoc - Documentation for FocusTrap accessibility utility
 * 
 * FocusTrap is essential for modal/dialog accessibility, trapping keyboard focus within a container.
 * 
 * @version 1.0.0
 */
import * as FocusTrapDemos from '../demos';

const FocusTrapDoc = {
    name: 'FocusTrap',
    description: 'Accessibility utility that traps keyboard focus within a container. Essential for modals, dialogs, and overlay components to meet WCAG requirements.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-01',

    // Accessibility Testing Status
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'n/a' as const,
        screenReader: 'pass' as const,
    },

    // When to Use
    whenToUse: [
        'Modal dialogs and overlays',
        'Dropdown menus that should trap focus',
        'Multi-step wizards in modal context',
        'Any container that temporarily takes over the UI',
    ],

    whenNotToUse: [
        { text: 'Inline content', alternative: 'No focus trapping needed' },
        { text: 'Toast notifications', alternative: 'Use aria-live regions instead' },
        { text: 'Tooltips', alternative: 'Focus should remain on trigger' },
    ],

    // Overview
    overview: {
        description: 'FocusTrap wraps content and prevents keyboard focus from leaving the container. When Tab reaches the last focusable element, it cycles back to the first. Shift+Tab cycles in reverse. Essential for WCAG 2.4.3 Focus Order compliance.',
        variants: [],
        demos: [
            {
                name: 'Basic Focus Trap',
                description: 'Tab cycles through elements within the trap. Press Escape to deactivate.',
                component: FocusTrapDemos.FocusTrapBasicDemo,
            },
            {
                name: 'Modal-like Behavior',
                description: 'Focus trap with overlay behavior and return focus on close.',
                component: FocusTrapDemos.FocusTrapModalDemo,
            }
        ]
    },

    // Props
    props: [
        { name: 'active', type: 'boolean', default: 'true', description: 'Whether focus trapping is active' },
        { name: 'initialFocus', type: 'string | HTMLElement', description: 'Element or selector to focus when trap activates' },
        { name: 'returnFocus', type: 'boolean | string | HTMLElement', default: 'true', description: 'Where to return focus when trap deactivates' },
        { name: 'allowOutsideClick', type: 'boolean | (event) => boolean', default: 'false', description: 'Allow clicks outside the trap' },
        { name: 'onEscape', type: '() => void', description: 'Callback when Escape key is pressed' },
        { name: 'onActivate', type: '() => void', description: 'Callback when trap activates' },
        { name: 'onDeactivate', type: '() => void', description: 'Callback when trap deactivates' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Content to trap focus within' },
    ],

    // Key Features
    keyFeatures: [
        'Tabs cycle through focusable elements within container',
        'Escape key handling with callback',
        'Initial focus control',
        'Return focus to previous element on deactivation',
        'Configurable outside click behavior',
    ],

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move to next focusable element (cycles at end)' },
            { key: 'Shift + Tab', action: 'Move to previous focusable element (cycles at start)' },
            { key: 'Escape', action: 'Trigger onEscape callback (typically closes modal)' },
        ],
        aria: [
            { attribute: 'role="dialog"', usage: 'Apply to modal container (not FocusTrap itself)' },
            { attribute: 'aria-modal="true"', usage: 'Apply to modal container' },
            { attribute: 'aria-labelledby', usage: 'Link to modal title' },
        ],
        wcagCompliance: [
            '2.4.3 Focus Order - Focus trapping ensures logical order',
            '2.1.2 No Keyboard Trap - Escape key provides exit mechanism',
        ],
    },

    // In Use (Do/Don't)
    inUse: {
        dos: [
            'Always provide an escape mechanism (onEscape handler)',
            'Use initialFocus to direct attention to important elements',
            'Enable returnFocus to restore context after modal closes',
            'Use with Modal, Dialog, and Overlay components',
        ],
        donts: [
            'Don\'t trap focus without an escape mechanism',
            'Don\'t use for inline content that doesn\'t overlay the page',
            'Don\'t forget to add aria-modal to the modal container',
        ],
        examples: [
            {
                name: 'Basic Modal Usage',
                description: 'Wrap modal content in FocusTrap',
                code: `<FocusTrap active={isOpen} onEscape={closeModal}>
  <div role="dialog" aria-modal="true">
    <h2>Modal Title</h2>
    <p>Modal content...</p>
    <Button onClick={closeModal}>Close</Button>
  </div>
</FocusTrap>`
            },
        ]
    },

    // Related Components
    relatedComponents: [
        { name: 'Modal', description: 'Uses FocusTrap internally' },
        { name: 'Confirmation Modal', description: 'Uses FocusTrap internally' },
        { name: 'VisuallyHidden', description: 'Often used together for accessible labels' },
    ],
};

export default FocusTrapDoc;
