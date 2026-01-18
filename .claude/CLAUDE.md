# Pulwave Architecture Guide for Claude AI

> This guide provides Claude AI with comprehensive understanding of the Pulwave monorepo architecture, coding patterns, and conventions.

## Quick Reference

| Item | Value |
|------|-------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 7 + Turborepo 2.7 |
| **Styling** | SCSS + BEM + CSS Custom Properties |
| **State** | TanStack Query 5 (server) + React Context (client) |
| **Database** | Supabase (abstracted via provider pattern) |
| **Testing** | Vitest + Playwright |
| **Package Manager** | npm with workspaces |

---

## 1. Architecture Overview

Pulwave is an **Atomic Modular Monorepo** with strict layer separation. Dependencies flow **downward only**.

```
┌─────────────────────────────────────────────────────────┐
│  APPS (apps/web/*)                                      │
│  Thin shells: routing, providers, entry points          │
├─────────────────────────────────────────────────────────┤
│  EXPERIENCE (packages/experience/*)                     │
│  Page assemblies, flows, shell components               │
├─────────────────────────────────────────────────────────┤
│  FEATURES (packages/features/*)                         │
│  Domain logic, feature-specific UI, business rules      │
├─────────────────────────────────────────────────────────┤
│  PATTERNS (packages/patterns/)                          │
│  Reusable layout compositions, data-agnostic            │
├─────────────────────────────────────────────────────────┤
│  UI (packages/ui/)                                      │
│  Pure presentational components, theme-aware            │
├─────────────────────────────────────────────────────────┤
│  DATA (packages/data/)                                  │
│  Provider-agnostic data layer, hooks, services, repos   │
├─────────────────────────────────────────────────────────┤
│  FOUNDATION (packages/foundation/)                      │
│  Design tokens, utilities, shared hooks                 │
└─────────────────────────────────────────────────────────┘
```

### Layer Rules

| From → To | Allowed? |
|-----------|----------|
| Apps → Experience | ✅ |
| Experience → Features | ✅ |
| Features → UI | ✅ |
| Features → Data | ✅ |
| UI → Foundation | ✅ |
| UI → Features | ❌ NEVER |
| Features → Features | ❌ NEVER |
| Data → UI | ❌ NEVER |

---

## 2. Package Structure

```
pulwave/
├── apps/
│   └── web/
│       ├── real-estate/     # Real estate vertical app
│       └── restaurant/      # Restaurant vertical app (WIP)
├── packages/
│   ├── foundation/          # Design tokens, hooks, utils
│   ├── data/                # Provider-agnostic data layer
│   │   ├── domains/         # 9 domain modules
│   │   ├── providers/       # Supabase implementation
│   │   └── cache/           # Query caching
│   ├── ui/                  # 91 UI components
│   │   ├── components/      # Core components
│   │   └── data-visualization/  # Charts
│   ├── patterns/            # Layout patterns
│   ├── features/            # 16 feature packages
│   ├── experience/          # 7 experience packages
│   ├── tooling/             # Shared configs
│   │   ├── typescript/      # tsconfig presets
│   │   ├── eslint/          # ESLint configs
│   │   └── prettier/        # Prettier config
│   └── internal/            # Internal-only packages
│       └── env/             # Zod env validation
├── docs/                    # Documentation
└── scripts/                 # Build scripts
```

---

## 3. UI Component Pattern

Every UI component follows this structure:

```
packages/ui/components/[ComponentName]/
├── [ComponentName].tsx      # Implementation with CVA
├── index.ts                 # Barrel export
├── types.ts                 # CVA variants + TypeScript types
└── styles/
    ├── _index.scss          # Main SCSS entry
    └── partials/            # BEM-based modules
        ├── _base.scss       # Base styles
        ├── _variants.scss   # Variant styles
        ├── _sizes.scss      # Size modifiers
        └── _states.scss     # Interactive states
```

