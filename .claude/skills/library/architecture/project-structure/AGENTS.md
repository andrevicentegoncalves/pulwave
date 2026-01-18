# Project Structure & Monorepo Architecture

**Version 1.0.0**
Pulwave Engineering
2026-01-17

> **Note:**
> This document is designed for AI agents and LLMs working on the Pulwave codebase.
> Reference specific sections by number (e.g., "follow rule 2.1") for targeted guidance.

## Abstract

Comprehensive guide to Pulwave's Atomic Modular Monorepo architecture. Contains 30+ rules across 7 categories covering layer architecture, package organization, dependency management, code placement, Turborepo patterns, import rules, and architectural boundaries. Essential for maintaining clean architecture and preventing coupling.

**Pulwave Architecture:**
- Atomic Modular Monorepo (strict layer separation)
- Turborepo 2.7 (build orchestration)
- npm workspaces (package management)
- 7 architectural layers (apps → experience → features → patterns → UI → data → foundation)
- Unidirectional dependencies (downward only)
- Provider-agnostic data layer

**Key Principle:** Dependencies flow downward only. Upper layers depend on lower layers, never the reverse.

---

## Table of Contents

1. [Layer Architecture](#1-layer-architecture) (CRITICAL)
2. [Package Organization](#2-package-organization) (HIGH)
3. [Code Placement Rules](#3-code-placement-rules) (HIGH)
4. [Dependency Management](#4-dependency-management) (CRITICAL)
5. [Turborepo Patterns](#5-turborepo-patterns) (MEDIUM)
6. [Import Rules](#6-import-rules) (HIGH)
7. [Architectural Boundaries](#7-architectural-boundaries) (CRITICAL)

---

## 1. Layer Architecture

**Impact: CRITICAL**

Pulwave uses a 7-layer architecture with strict dependency rules. Understanding these layers is fundamental to working on the codebase.

### 1.1 The Seven Layers

**Impact: CRITICAL** (defines entire codebase structure)

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

**Layer Descriptions:**

**1. Apps** (Top Layer)
- Runnable applications
- Routing configuration
- Provider setup (TanStack Query, Theme, Auth)
- Environment-specific configuration
- Entry points (main.tsx)
- **Can import from:** Experience, Features, UI, Data, Foundation
- **Example:** `apps/web/real-estate/`

**2. Experience**
- Page-level components
- Multi-feature compositions
- User flows (onboarding, checkout)
- Shell components (AdminShell, MobileShell)
- **Can import from:** Features, Patterns, UI, Data, Foundation
- **Example:** `packages/experience/admin/`

**3. Features**
- Feature-specific business logic
- Feature-specific UI components
- Domain-bounded contexts
- **Can import from:** Patterns, UI, Data, Foundation
- **Cannot import from:** Other Features (sibling imports forbidden)
- **Example:** `packages/features/property-management/`

**4. Patterns**
- Reusable layout compositions
- Data-agnostic patterns (List, Grid, Detail)
- Generic UI patterns
- **Can import from:** UI, Foundation
- **Example:** `packages/patterns/list-detail/`

**5. UI**
- Pure presentational components
- Design system components
- Theme-aware, data-agnostic
- **Can import from:** Foundation only
- **Example:** `packages/ui/components/Button/`

**6. Data**
- Provider-agnostic data access
- Repository pattern
- Service layer
- TanStack Query hooks
- **Can import from:** Foundation only
- **Example:** `packages/data/domains/profile/`

**7. Foundation** (Bottom Layer)
- Design tokens (CSS variables)
- Utility functions
- Shared hooks (useWindowSize, useMediaQuery)
- **Cannot import from:** Any other package
- **Example:** `packages/foundation/hooks/`

**Pulwave-Specific Notes:**
- This is enforced by ESLint rules
- Violations break the build
- Each layer has a specific purpose
- Know your layer before adding code

---

### 1.2 Dependency Flow Rules

**Impact: CRITICAL** (prevents coupling, ensures maintainability)

Dependencies MUST flow downward only. Upper layers can depend on lower layers, but never the reverse.

**Allowed Dependencies:**

```
Apps      → Experience, Features, UI, Data, Foundation ✅
Experience → Features, Patterns, UI, Data, Foundation ✅
Features  → Patterns, UI, Data, Foundation ✅
Patterns  → UI, Foundation ✅
UI        → Foundation ✅
Data      → Foundation ✅
Foundation → Nothing ✅
```

**Forbidden Dependencies:**

```
UI        → Features ❌ NEVER
Features  → Features ❌ NEVER (siblings)
Data      → UI ❌ NEVER
Foundation → Anything ❌ NEVER
Experience → Apps ❌ NEVER (upward)
```

**Incorrect: Upward dependency**

```typescript
// packages/ui/components/Button/Button.tsx - WRONG
import { useAuth } from '@pulwave/features-auth'; // UI importing Features!

function Button() {
  const { user } = useAuth(); // UI should not know about auth
  // ...
}
// Problem: UI layer depends on Features layer (upward dependency)
```

**Correct: Data passed via props**

```typescript
// packages/ui/components/Button/Button.tsx - CORRECT
interface ButtonProps {
  disabled?: boolean;
  children: ReactNode;
}

function Button({ disabled, children }: ButtonProps) {
  // Pure presentational component
  return <button disabled={disabled}>{children}</button>;
}

// Usage in Features layer
import { Button } from '@pulwave/ui';
import { useAuth } from '@pulwave/data';

function LogoutButton() {
  const { user } = useAuth();
  return <Button disabled={!user}>Logout</Button>;
}
```

**Incorrect: Feature-to-Feature dependency**

```typescript
// packages/features/billing/src/components/Invoice.tsx - WRONG
import { PropertySelector } from '@pulwave/features-property'; // Sibling import!

function Invoice() {
  return <PropertySelector />; // Feature importing another Feature
}
// Problem: Creates coupling between features
```

**Correct: Shared components in UI layer**

```typescript
// Move shared component to UI layer
// packages/ui/components/PropertySelect/PropertySelect.tsx
export function PropertySelect({ properties, onChange }: Props) {
  // Generic, reusable component
}

// Both features import from UI
// packages/features/billing/
import { PropertySelect } from '@pulwave/ui';

// packages/features/property/
import { PropertySelect } from '@pulwave/ui';
```

**Pulwave-Specific Notes:**
- ESLint rule: `@typescript-eslint/no-restricted-imports`
- Build fails on violation
- If two features need shared code → move to UI or Data layer
- If UI needs data → accept as props from upper layers

---

### 1.3 Layer-Specific Responsibilities

**Impact: HIGH** (clear separation of concerns)

Each layer has specific responsibilities. Code in the wrong layer creates architectural debt.

**Apps Layer**
- ✅ Routing configuration
- ✅ Provider setup (QueryClient, Theme, Auth)
- ✅ Entry points (main.tsx, index.html)
- ✅ Environment variables
- ❌ Business logic
- ❌ UI components
- ❌ Data fetching

**Experience Layer**
- ✅ Page components
- ✅ Multi-feature compositions
- ✅ User flows (onboarding, wizards)
- ✅ Shell components (layout wrappers)
- ❌ Reusable UI components (→ UI layer)
- ❌ Data access logic (→ Data layer)

**Features Layer**
- ✅ Feature-specific business logic
- ✅ Feature-specific UI components
- ✅ Domain models and types
- ✅ Feature-specific hooks
- ❌ Generic UI components (→ UI layer)
- ❌ Direct database access (→ Data layer)

**Patterns Layer**
- ✅ Layout compositions (List-Detail, Master-Detail)
- ✅ Data-agnostic patterns
- ✅ Generic UI patterns
- ❌ Data fetching
- ❌ Business logic

**UI Layer**
- ✅ Presentational components
- ✅ Design system components
- ✅ Theme-aware components
- ❌ Business logic
- ❌ Data fetching
- ❌ Feature-specific logic

**Data Layer**
- ✅ Data fetching (TanStack Query)
- ✅ Repository pattern
- ✅ Service layer (business logic)
- ✅ Provider abstraction (Supabase)
- ❌ UI components
- ❌ Rendering logic

**Foundation Layer**
- ✅ Design tokens (CSS variables)
- ✅ Utility functions (formatters, validators)
- ✅ Shared hooks (useWindowSize, useMediaQuery)
- ❌ Components
- ❌ Feature-specific code

**Decision Tree: Where does this code go?**

```
Is it a runnable app?
  → Yes: apps/

Is it a full page or multi-feature composition?
  → Yes: experience/

Is it feature-specific UI or logic?
  → Yes: features/

Is it a layout pattern?
  → Yes: patterns/

Is it a presentational component?
  → Yes: ui/

Is it data access or business logic?
  → Yes: data/

Is it a utility, token, or shared hook?
  → Yes: foundation/
```

**Pulwave-Specific Notes:**
- When in doubt, ask: "Who should know about this?"
- If only one feature: → Features layer
- If multiple features need it: → UI or Data layer
- If everyone needs it: → Foundation layer

---

## 2. Package Organization

**Impact: HIGH**

Consistent package structure makes the codebase navigable and predictable.

### 2.1 Package Naming Convention

**Impact: MEDIUM** (discoverability, clarity)

Package names follow a strict pattern: `@pulwave/[layer]-[name]`

**Layer Prefixes:**
- Apps: No prefix (e.g., `apps/web/real-estate`)
- Experience: `experience-` (e.g., `@pulwave/experience-admin`)
- Features: `features-` (e.g., `@pulwave/features-property`)
- Patterns: `patterns-` (e.g., `@pulwave/patterns-list-detail`)
- UI: `ui` (single package: `@pulwave/ui`)
- Data: `data` (single package: `@pulwave/data`)
- Foundation: `foundation` (single package: `@pulwave/foundation`)
- Tooling: `tooling-` (e.g., `@pulwave/tooling-eslint`)
- Internal: `internal-` (e.g., `@pulwave/internal-env`)

**Examples:**

```json
// Good naming
"@pulwave/features-billing"
"@pulwave/features-property-management"
"@pulwave/experience-onboarding"
"@pulwave/patterns-list-detail"

// Bad naming
"@pulwave/billing" // Missing layer prefix
"@pulwave/prop-mgmt" // Abbreviations unclear
"@pulwave/propertyManagement" // camelCase, not kebab-case
```

**Pulwave-Specific Notes:**
- UI, Data, Foundation are monolithic packages (no sub-packages)
- Features are separate packages per domain
- Tooling packages for shared configs (ESLint, TypeScript)

---

### 2.2 Package Structure Template

**Impact: HIGH** (consistency, maintainability)

All packages follow a consistent internal structure.

**Standard Package Structure:**

```
packages/[layer]/[package-name]/
├── src/
│   ├── components/       # React components (if applicable)
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   ├── constants/        # Constants
│   └── index.ts          # Public API (barrel export)
├── styles/               # SCSS files (if applicable)
│   └── index.scss
├── __tests__/            # Tests
│   ├── unit/
│   └── integration/
├── package.json          # Package manifest
├── tsconfig.json         # TypeScript config (extends base)
├── README.md             # Package documentation
└── index.ts              # Main entry point (re-exports src/index.ts)
```

**Data Package Structure:**

```
packages/data/
├── domains/              # Domain modules
│   ├── profile/
│   │   ├── hooks/        # useProfile, useUpdateProfile
│   │   ├── services/     # profileService
│   │   ├── repositories/ # profileRepository
│   │   ├── interfaces/   # Types
│   │   ├── keys/         # Query keys
│   │   └── index.ts
│   ├── property/
│   └── ...
├── providers/            # Provider implementations
│   ├── supabase/
│   └── index.ts
├── cache/                # Cache utilities
├── src/
│   └── index.ts          # Re-exports all domains
└── package.json
```

**UI Package Structure:**

```
packages/ui/
├── components/           # 91 UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── types.ts      # CVA variants
│   │   ├── index.ts
│   │   └── styles/
│   │       ├── _index.scss
│   │       └── partials/
│   ├── Input/
│   └── ...
├── data-visualization/   # Chart components
│   ├── BarChart/
│   └── ...
├── src/
│   └── index.ts          # Barrel export of all components
└── package.json
```

**Pulwave-Specific Notes:**
- Every package has a README.md
- Tests colocated with code in `__tests__/`
- Styles in separate `styles/` directory
- Public API defined in `index.ts` (explicit exports)

---

### 2.3 Barrel Exports (index.ts)

**Impact: MEDIUM** (controls public API, prevents internal coupling)

Use `index.ts` to define what's public. Internal files should not be imported directly.

**Incorrect: Direct import of internal file**

```typescript
// WRONG
import { ButtonInternal } from '@pulwave/ui/components/Button/ButtonInternal';
```

**Correct: Import from package entry**

```typescript
// CORRECT
import { Button } from '@pulwave/ui';
```

**Barrel Export Pattern:**

```typescript
// packages/features/property/src/index.ts
export { PropertyList } from './components/PropertyList';
export { PropertyForm } from './components/PropertyForm';
export { useProperties } from './hooks/useProperties';
export type { Property, PropertyFormData } from './types';

// DON'T export internal utilities
// DON'T export helper components not meant for external use
```

**Pulwave-Specific Notes:**
- Only export what consumers need
- Internal utils stay internal
- Types should be exported (with `export type`)
- Document breaking changes when removing exports

---

## 3. Code Placement Rules

**Impact: HIGH**

Knowing where to put new code prevents architectural drift.

### 3.1 Where to Put Components

**Impact: HIGH** (most common decision)

**Decision Tree:**

```
Is it a full page?
  → packages/experience/[domain]/pages/

Is it used in multiple features?
  → packages/ui/components/

Is it feature-specific UI?
  → packages/features/[feature]/components/

Is it a layout pattern?
  → packages/patterns/[pattern]/
```

**Examples:**

```typescript
// Full page → Experience
packages/experience/admin/src/pages/DashboardPage.tsx

// Generic button → UI
packages/ui/components/Button/Button.tsx

// Property-specific card → Features
packages/features/property/src/components/PropertyCard.tsx

// List-detail layout → Patterns
packages/patterns/list-detail/src/ListDetail.tsx
```

**Pulwave-Specific Notes:**
- If unsure, start in Features
- Promote to UI when 3+ features need it
- Never put feature logic in UI components

---

### 3.2 Where to Put Hooks

**Impact: MEDIUM** (logic reusability)

**Decision Tree:**

```
Is it data fetching?
  → packages/data/domains/[domain]/hooks/

Is it feature-specific logic?
  → packages/features/[feature]/hooks/

Is it generic utility (window size, media query)?
  → packages/foundation/hooks/
```

**Examples:**

```typescript
// Data fetching → Data layer
packages/data/domains/profile/hooks/useProfile.ts

// Feature-specific → Features layer
packages/features/billing/hooks/useInvoiceCalculator.ts

// Generic utility → Foundation
packages/foundation/hooks/useWindowSize.ts
```

**Pulwave-Specific Notes:**
- Data hooks use TanStack Query
- Feature hooks contain business logic
- Foundation hooks are pure utilities

---

### 3.3 Where to Put Utilities

**Impact: MEDIUM** (code reuse)

**Decision Tree:**

```
Is it domain-specific logic?
  → packages/data/domains/[domain]/utils/

Is it feature-specific?
  → packages/features/[feature]/utils/

Is it generic (formatting, validation)?
  → packages/foundation/utils/
```

**Examples:**

```typescript
// Domain-specific → Data layer
packages/data/domains/property/utils/calculatePropertyTax.ts

// Feature-specific → Features layer
packages/features/billing/utils/formatInvoiceNumber.ts

// Generic formatter → Foundation
packages/foundation/utils/formatCurrency.ts
```

**Pulwave-Specific Notes:**
- Keep utilities close to usage
- Only promote to Foundation when widely used
- Document generic utilities well

---

## 4. Dependency Management

**Impact: CRITICAL**

Proper dependency management prevents version conflicts and circular dependencies.

### 4.1 Workspace Dependencies

**Impact: HIGH** (enables monorepo, prevents version conflicts)

All internal packages use workspace protocol: `workspace:*`

**Incorrect: Hardcoded version**

```json
// packages/features/property/package.json - WRONG
{
  "dependencies": {
    "@pulwave/ui": "^1.0.0"  // Hardcoded version
  }
}
```

**Correct: Workspace protocol**

```json
// packages/features/property/package.json - CORRECT
{
  "dependencies": {
    "@pulwave/ui": "workspace:*"  // Always latest local version
  }
}
```

**Benefits:**
- Always uses local version (no version conflicts)
- Faster installs (no network requests)
- Type checking across packages
- Turbo cache works correctly

**Pulwave-Specific Notes:**
- All `@pulwave/*` packages use `workspace:*`
- External packages use semantic versioning
- npm automatically resolves workspace dependencies

---

### 4.2 Circular Dependency Prevention

**Impact: CRITICAL** (prevents build failures, ensures clean architecture)

Circular dependencies break the build and violate layer architecture.

**Common Circular Dependency:**

```
Package A → Package B
Package B → Package A
❌ CIRCULAR!
```

**How to Detect:**

```bash
# Check for circular dependencies
npm run check:circular

# Or with madge
npx madge --circular --extensions ts,tsx src/
```

**How to Fix:**

1. **Extract shared code to lower layer**

```typescript
// WRONG: Features importing each other
// features/billing/src/utils/shared.ts
import { calculateTax } from '@pulwave/features-property/utils';

// features/property/src/utils/shared.ts
import { formatCurrency } from '@pulwave/features-billing/utils';

// CORRECT: Extract to Foundation
// foundation/utils/calculations.ts
export function calculateTax() { }
export function formatCurrency() { }

// Both features import from Foundation
import { calculateTax, formatCurrency } from '@pulwave/foundation';
```

2. **Use dependency inversion**

```typescript
// Instead of Feature A importing Feature B directly
// Define interface in lower layer, implement in features

// data/interfaces/types.ts
export interface TaxCalculator {
  calculate(amount: number): number;
}

// features/property implements interface
export class PropertyTaxCalculator implements TaxCalculator {
  calculate(amount: number) { /* ... */ }
}
```

**Pulwave-Specific Notes:**
- CI fails on circular dependencies
- ESLint warns about potential circles
- Layer architecture naturally prevents most circles

---

### 4.3 External Dependencies

**Impact: MEDIUM** (bundle size, security, maintainability)

Manage external dependencies carefully to avoid bloat and security issues.

**Where to Put External Dependencies:**

```
Shared across packages → packages/*/package.json (each package)
Build tools → tooling packages
Types → @types/* in relevant package
```

**Example:**

```json
// packages/ui/package.json
{
  "dependencies": {
    "react": "^19.0.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "typescript": "^5.3.0"
  }
}
```

**Pulwave-Specific Notes:**
- React, TypeScript in multiple packages (not hoisted)
- Build tools in tooling packages
- Keep dependency versions aligned across packages

---

## 5. Turborepo Patterns

**Impact: MEDIUM**

Turborepo orchestrates builds and caching.

### 5.1 Task Pipeline

**Impact: MEDIUM** (build performance)

Define task dependencies in `turbo.json`:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {
      "cache": false
    }
  }
}
```

**`^build`**: Run dependencies' build first
**`outputs`**: Cache these directories
**`cache: false`**: Don't cache this task

**Pulwave-Specific Notes:**
- Build tasks are cached
- Tests depend on builds
- Lint runs on source files (no build needed)

---

## 6. Import Rules

**Impact: HIGH**

Consistent import patterns improve readability and prevent errors.

### 6.1 Import Order

**Impact: LOW** (readability, consistency)

Order imports from external to internal, top-level to specific:

```typescript
// 1. External packages
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal packages (@ aliases)
import { Button, Input } from '@pulwave/ui';
import { useProfile } from '@pulwave/data';

// 3. Relative imports (same package)
import { PropertyCard } from './PropertyCard';
import { formatPrice } from '../utils';
import type { Property } from '../types';
```

**Pulwave-Specific Notes:**
- ESLint auto-sorts imports
- Prettier enforces formatting
- Type imports use `import type`

---

### 6.2 Path Aliases

**Impact: MEDIUM** (cleaner imports)

Use `@pulwave/*` for package imports, avoid relative paths across packages:

**Incorrect: Relative path across packages**

```typescript
// WRONG
import { Button } from '../../../ui/components/Button';
```

**Correct: Package alias**

```typescript
// CORRECT
import { Button } from '@pulwave/ui';
```

**Pulwave-Specific Notes:**
- TypeScript paths configured in `tsconfig.json`
- All packages use `@pulwave/` namespace
- Internal imports use relative paths (`./`, `../`)

---

## 7. Architectural Boundaries

**Impact: CRITICAL**

Enforcing boundaries prevents architectural erosion.

### 7.1 Boundary Enforcement

**Impact: CRITICAL** (maintains clean architecture)

Boundaries are enforced through:

1. **ESLint rules**
2. **TypeScript path mappings**
3. **Automated checks in CI**

**ESLint Configuration:**

```json
{
  "rules": {
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "@pulwave/features-*",
            "message": "UI layer cannot import from Features layer"
          }
        ],
        "patterns": [
          {
            "group": ["@pulwave/features-*"],
            "importNames": ["*"],
            "message": "Features cannot import from other Features"
          }
        ]
      }
    ]
  }
}
```

**Pulwave-Specific Notes:**
- Build fails on boundary violations
- CI runs architecture checks
- Pre-commit hooks prevent violations locally

---

## Appendix: Quick Reference

**Layer Dependencies:**

| From | To | Allowed? |
|------|-----|----------|
| Apps → Experience | ✅ |
| Experience → Features | ✅ |
| Features → UI | ✅ |
| Features → Data | ✅ |
| UI → Foundation | ✅ |
| **UI → Features** | ❌ NEVER |
| **Features → Features** | ❌ NEVER |
| **Data → UI** | ❌ NEVER |

**Code Placement Quick Guide:**

| Code Type | Location |
|-----------|----------|
| Full page | experience/ |
| Feature UI | features/ |
| Generic UI | ui/ |
| Data hook | data/domains/*/hooks/ |
| Business logic | features/*/services/ or data/domains/*/services/ |
| Generic util | foundation/utils/ |

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Maintained By**: Pulwave Engineering
