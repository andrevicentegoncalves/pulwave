# Comprehensive Component-to-Skills Implementation Plan

> Cross-reference analysis of 280 TSX components against 62 Skills (47 Pulwave Library + 15 Anthropic)
> Generated: 2026-01-18

---

## Executive Summary

This document provides a comprehensive cross-check of all Pulwave TSX components (280 files) against:
- **47 Pulwave Library Skills** (components, styling, CVA, accessibility, performance, design-system, etc.)
- **15 Anthropic Skills** (frontend-design, webapp-testing, pdf, xlsx, theme-factory, etc.)

### Key Statistics
| Metric | Count |
|--------|-------|
| Total TSX Components | 280 |
| Total Skills Analyzed | 62 |
| Critical Rule Violations Expected | HIGH |
| Implementation Tasks | 45+ |

---

## Part A: Pulwave Library Skills Analysis

### A.1 Component Library Rules (CRITICAL)

Based on `front-end/components/AGENTS.md`:

#### Rule 1.1: Semantic Tokens (CRITICAL)
**Requirement**: All components must use semantic tokens, not primitives.

**Components to Audit**:
| Component Category | Files | Compliance Status |
|-------------------|-------|-------------------|
| UI Atoms | ~40 | AUDIT REQUIRED |
| UI Molecules | ~25 | AUDIT REQUIRED |
| UI Organisms | ~26 | AUDIT REQUIRED |
| Feature Components | 178 | AUDIT REQUIRED |

**What to Check**:
```scss
// ❌ BAD: Primitive tokens
background: var(--color-blue-600);
color: var(--color-gray-900);
padding: 16px;

// ✅ GOOD: Semantic tokens
background: var(--color-brand-primary);
color: var(--color-text-primary);
padding: var(--spacing-4);
```

#### Rule 1.2: No Hard-Coded Values (CRITICAL)
**Requirement**: Never hard-code colors, spacing, or typography.

**Common Violations to Find**:
- `#ffffff`, `#333333`, `rgba()` in styles
- `16px`, `24px`, `12px` instead of spacing tokens
- Font sizes as pixels instead of tokens

#### Rule 2.2: File Organization (MEDIUM)
**Required Structure**:
```
components/[ComponentName]/
├── [ComponentName].tsx
├── index.ts
├── types.ts
└── styles/
    ├── _index.scss
    └── partials/
```

**Components Needing Structure Review**:
- All 91 UI components should match this structure

---

### A.2 CVA Integration Rules (CRITICAL)

Based on `front-end/cva/AGENTS.md`:

#### Rule 3.1: CVA for All Variants (CRITICAL)
**Requirement**: All component variants must use CVA, not manual class concatenation.

**Pattern Check**:
```tsx
// ❌ BAD: Manual concatenation
let className = 'btn';
if (variant === 'primary') className += ' btn--primary';

// ✅ GOOD: CVA
const buttonVariants = cva('btn', {
  variants: { variant: { primary: 'btn--primary' } }
});
```

**Components Requiring CVA Audit**:
| Component Type | Count | Priority |
|---------------|-------|----------|
| Button variants | 15 demos | HIGH |
| Input variants | 49 demos | HIGH |
| Badge variants | 12 demos | HIGH |
| Card variants | 6 demos | HIGH |
| All UI components | 91 | CRITICAL |

#### Rule 3.2: Type Safety (CRITICAL)
**Requirement**: Use `VariantProps<typeof variants>` for type inference.

```tsx
// ✅ Required pattern
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;
```

---

### A.3 Styling Rules (CRITICAL)

Based on `front-end/styling/AGENTS.md`:

#### Rule 6.1: BEM Naming Convention (HIGH)
**Requirement**: All CSS classes must follow BEM naming.

**Pattern**: `.block__element--modifier`

```scss
// ✅ GOOD
.card { }
.card__header { }
.card__body { }
.card--elevated { }
.card--interactive { }

// ❌ BAD
.cardHeader { }
.card-header { }
.Card__header { }
```

**Components to Audit**: All 91 UI components + 178 feature components

#### Rule 6.2: Max 3 Nesting Levels (HIGH)
**Requirement**: Never nest more than 3 levels deep in SCSS.

```scss
// ❌ BAD: Too deep
.card {
  &__header {
    &__title {
      &__icon { // 4 levels - BAD
        color: red;
      }
    }
  }
}

// ✅ GOOD: Flat structure
.card__header-title-icon {
  color: var(--color-text-secondary);
}
```

---

### A.4 Accessibility Rules (CRITICAL)

