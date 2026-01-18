/**
 * Getting Started - For Developers Documentation
 */
import type { FoundationDoc } from '@pulwave/features-style-guide';

export const ForDevelopersDoc: FoundationDoc = {
    name: 'For Developers',
    description: 'Technical guide for developers implementing the Pulwave Design System.',
    sections: [
        {
            id: 'installation',
            title: 'Installation & Setup',
            content: `
**Install Core Packages:**
\`\`\`bash
npm install @pulwave/ui @pulwave/foundation
\`\`\`

**For Specific Features:**
\`\`\`bash
# Layout components
npm install @pulwave/features-layout

# Forms and validation
npm install @pulwave/patterns

# Data visualization
npm install @pulwave/ui/data-visualization
\`\`\`

**Setup Styles:**
\`\`\`tsx
// In your app entry point (main.tsx or _app.tsx)
import '@pulwave/foundation/styles/tokens/generated/tokens.css';
import '@pulwave/foundation/styles/scss/_index.scss';
\`\`\`
            `.trim(),
        },
        {
            id: 'architecture',
            title: 'Architecture Overview',
            content: `
The Pulwave monorepo follows **Atomic Modular Architecture**:

\`\`\`
┌─────────────────────────────────────┐
│  APPS (apps/web/*)                  │
│  Entry points and routing           │
├─────────────────────────────────────┤
│  EXPERIENCE (packages/experience/*) │
│  Page assemblies and flows          │
├─────────────────────────────────────┤
│  FEATURES (packages/features/*)     │
│  Domain logic and feature UI        │
├─────────────────────────────────────┤
│  PATTERNS (packages/patterns/)      │
│  Reusable layout compositions       │
├─────────────────────────────────────┤
│  UI (packages/ui/)                  │
│  Pure presentational components     │
├─────────────────────────────────────┤
│  DATA (packages/data/)              │
│  Provider-agnostic data layer       │
├─────────────────────────────────────┤
│  FOUNDATION (packages/foundation/)  │
│  Design tokens and utilities        │
└─────────────────────────────────────┘
\`\`\`

**Key Principles:**
- Dependencies flow **downward only**
- UI components are **stateless and pure**
- Data layer is **provider-agnostic**
- Tokens define all design values
            `.trim(),
        },
        {
            id: 'component-usage',
            title: 'Using Components',
            content: `
**Basic Usage:**
\`\`\`tsx
import { Button, Card, Text } from '@pulwave/ui';

function MyComponent() {
    return (
        <Card>
            <Text category="title" size="lg">Hello World</Text>
            <Button variant="primary" size="md">
                Click me
            </Button>
        </Card>
    );
}
\`\`\`

**With TypeScript:**
\`\`\`tsx
import type { ButtonProps } from '@pulwave/ui';

interface MyButtonProps extends ButtonProps {
    customProp?: string;
}

function MyButton({ customProp, ...buttonProps }: MyButtonProps) {
    return <Button {...buttonProps} />;
}
\`\`\`

**Styling Components:**
\`\`\`tsx
import { Button } from '@pulwave/ui';
import { cn } from '@pulwave/utils';

// Use className for custom styles
<Button
    variant="primary"
    className={cn('my-custom-class', {
        'is-active': isActive
    })}
/>
\`\`\`
            `.trim(),
        },
        {
            id: 'theming',
            title: 'Theming & Dark Mode',
            content: `
**Dark Mode Support:**
The system automatically switches between light and dark themes using CSS custom properties.

\`\`\`tsx
// Dark mode is automatic - no code needed!
// Themes are applied via data-theme attribute
\`\`\`

**Using Design Tokens in Code:**
\`\`\`tsx
// ❌ Don't use hardcoded values
<div style={{ color: '#333', margin: '16px' }} />

// ✅ Use CSS variables
<div style={{
    color: 'var(--color-text-primary)',
    margin: 'var(--spacing-4)'
}} />

// ✅ Better: Use component props
<Card padding="md">
    <Text color="primary">Hello</Text>
</Card>
\`\`\`
            `.trim(),
        },
        {
            id: 'best-practices',
            title: 'Development Best Practices',
            content: `
**Component Patterns:**
- Keep components small and focused
- Use TypeScript for type safety
- Follow the CVA (Class Variance Authority) pattern for variants
- Use BEM naming in SCSS

**Performance:**
- Use React.memo() for expensive components
- Lazy load heavy components
- Use CSS-in-JS sparingly (prefer SCSS)

**Accessibility:**
- Always include ARIA labels
- Test with keyboard navigation
- Use semantic HTML
- Verify screen reader compatibility

**Testing:**
- Write unit tests with Vitest
- E2E tests with Playwright
- Visual regression tests for components
            `.trim(),
        },
        {
            id: 'data-layer',
            title: 'Working with Data',
            content: `
**Data Layer Pattern:**
\`\`\`tsx
// Hook → Service → Repository → Provider

// In your component
import { useProfile } from '@pulwave/data';

function ProfilePage() {
    const { data: profile, isLoading } = useProfile();

    if (isLoading) return <Skeleton />;
    return <ProfileCard profile={profile} />;
}
\`\`\`

**State Management:**
- Server state: TanStack Query (React Query)
- Client state: React Context
- Form state: React Hook Form
            `.trim(),
        },
    ],
    dos: [
        'Use TypeScript with strict mode',
        'Follow the layer architecture (UI → Foundation)',
        'Use design tokens via CSS variables',
        'Write tests for components',
        'Use semantic HTML elements',
    ],
    donts: [
        'Import from higher layers (e.g., UI importing from Features)',
        'Use inline styles for theming',
        'Skip accessibility attributes',
        'Use any type in TypeScript',
        'Create circular dependencies',
    ],
};
