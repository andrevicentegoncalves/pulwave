/**
 * Getting Started - For Designers Documentation
 */
import type { FoundationDoc } from '@pulwave/features-style-guide';

export const ForDesignersDoc: FoundationDoc = {
    name: 'For Designers',
    description: 'A guide for designers working with the Pulwave Design System.',
    sections: [
        {
            id: 'design-tokens',
            title: 'Working with Design Tokens',
            content: `
Design tokens are the foundation of our design system. They ensure consistency across all platforms and make it easy to maintain and update the visual language.

**Key Token Categories:**
- **Colors** - Semantic color palette with light/dark mode support
- **Typography** - Font sizes, weights, line heights, and families
- **Spacing** - Consistent spacing scale (4px base unit)
- **Elevation** - Shadow and depth tokens
- **Border Radius** - Rounded corner values
- **Motion** - Animation durations and easing functions

**Using Tokens in Figma:**
- Variables are synced from code to Figma
- Use semantic tokens (e.g., \`color-text-primary\`) instead of primitives
- Check the Foundation section for complete token reference
            `.trim(),
        },
        {
            id: 'component-library',
            title: 'Component Library',
            content: `
Our component library is organized by function and complexity:

**Atomic Components** (Basic building blocks)
- Buttons, Inputs, Text, Icons, Badges

**Composite Components** (Assembled from atoms)
- Cards, Modals, Forms, Data Tables

**Pattern Components** (Complex compositions)
- Navigation, Layouts, Dashboards

**Best Practices:**
- Start with existing components before designing custom ones
- Use component variants for different states and sizes
- Maintain consistent spacing using the spacing scale
- Follow accessibility guidelines for color contrast and touch targets
            `.trim(),
        },
        {
            id: 'design-workflow',
            title: 'Design Workflow',
            content: `
**Recommended Workflow:**

1. **Research & Planning**
   - Review existing components and patterns
   - Check if similar solutions exist in the system
   - Document user requirements and edge cases

2. **Design Phase**
   - Use design tokens for all values
   - Create responsive layouts (mobile, tablet, desktop)
   - Consider dark mode from the start
   - Include all interactive states (hover, focus, disabled, error)

3. **Accessibility Review**
   - Verify color contrast (WCAG 2.1 AA minimum)
   - Add proper labels and ARIA attributes
   - Test keyboard navigation flow
   - Ensure touch targets are at least 44x44px

4. **Handoff**
   - Annotate spacing and token usage
   - Document component variants and props
   - Include interaction and animation specs
   - Share edge cases and error states
            `.trim(),
        },
        {
            id: 'resources',
            title: 'Resources',
            content: `
**Figma Libraries**
- Main Design System Library
- Icon Library
- Illustration Library

**Documentation**
- Style Guide (this site)
- Component API Reference
- Accessibility Guidelines
- Motion & Animation Principles

**Tools**
- Figma to Code plugins
- Design token sync
- Accessibility checker
            `.trim(),
        },
    ],
    dos: [
        'Use design tokens for all design decisions',
        'Design for dark mode alongside light mode',
        'Create mobile-first, responsive layouts',
        'Test designs with real content',
        'Consider accessibility from the start',
    ],
    donts: [
        'Create custom components without checking existing ones first',
        'Use hardcoded values instead of tokens',
        'Design only for desktop',
        'Ignore edge cases and error states',
        'Skip accessibility checks',
    ],
};