Based on `front-end/accessibility/AGENTS.md`:

#### Rule 8.1: Semantic HTML (CRITICAL)
**Requirement**: Use semantic HTML elements, not div soup.

**Components Requiring Semantic Review**:
| Element | Should Use | Common Mistake |
|---------|-----------|----------------|
| Buttons | `<button>` | `<div onClick>` |
| Links | `<a>` | `<div>` or `<button>` |
| Lists | `<ul>/<ol>` | `<div>` containers |
| Navigation | `<nav>` | `<div>` |
| Headers | `<header>` | `<div>` |
| Main content | `<main>` | `<div>` |

**Priority Components**:
- All Navigation components (Sidebar, Header, Menu, Tabs)
- All Button variants
- All Input components
- All Modal components

#### Rule 8.2: ARIA Attributes (HIGH)
**Required ARIA Patterns**:

| Pattern | Requirement |
|---------|-------------|
| Icon buttons | `aria-label` required |
| Loading states | `aria-busy="true"` |
| Expandable | `aria-expanded` |
| Controls | `aria-controls` |
| Live regions | `aria-live` for dynamic content |

**Components Requiring ARIA Audit**:
- `IconOnlyButtonsDemo.tsx` - All 15 button demos
- `SpinnerSizesDemo.tsx` - Loading indicators
- `AccordionBasicDemo.tsx` - Expandable content
- `DropdownBasicDemo.tsx` - Menus
- `ToastTypesDemo.tsx` - Live regions
- `ModalBasicDemo.tsx` - Focus management

#### Rule 8.3: Keyboard Navigation (HIGH)
**Requirements**:
- All interactive elements must be keyboard accessible
- Focus order must be logical
- Focus styles must be visible (`focus-visible`)

---

### A.5 Performance Rules (CRITICAL)

Based on `front-end/performance/AGENTS.md`:

#### Rule 1.1: Eliminate Waterfalls (CRITICAL)
**Requirement**: Use `Promise.all()` for parallel data fetching.

**Components to Review**:
- All page components (31 files)
- Dashboard components
- Data tables with multiple data sources

#### Rule 2.1: Avoid Barrel Imports (CRITICAL)
**Requirement**: Import directly from source, not barrel files.

```tsx
// ❌ BAD: Barrel import
import { Check } from '@pulwave/ui/icons';

// ✅ GOOD: Direct import
import { Check } from '@pulwave/ui/icons/Check';
```

**Impact**: Saves 50-500KB per library

#### Rule 2.2: Dynamic Imports for Heavy Components (CRITICAL)
**Components Requiring Lazy Loading**:
| Component | Reason | Priority |
|-----------|--------|----------|
| RichTextEditor | Heavy (300KB+) | HIGH |
| DataTable | Complex | HIGH |
| Charts | Heavy libraries | HIGH |
| DatePicker | Calendar libraries | MEDIUM |
| TimePicker | Time utilities | MEDIUM |
| ColorPicker | Color utilities | MEDIUM |

```tsx
// ✅ Required pattern
const RichTextEditor = lazy(() => import('./RichTextEditor'));
```

---

### A.6 Design System Rules (CRITICAL)

Based on `front-end/design-system/AGENTS.md`:

#### Rule: Token-Based Design (CRITICAL)
**Requirements**:
- 100% token-based design
- Zero hardcoded values
- Semantic color usage

#### Rule: Atomic Design Hierarchy
| Level | Examples | Rules |
|-------|----------|-------|
| Atoms | Button, Input, Text, Icon | Single purpose, indivisible |
| Molecules | InputGroup, SearchBar | Combinations of atoms |
| Organisms | Form, DataTable, Modal | Complex, standalone |

---

## Part B: Anthropic Skills Analysis

### B.1 Frontend Design Skill (HIGH APPLICABILITY)

**Applicable Components**: ALL 280 TSX files

#### Design Thinking Requirements
Every component should embody:
1. **Bold Aesthetic Direction** - Commit to a clear conceptual direction
2. **Typography Excellence** - Distinctive fonts, not Inter/Roboto/Arial
3. **Color & Theme** - Cohesive aesthetic with CSS variables
4. **Motion** - High-impact animations at key moments
5. **Spatial Composition** - Unexpected layouts, asymmetry, overlap

#### Anti-Patterns to Avoid (frontend-design)
| Anti-Pattern | Found In | Fix |
|--------------|----------|-----|
| Generic fonts (Inter, Roboto) | Typography demos | Use distinctive fonts |
| Purple gradients | Common AI slop | Use brand colors |
| Predictable layouts | Grid demos | Add asymmetry |
| Cookie-cutter design | Many components | Context-specific character |

