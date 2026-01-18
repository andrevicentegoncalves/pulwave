/**
 * BordersDoc - Foundation documentation for Borders system
 */
import type { DocData } from '@pulwave/features-style-guide';

export const BordersDoc: DocData = {
    name: 'Borders & Shape',
    description: 'Border tokens define the visual boundaries of elements. Shape tokens (border-radius) establish the curvature of corners.',
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `Borders and shapes create visual hierarchy, delineate interactive regions, and establish brand identity through consistent corner treatments.`
        },
        {
            id: 'width',
            name: 'Border Width Scale',
            content: `| Token | Value | Use Case |
|-------|-------|----------|
| \`--border-width-none\` | 0 | No border |
| \`--border-width-thin\` | 1px | Subtle dividers, input borders |
| \`--border-width-medium\` | 2px | Focused states, emphasis |
| \`--border-width-thick\` | 3px | Strong emphasis, active tabs |`
        },
        {
            id: 'radius',
            name: 'Border Radius Scale',
            content: `| Token | Value | Use Case |
|-------|-------|----------|
| \`--border-radius-none\` | 0 | Sharp corners (tables, data grids) |
| \`--border-radius-xs\` | 2px | Subtle rounding (badges, chips) |
| \`--border-radius-s\` | 4px | Small elements (inputs, small buttons) |
| \`--border-radius-m\` | 8px | Cards, modals, medium surfaces |
| \`--border-radius-l\` | 12px | Large cards, panels |
| \`--border-radius-xl\` | 16px | Hero sections, prominent surfaces |
| \`--border-radius-round\` | 9999px | Pills, circular avatars, FABs |`
        },
        {
            id: 'color',
            name: 'Border Color',
            content: `Use semantic color tokens for borders:
- \`--color-border-default\` — Standard borders
- \`--color-border-subtle\` — De-emphasized borders
- \`--color-border-strong\` — High-emphasis borders
- \`--color-border-interactive\` — Focusable elements`
        },
        {
            id: 'dodont',
            name: 'Do / Don\'t',
            content: `### Do
- Use \`--border-radius-m\` for most interactive surfaces
- Match border-radius to the element's importance
- Use \`--border-radius-round\` only for pills and avatars

### Don't
- Mix multiple radius sizes on adjacent elements
- Use arbitrary pixel values
- Apply excessive rounding to rectangular content`
        }
    ]
};

export default BordersDoc;
