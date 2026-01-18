/**
 * ColorDoc - Foundation documentation for Color system
 * 
 * Following enterprise design system pattern with:
 * - Introduction
 * - Color Anatomy / Layering Model
 * - Implementing Color
 * - Themes
 * - Tokens
 * - Do / Don't
 * - Accessibility
 */
import type { DocData } from '@pulwave/features-style-guide';

export const ColorDoc: DocData = {
    name: 'Color',
    description: 'The color system provides a consistent, accessible, and themeable palette for building cohesive user interfaces.',
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `Colors in Pulwave are organized into three tiers: **Core tokens**, **Semantic tokens**, and **Component tokens**. This layered approach ensures consistency, themability, and accessibility across light and dark modes.`
        },
        {
            id: 'architecture',
            name: 'Color Architecture',
            content: `### 1. Core Palette (Scales)
Color scales from 50-950 for primary, secondary, tertiary, and feedback colors. These are raw values used to generate semantic tokens.

### 2. Semantic Tokens
Purpose-based tokens like \`--color-surface-default\`, \`--color-on-surface-primary\`. These automatically adapt to theme.

### 3. Component Tokens
Component-specific tokens like \`--color-button-primary-bg\` that reference semantic tokens.`
        },
        {
            id: 'roles',
            name: 'Color Roles',
            content: `| Role | Description | Example |
|------|-------------|---------|
| **Primary** | Main brand color, primary actions | Primary buttons, links |
| **Secondary** | Supporting brand color | Secondary actions |
| **Tertiary** | Accent brand color | Accents, graphical elements |
| **Neutral** | Text, borders, backgrounds | Body text, cards |
| **Success** | Positive feedback | Success toasts |
| **Warning** | Cautionary feedback | Warning alerts |
| **Error** | Negative feedback | Error messages |
| **Info** | Informational feedback | Help text |`
        },
        {
            id: 'colorScales',
            name: 'Core Palette',
            content: 'The core palette consists of the raw color values used to generate the design system. These should rarely be used directly; prefer semantic tokens.'
        },
        {
            id: 'semanticColors',
            name: 'Semantic Tokens',
            content: 'Semantic tokens map color values to specific UI purposes, ensuring consistency and supporting theming (light/dark mode).'
        },
        {
            id: 'implementation',
            name: 'Implementing Color',
            content: `Always use semantic tokens, never hardcoded hex values:

\`\`\`scss
// ✅ Correct - uses semantic token
.card {
    background: var(--color-surface-default);
    color: var(--color-on-surface-default);
    border: 1px solid var(--color-border-subtle);
}

// ❌ Incorrect - hardcoded value
.card {
    background: #ffffff;
    color: #333333;
    border: 1px solid #e0e0e0;
}
\`\`\``
        }
    ]
};

export default ColorDoc;
