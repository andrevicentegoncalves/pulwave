/**
 * Getting Started - Introduction Documentation
 */
import type { FoundationDoc } from '@pulwave/features-style-guide';

// Re-export sub-docs
export { ForDesignersDoc } from './ForDesignersDoc';
export { ForDevelopersDoc } from './ForDevelopersDoc';
export { IAAuditDoc } from './IAAuditDoc';

export const OverviewDoc: FoundationDoc = {
    name: 'Overview',
    description: 'Welcome to the Pulwave Design System. This guide will help you get started with our component library.',
    sections: [
        {
            id: 'introduction',
            title: 'Introduction',
            content: `
The Pulwave Design System provides a comprehensive set of reusable components, patterns, and design tokens to build consistent, accessible, and beautiful user interfaces.

**Key Features:**
- **Foundation tokens** - Colors, typography, spacing, and more
- **Component library** - 50+ production-ready components
- **Patterns** - Pre-built solutions for common UI challenges
- **Accessibility** - WCAG 2.1 AA compliant by default
- **Dark mode** - Built-in theming support
            `.trim(),
        },
        {
            id: 'quick-start',
            title: 'Quick Start',
            content: `
To get started with the Pulwave Design System:

1. **Install the packages**
\`\`\`bash
npm install @pulwave/ui @pulwave/foundation
\`\`\`

2. **Import the styles**
\`\`\`tsx
import '@pulwave/foundation/styles/tokens/generated/tokens.css';
import '@pulwave/foundation/styles/scss/_index.scss';
\`\`\`

3. **Use the components**
\`\`\`tsx
import { Button, Text, Card } from '@pulwave/ui';

function App() {
    return (
        <Card>
            <Text as="h1" category="title" size="xl">Hello World</Text>
            <Button variant="primary">Get Started</Button>
        </Card>
    );
}
\`\`\`
            `.trim(),
        },
        {
            id: 'packages',
            title: 'Package Structure',
            content: `
The design system is organized into several packages:

| Package | Description |
|---------|-------------|
| @pulwave/foundation | Design tokens, CSS variables, SCSS utilities |
| @pulwave/ui | Core UI components (Button, Input, Card, etc.) |
| @pulwave/patterns | Composed patterns (Forms, Layouts, etc.) |
| @pulwave/features-layout | Navigation components (Sidebar, Menu) |
| @pulwave/pages-shell | App shells and layouts (deprecated, use @pulwave/pages-shell) |
| @pulwave/pages-shell | Unified App Shell & Layouts |
            `.trim(),
        },
    ],
    dos: [
        'Use design tokens instead of hardcoded values',
        'Follow the component API documentation',
        'Test with keyboard navigation',
        'Verify color contrast ratios',
    ],
    donts: [
        'Override component styles with !important',
        'Use inline styles for theming',
        'Ignore accessibility warnings',
        'Skip responsive testing',
    ],
};

export const PrinciplesDoc: FoundationDoc = {
    name: 'Design Principles',
    description: 'The core principles that guide the Pulwave Design System.',
    sections: [
        {
            id: 'consistency',
            title: 'Consistency',
            content: `
Consistent design creates familiarity and reduces cognitive load. We achieve this through:
- Standardized spacing scale
- Unified color palette
- Consistent typography hierarchy
- Predictable interaction patterns
            `.trim(),
        },
        {
            id: 'accessibility',
            title: 'Accessibility First',
            content: `
Every component is built with accessibility in mind:
- Semantic HTML structure
- ARIA attributes where needed
- Keyboard navigation support
- Screen reader compatible
- Color contrast compliance
            `.trim(),
        },
        {
            id: 'flexibility',
            title: 'Flexibility',
            content: `
Components are designed to be flexible without being overwhelming:
- Sensible defaults
- Customizable through props
- Composable patterns
- Theme-aware styling
            `.trim(),
        },
    ],
};
