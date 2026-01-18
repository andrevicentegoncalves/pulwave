# UI2 Component Guidelines

> **V2 Design System Migration Guidelines**
> All new and migrated components MUST follow these standards.

---

## Architecture Overview

```
ComponentName/
├── ComponentName.tsx      # Main component (Compound Pattern)
├── types.ts               # CVA config + TypeScript types
├── index.ts              # Exports
└── styles/
    ├── _index.scss       # Entry point (@forward partials)
    └── partials/
        ├── _base.scss    # Core layout, structure
        ├── _tokens.scss  # Component CSS vars
        ├── _variants.scss # Visual variants
        ├── _sizes.scss   # Size modifiers
        ├── _states.scss  # Interactive states
        └── _elements.scss # BEM elements
```

---

## Mandatory Standards

### 1. Design System

| Rule | Requirement |
|------|-------------|
| **SCSS Import** | `@use '@pulwave/foundation/styles/scss' as *;` |
| Tokens | Use `styles2` design tokens exclusively |
| Colors | `var(--color-*)` only - no hex/rgb/rgba |
| Spacing | `var(--scale-*)` only - no px values |
| Typography | `var(--font-*)`, `var(--text-*)` |
| Touch targets | `var(--touch-target-min)` for 44px buttons |
| Z-index | `var(--z-index-*)` - not raw numbers |
| Transitions | `var(--duration-*)`, `var(--easing-*)` |
| Safe areas | `env(safe-area-inset-*)` for mobile |

> [!TIP]
> **Typography Migration**: detailed guide available at [token_migration_guidelines.md](./token_migration_guidelines.md)

> [!IMPORTANT]
> **Never use hardcoded values.** All `44px`, `56px`, `280px`, `rgba()`, `#hex`, or numeric z-index values must be replaced with tokens.

### 2. Component Pattern: Compound Components

```tsx
// ✅ CORRECT: Compound Pattern
const CardRoot = forwardRef<HTMLDivElement, CardProps>(
    ({ variant, className, children }, ref) => (
        <div ref={ref} className={classNames(cardVariants({ variant }), className)}>
            {children}
        </div>
    )
);

const CardHeader = ({ children }) => (
    <div className="card__header">{children}</div>
);

const CardContent = ({ children }) => (
    <div className="card__content">{children}</div>
);

export const Card = Object.assign(CardRoot, {
    Header: CardHeader,
    Content: CardContent,
});

// Usage:
<Card variant="elevated">
    <Card.Header>Title</Card.Header>
    <Card.Content>Body</Card.Content>
</Card>
```

### 3. Variant Management: CVA

```tsx
// types.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('button', {
    variants: {
        variant: {
            primary: 'button--primary',
            secondary: 'button--secondary',
            ghost: 'button--ghost',
        },
        size: {
            s: 'button--s',
            m: 'button--m',
            l: 'button--l',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'm',
    },
});

export type ButtonProps = VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    disabled?: boolean;
};
```

### 4. Styling: Modular BEM SCSS

```scss
// styles/partials/_base.scss
.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--scale-2);
    font-family: var(--font-family-body);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);

    // Elements
    &__icon {
        flex-shrink: 0;
    }

    &__label {
        flex: 1;
    }
}

// styles/partials/_variants.scss
.button {
    &--primary {
        background: var(--color-primary);
        color: var(--color-on-primary);
    }

    &--secondary {
        background: var(--color-surface-secondary);
        color: var(--color-text-default);
    }

    &--ghost {
        background: transparent;
        color: var(--color-text-default);
    }
}

// styles/partials/_sizes.scss
.button {
    &--s {
        height: var(--scale-8);
        padding: 0 var(--scale-3);
        font-size: var(--text-xs);
    }

    &--m {
        height: var(--scale-10);
        padding: 0 var(--scale-4);
        font-size: var(--text-sm);
    }

    &--l {
        height: var(--scale-12);
        padding: 0 var(--scale-6);
        font-size: var(--text-base);
    }
}

// styles/partials/_states.scss
.button {
    &:hover:not(:disabled) {
        filter: brightness(1.1);
    }

    &:focus-visible {
        outline: 2px solid var(--color-focus-ring);
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
```

---

## Migration Checklist

Before a component is considered migrated, verify **ALL** items:

### Code Quality

- [ ] **No inline styles** - Remove all `style={{ }}` attributes
- [ ] **No hardcoded values** - No `#hex`, `rgb()`, or `px` values
- [ ] **No deprecated code** - Remove all legacy compatibility shims
- [ ] **No backwards compat** - Remove v1 fallbacks and polyfills

### Design System Compliance

- [ ] **Uses `styles2` tokens** - All values from design tokens
- [ ] **CVA for variants** - All visual variants managed via CVA
- [ ] **Compound pattern** - Sub-components use `Component.Part` syntax
- [ ] **BEM SCSS structure** - Follows partial organization

### Package Placement

- [ ] **Correct layer** - Component in appropriate package per taxonomy:
  - `foundation/ui2` - Pure presentational components
  - `patterns` - Reusable compositions
  - `features/*` - Domain-specific logic
  - `experience/*` - Full page experiences

### Documentation

- [ ] **Style Guide entry** - Documented in `style-guide2`
- [ ] **All variants shown** - Every variant/size demonstrated
- [ ] **Accessibility notes** - ARIA, keyboard navigation documented

---

## Import Rules

```tsx
// ✅ CORRECT
import { classNames } from '@pulwave/foundation';
import { Button, Icon } from '@pulwave/ui';

// ❌ WRONG - Direct imports
import { Button } from '@pulwave/ui/components/Button';
import { ChevronDown } from '@pulwave/ui';
```

---

## File Templates

### `index.ts`

```tsx
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './types';
```

### `types.ts`

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

export const componentVariants = cva('component', {
    variants: {
        variant: { /* ... */ },
        size: { /* ... */ },
    },
    defaultVariants: { /* ... */ },
});

export type ComponentProps = VariantProps<typeof componentVariants> & {
    children?: React.ReactNode;
    className?: string;
};
```

### `ComponentName.tsx`

```tsx
import { forwardRef } from 'react';
import { classNames } from '@pulwave/foundation';
import { componentVariants, type ComponentProps } from './types';
import './styles/_index.scss';

const ComponentRoot = forwardRef<HTMLDivElement, ComponentProps>(
    ({ variant, size, className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={classNames(componentVariants({ variant, size }), className)}
            {...props}
        >
            {children}
        </div>
    )
);
ComponentRoot.displayName = 'Component';

export const Component = Object.assign(ComponentRoot, {
    // Add sub-components here
});
```

### `styles/_index.scss`

```scss
@forward 'partials/base';
@forward 'partials/tokens';
@forward 'partials/variants';
@forward 'partials/sizes';
@forward 'partials/states';
@forward 'partials/elements';
```

---

## Quick Reference

| Aspect | Standard |
|--------|----------|
| Pattern | Compound Components |
| Variants | CVA (class-variance-authority) |
| Styling | Modular BEM SCSS with partials |
| Tokens | `styles2` design system only |
| Icons | Import from `@pulwave/ui` |
| Utilities | `classNames()` from `@pulwave/foundation` |
