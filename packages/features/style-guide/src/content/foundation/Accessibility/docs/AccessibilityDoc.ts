/**
 * AccessibilityDoc - Foundation documentation for Accessibility
 */
import type { DocData } from '@pulwave/features-style-guide';

export const AccessibilityDoc: DocData = {
    name: 'Accessibility',
    description: 'Accessibility foundations ensure all users can perceive, understand, navigate, and interact with the design system. WCAG 2.1 AA is the baseline.',
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `Accessibility is not optional. These foundations ensure Pulwave products work for everyone, including users with visual, motor, cognitive, and auditory disabilities.`
        },
        {
            id: 'focus',
            name: 'Focus Management',
            content: `### Focus Ring Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| \`--focus-ring-width\` | 2px | Standard focus indicator |
| \`--focus-ring-offset\` | 2px | Space between element and ring |
| \`--focus-ring-color\` | var(--color-focus) | High-contrast focus color |

### Focus Ring Usage

\`\`\`scss
@include focus-ring(); // Applies standard focus styles
\`\`\`

All interactive elements must have visible focus indicators. Never use \`outline: none\` without replacement.`
        },
        {
            id: 'contrast',
            name: 'Color Contrast',
            content: `| Requirement | Ratio | Elements |
|-------------|-------|----------|
| Text (body) | 4.5:1 | All readable text |
| Large text | 3:1 | ≥18px or ≥14px bold |
| UI components | 3:1 | Icons, borders, form controls |
| Focus indicators | 3:1 | Focus rings |`
        },
        {
            id: 'targets',
            name: 'Touch Targets',
            content: `| Target | Minimum Size | Optimal Size |
|--------|--------------|--------------|
| Buttons | 44×44px | 48×48px |
| Links | 44×44px | — |
| Form inputs | 44px height | 48px height |`
        },
        {
            id: 'keyboard',
            name: 'Keyboard Navigation',
            content: `All interactive elements must be:
- Reachable via Tab key
- Activable via Enter or Space
- Escapable via Escape (for overlays)

### Focus Trapping

Modals and overlays must trap focus:
- Tab cycles within the overlay
- Escape closes the overlay
- Focus returns to trigger on close`
        },
        {
            id: 'screen-readers',
            name: 'Screen Readers',
            content: `### Required ARIA

- \`aria-label\` — Icon-only buttons
- \`aria-expanded\` — Expandable elements
- \`aria-hidden="true"\` — Decorative icons
- \`role="alert"\` — Dynamic notifications`
        },
        {
            id: 'dodont',
            name: 'Do / Don\'t',
            content: `### Do
- Test with keyboard only
- Use semantic HTML elements
- Provide text alternatives for images
- Ensure 4.5:1 contrast for text

### Don't
- Remove focus indicators
- Use color as the only indicator
- Auto-play audio/video
- Create keyboard traps`
        }
    ]
};

export default AccessibilityDoc;
