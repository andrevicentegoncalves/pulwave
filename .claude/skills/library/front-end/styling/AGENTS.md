# SCSS/Sass Styling Architecture

**Abstract**: Comprehensive guide to building maintainable, scalable stylesheets using SCSS/Sass with BEM methodology, design tokens, and modular architecture. Covers the complete styling workflow from token definition through component styling, responsive design, and build optimization.

---

## Table of Contents

1. [Architecture Fundamentals](#1-architecture-fundamentals)
   - 1.1 [7-1 Pattern](#11-7-1-pattern) (CRITICAL)
   - 1.2 [File Organization](#12-file-organization) (CRITICAL)
   - 1.3 [Import Order](#13-import-order) (HIGH)
   - 1.4 [Partial Naming](#14-partial-naming) (MEDIUM)

2. [Design Tokens](#2-design-tokens)
   - 2.1 [Token Definition](#21-token-definition) (CRITICAL)
   - 2.2 [Spacing Scale](#22-spacing-scale) (CRITICAL)
   - 2.3 [Color System](#23-color-system) (CRITICAL)
   - 2.4 [Typography Scale](#24-typography-scale) (CRITICAL)
   - 2.5 [Border and Shadow Tokens](#25-border-and-shadow-tokens) (HIGH)

3. [BEM Methodology](#3-bem-methodology)
   - 3.1 [BEM Naming Convention](#31-bem-naming-convention) (CRITICAL)
   - 3.2 [Block Patterns](#32-block-patterns) (CRITICAL)
   - 3.3 [Element Patterns](#33-element-patterns) (CRITICAL)
   - 3.4 [Modifier Patterns](#34-modifier-patterns) (CRITICAL)
   - 3.5 [Nesting Guidelines](#35-nesting-guidelines) (HIGH)

4. [Component Styling](#4-component-styling)
   - 4.1 [Component Structure](#41-component-structure) (CRITICAL)
   - 4.2 [Base Styles](#42-base-styles) (CRITICAL)
   - 4.3 [Variants](#43-variants) (CRITICAL)
   - 4.4 [States](#44-states) (HIGH)
   - 4.5 [Responsive Components](#45-responsive-components) (HIGH)

5. [Mixins and Functions](#5-mixins-and-functions)
   - 5.1 [Breakpoint Mixins](#51-breakpoint-mixins) (CRITICAL)
   - 5.2 [Layout Mixins](#52-layout-mixins) (HIGH)
   - 5.3 [Typography Mixins](#53-typography-mixins) (HIGH)
   - 5.4 [Custom Functions](#54-custom-functions) (MEDIUM)

6. [Responsive Design](#6-responsive-design)
   - 6.1 [Mobile-First Approach](#61-mobile-first-approach) (CRITICAL)
   - 6.2 [Breakpoint System](#62-breakpoint-system) (CRITICAL)
   - 6.3 [Container Queries](#63-container-queries) (HIGH)
   - 6.4 [Fluid Typography](#64-fluid-typography) (HIGH)

7. [Performance](#7-performance)
   - 7.1 [Build Optimization](#71-build-optimization) (CRITICAL)
   - 7.2 [Selector Performance](#72-selector-performance) (HIGH)
   - 7.3 [Critical CSS](#73-critical-css) (HIGH)
   - 7.4 [Tree Shaking](#74-tree-shaking) (MEDIUM)

8. [Advanced Patterns](#8-advanced-patterns)
   - 8.1 [Theme Switching](#81-theme-switching) (HIGH)
   - 8.2 [RTL Support](#82-rtl-support) (HIGH)
   - 8.3 [CSS-in-JS Integration](#83-css-in-js-integration) (MEDIUM)
   - 8.4 [CSS Custom Properties](#84-css-custom-properties) (HIGH)

9. [Testing and Quality](#9-testing-and-quality)
   - 9.1 [Stylelint Configuration](#91-stylelint-configuration) (CRITICAL)
   - 9.2 [Visual Regression Testing](#92-visual-regression-testing) (HIGH)
   - 9.3 [Accessibility Testing](#93-accessibility-testing) (CRITICAL)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [Foundation Package](#101-foundation-package) (CRITICAL)
    - 10.2 [UI Component Styles](#102-ui-component-styles) (CRITICAL)
    - 10.3 [Build Pipeline](#103-build-pipeline) (HIGH)

**Appendix**
- [A. Complete Token Reference](#appendix-a-complete-token-reference)
- [B. BEM Cheat Sheet](#appendix-b-bem-cheat-sheet)
- [C. Mixin Library](#appendix-c-mixin-library)
- [D. Stylelint Rules](#appendix-d-stylelint-rules)
- [E. Migration Guide](#appendix-e-migration-guide)

---

## 1. Architecture Fundamentals

### 1.1 7-1 Pattern (CRITICAL)

The 7-1 pattern organizes SCSS into 7 folders and 1 main file.

**Incorrect** - Flat structure:
```scss
// All in one directory
styles/
├── button.scss
├── card.scss
├── colors.scss
├── spacing.scss
├── main.scss
```

**Correct** - 7-1 pattern:
```scss
// packages/foundation/styles/
abstracts/
├── _variables.scss
├── _functions.scss
├── _mixins.scss
├── _tokens.scss

base/
├── _reset.scss
├── _typography.scss
├── _global.scss

components/
├── _button.scss
├── _card.scss
├── _input.scss

layout/
├── _header.scss
├── _sidebar.scss
├── _grid.scss

pages/
├── _home.scss
├── _dashboard.scss

themes/
├── _dark.scss
├── _light.scss

utilities/
├── _helpers.scss
├── _spacing.scss

main.scss  // Main entry point
```

**main.scss**:
```scss
// 1. Abstracts (variables, functions, mixins - no CSS output)
@import 'abstracts/tokens';
@import 'abstracts/variables';
@import 'abstracts/functions';
@import 'abstracts/mixins';

// 2. Base (resets, typography, global styles)
@import 'base/reset';
@import 'base/typography';
@import 'base/global';

// 3. Layout (grid, header, footer, sidebar)
@import 'layout/grid';
@import 'layout/header';
@import 'layout/sidebar';

// 4. Components (buttons, cards, forms)
@import 'components/button';
@import 'components/card';
@import 'components/input';

// 5. Pages (page-specific styles)
@import 'pages/home';
@import 'pages/dashboard';

// 6. Themes (theme variations)
@import 'themes/dark';
@import 'themes/light';

// 7. Utilities (helper classes)
@import 'utilities/helpers';
@import 'utilities/spacing';
```

### 1.2 File Organization (CRITICAL)

Organize files by feature, not by type.

**Incorrect** - By type:
```scss
// packages/ui/components/Button/styles/
_colors.scss
_sizes.scss
_variants.scss
_states.scss
```

**Correct** - By feature with clear separation:
```scss
// packages/ui/components/Button/styles/
_index.scss           // Main entry, imports all partials

partials/
├── _base.scss        // Base button styles
├── _variants.scss    // Primary, outlined, ghost
├── _sizes.scss       // Small, medium, large
├── _states.scss      // Hover, active, disabled, focus
```

**_index.scss**:
```scss
// Import order: base → variants → sizes → states
@import './partials/base';
@import './partials/variants';
@import './partials/sizes';
@import './partials/states';
```

**partials/_base.scss**:
```scss
.btn {
  // Layout
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // Spacing (use tokens)
  padding: var(--spacing-2) var(--spacing-4);
  gap: var(--spacing-2);

  // Typography
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-base);

  // Visual
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: inherit;

  // Interaction
  cursor: pointer;
  transition: var(--transition-colors);
  user-select: none;

  // Accessibility
  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
```

### 1.3 Import Order (HIGH)

Always import in the correct order to prevent specificity issues.

**Incorrect** - Random order:
```scss
@import 'components/button';
@import 'abstracts/variables';
@import 'utilities/helpers';
@import 'base/reset';
```

**Correct** - Logical cascade:
```scss
// 1. Configuration (no output)
@import 'abstracts/tokens';
@import 'abstracts/variables';
@import 'abstracts/functions';
@import 'abstracts/mixins';

// 2. Foundation (low specificity)
@import 'base/reset';
@import 'base/typography';

// 3. Layout (medium specificity)
@import 'layout/grid';
@import 'layout/container';

// 4. Components (high specificity)
@import 'components/button';
@import 'components/card';

// 5. Utilities (highest specificity)
@import 'utilities/helpers';
```

### 1.4 Partial Naming (MEDIUM)

Use underscore prefix for partials that shouldn't compile independently.

**Incorrect** - No underscore:
```scss
// abstracts/variables.scss (will compile to variables.css)
```

**Correct** - Underscore prefix:
```scss
// abstracts/_variables.scss (won't compile independently)
```

---

## 2. Design Tokens

### 2.1 Token Definition (CRITICAL)

Define all design values as tokens using CSS custom properties.

**Incorrect** - Hard-coded values:
```scss
.card {
  padding: 16px;
  margin: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

**Correct** - Token-based:
```scss
// packages/foundation/styles/abstracts/_tokens.scss
:root {
  // Spacing tokens
  --spacing-0: 0;
  --spacing-1: 0.25rem;  // 4px
  --spacing-2: 0.5rem;   // 8px
  --spacing-3: 0.75rem;  // 12px
  --spacing-4: 1rem;     // 16px
  --spacing-6: 1.5rem;   // 24px

  // Color tokens
  --color-surface-default: hsl(0, 0%, 100%);
  --color-surface-elevated: hsl(0, 0%, 98%);
  --color-shadow-default: hsl(0, 0%, 0%, 0.1);

  // Radius tokens
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}

// Usage
.card {
  padding: var(--spacing-4);
  margin: var(--spacing-6);
  background: var(--color-surface-default);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 4px var(--color-shadow-default);
}
```

### 2.2 Spacing Scale (CRITICAL)

Use a consistent spacing scale based on a base unit.

**Incorrect** - Random values:
```scss
.component {
  padding: 7px 13px;
  margin: 19px 0;
  gap: 11px;
}
```

**Correct** - Scale-based spacing:
```scss
// Foundation tokens
:root {
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
}

// Usage
.component {
  padding: var(--spacing-2) var(--spacing-3);
  margin: var(--spacing-5) 0;
  gap: var(--spacing-3);
}
```

### 2.3 Color System (CRITICAL)

Use semantic color tokens that map to primitive colors.

**Incorrect** - Direct color usage:
```scss
.button--primary {
  background: #3b82f6;
  color: #ffffff;
}

.text {
  color: #1f2937;
}
```

**Correct** - Semantic tokens:
```scss
// 1. Primitive colors (palette)
:root {
  --color-blue-50: hsl(214, 100%, 97%);
  --color-blue-500: hsl(217, 91%, 60%);
  --color-blue-600: hsl(217, 91%, 50%);
  --color-neutral-900: hsl(220, 13%, 13%);
  --color-neutral-0: hsl(0, 0%, 100%);
}

// 2. Semantic tokens (use these)
:root {
  --color-brand-primary: var(--color-blue-500);
  --color-brand-primary-hover: var(--color-blue-600);
  --color-text-primary: var(--color-neutral-900);
  --color-text-on-primary: var(--color-neutral-0);
}

// 3. Theme variants
[data-theme='dark'] {
  --color-text-primary: var(--color-neutral-0);
  --color-brand-primary: var(--color-blue-400);
}

// Usage
.button--primary {
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);

  &:hover {
    background: var(--color-brand-primary-hover);
  }
}

.text {
  color: var(--color-text-primary);
}
```

### 2.4 Typography Scale (CRITICAL)

Define a modular typography scale.

**Incorrect** - Arbitrary font sizes:
```scss
h1 { font-size: 34px; }
h2 { font-size: 27px; }
.lead { font-size: 19px; }
```

**Correct** - Modular scale:
```scss
// Foundation tokens
:root {
  // Font size scale
  --font-size-xs: 0.75rem;    // 12px
  --font-size-sm: 0.875rem;   // 14px
  --font-size-base: 1rem;     // 16px
  --font-size-lg: 1.125rem;   // 18px
  --font-size-xl: 1.25rem;    // 20px
  --font-size-2xl: 1.5rem;    // 24px
  --font-size-3xl: 1.875rem;  // 30px
  --font-size-4xl: 2.25rem;   // 36px

  // Font weight
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  // Line height
  --line-height-tight: 1.25;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;
}

// Usage
h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.lead {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
}
```

### 2.5 Border and Shadow Tokens (HIGH)

Standardize borders, radii, and shadows.

**Incorrect** - Inline definitions:
```scss
.card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

**Correct** - Token system:
```scss
// Foundation tokens
:root {
  // Border tokens
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;

  // Radius tokens
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  // Shadow tokens
  --shadow-sm: 0 1px 2px 0 hsl(0, 0%, 0%, 0.05);
  --shadow-md: 0 4px 6px -1px hsl(0, 0%, 0%, 0.1);
  --shadow-lg: 0 10px 15px -3px hsl(0, 0%, 0%, 0.1);
  --shadow-xl: 0 20px 25px -5px hsl(0, 0%, 0%, 0.1);
}

// Usage
.card {
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
```

---

## 3. BEM Methodology

### 3.1 BEM Naming Convention (CRITICAL)

Follow strict BEM: Block__Element--Modifier.

**Incorrect** - Non-BEM naming:
```scss
.card {
  .title { }
  .image { }
  .primary { }
}
```

**Correct** - BEM naming:
```scss
.card {
  // Block base styles

  // Elements
  &__header { }
  &__title { }
  &__image { }
  &__body { }
  &__footer { }

  // Modifiers
  &--primary { }
  &--outlined { }
  &--elevated { }
}
```

### 3.2 Block Patterns (CRITICAL)

The block represents a standalone component.

**Incorrect** - Nested blocks:
```scss
.sidebar {
  .nav {
    .item {
      .link { }
    }
  }
}
```

**Correct** - Independent blocks:
```scss
// Block: sidebar
.sidebar {
  padding: var(--spacing-4);
}

// Block: nav (independent)
.nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);

  &__item { }
  &__link { }
}
```

### 3.3 Element Patterns (CRITICAL)

Elements belong to a block and can't exist independently.

**Incorrect** - Element with modifier on wrong level:
```scss
.card {
  &__title--large { }  // Wrong level
}

.card__title {
  &--large { }  // Correct level but wrong nesting
}
```

**Correct** - Modifier on block with element context:
```scss
.card {
  &__title {
    font-size: var(--font-size-lg);
  }

  // Modifier affects the card, which changes title
  &--large &__title {
    font-size: var(--font-size-2xl);
  }
}

// Or use element modifier if truly element-specific
.card {
  &__title {
    font-size: var(--font-size-lg);

    &--large {
      font-size: var(--font-size-2xl);
    }
  }
}
```

### 3.4 Modifier Patterns (CRITICAL)

Modifiers change appearance, behavior, or state.

**Incorrect** - Boolean attributes as classes:
```scss
.button.disabled { }
.button.loading { }
```

**Correct** - BEM modifiers:
```scss
.btn {
  // Base styles
  padding: var(--spacing-2) var(--spacing-4);

  // Visual modifiers
  &--primary {
    background: var(--color-brand-primary);
    color: var(--color-text-on-primary);
  }

  &--outlined {
    background: transparent;
    border: var(--border-width-thin) solid var(--color-border-default);
  }

  // Size modifiers
  &--sm {
    padding: var(--spacing-1) var(--spacing-2);
    font-size: var(--font-size-sm);
  }

  &--lg {
    padding: var(--spacing-3) var(--spacing-6);
    font-size: var(--font-size-lg);
  }

  // State modifiers
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &--loading {
    position: relative;
    color: transparent;
  }
}
```

### 3.5 Nesting Guidelines (HIGH)

Keep nesting shallow (max 3 levels).

**Incorrect** - Deep nesting:
```scss
.sidebar {
  .nav {
    .list {
      .item {
        .link {
          .icon {
            color: red;  // 6 levels deep
          }
        }
      }
    }
  }
}
```

**Correct** - Flat BEM:
```scss
// Block: sidebar
.sidebar {
  padding: var(--spacing-4);
}

// Block: nav
.nav {
  &__list {
    list-style: none;
    padding: 0;
  }

  &__item {
    &:not(:last-child) {
      margin-bottom: var(--spacing-2);
    }
  }

  &__link {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  &__icon {
    color: var(--color-text-secondary);
  }
}
```

---

## 4. Component Styling

### 4.1 Component Structure (CRITICAL)

Organize component styles with clear separation of concerns.

**Pulwave Example**:
```scss
// packages/ui/components/Button/styles/_index.scss
@import './partials/base';
@import './partials/variants';
@import './partials/sizes';
@import './partials/states';

// partials/_base.scss
.btn {
  // Reset
  appearance: none;
  border: none;
  background: none;

  // Layout
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // Spacing
  padding: var(--spacing-2) var(--spacing-4);
  gap: var(--spacing-2);

  // Typography
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  text-decoration: none;

  // Visual
  border-radius: var(--radius-md);
  transition: var(--transition-colors);

  // Interaction
  cursor: pointer;
  user-select: none;

  // Elements
  &__icon {
    flex-shrink: 0;
    width: 1em;
    height: 1em;
  }

  &__label {
    flex: 1;
  }
}

// partials/_variants.scss
.btn--primary {
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);

  &:hover:not(:disabled) {
    background: var(--color-brand-primary-hover);
  }
}

.btn--outlined {
  background: transparent;
  border: var(--border-width-thin) solid var(--color-border-default);
  color: var(--color-text-primary);

  &:hover:not(:disabled) {
    background: var(--color-surface-hover);
  }
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-primary);

  &:hover:not(:disabled) {
    background: var(--color-surface-hover);
  }
}

// partials/_sizes.scss
.btn--sm {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
}

.btn--md {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
}

.btn--lg {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-lg);
}

// partials/_states.scss
.btn {
  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  &:disabled,
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &--loading {
    position: relative;
    color: transparent;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: var(--radius-full);
      animation: spin 0.6s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

### 4.2 Base Styles (CRITICAL)

Define base styles that all variants inherit.

**Incorrect** - Duplicating base styles:
```scss
.btn--primary {
  display: inline-flex;
  padding: 1rem;
  border-radius: 0.5rem;
  background: blue;
}

.btn--outlined {
  display: inline-flex;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid gray;
}
```

**Correct** - Shared base:
```scss
.btn {
  // Shared base styles
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: var(--transition-colors);
  cursor: pointer;
}

.btn--primary {
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);
}

.btn--outlined {
  background: transparent;
  border: var(--border-width-thin) solid var(--color-border-default);
}
```

### 4.3 Variants (CRITICAL)

Create variant modifiers for different visual styles.

**Pulwave Card Example**:
```scss
// packages/ui/components/Card/styles/partials/_variants.scss
.card {
  // Default variant
  background: var(--color-surface-default);
  border: var(--border-width-thin) solid var(--color-border-default);

  // Elevated variant (with shadow)
  &--elevated {
    background: var(--color-surface-elevated);
    border: none;
    box-shadow: var(--shadow-md);
  }

  // Outlined variant (emphasized border)
  &--outlined {
    background: transparent;
    border: var(--border-width-medium) solid var(--color-border-emphasis);
  }

  // Ghost variant (no background/border)
  &--ghost {
    background: transparent;
    border: none;
  }

  // Interactive variant (hover effect)
  &--interactive {
    cursor: pointer;
    transition: var(--transition-all);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
}
```

### 4.4 States (HIGH)

Handle interactive states consistently.

**Incorrect** - Inconsistent state handling:
```scss
.btn:hover { background: blue; }
.btn.active { background: darkblue; }
.btn[disabled] { opacity: 0.5; }
```

**Correct** - Systematic states:
```scss
.btn {
  // Default state
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);

  // Hover state (not disabled)
  &:hover:not(:disabled) {
    background: var(--color-brand-primary-hover);
  }

  // Active/pressed state
  &:active:not(:disabled) {
    background: var(--color-brand-primary-active);
    transform: scale(0.98);
  }

  // Focus state (keyboard navigation)
  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  // Disabled state
  &:disabled,
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  // Loading state
  &--loading {
    position: relative;
    color: transparent;
    pointer-events: none;
  }
}
```

### 4.5 Responsive Components (HIGH)

Make components responsive with breakpoint-specific styles.

**Incorrect** - Media queries everywhere:
```scss
.card {
  padding: 16px;

  @media (min-width: 768px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
}
```

**Correct** - Mixin-based breakpoints:
```scss
// abstracts/_mixins.scss
@mixin breakpoint($size) {
  @if $size == 'sm' {
    @media (min-width: 640px) { @content; }
  } @else if $size == 'md' {
    @media (min-width: 768px) { @content; }
  } @else if $size == 'lg' {
    @media (min-width: 1024px) { @content; }
  } @else if $size == 'xl' {
    @media (min-width: 1280px) { @content; }
  }
}

// Component usage
.card {
  padding: var(--spacing-4);  // Mobile first

  @include breakpoint('md') {
    padding: var(--spacing-6);
  }

  @include breakpoint('lg') {
    padding: var(--spacing-8);
  }
}
```

---

## 5. Mixins and Functions

### 5.1 Breakpoint Mixins (CRITICAL)

Create reusable breakpoint mixins for responsive design.

**Incorrect** - Inline media queries:
```scss
.component {
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 20px;
  }
}
```

**Correct** - Breakpoint system:
```scss
// packages/foundation/styles/abstracts/_mixins.scss

// Breakpoint tokens
$breakpoints: (
  'xs': 480px,
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px,
);

// Min-width breakpoint
@mixin breakpoint($size) {
  $width: map-get($breakpoints, $size);
  @media (min-width: $width) {
    @content;
  }
}

// Max-width breakpoint
@mixin breakpoint-max($size) {
  $width: map-get($breakpoints, $size);
  @media (max-width: $width - 1px) {
    @content;
  }
}

// Between breakpoints
@mixin breakpoint-between($min, $max) {
  $min-width: map-get($breakpoints, $min);
  $max-width: map-get($breakpoints, $max);
  @media (min-width: $min-width) and (max-width: $max-width - 1px) {
    @content;
  }
}

// Usage
.component {
  padding: var(--spacing-4);

  @include breakpoint('md') {
    padding: var(--spacing-6);
  }

  @include breakpoint('lg') {
    padding: var(--spacing-8);
  }

  @include breakpoint-between('md', 'lg') {
    background: var(--color-surface-elevated);
  }
}
```

### 5.2 Layout Mixins (HIGH)

Create mixins for common layout patterns.

**Pulwave Layout Mixins**:
```scss
// packages/foundation/styles/abstracts/_mixins.scss

// Flexbox center
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Flex column with gap
@mixin flex-column($gap: var(--spacing-4)) {
  display: flex;
  flex-direction: column;
  gap: $gap;
}

// Container with max-width
@mixin container($max-width: 1280px) {
  width: 100%;
  max-width: $max-width;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);

  @include breakpoint('md') {
    padding-left: var(--spacing-6);
    padding-right: var(--spacing-6);
  }
}

// Aspect ratio
@mixin aspect-ratio($width, $height) {
  aspect-ratio: $width / $height;

  @supports not (aspect-ratio: 1) {
    position: relative;

    &::before {
      content: '';
      display: block;
      padding-top: percentage($height / $width);
    }

    & > * {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}

// Usage
.hero {
  @include container;
  @include flex-center;
}

.card-grid {
  @include flex-column(var(--spacing-6));
}

.video-container {
  @include aspect-ratio(16, 9);
}
```

### 5.3 Typography Mixins (HIGH)

Standardize typography styles with mixins.

**Pulwave Typography Mixins**:
```scss
// packages/foundation/styles/abstracts/_mixins.scss

// Heading styles
@mixin heading-1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

@mixin heading-2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

@mixin heading-3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-base);
}

// Body text
@mixin body-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-relaxed);
}

// Text truncation
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// Usage
h1 {
  @include heading-1;
}

.card__title {
  @include heading-3;
  @include truncate;
}

.description {
  @include body-text;
  @include line-clamp(3);
}
```

### 5.4 Custom Functions (MEDIUM)

Create helper functions for calculations.

**Pulwave Functions**:
```scss
// packages/foundation/styles/abstracts/_functions.scss

// Convert px to rem
@function px-to-rem($px, $base: 16px) {
  @return calc($px / $base) * 1rem;
}

// Get spacing value
@function spacing($multiplier) {
  @return calc(var(--spacing-1) * $multiplier);
}

// Lighten/darken colors (HSL-based)
@function lighten-hsl($color, $amount) {
  @return adjust-color($color, $lightness: $amount);
}

// Usage
.component {
  padding: px-to-rem(24px);
  margin: spacing(6);
  background: lighten-hsl(var(--color-brand-primary), 10%);
}
```

---

## 6. Responsive Design

### 6.1 Mobile-First Approach (CRITICAL)

Always start with mobile styles and enhance for larger screens.

**Incorrect** - Desktop first:
```scss
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

**Correct** - Mobile first:
```scss
.grid {
  // Mobile (default)
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);

  // Tablet
  @include breakpoint('md') {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-6);
  }

  // Desktop
  @include breakpoint('lg') {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-8);
  }
}
```

### 6.2 Breakpoint System (CRITICAL)

Use a consistent breakpoint system across the application.

**Pulwave Breakpoint System**:
```scss
// packages/foundation/styles/abstracts/_tokens.scss
:root {
  --breakpoint-xs: 480px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

// packages/foundation/styles/abstracts/_mixins.scss
$breakpoints: (
  'xs': 480px,
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px,
);

@mixin breakpoint($size) {
  $width: map-get($breakpoints, $size);
  @media (min-width: $width) {
    @content;
  }
}

// Usage example
.container {
  padding: var(--spacing-4);

  @include breakpoint('md') {
    padding: var(--spacing-6);
  }

  @include breakpoint('lg') {
    padding: var(--spacing-8);
    max-width: 1280px;
    margin: 0 auto;
  }
}
```

### 6.3 Container Queries (HIGH)

Use container queries for component-based responsive design.

**Pulwave Container Query Example**:
```scss
// Card that adapts to its container
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  padding: var(--spacing-4);

  &__header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  &__image {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  // When container is >= 500px, use horizontal layout
  @container card (min-width: 500px) {
    &__header {
      flex-direction: row;
      align-items: center;
    }

    &__image {
      aspect-ratio: 4 / 3;
    }
  }
}
```

### 6.4 Fluid Typography (HIGH)

Implement fluid typography that scales smoothly.

**Incorrect** - Fixed breakpoints:
```scss
h1 {
  font-size: 24px;

  @media (min-width: 768px) {
    font-size: 32px;
  }

  @media (min-width: 1024px) {
    font-size: 40px;
  }
}
```

**Correct** - Fluid typography:
```scss
// Function to calculate fluid size
@function fluid-size($min, $max, $min-vw: 320px, $max-vw: 1280px) {
  $slope: calc(($max - $min) / ($max-vw - $min-vw));
  $base: $min - $slope * $min-vw;

  @return clamp(#{$min}, #{$base} + #{$slope * 100vw}, #{$max});
}

// Usage
h1 {
  font-size: fluid-size(1.5rem, 2.5rem);
}

h2 {
  font-size: fluid-size(1.25rem, 2rem);
}

.hero__title {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

---

## 7. Performance

### 7.1 Build Optimization (CRITICAL)

Optimize SCSS compilation and output.

**Pulwave Vite Configuration**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Include paths for @import
        includePaths: [resolve(__dirname, 'packages/foundation/styles')],

        // Use modern Sass API
        api: 'modern-compiler',

        // Additional data (global imports)
        additionalData: `
          @import 'abstracts/tokens';
          @import 'abstracts/variables';
          @import 'abstracts/functions';
          @import 'abstracts/mixins';
        `,
      },
    },

    // PostCSS configuration
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({
          preset: ['default', {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
          }],
        }),
      ],
    },
  },
});
```

### 7.2 Selector Performance (HIGH)

Write performant selectors.

**Incorrect** - Slow selectors:
```scss
// Universal selector
* { box-sizing: border-box; }

// Deep nesting
.sidebar .nav .list .item .link { }

// Attribute selectors on every element
*[data-theme] { }

// Complex pseudo-selectors
:not(.btn):not(.link):not(.card) { }
```

**Correct** - Performant selectors:
```scss
// Scoped universal selector
*,
*::before,
*::after {
  box-sizing: border-box;
}

// Flat BEM selectors
.nav__link { }

// Targeted attribute selectors
[data-theme='dark'] {
  // Theme-specific styles
}

// Simple pseudo-selectors
.btn:not(:disabled) { }
```

### 7.3 Critical CSS (HIGH)

Extract critical above-the-fold CSS.

**Pulwave Critical CSS Strategy**:
```typescript
// vite.config.ts with critical CSS plugin
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(?:css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'css-cache',
            },
          },
        ],
      },
    }),
  ],

  build: {
    cssCodeSplit: true,  // Split CSS by route
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor CSS
          'vendor-styles': ['normalize.css'],
        },
      },
    },
  },
});
```

### 7.4 Tree Shaking (MEDIUM)

Ensure unused CSS is removed.

**Incorrect** - No purging:
```scss
// All utility classes included (100+ KB)
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
// ... 100+ more utilities
```

**Correct** - PurgeCSS configuration:
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: [
        './packages/**/*.tsx',
        './apps/**/*.tsx',
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        standard: [/^is-/, /^has-/],  // Keep state classes
        deep: [/^data-theme/],         // Keep theme classes
      },
    }),
  ],
};
```

---

## 10. Pulwave Integration

### 10.1 Foundation Package (CRITICAL)

Structure the foundation package for shared styles.

**Pulwave Foundation Structure**:
```
packages/foundation/
├── styles/
│   ├── abstracts/
│   │   ├── _tokens.scss       # Design tokens (CSS custom properties)
│   │   ├── _variables.scss    # SCSS variables
│   │   ├── _functions.scss    # Helper functions
│   │   └── _mixins.scss       # Reusable mixins
│   │
│   ├── base/
│   │   ├── _reset.scss        # CSS reset
│   │   ├── _typography.scss   # Base typography
│   │   └── _global.scss       # Global styles
│   │
│   ├── utilities/
│   │   ├── _helpers.scss      # Helper classes
│   │   └── _spacing.scss      # Spacing utilities
│   │
│   └── main.scss              # Main entry point
│
├── package.json
└── index.ts                   # TypeScript exports
```

**packages/foundation/styles/main.scss**:
```scss
// 1. Abstracts (no CSS output)
@import 'abstracts/tokens';
@import 'abstracts/variables';
@import 'abstracts/functions';
@import 'abstracts/mixins';

// 2. Base styles
@import 'base/reset';
@import 'base/typography';
@import 'base/global';

// 3. Utilities (optional, can be tree-shaken)
@import 'utilities/helpers';
@import 'utilities/spacing';
```

### 10.2 UI Component Styles (CRITICAL)

Integrate component styles with CVA and SCSS.

**Pulwave Button Integration**:
```typescript
// packages/ui/components/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import './styles/_index.scss';

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
  disabled?: boolean;
  loading?: boolean;
};

export const Button = ({
  variant,
  size,
  disabled,
  loading,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={buttonVariants({ variant, size })}
      disabled={disabled || loading}
      data-loading={loading}
      {...props}
    >
      {children}
    </button>
  );
};
```

**packages/ui/components/Button/styles/_index.scss**:
```scss
@import './partials/base';
@import './partials/variants';
@import './partials/sizes';
@import './partials/states';
```

### 10.3 Build Pipeline (HIGH)

Configure the build pipeline for optimal CSS output.

**Turbo Configuration**:
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
      "env": ["NODE_ENV"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint:styles": {
      "outputs": [],
      "cache": false
    }
  }
}
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "lint:styles": "stylelint '**/*.scss' --fix",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Appendix A: Complete Token Reference

```scss
// packages/foundation/styles/abstracts/_tokens.scss
:root {
  /* Spacing Scale (base: 4px) */
  --spacing-0: 0;
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */

  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 hsl(0, 0%, 0%, 0.05);
  --shadow-md: 0 4px 6px -1px hsl(0, 0%, 0%, 0.1);
  --shadow-lg: 0 10px 15px -3px hsl(0, 0%, 0%, 0.1);
  --shadow-xl: 0 20px 25px -5px hsl(0, 0%, 0%, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-colors: color 200ms ease, background-color 200ms ease, border-color 200ms ease;
  --transition-all: all 200ms ease;

  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

## Appendix B: BEM Cheat Sheet

```scss
/* Block - standalone component */
.block { }

/* Element - part of a block */
.block__element { }

/* Modifier - variant or state */
.block--modifier { }
.block__element--modifier { }

/* Examples */
.card { }
.card__header { }
.card__title { }
.card__body { }
.card--elevated { }
.card__title--large { }

/* Nesting with & */
.card {
  &__header { }       // .card__header
  &__title { }        // .card__title
  &--elevated { }     // .card--elevated

  &--elevated &__title {  // .card--elevated .card__title
    color: var(--color-text-emphasis);
  }
}

/* State classes */
.is-active { }
.is-loading { }
.has-error { }
```

## Appendix C: Mixin Library

```scss
/* Flexbox Mixins */
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column($gap: var(--spacing-4)) {
  display: flex;
  flex-direction: column;
  gap: $gap;
}

/* Typography Mixins */
@mixin heading-1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Layout Mixins */
@mixin container($max-width: 1280px) {
  width: 100%;
  max-width: $max-width;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

@mixin aspect-ratio($width, $height) {
  aspect-ratio: $width / $height;
}

/* Accessibility Mixins */
@mixin sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@mixin focus-ring {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

## Appendix D: Stylelint Rules

```javascript
// .stylelintrc.js
module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss',
  ],
  rules: {
    // BEM naming
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(__[a-z0-9]+)?(--[a-z0-9]+)?$',
      {
        message: 'Expected class to follow BEM naming convention',
      },
    ],

    // Max nesting depth
    'max-nesting-depth': [
      3,
      {
        ignore: ['pseudo-classes', 'pseudo-elements'],
      },
    ],

    // No hard-coded colors
    'color-named': 'never',
    'color-no-hex': true,

    // Require custom properties for colors
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],

    // Order properties
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'display',
      'flex',
      'grid',
      'width',
      'height',
      'padding',
      'margin',
      // ... etc
    ],
  },
};
```

## Appendix E: Migration Guide

**Migrating from inline styles to SCSS**:

```tsx
// Before: Inline styles
const Button = ({ variant }: Props) => (
  <button
    style={{
      padding: '8px 16px',
      backgroundColor: variant === 'primary' ? '#3b82f6' : 'transparent',
      border: variant === 'outlined' ? '1px solid #d1d5db' : 'none',
      borderRadius: '0.5rem',
    }}
  >
    Click me
  </button>
);

// After: SCSS + CVA
// Button.tsx
import { buttonVariants } from './types';
import './styles/_index.scss';

const Button = ({ variant }: Props) => (
  <button className={buttonVariants({ variant })}>
    Click me
  </button>
);

// types.ts
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      outlined: 'btn--outlined',
    },
  },
});

// styles/partials/_variants.scss
.btn--primary {
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);
}

.btn--outlined {
  background: transparent;
  border: var(--border-width-thin) solid var(--color-border-default);
}
```

---

**Impact Levels Summary**:
- **CRITICAL** (18): Architecture, tokens, BEM, component structure, responsive design, build config
- **HIGH** (15): Import order, modifiers, states, mixins, breakpoints, performance, theme switching
- **MEDIUM** (4): Partial naming, functions, tree shaking, CSS-in-JS
- **LOW** (0): None

**Total Patterns**: 45+ comprehensive SCSS architecture and styling patterns