### CVA Pattern Example

```tsx
// types.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      outlined: 'btn--outlined',
      ghost: 'btn--ghost',
    },
    size: {
      sm: 'btn--sm',
      md: 'btn--md',
      lg: 'btn--lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode;
};

// Button.tsx
export const Button = ({ variant, size, children, ...props }: ButtonProps) => {
  return (
    <button className={buttonVariants({ variant, size })} {...props}>
      {children}
    </button>
  );
};
```

### SCSS/BEM Pattern

```scss
// _base.scss
.btn {
  // Base styles
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-colors);

  // Elements (BEM)
  &__icon {
    margin-right: var(--spacing-2);
  }

  &__label {
    flex: 1;
  }
}

// _variants.scss
.btn--primary {
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);

  &:hover {
    background: var(--color-brand-primary-hover);
  }
}

.btn--outlined {
  background: transparent;
  border: 1px solid var(--color-border-default);
}
```

---

## 4. Data Layer Pattern

The data layer uses hexagonal architecture with 4 layers:

```
Component → Hook → Service → Repository → Provider
```

### Domain Structure

```
packages/data/domains/[domain]/
├── __tests__/           # Unit tests
├── hooks/               # React Query hooks
│   └── use[Domain].ts
├── interfaces/          # Type definitions
│   └── types/
├── keys/                # Query keys
├── repositories/        # Data access
│   └── [domain]Repository.ts
└── services/            # Business logic
    └── [domain]Service.ts
```

### Usage Example

```tsx
// In a component (Experience or Features layer)
import { useProfile } from '@pulwave/data';

const ProfilePage = () => {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState error={error} />;

  return <ProfileCard profile={profile} />;
};
```

### Service Pattern

```tsx
// profileService.ts
import { profileRepository } from '../repositories/profileRepository';

export const profileService = {
  async getFullProfile(userId: string) {
    const profile = await profileRepository.findById(userId);
    // Business logic, transformations, enrichment
    return enrichProfile(profile);
  },

  async updateProfile(userId: string, data: UpdateProfileDTO) {
    // Validation, business rules
    await profileRepository.update(userId, data);
  },
};
```

### Repository Pattern

```tsx
// profileRepository.ts
import { dataProvider } from '../../providers';

export const profileRepository = {
  async findById(id: string): Promise<Profile | null> {
    return dataProvider.profile.findById(id);
  },

  async update(id: string, data: Partial<Profile>): Promise<void> {
    return dataProvider.profile.update(id, data);
  },
};
```

---

## 5. Feature Package Pattern

```
packages/features/[feature]/
├── src/
│   ├── components/      # Feature-specific UI
│   ├── hooks/           # Feature-specific hooks
│   ├── utils/           # Feature utilities
│   └── index.ts         # Public exports
├── styles/              # Feature styles
├── package.json
├── tsconfig.json
└── index.ts             # Main entry
```

---

## 6. Experience Package Pattern

```
packages/experience/[experience]/
├── src/
│   ├── pages/           # Page components
│   ├── layouts/         # Layout wrappers
│   └── index.ts
├── styles/
├── package.json
└── index.ts
```

---

## 7. Design Tokens

All design values come from CSS custom properties defined in Foundation.

### Color System (HSL-based)

```scss
// Semantic colors (use these)
--color-text-primary
--color-text-secondary
--color-text-disabled
--color-surface-default
--color-surface-elevated
--color-brand-primary
--color-brand-primary-hover
--color-feedback-success
--color-feedback-error
--color-feedback-warning

// Primitives (avoid direct use)
--color-neutral-50 to --color-neutral-950
--color-primary-50 to --color-primary-950
```

### Spacing Scale

