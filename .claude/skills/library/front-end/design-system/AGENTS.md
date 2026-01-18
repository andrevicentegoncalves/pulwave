# Design Systems

**Abstract**: Comprehensive guide to building and maintaining scalable design systems for modern web applications. Covers design tokens, atomic component architecture, theme systems, accessibility integration, documentation patterns, and governance strategies for ensuring consistency across large teams and products.

---

## Table of Contents

1. [Design System Fundamentals](#1-design-system-fundamentals)
   - 1.1 [Design System Definition](#11-design-system-definition) (CRITICAL)
   - 1.2 [System Architecture](#12-system-architecture) (CRITICAL)
   - 1.3 [Atomic Design Principles](#13-atomic-design-principles) (CRITICAL)
   - 1.4 [System Layers](#14-system-layers) (CRITICAL)

2. [Design Tokens](#2-design-tokens)
   - 2.1 [Token Hierarchy](#21-token-hierarchy) (CRITICAL)
   - 2.2 [Semantic Tokens](#22-semantic-tokens) (CRITICAL)
   - 2.3 [Token Naming](#23-token-naming) (CRITICAL)
   - 2.4 [Token Distribution](#24-token-distribution) (HIGH)

3. [Component Architecture](#3-component-architecture)
   - 3.1 [Atoms](#31-atoms) (CRITICAL)
   - 3.2 [Molecules](#32-molecules) (CRITICAL)
   - 3.3 [Organisms](#33-organisms) (HIGH)
   - 3.4 [Templates and Pages](#34-templates-and-pages) (MEDIUM)

4. [Theme System](#4-theme-system)
   - 4.1 [Theme Architecture](#41-theme-architecture) (CRITICAL)
   - 4.2 [Light and Dark Modes](#42-light-and-dark-modes) (CRITICAL)
   - 4.3 [Multi-Tenant Theming](#43-multi-tenant-theming) (HIGH)
   - 4.4 [Theme Switching](#44-theme-switching) (HIGH)

5. [Component Patterns](#5-component-patterns)
   - 5.1 [Composition Patterns](#51-composition-patterns) (CRITICAL)
   - 5.2 [Variant Systems](#52-variant-systems) (CRITICAL)
   - 5.3 [Compound Components](#53-compound-components) (HIGH)
   - 5.4 [Polymorphic Components](#54-polymorphic-components) (HIGH)

6. [Accessibility](#6-accessibility)
   - 6.1 [Accessible by Default](#61-accessible-by-default) (CRITICAL)
   - 6.2 [ARIA Patterns](#62-aria-patterns) (CRITICAL)
   - 6.3 [Keyboard Navigation](#63-keyboard-navigation) (CRITICAL)
   - 6.4 [Screen Reader Support](#64-screen-reader-support) (CRITICAL)

7. [Documentation](#7-documentation)
   - 7.1 [Living Style Guide](#71-living-style-guide) (CRITICAL)
   - 7.2 [Component Documentation](#72-component-documentation) (CRITICAL)
   - 7.3 [Usage Guidelines](#73-usage-guidelines) (HIGH)
   - 7.4 [Do's and Don'ts](#74-dos-and-donts) (HIGH)

8. [Governance](#8-governance)
   - 8.1 [Contribution Guidelines](#81-contribution-guidelines) (HIGH)
   - 8.2 [Review Process](#82-review-process) (HIGH)
   - 8.3 [Deprecation Strategy](#83-deprecation-strategy) (HIGH)
   - 8.4 [Breaking Changes](#84-breaking-changes) (MEDIUM)

9. [Quality Assurance](#9-quality-assurance)
   - 9.1 [Visual Regression Testing](#91-visual-regression-testing) (CRITICAL)
   - 9.2 [Accessibility Testing](#92-accessibility-testing) (CRITICAL)
   - 9.3 [Component Audits](#93-component-audits) (HIGH)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [Foundation Package](#101-foundation-package) (CRITICAL)
    - 10.2 [UI Package](#102-ui-package) (CRITICAL)
    - 10.3 [Patterns Package](#103-patterns-package) (HIGH)

**Appendix**
- [A. Token Reference](#appendix-a-token-reference)
- [B. Component Checklist](#appendix-b-component-checklist)
- [C. Accessibility Checklist](#appendix-c-accessibility-checklist)
- [D. Documentation Template](#appendix-d-documentation-template)

---

## 1. Design System Fundamentals

### 1.1 Design System Definition (CRITICAL)

A design system is a collection of reusable components, guided by clear standards, that can be assembled to build applications.

**What a Design System IS**:
```
Design System = Design Tokens + Component Library + Documentation + Governance

Components:
1. Design Tokens: Visual primitives (colors, spacing, typography)
2. Component Library: Reusable UI components (Button, Input, Card)
3. Documentation: Usage guidelines, examples, best practices
4. Governance: Contribution process, review, versioning
```

**What a Design System is NOT**:
```
❌ Just a component library
❌ Just a style guide
❌ Just design tokens
❌ A one-time project

✅ A living product that evolves
✅ A shared language between design and engineering
✅ A system for building consistent UIs
```

### 1.2 System Architecture (CRITICAL)

Structure the design system in layers with clear dependencies.

**Incorrect** - Flat structure:
```
components/
├── Button.tsx
├── Card.tsx
├── Input.tsx
├── Modal.tsx
└── ... 100+ components
```

**Correct** - Layered architecture:
```
packages/
├── foundation/           # Layer 1: Design tokens, utilities
│   ├── tokens/          # Colors, spacing, typography
│   ├── utils/           # Helper functions
│   └── hooks/           # Shared hooks
│
├── ui/                  # Layer 2: Primitive components
│   ├── components/      # Atoms (Button, Input, Badge)
│   └── data-visualization/ # Charts, graphs
│
├── patterns/            # Layer 3: Compositions
│   ├── DataTable/       # Complex patterns
│   ├── Modal/
│   └── Wizard/
│
├── features/            # Layer 4: Feature components
│   ├── auth/
│   ├── profile/
│   └── properties/
│
└── experience/          # Layer 5: Page assemblies
    ├── dashboard/
    ├── settings/
    └── onboarding/
```

**Dependency Rules**:
```typescript
// ✅ Allowed dependencies (downward only)
experience → features → patterns → ui → foundation

// ❌ Forbidden dependencies (upward or sideways)
foundation → ui           // Foundation can't import ui
ui → patterns             // UI can't import patterns
features → features       // Features can't import each other
```

### 1.3 Atomic Design Principles (CRITICAL)

Follow atomic design methodology for component organization.

**Atomic Design Hierarchy**:
```
Atoms → Molecules → Organisms → Templates → Pages

Atoms:
- Button, Input, Label, Badge, Icon
- Single-purpose, indivisible components
- No dependencies on other components

Molecules:
- SearchInput (Input + Icon + Button)
- FormField (Label + Input + ErrorMessage)
- Simple combinations of atoms

Organisms:
- Header (Logo + Navigation + SearchInput + UserMenu)
- DataTable (Headers + Rows + Pagination + Filters)
- Complex, standalone sections

Templates:
- PageLayout (Header + Sidebar + Content + Footer)
- DashboardLayout
- Structure without content

Pages:
- HomePage (Template + actual content)
- DashboardPage (Template + real data)
- Full pages with real content
```

### 1.4 System Layers (CRITICAL)

Organize the system into clear, purposeful layers.

**Pulwave Layer System**:
```typescript
// Layer 1: Foundation (Design tokens + utilities)
// packages/foundation/
export const tokens = {
  color: {
    brand: { primary: 'hsl(217, 91%, 60%)' },
    text: { primary: 'hsl(220, 13%, 13%)' },
  },
  spacing: { 4: '1rem', 6: '1.5rem' },
  typography: { base: '1rem', lg: '1.125rem' },
};

// Layer 2: UI (Atoms + primitive components)
// packages/ui/components/Button/
export const Button = ({ children, variant, size }: ButtonProps) => {
  return (
    <button className={buttonVariants({ variant, size })}>
      {children}
    </button>
  );
};

// Layer 3: Patterns (Molecules + compositions)
// packages/patterns/SearchFilter/
export const SearchFilter = () => {
  return (
    <div className="search-filter">
      <Input placeholder="Search..." />
      <Button variant="primary">Search</Button>
      <Button variant="ghost">Clear</Button>
    </div>
  );
};

// Layer 4: Features (Domain-specific)
// packages/features/property/PropertyCard/
export const PropertyCard = ({ property }: Props) => {
  return (
    <Card>
      <Card.Header>
        <Badge variant={property.status}>{property.status}</Badge>
      </Card.Header>
      <Card.Body>
        <h3>{property.name}</h3>
        <p>{property.address}</p>
      </Card.Body>
    </Card>
  );
};
```

---

## 2. Design Tokens

### 2.1 Token Hierarchy (CRITICAL)

Create a three-tier token system: primitives, semantic, component.

**Token Hierarchy**:
```scss
// Tier 1: Primitives (raw values)
:root {
  // Color palette
  --color-blue-50: hsl(214, 100%, 97%);
  --color-blue-500: hsl(217, 91%, 60%);
  --color-blue-600: hsl(217, 91%, 50%);

  --color-neutral-0: hsl(0, 0%, 100%);
  --color-neutral-900: hsl(220, 13%, 13%);

  // Spacing scale
  --spacing-base: 4px;
  --spacing-1: calc(var(--spacing-base) * 1);   // 4px
  --spacing-4: calc(var(--spacing-base) * 4);   // 16px
  --spacing-6: calc(var(--spacing-base) * 6);   // 24px
}

// Tier 2: Semantic tokens (intent-based)
:root {
  // Colors
  --color-brand-primary: var(--color-blue-500);
  --color-brand-primary-hover: var(--color-blue-600);
  --color-text-primary: var(--color-neutral-900);
  --color-text-on-primary: var(--color-neutral-0);

  --color-surface-default: var(--color-neutral-0);
  --color-surface-elevated: var(--color-neutral-50);

  --color-feedback-success: var(--color-green-500);
  --color-feedback-error: var(--color-red-500);

  // Spacing
  --spacing-component-padding: var(--spacing-4);
  --spacing-section-gap: var(--spacing-6);
}

// Tier 3: Component tokens (component-specific)
:root {
  --button-padding-x: var(--spacing-4);
  --button-padding-y: var(--spacing-2);
  --button-bg-primary: var(--color-brand-primary);
  --button-text-primary: var(--color-text-on-primary);

  --card-padding: var(--spacing-6);
  --card-bg: var(--color-surface-elevated);
  --card-border-radius: var(--radius-lg);
}
```

**Usage Pattern**:
```scss
// ❌ Incorrect - Using primitives directly
.button {
  background: var(--color-blue-500);
  padding: var(--spacing-4);
}

// ✅ Correct - Using semantic tokens
.button {
  background: var(--color-brand-primary);
  padding: var(--button-padding-y) var(--button-padding-x);
}

// ✅ Best - Using component tokens
.button {
  background: var(--button-bg-primary);
  color: var(--button-text-primary);
  padding: var(--button-padding-y) var(--button-padding-x);
}
```

### 2.2 Semantic Tokens (CRITICAL)

Create semantic tokens that express intent, not appearance.

**Incorrect** - Presentational names:
```scss
:root {
  --blue-color: #3b82f6;
  --dark-gray: #1f2937;
  --light-background: #f9fafb;
  --big-spacing: 32px;
}

.button {
  background: var(--blue-color);      // What if brand changes to green?
  color: var(--dark-gray);
  padding: var(--big-spacing);
}
```

**Correct** - Semantic names:
```scss
:root {
  // Intent-based color tokens
  --color-brand-primary: hsl(217, 91%, 60%);
  --color-text-primary: hsl(220, 13%, 13%);
  --color-surface-default: hsl(0, 0%, 98%);

  // Intent-based spacing
  --spacing-component: 1rem;
  --spacing-section: 2rem;

  // Intent-based feedback
  --color-feedback-success: hsl(142, 71%, 45%);
  --color-feedback-error: hsl(0, 84%, 60%);
  --color-feedback-warning: hsl(38, 92%, 50%);
  --color-feedback-info: hsl(199, 89%, 48%);
}

// Usage expresses intent clearly
.button--primary {
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);
}

.alert--error {
  background: var(--color-feedback-error);
  color: var(--color-text-on-error);
}
```

### 2.3 Token Naming (CRITICAL)

Follow consistent naming conventions for tokens.

**Pulwave Token Naming Convention**:
```scss
// Pattern: --{category}-{property}-{variant}?-{state}?

// Colors: --color-{intent}-{variant}?-{state}?
--color-brand-primary
--color-brand-primary-hover
--color-text-primary
--color-text-secondary
--color-surface-default
--color-surface-elevated
--color-border-default
--color-border-emphasis

// Spacing: --spacing-{scale}
--spacing-0
--spacing-1   // 4px
--spacing-2   // 8px
--spacing-4   // 16px
--spacing-6   // 24px

// Typography: --{property}-{variant}
--font-size-xs
--font-size-base
--font-size-xl
--font-weight-regular
--font-weight-semibold
--line-height-tight
--line-height-base

// Component-specific: --{component}-{property}-{variant}?
--button-padding-x
--button-padding-y
--button-bg-primary
--card-padding
--card-radius
```

### 2.4 Token Distribution (HIGH)

Distribute tokens across different platforms and formats.

**Pulwave Token Distribution**:
```typescript
// packages/foundation/tokens/index.ts
export const tokens = {
  color: {
    brand: {
      primary: 'hsl(217, 91%, 60%)',
      'primary-hover': 'hsl(217, 91%, 50%)',
    },
    text: {
      primary: 'hsl(220, 13%, 13%)',
      secondary: 'hsl(220, 9%, 46%)',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    4: '1rem',
    6: '1.5rem',
  },
} as const;

// Export as CSS (for SCSS consumption)
// packages/foundation/styles/abstracts/_tokens.scss
:root {
  --color-brand-primary: hsl(217, 91%, 60%);
  --color-text-primary: hsl(220, 13%, 13%);
  --spacing-4: 1rem;
}

// Export as JSON (for documentation/tooling)
// packages/foundation/tokens/tokens.json
{
  "color": {
    "brand": {
      "primary": "hsl(217, 91%, 60%)"
    }
  }
}

// Type-safe token access
import { tokens } from '@pulwave/foundation';

const primaryColor = tokens.color.brand.primary;
```

---

## 3. Component Architecture

### 3.1 Atoms (CRITICAL)

Build single-purpose, indivisible components.

**Pulwave Atom Examples**:
```typescript
// Button - single-purpose atom
// packages/ui/components/Button/Button.tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Input - single-purpose atom
// packages/ui/components/Input/Input.tsx
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, size, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant, size, error }))}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    );
  }
);

// Badge - single-purpose atom
// packages/ui/components/Badge/Badge.tsx
export const Badge = ({ variant, size, children }: BadgeProps) => {
  return (
    <span className={badgeVariants({ variant, size })}>
      {children}
    </span>
  );
};

// Icon - single-purpose atom
// packages/ui/components/Icon/Icon.tsx
export const Icon = ({ name, size, color }: IconProps) => {
  const IconComponent = iconMap[name];
  return <IconComponent className={iconVariants({ size, color })} />;
};
```

### 3.2 Molecules (CRITICAL)

Combine atoms into simple, reusable groups.

**Pulwave Molecule Examples**:
```typescript
// SearchInput - combines Input + Icon + Button
// packages/ui/components/SearchInput/SearchInput.tsx
export const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
}: SearchInputProps) => {
  return (
    <div className="search-input">
      <Icon name="search" className="search-input__icon" />
      <Input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input__field"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          className="search-input__clear"
        >
          <Icon name="x" />
        </Button>
      )}
    </div>
  );
};

// FormField - combines Label + Input + ErrorMessage
// packages/ui/components/FormField/FormField.tsx
export const FormField = ({
  label,
  error,
  required,
  helperText,
  children,
}: FormFieldProps) => {
  return (
    <div className="form-field">
      <Label required={required} className="form-field__label">
        {label}
      </Label>
      {children}
      {helperText && !error && (
        <span className="form-field__helper">{helperText}</span>
      )}
      {error && (
        <span className="form-field__error">
          <Icon name="alert-circle" />
          {error}
        </span>
      )}
    </div>
  );
};

// AvatarWithName - combines Avatar + Text
// packages/ui/components/AvatarWithName/AvatarWithName.tsx
export const AvatarWithName = ({ user, size = 'md' }: Props) => {
  return (
    <div className="avatar-with-name">
      <Avatar src={user.avatar} alt={user.name} size={size} />
      <div className="avatar-with-name__content">
        <span className="avatar-with-name__name">{user.name}</span>
        <span className="avatar-with-name__role">{user.role}</span>
      </div>
    </div>
  );
};
```

### 3.3 Organisms (HIGH)

Build complex, standalone sections from molecules and atoms.

**Pulwave Organism Example**:
```typescript
// DataTable - complex organism
// packages/patterns/DataTable/DataTable.tsx
export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  pagination,
  filters,
  sorting,
  onRowClick,
}: DataTableProps<T>) => {
  return (
    <div className="data-table">
      {/* Header with search and filters */}
      <div className="data-table__header">
        <SearchInput
          value={filters.search}
          onChange={(value) => filters.onSearchChange(value)}
        />
        <Button variant="outlined" onClick={filters.onFilterClick}>
          <Icon name="filter" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <table className="data-table__table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id}>
                <Button
                  variant="ghost"
                  onClick={() => sorting.onSort(column.id)}
                >
                  {column.label}
                  {sorting.column === column.id && (
                    <Icon name={sorting.direction === 'asc' ? 'arrow-up' : 'arrow-down'} />
                  )}
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} onClick={() => onRowClick?.(row)}>
              {columns.map((column) => (
                <td key={column.id}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={pagination.onPageChange}
      />
    </div>
  );
};
```

### 3.4 Templates and Pages (MEDIUM)

Create layout templates and assemble pages.

**Pulwave Template Example**:
```typescript
// DashboardLayout - template
// packages/experience/layouts/DashboardLayout/DashboardLayout.tsx
export const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-layout__container">
        <Sidebar />
        <main className="dashboard-layout__content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

// DashboardPage - page (template + content)
// packages/experience/dashboard/DashboardPage/DashboardPage.tsx
export const DashboardPage = () => {
  const { data: stats } = useDashboardStats();

  return (
    <DashboardLayout>
      <PageHeader title="Dashboard" />

      <div className="dashboard-grid">
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          trend={stats.propertyTrend}
        />
        <StatCard
          title="Active Leases"
          value={stats.activeLeases}
          trend={stats.leaseTrend}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(stats.revenue)}
          trend={stats.revenueTrend}
        />
      </div>

      <DataTable
        columns={propertyColumns}
        data={stats.recentProperties}
      />
    </DashboardLayout>
  );
};
```

---

## 4. Theme System

### 4.1 Theme Architecture (CRITICAL)

Build a theme system using CSS custom properties.

**Pulwave Theme Architecture**:
```scss
// packages/foundation/styles/themes/_base.scss

// Default (light) theme
:root,
[data-theme='light'] {
  // Surface colors
  --color-surface-default: hsl(0, 0%, 100%);
  --color-surface-elevated: hsl(0, 0%, 98%);
  --color-surface-hover: hsl(0, 0%, 96%);

  // Text colors
  --color-text-primary: hsl(220, 13%, 13%);
  --color-text-secondary: hsl(220, 9%, 46%);
  --color-text-disabled: hsl(220, 9%, 66%);

  // Border colors
  --color-border-default: hsl(220, 13%, 91%);
  --color-border-emphasis: hsl(220, 13%, 80%);

  // Brand colors (same in both themes)
  --color-brand-primary: hsl(217, 91%, 60%);
  --color-brand-primary-hover: hsl(217, 91%, 50%);

  // Feedback colors
  --color-feedback-success: hsl(142, 71%, 45%);
  --color-feedback-error: hsl(0, 84%, 60%);
}

// Dark theme
[data-theme='dark'] {
  // Surface colors (inverted)
  --color-surface-default: hsl(220, 13%, 13%);
  --color-surface-elevated: hsl(220, 13%, 18%);
  --color-surface-hover: hsl(220, 13%, 23%);

  // Text colors (inverted)
  --color-text-primary: hsl(0, 0%, 98%);
  --color-text-secondary: hsl(220, 9%, 66%);
  --color-text-disabled: hsl(220, 9%, 46%);

  // Border colors (adjusted)
  --color-border-default: hsl(220, 13%, 23%);
  --color-border-emphasis: hsl(220, 13%, 33%);

  // Brand colors (adjusted for dark)
  --color-brand-primary: hsl(217, 91%, 70%);
  --color-brand-primary-hover: hsl(217, 91%, 60%);

  // Feedback colors (adjusted)
  --color-feedback-success: hsl(142, 71%, 55%);
  --color-feedback-error: hsl(0, 84%, 70%);
}
```

### 4.2 Light and Dark Modes (CRITICAL)

Implement theme switching with proper contrast.

**Pulwave Theme Switching**:
```typescript
// packages/foundation/hooks/useTheme.ts
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme };
};

// Component usage
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </Button>
  );
};
```

### 4.3 Multi-Tenant Theming (HIGH)

Support multiple brand themes for different tenants.

**Pulwave Multi-Tenant Theming**:
```scss
// Base theme structure
[data-tenant='default'] {
  --color-brand-primary: hsl(217, 91%, 60%);
  --color-brand-secondary: hsl(217, 91%, 40%);
}

[data-tenant='acme'] {
  --color-brand-primary: hsl(142, 71%, 45%);    // Green
  --color-brand-secondary: hsl(142, 71%, 35%);
}

[data-tenant='globex'] {
  --color-brand-primary: hsl(271, 76%, 53%);    // Purple
  --color-brand-secondary: hsl(271, 76%, 43%);
}
```

```typescript
// Set tenant theme
export const setTenantTheme = (tenantId: string) => {
  document.documentElement.setAttribute('data-tenant', tenantId);
};
```

### 4.4 Theme Switching (HIGH)

Implement smooth theme transitions.

```scss
// Transition theme changes smoothly
:root {
  transition: background-color 200ms ease, color 200ms ease;
}

// Prevent transition on page load
:root.no-transitions * {
  transition: none !important;
}
```

```typescript
// Prevent flash of unstyled content
const ThemeProvider = ({ children }: Props) => {
  useEffect(() => {
    // Remove no-transitions class after mount
    document.documentElement.classList.remove('no-transitions');
  }, []);

  return <>{children}</>;
};
```

---

## 10. Pulwave Integration

### 10.1 Foundation Package (CRITICAL)

Structure the foundation package for design system primitives.

**packages/foundation/**:
```
foundation/
├── tokens/
│   ├── colors.ts        # Color primitives
│   ├── spacing.ts       # Spacing scale
│   ├── typography.ts    # Typography scale
│   └── index.ts         # All tokens
│
├── styles/
│   ├── abstracts/
│   │   ├── _tokens.scss      # CSS custom properties
│   │   ├── _variables.scss   # SCSS variables
│   │   ├── _mixins.scss      # Mixins
│   │   └── _functions.scss   # Functions
│   ├── base/
│   │   ├── _reset.scss
│   │   └── _global.scss
│   └── themes/
│       ├── _light.scss
│       └── _dark.scss
│
├── utils/
│   ├── cn.ts            # Class name utility
│   └── index.ts
│
├── hooks/
│   ├── useTheme.ts
│   ├── useMediaQuery.ts
│   └── index.ts
│
└── index.ts             # Package exports
```

### 10.2 UI Package (CRITICAL)

Organize the UI component library.

**packages/ui/**:
```
ui/
├── components/          # All components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── styles/
│   │       ├── _index.scss
│   │       └── partials/
│   ├── Input/
│   ├── Card/
│   └── ... 91 components
│
├── data-visualization/  # Charts
│   ├── BarChart/
│   ├── LineChart/
│   └── PieChart/
│
└── index.ts            # Barrel exports
```

### 10.3 Patterns Package (HIGH)

Create reusable composition patterns.

**packages/patterns/**:
```
patterns/
├── DataTable/
├── Modal/
├── Wizard/
├── SearchFilter/
└── index.ts
```

---

## Appendix A: Token Reference

```typescript
// Complete token system
export const tokens = {
  color: {
    // Brand
    brand: {
      primary: 'hsl(217, 91%, 60%)',
      'primary-hover': 'hsl(217, 91%, 50%)',
    },

    // Text
    text: {
      primary: 'hsl(220, 13%, 13%)',
      secondary: 'hsl(220, 9%, 46%)',
      disabled: 'hsl(220, 9%, 66%)',
      'on-primary': 'hsl(0, 0%, 100%)',
    },

    // Surface
    surface: {
      default: 'hsl(0, 0%, 100%)',
      elevated: 'hsl(0, 0%, 98%)',
      hover: 'hsl(0, 0%, 96%)',
    },

    // Feedback
    feedback: {
      success: 'hsl(142, 71%, 45%)',
      error: 'hsl(0, 84%, 60%)',
      warning: 'hsl(38, 92%, 50%)',
      info: 'hsl(199, 89%, 48%)',
    },
  },

  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  },

  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      base: 1.5,
      relaxed: 1.75,
    },
  },
} as const;
```

## Appendix B: Component Checklist

```markdown
# Component Checklist

## API Design
- [ ] Props follow naming conventions
- [ ] TypeScript types are exported
- [ ] Variants use CVA
- [ ] className prop is supported
- [ ] Ref forwarding is implemented

## Accessibility
- [ ] Semantic HTML elements used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Screen reader tested

## Documentation
- [ ] Props documented with JSDoc
- [ ] Usage examples provided
- [ ] Do's and Don'ts listed
- [ ] Accessibility notes included

## Testing
- [ ] Unit tests written
- [ ] Visual regression tests added
- [ ] Accessibility tests pass

## Code Quality
- [ ] No hardcoded values (uses tokens)
- [ ] BEM naming in SCSS
- [ ] No circular dependencies
- [ ] Performance optimized
```

## Appendix C: Accessibility Checklist

```markdown
# Accessibility Checklist

## Semantic HTML
- [ ] Correct HTML elements used (button, input, etc.)
- [ ] Headings in logical order (h1 → h2 → h3)
- [ ] Lists use <ul>/<ol>/<li>
- [ ] Forms use <form> element

## ARIA
- [ ] ARIA labels on interactive elements
- [ ] ARIA roles where needed
- [ ] ARIA states (aria-expanded, aria-checked)
- [ ] Live regions for dynamic content

## Keyboard
- [ ] All interactive elements focusable
- [ ] Logical tab order
- [ ] Keyboard shortcuts documented
- [ ] Focus trap in modals

## Visual
- [ ] Color contrast 4.5:1 (AA)
- [ ] Focus indicators visible
- [ ] Text resizable to 200%
- [ ] No information by color alone

## Screen Reader
- [ ] Tested with NVDA/JAWS/VoiceOver
- [ ] Skip links provided
- [ ] Image alt text meaningful
- [ ] Form errors announced
```

## Appendix D: Documentation Template

```markdown
# Component Name

Brief description of what this component does.

## Usage

\`\`\`tsx
import { ComponentName } from '@pulwave/ui';

<ComponentName variant="primary" size="md">
  Content
</ComponentName>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size variant |

## Examples

### Basic
[Example code]

### With Icon
[Example code]

## Accessibility

- Uses semantic <button> element
- Keyboard accessible with Tab
- Screen reader friendly

## Do's and Don'ts

✅ DO use for primary actions
❌ DON'T use more than one primary button per section
```

---

**Impact Levels Summary**:
- **CRITICAL** (26): System architecture, tokens, component structure, themes, accessibility, documentation
- **HIGH** (14): Token distribution, organisms, theme switching, governance, testing, patterns
- **MEDIUM** (3): Templates, breaking changes, component-specific
- **LOW** (0): None

**Total Patterns**: 45+ comprehensive design system patterns
