/**
 * SpacingDoc - Foundation documentation for Spacing system
 */
import type { DocData } from '@pulwave/features-style-guide';

export const SpacingDoc: DocData = {
    name: 'Spacing',
    description: 'The Pulwave spacing system uses a consistent 4px base scale for margins, paddings, and gaps throughout the interface.',
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `Spacing in Pulwave follows an **8-point grid** with a 4px base unit. All spacing values are multiples of 4px, creating visual rhythm and consistency.`
        },
        {
            id: 'scale',
            name: 'Spacing Scale',
            content: `| Token | Value | Rem | Usage |
|-------|-------|-----|-------|
| \`--spacing-1\` | 4px | 0.25rem | Tight: icon gaps |
| \`--spacing-2\` | 8px | 0.5rem | Compact: small padding |
| \`--spacing-3\` | 12px | 0.75rem | Default: input padding |
| \`--spacing-4\` | 16px | 1rem | Regular: card padding |
| \`--spacing-5\` | 20px | 1.25rem | Medium: section padding |
| \`--spacing-6\` | 24px | 1.5rem | Large: card margins |
| \`--spacing-8\` | 32px | 2rem | Section: major breaks |
| \`--spacing-10\` | 40px | 2.5rem | Page: top-level margins |
| \`--spacing-12\` | 48px | 3rem | Extra-large: hero |
| \`--spacing-16\` | 64px | 4rem | Major sections |`
        },
        {
            id: 'implementation',
            name: 'Implementing Spacing',
            content: `\`\`\`scss
// ✅ Use spacing tokens
.card {
    padding: var(--spacing-4);
    margin-bottom: var(--spacing-6);
    gap: var(--spacing-3);
}

// ❌ Don't hardcode values
.card {
    padding: 16px;
    margin-bottom: 24px;
}
\`\`\``
        },
        {
            id: 'aliases',
            name: 'Semantic Aliases',
            content: `| Alias | Token | Usage |
|-------|-------|-------|
| \`--spacing-micro\` | spacing-1 | Fine adjustments |
| \`--spacing-tight\` | spacing-2 | Related elements |
| \`--spacing-base\` | spacing-4 | Standard padding |
| \`--spacing-section\` | spacing-10 | Section padding |`
        },
        {
            id: 'guidelines',
            name: 'Layout Guidelines',
            content: `- **Component internal**: \`spacing-2\` to \`spacing-4\`
- **Card padding**: \`spacing-4\` to \`spacing-6\`
- **Between cards**: \`spacing-4\`
- **Section gaps**: \`spacing-8\` to \`spacing-12\``
        }
    ]
};

export default SpacingDoc;