```scss
--spacing-0: 0;
--spacing-1: 0.25rem;   // 4px
--spacing-2: 0.5rem;    // 8px
--spacing-3: 0.75rem;   // 12px
--spacing-4: 1rem;      // 16px
--spacing-5: 1.25rem;   // 20px
--spacing-6: 1.5rem;    // 24px
--spacing-8: 2rem;      // 32px
--spacing-10: 2.5rem;   // 40px
--spacing-12: 3rem;     // 48px
--spacing-16: 4rem;     // 64px
```

### Typography

```scss
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;

--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

## 8. Import Aliases

```typescript
// Package imports (preferred)
import { Button, Card } from '@pulwave/ui';
import { useProfile, useAuth } from '@pulwave/data';
import { tokens } from '@pulwave/foundation';

// Internal imports within a package
import { helperFn } from '../utils';
import { LocalComponent } from './LocalComponent';
```

---

## 9. Common Commands

```bash
# Development
npm run dev                    # Run all apps
npm run dev -w apps/web/real-estate  # Run specific app

# Quality checks
npm run typecheck              # TypeScript check
npm run lint                   # ESLint + Stylelint
npm run test                   # Run tests
npm run check:circular         # Check circular deps
npm run check:architecture     # Validate boundaries

# Build
npm run build                  # Build all
npm run size                   # Check bundle size

# Utilities
npm run gen:types              # Generate Supabase types
npm run create:package         # Scaffold new package
```

---

## 10. Key Conventions

### DO ✅

- Use semantic color tokens (`--color-text-primary`), not primitives
- Follow BEM naming in SCSS (`.block__element--modifier`)
- Use CVA for component variants
- Keep UI components "dumb" (no business logic)
- Use React Query for server state
- Write tests in `__tests__/` directories
- Use TypeScript strict mode

### DON'T ❌

- Import from higher layers (UI importing Features)
- Use `any` type (use `unknown` if needed)
- Hardcode colors/spacing (use tokens)
- Put business logic in UI components
- Import Supabase directly (use data layer)
- Create circular dependencies
- Skip the service layer for data access

---

## 11. Current Known Issues

| Issue | Location | Status |
|-------|----------|--------|
| 50+ TypeScript errors | `packages/features/style-guide/` | Needs fix |
| Missing package.json | `packages/experience/backoffice/` | Needs fix |
| Missing package.json | `packages/experience/payments/` | Needs fix |

---

## 12. File Templates

### New UI Component

```bash
npm run create:package -- --type=component --name=NewComponent
```

Or manually create:
- `packages/ui/components/NewComponent/NewComponent.tsx`
- `packages/ui/components/NewComponent/index.ts`
- `packages/ui/components/NewComponent/types.ts`
- `packages/ui/components/NewComponent/styles/_index.scss`

### New Feature Package

```bash
npm run create:package -- --type=feature --name=new-feature
```

### New Data Domain

Create in `packages/data/domains/[domain]/`:
- `hooks/use[Domain].ts`
- `services/[domain]Service.ts`
- `repositories/[domain]Repository.ts`
- `interfaces/types/index.ts`
- `keys/index.ts`
- `__tests__/`

---

## 13. Testing Patterns

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with primary variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
  });
});

// Hook test
import { renderHook, waitFor } from '@testing-library/react';
import { useProfile } from '../useProfile';

describe('useProfile', () => {
  it('fetches profile data', async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

---

## 14. Environment Variables

Validated via Zod in `@pulwave/internal-env`:

```typescript
// Client-side (VITE_ prefix)
VITE_SUPABASE_URL      // Required: Supabase URL
VITE_SUPABASE_ANON_KEY // Required: Supabase anon key
VITE_APP_ENV           // Optional: development | staging | production

// Server-side (if needed)
DATABASE_URL           // Database connection
API_SECRET             // API secret key
```

Usage:
```typescript
import { clientEnv } from '@pulwave/internal-env';

const supabase = createClient(
  clientEnv.VITE_SUPABASE_URL,
  clientEnv.VITE_SUPABASE_ANON_KEY
);
```

---

*Last updated: 2026-01-14*