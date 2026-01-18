/**
 * TypographyDoc - Foundation documentation for Typography system
 */
import type { DocData } from '@pulwave/features-style-guide';

export const TypographyDoc: DocData = {
    name: 'Typography',
    description: 'The Pulwave typography system provides consistent, responsive, and accessible text styles across all interfaces.',
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `Typography in Pulwave uses a **category-based scale** system. Each category (title, body, caption, label) has size variants that respond to viewport width.`
        },
        {
            id: 'font-families',
            name: 'Font Families',
            content: `- **Sans-serif**: Inter for UI text
- **Monospace**: JetBrains Mono for code`
        },
        {
            id: 'scale',
            name: 'Type Scale',
            content: `### Title Category
| Size | Desktop | Mobile | Usage |
|------|---------|--------|-------|
| 3xl | 48px | 36px | Hero headings |
| 2xl | 36px | 28px | Page titles |
| xl | 28px | 24px | Section headings |
| l | 24px | 20px | Card titles |
| m | 20px | 18px | Subsections |
| s | 18px | 16px | Small headings |

### Body Category
| Size | Desktop | Mobile | Usage |
|------|---------|--------|-------|
| l | 18px | 16px | Lead paragraphs |
| m | 16px | 14px | Body text |
| s | 14px | 13px | Secondary text |

### Caption Category
| Size | Desktop | Mobile | Usage |
|------|---------|--------|-------|
| m | 13px | 12px | Captions |
| s | 12px | 11px | Fine print |`
        },
        {
            id: 'implementation',
            name: 'Implementing Typography',
            content: `\`\`\`scss
// ✅ Use typography mixin
.heading {
    @include typography-responsive(title, l);
}

// ❌ Don't hardcode values
.heading {
    font-size: 24px;
    line-height: 1.2;
}
\`\`\``
        },
        {
            id: 'weights',
            name: 'Font Weights',
            content: `- **Regular (400)**: Body text
- **Medium (500)**: Labels, buttons
- **SemiBold (600)**: Headings, emphasis`
        }
    ]
};

export default TypographyDoc;
