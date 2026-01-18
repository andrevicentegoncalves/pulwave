/**
 * BreakpointsDoc - Foundation documentation for Breakpoints
 */
import type { DocData } from '@pulwave/features-style-guide';

export const BreakpointsDoc: DocData = {
    name: 'Breakpoints',
    description: 'Breakpoint tokens define the thresholds at which layouts adapt to different screen sizes. Use these with responsive utilities and mixins.',
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `Breakpoints enable responsive design by establishing consistent thresholds for layout changes. They ensure experiences work across mobile, tablet, and desktop.`
        },
        {
            id: 'scale',
            name: 'Breakpoint Scale',
            content: `| Token | Value | Target |
|-------|-------|--------|
| \`xs\` | 0 | Mobile portrait (base) |
| \`sm\` | 576px | Mobile landscape |
| \`md\` | 768px | Tablets |
| \`lg\` | 992px | Small desktops / laptops |
| \`xl\` | 1200px | Standard desktops |
| \`xxl\` | 1400px | Large screens |`
        },
        {
            id: 'usage',
            name: 'SCSS Usage',
            content: `Use the provided mixins instead of raw media queries:

\`\`\`scss
// Mobile-first (min-width)
@include bp-up(md) {
    // Styles for tablet and up
}

// Desktop-first (max-width)
@include bp-down(md) {
    // Styles for below tablet
}

// Specific range
@include bp-between(sm, lg) {
    // Styles for sm to lg
}
\`\`\``
        },
        {
            id: 'dodont',
            name: 'Do / Don\'t',
            content: `### Do
- Design mobile-first, add complexity at larger breakpoints
- Use semantic mixins (\`bp-up\`, \`bp-down\`)
- Test at each breakpoint threshold

### Don't
- Hardcode pixel values in media queries
- Create custom breakpoints
- Assume only 3 sizes (mobile/tablet/desktop)`
        }
    ]
};

export default BreakpointsDoc;