### B.2 Webapp Testing Skill (HIGH APPLICABILITY)

**Priority Pages for E2E Tests**:

#### CRITICAL Priority (Authentication)
| Page | Test Scenarios |
|------|----------------|
| `LoginPage.tsx` | Login flow, error handling, forgot password |
| `AuthCallbackPage.tsx` | OAuth callback, token handling |

#### HIGH Priority (Core Workflows)
| Page | Test Scenarios |
|------|----------------|
| `DashboardPage.tsx` | Data loading, navigation, widgets |
| `SettingsPage.tsx` | Form validation, save, cancel |
| `OnboardingPage.tsx` | Multi-step wizard, validation |
| `PropertiesPage.tsx` | CRUD operations |
| `AdminPage.tsx` | Permission checks |

### B.3 Export Skills (XLSX/PDF)

**Components Needing Export**:

#### XLSX Export Required
| Component | Export Type |
|-----------|-------------|
| DataTable | Table data |
| FinancePage | Financial reports |
| BillingHistory | Billing records |
| UsersList | User data |

#### PDF Export Required
| Component | Document Type |
|-----------|---------------|
| LeasesPage | Lease agreements |
| BillingPage | Invoices |
| LegalDocumentCard | Legal documents |

### B.4 Theme Factory Skill

**Theme-Related Components**:
| Component | Application |
|-----------|-------------|
| ThemeContext.tsx | Theme provider logic |
| ThemeToggleBasicDemo.tsx | Theme switching UI |
| All Foundation demos | Theme token usage |

---

## Part C: Component Categories Deep Dive

### C.1 Apps Layer (40 files)

#### Main App Shell (5 files)
| File | Rules to Apply |
|------|----------------|
| `App.tsx` | Performance (code splitting) |
| `main.tsx` | Performance (async loading) |
| `providers/index.tsx` | Context patterns |
| `adminRoutes.tsx` | Lazy loading |
| `appRoutes.tsx` | Lazy loading |

#### Real Estate App Pages (18 files)
All pages need:
- Performance optimization (Rule 1.1, 2.1, 2.2)
- Accessibility audit (Rule 8.1, 8.2, 8.3)
- E2E tests (webapp-testing)

#### Restaurant App Pages (13 files)
Same requirements as Real Estate

### C.2 Features Layer (178 files)

#### Admin Features (25 files)
| Component | Key Rules |
|-----------|-----------|
| Translation forms | Accessibility, Form patterns |
| Master data selects | CVA, Accessibility |
| User lists | Performance, Data tables |

#### Settings Features (26 files)
| Component | Key Rules |
|-----------|-----------|
| Profile forms | Form validation, Accessibility |
| Payment sections | Security, Error handling |
| Preference toggles | Accessibility, State |

#### Style Guide Features (91 files)
ALL require:
- CVA variant management
- BEM styling
- Accessibility patterns
- Performance optimization
- Design system compliance

### C.3 Pages Layer (31 files)

#### Critical for E2E Testing
| Package | Files | Priority |
|---------|-------|----------|
| pages/auth | 2 | CRITICAL |
| pages/admin | 8 | HIGH |
| pages/shell | 8 | MEDIUM |
| pages/backoffice | 9 | HIGH |

---

## Part D: Implementation Tasks

### Phase 1: Critical Fixes (Week 1-2)

#### Task 1.1: Semantic Token Audit
**Status**: NOT STARTED
**Priority**: CRITICAL
**Effort**: 3-5 days

**Actions**:
- [ ] Run grep for hardcoded colors (`#[0-9a-fA-F]{3,6}`)
- [ ] Run grep for hardcoded spacing (`\d+px`)
- [ ] Create list of violations
- [ ] Fix violations in priority order

#### Task 1.2: CVA Migration
**Status**: NOT STARTED
**Priority**: CRITICAL
**Effort**: 5-7 days

**Actions**:
- [ ] Identify components with manual class concatenation
- [ ] Create types.ts with CVA variants for each
- [ ] Migrate component implementations
- [ ] Update tests

#### Task 1.3: Accessibility Quick Wins
**Status**: NOT STARTED
**Priority**: CRITICAL
**Effort**: 2-3 days

**Actions**:
- [ ] Add `aria-label` to all icon-only buttons
- [ ] Add `aria-expanded` to all expandable components
- [ ] Add `aria-live` to toast/alert components
- [ ] Fix semantic HTML (div → button, etc.)

