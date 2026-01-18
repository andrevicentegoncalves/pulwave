/**
 * ElevationDoc - Foundation documentation for Elevation/Shadow system
 * 
 * Following IBM Carbon pattern with elevation levels and usage.
 */
const ElevationDoc = {
    name: 'Elevation',
    description: 'The Pulwave elevation system uses shadows and layering to create visual hierarchy and depth.',

    sections: [
        {
            id: 'introduction',
            name: 'Introduction',
            content: `Elevation in Pulwave creates visual depth using **box shadows** and **z-index layering**. Higher elevation indicates more importance or interactivity.

**Key Principles**
- Higher elevation = more prominence
- Use consistent elevation within component types
- Shadows adapt to light/dark themes`
        },
        {
            id: 'elevation-scale',
            name: 'Elevation Scale',
            content: `| Level | Token | Usage |
| --- | --- | --- |
| 0 | \`--shadow-none\` | Flat elements, disabled states |
| 1 | \`--shadow-xs\` | Subtle lift: cards, inputs |
| 2 | \`--shadow-s\` | Raised: active cards, buttons |
| 3 | \`--shadow-m\` | Floating: dropdowns, popovers |
| 4 | \`--shadow-l\` | Modals, dialogs |
| 5 | \`--shadow-xl\` | Maximum: navigation overlays |`
        },
        {
            id: 'implementing-elevation',
            name: 'Implementing Elevation',
            content: `Use shadow tokens in CSS:

\`\`\`scss
// ✅ Correct - uses shadow tokens
.card {
    box-shadow: var(--shadow-xs);
    
    &:hover {
        box-shadow: var(--shadow-s);
    }
}

.modal {
    box-shadow: var(--shadow-l);
}

// ❌ Incorrect - hardcoded values
.card {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
\`\`\``
        },
        {
            id: 'z-index',
            name: 'Z-Index Scale',
            content: `Z-index tokens ensure consistent stacking order:

| Token | Value | Usage |
| --- | --- | --- |
| \`--z-index-base\` | 0 | Default content |
| \`--z-index-dropdown\` | 100 | Dropdowns, popovers |
| \`--z-index-sticky\` | 200 | Sticky headers |
| \`--z-index-overlay\` | 300 | Overlay backgrounds |
| \`--z-index-modal\` | 400 | Modal dialogs |
| \`--z-index-toast\` | 500 | Toast notifications |
| \`--z-index-tooltip\` | 600 | Tooltips (highest) |`
        },
        {
            id: 'theme-adaptation',
            name: 'Theme Adaptation',
            content: `Shadows automatically adapt to themes:

**Light Theme**
- Subtle gray shadows
- Lower opacity
- Natural lighting feel

**Dark Theme**
- Deeper, darker shadows
- Higher contrast
- Ambient occlusion effect

Shadow tokens include RGB values that adjust per theme.`
        },
        {
            id: 'accessibility',
            name: 'Accessibility',
            content: `**Focus Visibility**
Elevated elements may use shadows for focus indication:
- \`--shadow-focus\` provides accessible focus ring
- Combine with border for color-blind users

**Motion Sensitivity**
Elevation transitions should be subtle:
- Duration: 100-200ms maximum
- Avoid dramatic elevation changes that cause motion sickness`
        }
    ]
};

export default ElevationDoc;
