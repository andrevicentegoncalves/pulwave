/**
 * ElevationDoc - Foundation documentation for Elevation/Shadow system
 */
import type { DocData } from '@pulwave/features-style-guide';

export const ElevationDoc: DocData = {
    name: 'Elevation',
    description: 'The Pulwave elevation system uses shadows and layering to create visual hierarchy and depth.',
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `Elevation creates visual depth using **box shadows**. Higher elevation indicates more importance or interactivity.`
        },
        {
            id: 'scale',
            name: 'Elevation Scale',
            content: `| Level | Token | Usage |
|-------|-------|-------|
| 0 | \`--shadow-none\` | Flat elements, disabled |
| 1 | \`--shadow-xs\` | Subtle: cards, inputs |
| 2 | \`--shadow-s\` | Raised: active cards |
| 3 | \`--shadow-m\` | Floating: dropdowns |
| 4 | \`--shadow-l\` | Modals, dialogs |
| 5 | \`--shadow-xl\` | Navigation overlays |`
        },
        {
            id: 'semantic',
            name: 'Semantic Shadows',
            content: `| Token | Usage |
|-------|-------|
| \`--shadow-card\` | Default card state |
| \`--shadow-card-hover\` | Hovered card |
| \`--shadow-popover\` | Popovers, dropdowns |
| \`--shadow-modal\` | Modals, dialogs |
| \`--shadow-drawer\` | Slide-out drawers |
| \`--shadow-sticky\` | Sticky headers |`
        },
        {
            id: 'inset',
            name: 'Inset Shadows',
            content: `| Token | Usage |
|-------|-------|
| \`--shadow-inset-xs\` | Subtle inner depth |
| \`--shadow-inset-s\` | Medium inner depth |
| \`--shadow-input-default\` | Input fields |
| \`--shadow-input-focus\` | Focused inputs |`
        },
        {
            id: 'implementation',
            name: 'Implementing Elevation',
            content: `\`\`\`scss
// ✅ Use shadow tokens
.card {
    box-shadow: var(--shadow-xs);
    
    &:hover {
        box-shadow: var(--shadow-s);
    }
}

// ❌ Don't hardcode shadows
.card {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
\`\`\``
        }
    ]
};

export default ElevationDoc;
