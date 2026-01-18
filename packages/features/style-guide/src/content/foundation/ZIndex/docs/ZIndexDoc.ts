/**
 * ZIndexDoc - Foundation documentation for Z-Index
 */
import type { DocData } from '@pulwave/features-style-guide';

export const ZIndexDoc: DocData = {
    name: 'Z-Index & Layers',
    description: 'Z-index tokens establish a predictable stacking order for layered UI elements. This prevents z-index wars and ensures consistent overlay behavior.',
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `Z-index tokens create a layering system that ensures:
- Tooltips appear above content
- Modals appear above tooltips
- Overlays don't fight for dominance`
        },
        {
            id: 'scale',
            name: 'Z-Index Scale',
            content: `| Token | Value | Use Case |
|-------|-------|----------|
| \`--z-index-base\` | 0 | Default stacking |
| \`--z-index-dropdown\` | 100 | Dropdowns, menus |
| \`--z-index-sticky\` | 200 | Sticky headers, sidebars |
| \`--z-index-fixed\` | 300 | Fixed position elements |
| \`--z-index-drawer\` | 400 | Side drawers |
| \`--z-index-modal-backdrop\` | 500 | Modal backdrops |
| \`--z-index-modal\` | 600 | Modal dialogs |
| \`--z-index-popover\` | 700 | Popovers, tooltips |
| \`--z-index-tooltip\` | 800 | Tooltips |
| \`--z-index-toast\` | 900 | Toast notifications |
| \`--z-index-max\` | 9999 | Emergency override (use sparingly) |`
        },
        {
            id: 'rules',
            name: 'Layering Rules',
            content: `1. **Never use arbitrary z-index values** — Use tokens only
2. **Higher values = closer to user** — Toasts above modals above content
3. **Context matters** — A tooltip inside a modal uses the same token`
        },
        {
            id: 'dodont',
            name: 'Do / Don\'t',
            content: `### Do
- Use semantic tokens (\`--z-index-modal\`, not \`z-index: 500\`)
- Test layered interactions (modal + tooltip + dropdown)
- Keep overlays in a portal to avoid stacking context issues

### Don't
- Create new z-index values
- Use \`z-index: 99999\` to "fix" layering
- Nest positioned elements without considering stacking context`
        }
    ]
};

export default ZIndexDoc;