### Phase 2: Structure & Organization (Week 3-4)

#### Task 2.1: File Structure Normalization
**Actions**:
- [ ] Create standard component folder structure
- [ ] Move styles to proper partials
- [ ] Update barrel exports

#### Task 2.2: BEM Naming Audit
**Actions**:
- [ ] Audit all SCSS for BEM compliance
- [ ] Fix non-BEM class names
- [ ] Reduce nesting to max 3 levels

### Phase 3: Performance Optimization (Week 5-6)

#### Task 3.1: Lazy Loading Heavy Components
**Components**:
- [ ] RichTextEditor
- [ ] DataTable
- [ ] Chart components
- [ ] DatePicker/TimePicker

#### Task 3.2: Import Optimization
**Actions**:
- [ ] Identify barrel import violations
- [ ] Convert to direct imports
- [ ] Update paths in all files

### Phase 4: Testing Infrastructure (Week 7-8)

#### Task 4.1: E2E Test Setup
**Actions**:
- [ ] Configure Playwright per webapp-testing skill
- [ ] Create with_server.py integration
- [ ] Set up test fixtures

#### Task 4.2: Critical Flow Tests
**Test Suites**:
- [ ] Authentication flow
- [ ] Onboarding wizard
- [ ] Settings forms
- [ ] Admin CRUD operations

### Phase 5: Export Features (Week 9-10)

#### Task 5.1: XLSX Export
**Components**:
- [ ] DataTable export
- [ ] Financial reports
- [ ] Billing history

#### Task 5.2: PDF Export
**Documents**:
- [ ] Lease agreements
- [ ] Invoices
- [ ] Legal documents

---

## Part E: Compliance Checklist

### E.1 Per-Component Checklist

For EVERY component, verify:

#### Design System Compliance
- [ ] Uses semantic tokens only
- [ ] No hardcoded values
- [ ] BEM class naming
- [ ] Max 3 nesting levels

#### CVA Compliance
- [ ] Variants defined with CVA
- [ ] VariantProps types exported
- [ ] Default variants set
- [ ] TypeScript types complete

#### Accessibility Compliance
- [ ] Semantic HTML elements
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus styles visible
- [ ] Color contrast passes

#### Performance Compliance
- [ ] No barrel imports for icons/heavy libs
- [ ] Heavy components lazy loaded
- [ ] No data fetching in useEffect (use TanStack Query)
- [ ] Memoization where appropriate

#### Structure Compliance
- [ ] Proper folder structure
- [ ] types.ts separate from component
- [ ] styles/ folder with partials
- [ ] index.ts barrel export

---

## Part F: Priority Matrix

### CRITICAL (Do First)
| Task | Impact | Effort |
|------|--------|--------|
| Semantic token migration | System-wide theming | HIGH |
| CVA migration | Type safety | HIGH |
| Icon button aria-labels | Accessibility | LOW |
| E2E auth tests | Critical flow | MEDIUM |

### HIGH (Do Second)
| Task | Impact | Effort |
|------|--------|--------|
| Performance optimization | User experience | MEDIUM |
| BEM audit | Maintainability | MEDIUM |
| Complete accessibility audit | Compliance | HIGH |

### MEDIUM (Do Third)
| Task | Impact | Effort |
|------|--------|--------|
| File structure normalization | Developer experience | MEDIUM |
| Export features | User features | MEDIUM |
| Theme factory integration | Design consistency | LOW |

---

## Appendix: Quick Reference

### Token Categories
```scss
// Colors (use these)
--color-text-{primary|secondary|tertiary|disabled}
--color-surface-{default|elevated|sunken}
--color-brand-{primary|secondary|accent}
--color-feedback-{success|error|warning|info}

// Spacing
--spacing-{0|1|2|3|4|6|8|12|16}

// Typography
--font-size-{xs|sm|base|lg|xl|2xl|3xl}
--font-weight-{regular|medium|semibold|bold}
```

### CVA Template
```tsx
import { cva, type VariantProps } from 'class-variance-authority';

export const componentVariants = cva('component', {
  variants: {
    variant: { primary: 'component--primary' },
    size: { sm: 'component--sm', md: 'component--md', lg: 'component--lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export type ComponentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof componentVariants>;
```

### BEM Cheat Sheet
```scss
.block { }              // Container
.block__element { }     // Child
.block--modifier { }    // Variation
```

---

*Document generated: 2026-01-18*
*Total Skills Referenced: 62*
*Total Components Analyzed: 280*
*Status: COMPLETE*
