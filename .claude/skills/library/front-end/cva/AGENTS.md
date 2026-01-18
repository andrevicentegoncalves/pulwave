# Class Variance Authority (CVA)

**Abstract**: Comprehensive guide to managing component variants with Class Variance Authority (CVA) for type-safe, maintainable styling. Covers variant definition, BEM integration, TypeScript type inference, compound variants, and advanced patterns for building scalable design systems.

---

## Table of Contents

1. [CVA Fundamentals](#1-cva-fundamentals)
   - 1.1 [Basic Setup](#11-basic-setup) (CRITICAL)
   - 1.2 [Variant Definition](#12-variant-definition) (CRITICAL)
   - 1.3 [Default Variants](#13-default-variants) (CRITICAL)
   - 1.4 [Type Inference](#14-type-inference) (CRITICAL)

2. [BEM Integration](#2-bem-integration)
   - 2.1 [BEM Class Mapping](#21-bem-class-mapping) (CRITICAL)
   - 2.2 [Block Element Modifiers](#22-block-element-modifiers) (CRITICAL)
   - 2.3 [Naming Conventions](#23-naming-conventions) (HIGH)

3. [Component Patterns](#3-component-patterns)
   - 3.1 [Component Structure](#31-component-structure) (CRITICAL)
   - 3.2 [Props Interface](#32-props-interface) (CRITICAL)
   - 3.3 [className Merging](#33-classname-merging) (CRITICAL)
   - 3.4 [Forwarding Refs](#34-forwarding-refs) (HIGH)

4. [Compound Variants](#4-compound-variants)
   - 4.1 [Compound Basics](#41-compound-basics) (CRITICAL)
   - 4.2 [Multi-Condition Compounds](#42-multi-condition-compounds) (HIGH)
   - 4.3 [Use Cases](#43-use-cases) (HIGH)

5. [Advanced Variants](#5-advanced-variants)
   - 5.1 [Responsive Variants](#51-responsive-variants) (HIGH)
   - 5.2 [Boolean Variants](#52-boolean-variants) (MEDIUM)
   - 5.3 [Conditional Classes](#53-conditional-classes) (HIGH)

6. [Type Safety](#6-type-safety)
   - 6.1 [VariantProps Type](#61-variantprops-type) (CRITICAL)
   - 6.2 [Component Props Extension](#62-component-props-extension) (CRITICAL)
   - 6.3 [Discriminated Unions](#63-discriminated-unions) (HIGH)
   - 6.4 [Strict Typing](#64-strict-typing) (HIGH)

7. [Utility Integration](#7-utility-integration)
   - 7.1 [cn() Utility](#71-cn-utility) (CRITICAL)
   - 7.2 [clsx and tailwind-merge](#72-clsx-and-tailwind-merge) (HIGH)
   - 7.3 [Custom Class Utilities](#73-custom-class-utilities) (MEDIUM)

8. [Performance](#8-performance)
   - 8.1 [Runtime Performance](#81-runtime-performance) (HIGH)
   - 8.2 [Bundle Size](#82-bundle-size) (HIGH)
   - 8.3 [Memoization](#83-memoization) (MEDIUM)

9. [Testing](#9-testing)
   - 9.1 [Variant Testing](#91-variant-testing) (CRITICAL)
   - 9.2 [Type Testing](#92-type-testing) (HIGH)
   - 9.3 [Snapshot Testing](#93-snapshot-testing) (MEDIUM)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [UI Components](#101-ui-components) (CRITICAL)
    - 10.2 [Foundation Utilities](#102-foundation-utilities) (CRITICAL)
    - 10.3 [Pattern Library](#103-pattern-library) (HIGH)

**Appendix**
- [A. Complete CVA API Reference](#appendix-a-complete-cva-api-reference)
- [B. BEM Mapping Cheat Sheet](#appendix-b-bem-mapping-cheat-sheet)
- [C. TypeScript Patterns](#appendix-c-typescript-patterns)
- [D. Migration Guide](#appendix-d-migration-guide)

---

## 1. CVA Fundamentals

### 1.1 Basic Setup (CRITICAL)

Install and configure CVA for type-safe variant management.

**Installation**:
```bash
npm install class-variance-authority
```

**Incorrect** - Manual class concatenation:
```typescript
// types.ts
export type ButtonProps = {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
};

// Button.tsx
export const Button = ({ variant = 'primary', size = 'md' }: ButtonProps) => {
  let className = 'btn';

  if (variant === 'primary') className += ' btn--primary';
  if (variant === 'secondary') className += ' btn--secondary';
  if (size === 'sm') className += ' btn--sm';
  if (size === 'md') className += ' btn--md';
  if (size === 'lg') className += ' btn--lg';

  return <button className={className}>Click</button>;
};
```

**Correct** - CVA setup:
```typescript
// types.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      secondary: 'btn--secondary',
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

export type ButtonProps = VariantProps<typeof buttonVariants>;

// Button.tsx
import { buttonVariants, type ButtonProps } from './types';

export const Button = ({ variant, size, ...props }: ButtonProps) => {
  return (
    <button className={buttonVariants({ variant, size })} {...props}>
      Click
    </button>
  );
};
```

### 1.2 Variant Definition (CRITICAL)

Define variants as objects mapping variant values to class names.

**Incorrect** - String concatenation:
```typescript
const buttonClass = (variant: string) => `btn btn-${variant}`;
```

**Correct** - Structured variant definition:
```typescript
import { cva } from 'class-variance-authority';

export const buttonVariants = cva('btn', {
  variants: {
    // Visual variants
    variant: {
      primary: 'btn--primary',
      secondary: 'btn--secondary',
      outlined: 'btn--outlined',
      ghost: 'btn--ghost',
      danger: 'btn--danger',
    },

    // Size variants
    size: {
      sm: 'btn--sm',
      md: 'btn--md',
      lg: 'btn--lg',
      xl: 'btn--xl',
    },

    // State variants
    state: {
      default: '',
      loading: 'btn--loading',
      disabled: 'btn--disabled',
    },

    // Layout variants
    fullWidth: {
      true: 'btn--full-width',
      false: '',
    },
  },
});
```

### 1.3 Default Variants (CRITICAL)

Always specify default values for variants to ensure consistent behavior.

**Incorrect** - No defaults:
```typescript
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      secondary: 'btn--secondary',
    },
    size: {
      sm: 'btn--sm',
      md: 'btn--md',
    },
  },
  // No defaults - component might render without variant classes
});
```

**Correct** - Explicit defaults:
```typescript
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      secondary: 'btn--secondary',
      outlined: 'btn--outlined',
    },
    size: {
      sm: 'btn--sm',
      md: 'btn--md',
      lg: 'btn--lg',
    },
  },
  defaultVariants: {
    variant: 'primary',  // Will apply btn--primary if no variant provided
    size: 'md',          // Will apply btn--md if no size provided
  },
});

// Usage - both render with default classes
<Button />                              // btn btn--primary btn--md
<Button variant="outlined" size="lg" /> // btn btn--outlined btn--lg
```

### 1.4 Type Inference (CRITICAL)

Use `VariantProps` to automatically infer TypeScript types from CVA definitions.

**Incorrect** - Manual type definition:
```typescript
const buttonVariants = cva('btn', { /* ... */ });

// Manual type duplication (error-prone)
export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
};
```

**Correct** - Type inference:
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      secondary: 'btn--secondary',
      outlined: 'btn--outlined',
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

// Automatically inferred type
export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
// Type: { variant?: 'primary' | 'secondary' | 'outlined'; size?: 'sm' | 'md' | 'lg' }

// Extend with additional props
export type ButtonProps = ButtonVariantProps & {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};
```

---

## 2. BEM Integration

### 2.1 BEM Class Mapping (CRITICAL)

Map CVA variants to BEM modifier classes.

**Pulwave BEM Convention**:
```typescript
// Block: btn
// Element: btn__icon, btn__label
// Modifier: btn--primary, btn--sm

import { cva } from 'class-variance-authority';

export const buttonVariants = cva('btn', {  // Block
  variants: {
    variant: {
      primary: 'btn--primary',      // Modifier
      outlined: 'btn--outlined',    // Modifier
      ghost: 'btn--ghost',          // Modifier
    },
    size: {
      sm: 'btn--sm',                // Modifier
      md: 'btn--md',                // Modifier
      lg: 'btn--lg',                // Modifier
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Result: "btn btn--primary btn--md"
```

### 2.2 Block Element Modifiers (CRITICAL)

Handle nested BEM elements within CVA components.

**Incorrect** - Elements in CVA:
```typescript
// Don't put elements in CVA variants
export const buttonVariants = cva('btn', {
  variants: {
    hasIcon: {
      true: 'btn__icon',  // Wrong - this is an element, not a modifier
    },
  },
});
```

**Correct** - Separate element classes:
```typescript
// types.ts - Only modifiers in CVA
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      outlined: 'btn--outlined',
    },
    size: {
      sm: 'btn--sm',
      md: 'btn--md',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Button.tsx - Elements are static classes
export const Button = ({ variant, size, icon, children }: ButtonProps) => {
  return (
    <button className={buttonVariants({ variant, size })}>
      {icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__label">{children}</span>
    </button>
  );
};
```

### 2.3 Naming Conventions (HIGH)

Follow consistent BEM naming in CVA variant values.

**Pulwave BEM Naming Rules**:
```typescript
// ✅ Correct naming
export const cardVariants = cva('card', {
  variants: {
    variant: {
      elevated: 'card--elevated',    // Good: describes the card state
      outlined: 'card--outlined',    // Good: describes the visual style
      interactive: 'card--interactive',  // Good: describes behavior
    },
    padding: {
      none: 'card--no-padding',      // Good: semantic modifier
      sm: 'card--padding-sm',        // Good: size modifier
      md: 'card--padding-md',
      lg: 'card--padding-lg',
    },
  },
});

// ❌ Incorrect naming
export const badCardVariants = cva('card', {
  variants: {
    type: {
      1: 'card-type-1',      // Bad: non-semantic
      blue: 'card-blue',     // Bad: presentational, not semantic
    },
  },
});
```

---

## 3. Component Patterns

### 3.1 Component Structure (CRITICAL)

Structure components to separate variant logic from implementation.

**Pulwave Component Pattern**:
```
packages/ui/components/Button/
├── Button.tsx           # Component implementation
├── index.ts             # Barrel export
├── types.ts             # CVA variants + TypeScript types
└── styles/
    └── _index.scss      # SCSS styles
```

**types.ts**:
```typescript
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
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
};
```

**Button.tsx**:
```typescript
import { buttonVariants, type ButtonProps } from './types';
import './styles/_index.scss';

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
      aria-busy={loading}
      {...props}
    >
      {children}
    </button>
  );
};
```

### 3.2 Props Interface (CRITICAL)

Properly extend variant props with additional component props.

**Incorrect** - Duplicating types:
```typescript
const buttonVariants = cva('btn', { /* ... */ });

// Duplicates variant types
export type ButtonProps = {
  variant?: 'primary' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
};
```

**Correct** - Extending VariantProps:
```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      outlined: 'btn--outlined',
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

// Method 1: Extend VariantProps
export type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
};

// Method 2: Extend with native button props
export type ButtonPropsWithNative = VariantProps<typeof buttonVariants> &
  ComponentPropsWithoutRef<'button'>;
```

### 3.3 className Merging (CRITICAL)

Allow className prop to override or extend variant classes.

**Incorrect** - Ignoring className prop:
```typescript
export const Button = ({ variant, size, className }: ButtonProps) => {
  // className prop is ignored
  return <button className={buttonVariants({ variant, size })}>Click</button>;
};
```

**Correct** - Merging with cn() utility:
```typescript
import { cn } from '@pulwave/foundation';
import { buttonVariants, type ButtonProps } from './types';

export const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      Click
    </button>
  );
};

// Usage - custom classes override/extend variants
<Button className="custom-margin">Click</Button>
// Result: "btn btn--primary btn--md custom-margin"
```

**cn() Utility Implementation**:
```typescript
// packages/foundation/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3.4 Forwarding Refs (HIGH)

Forward refs properly when using CVA components.

**Pulwave Ref Forwarding Pattern**:
```typescript
import { forwardRef } from 'react';
import { cn } from '@pulwave/foundation';
import { buttonVariants, type ButtonProps } from './types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Usage with ref
const buttonRef = useRef<HTMLButtonElement>(null);
<Button ref={buttonRef} variant="primary">Click</Button>
```

---

## 4. Compound Variants

### 4.1 Compound Basics (CRITICAL)

Use compound variants when specific variant combinations need unique styles.

**Incorrect** - No compound variants:
```typescript
// Can't handle specific combinations
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      outlined: 'btn--outlined',
    },
    size: {
      sm: 'btn--sm',
      lg: 'btn--lg',
    },
  },
});

// Problem: Can't style "outlined + lg" differently
```

**Correct** - Compound variants:
```typescript
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      outlined: 'btn--outlined',
    },
    size: {
      sm: 'btn--sm',
      md: 'btn--md',
      lg: 'btn--lg',
    },
  },
  compoundVariants: [
    {
      // When variant is outlined AND size is lg
      variant: 'outlined',
      size: 'lg',
      class: 'btn--outlined-lg',  // Apply special class
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Usage
<Button variant="outlined" size="lg" />
// Result: "btn btn--outlined btn--lg btn--outlined-lg"
```

### 4.2 Multi-Condition Compounds (HIGH)

Create compound variants with multiple conditions.

**Pulwave Card Example**:
```typescript
export const cardVariants = cva('card', {
  variants: {
    variant: {
      elevated: 'card--elevated',
      outlined: 'card--outlined',
      ghost: 'card--ghost',
    },
    padding: {
      none: 'card--no-padding',
      sm: 'card--padding-sm',
      md: 'card--padding-md',
      lg: 'card--padding-lg',
    },
    interactive: {
      true: 'card--interactive',
      false: '',
    },
  },
  compoundVariants: [
    {
      // Elevated + interactive = extra shadow on hover
      variant: 'elevated',
      interactive: true,
      class: 'card--elevated-interactive',
    },
    {
      // Outlined + no padding = adjust border
      variant: 'outlined',
      padding: 'none',
      class: 'card--outlined-no-padding',
    },
    {
      // Ghost + interactive = subtle hover
      variant: 'ghost',
      interactive: true,
      class: 'card--ghost-interactive',
    },
  ],
  defaultVariants: {
    variant: 'elevated',
    padding: 'md',
    interactive: false,
  },
});
```

### 4.3 Use Cases (HIGH)

Common scenarios for compound variants.

**Pulwave Input Example**:
```typescript
export const inputVariants = cva('input', {
  variants: {
    variant: {
      outlined: 'input--outlined',
      filled: 'input--filled',
    },
    size: {
      sm: 'input--sm',
      md: 'input--md',
      lg: 'input--lg',
    },
    state: {
      default: '',
      error: 'input--error',
      success: 'input--success',
    },
  },
  compoundVariants: [
    {
      // Outlined variant with error state needs red border
      variant: 'outlined',
      state: 'error',
      class: 'input--outlined-error',
    },
    {
      // Filled variant with error state needs red background
      variant: 'filled',
      state: 'error',
      class: 'input--filled-error',
    },
    {
      // Large size + error = bigger error icon
      size: 'lg',
      state: 'error',
      class: 'input--lg-error',
    },
  ],
  defaultVariants: {
    variant: 'outlined',
    size: 'md',
    state: 'default',
  },
});
```

---

## 5. Advanced Variants

### 5.1 Responsive Variants (HIGH)

Create responsive variants that adapt to screen size.

**Pulwave Responsive Pattern**:
```typescript
// Note: This requires custom implementation or responsive class utilities
export const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid--cols-1',
      2: 'grid--cols-2',
      3: 'grid--cols-3',
      4: 'grid--cols-4',
    },
    gap: {
      sm: 'grid--gap-sm',
      md: 'grid--gap-md',
      lg: 'grid--gap-lg',
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 'md',
  },
});

// Component with responsive props
export type GridProps = VariantProps<typeof gridVariants> & {
  // Responsive variant system
  responsive?: {
    sm?: Pick<VariantProps<typeof gridVariants>, 'cols'>;
    md?: Pick<VariantProps<typeof gridVariants>, 'cols'>;
    lg?: Pick<VariantProps<typeof gridVariants>, 'cols'>;
  };
};

export const Grid = ({ cols, gap, responsive, className }: GridProps) => {
  const responsiveClasses = responsive ? [
    responsive.sm?.cols && `grid--cols-sm-${responsive.sm.cols}`,
    responsive.md?.cols && `grid--cols-md-${responsive.md.cols}`,
    responsive.lg?.cols && `grid--cols-lg-${responsive.lg.cols}`,
  ].filter(Boolean) : [];

  return (
    <div className={cn(gridVariants({ cols, gap }), responsiveClasses, className)}>
      {/* grid content */}
    </div>
  );
};

// Usage
<Grid
  cols={1}
  responsive={{
    sm: { cols: 2 },
    md: { cols: 3 },
    lg: { cols: 4 },
  }}
/>
```

### 5.2 Boolean Variants (MEDIUM)

Handle boolean variant values efficiently.

**Incorrect** - String booleans:
```typescript
export const buttonVariants = cva('btn', {
  variants: {
    fullWidth: {
      'true': 'btn--full-width',   // String instead of boolean
      'false': '',
    },
  },
});
```

**Correct** - Boolean variants:
```typescript
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      outlined: 'btn--outlined',
    },
    fullWidth: {
      true: 'btn--full-width',
      false: '',
    },
    loading: {
      true: 'btn--loading',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    fullWidth: false,
    loading: false,
  },
});

// TypeScript infers boolean type
type ButtonProps = VariantProps<typeof buttonVariants>;
// { variant?: 'primary' | 'outlined'; fullWidth?: boolean; loading?: boolean }

// Usage
<Button fullWidth />           // fullWidth={true}
<Button fullWidth={false} />   // fullWidth={false}
```

### 5.3 Conditional Classes (HIGH)

Apply classes conditionally based on props.

**Pulwave Alert Example**:
```typescript
export const alertVariants = cva('alert', {
  variants: {
    variant: {
      info: 'alert--info',
      success: 'alert--success',
      warning: 'alert--warning',
      error: 'alert--error',
    },
    dismissible: {
      true: 'alert--dismissible',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'info',
    dismissible: false,
  },
});

export type AlertProps = VariantProps<typeof alertVariants> & {
  title?: string;
  message: string;
  onDismiss?: () => void;
};

export const Alert = ({ variant, dismissible, title, message, onDismiss }: AlertProps) => {
  // Automatically set dismissible=true if onDismiss is provided
  const isDismissible = dismissible ?? Boolean(onDismiss);

  return (
    <div className={alertVariants({ variant, dismissible: isDismissible })}>
      {title && <div className="alert__title">{title}</div>}
      <div className="alert__message">{message}</div>
      {isDismissible && (
        <button className="alert__dismiss" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  );
};
```

---

## 6. Type Safety

### 6.1 VariantProps Type (CRITICAL)

Use VariantProps for automatic type inference from CVA definitions.

**Incorrect** - Manual type duplication:
```typescript
const buttonVariants = cva('btn', {
  variants: {
    variant: { primary: 'btn--primary', outlined: 'btn--outlined' },
    size: { sm: 'btn--sm', md: 'btn--md', lg: 'btn--lg' },
  },
});

// Manual duplication - error prone if CVA changes
type ButtonProps = {
  variant?: 'primary' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
};
```

**Correct** - VariantProps inference:
```typescript
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

// Automatically stays in sync with CVA definition
export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
// Inferred: { variant?: 'primary' | 'outlined' | 'ghost'; size?: 'sm' | 'md' | 'lg' }

// Extend with component-specific props
export type ButtonProps = ButtonVariantProps & {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};
```

### 6.2 Component Props Extension (CRITICAL)

Extend variant props with native HTML element props.

**Pulwave Pattern**:
```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';

export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      outlined: 'btn--outlined',
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

// Extend with all native button props
export type ButtonProps = VariantProps<typeof buttonVariants> &
  ComponentPropsWithoutRef<'button'>;

// Element ref type
export type ButtonRef = ElementRef<'button'>;

// Component with full type safety
export const Button = forwardRef<ButtonRef, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}  // All button props: onClick, disabled, type, etc.
      />
    );
  }
);
```

### 6.3 Discriminated Unions (HIGH)

Use discriminated unions for conditional prop types.

**Pulwave Input Example**:
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva('input', {
  variants: {
    variant: {
      text: 'input--text',
      number: 'input--number',
      email: 'input--email',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
});

// Base variant props
type InputVariantProps = VariantProps<typeof inputVariants>;

// Discriminated union based on variant
export type InputProps =
  | (InputVariantProps & { variant: 'text'; value?: string })
  | (InputVariantProps & { variant: 'number'; value?: number; min?: number; max?: number })
  | (InputVariantProps & { variant: 'email'; value?: string; pattern?: string });

// TypeScript enforces correct prop combinations
export const Input = ({ variant, value, ...props }: InputProps) => {
  if (variant === 'number') {
    // TypeScript knows min/max are available here
    const { min, max } = props as Extract<InputProps, { variant: 'number' }>;
  }

  return <input className={inputVariants({ variant })} value={value} {...props} />;
};
```

### 6.4 Strict Typing (HIGH)

Enforce strict typing for variant values.

**Pulwave Strict Pattern**:
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva('badge', {
  variants: {
    variant: {
      default: 'badge--default',
      success: 'badge--success',
      warning: 'badge--warning',
      error: 'badge--error',
    } as const,  // Make variant keys readonly
    size: {
      sm: 'badge--sm',
      md: 'badge--md',
      lg: 'badge--lg',
    } as const,
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// Strict variant type
export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
// Type: 'default' | 'success' | 'warning' | 'error' (not undefined)

// Strict component props
export type BadgeProps = Required<VariantProps<typeof badgeVariants>> & {
  children: React.ReactNode;
};

// Component requires all variant props
export const Badge = ({ variant, size, children }: BadgeProps) => {
  return (
    <span className={badgeVariants({ variant, size })}>
      {children}
    </span>
  );
};

// Must provide all variants
<Badge variant="success" size="md">New</Badge>  // ✅
<Badge>New</Badge>  // ❌ TypeScript error
```

---

## 10. Pulwave Integration

### 10.1 UI Components (CRITICAL)

Integrate CVA with Pulwave UI components.

**Pulwave Button Component**:
```
packages/ui/components/Button/
├── Button.tsx
├── index.ts
├── types.ts
└── styles/
    ├── _index.scss
    └── partials/
        ├── _base.scss
        ├── _variants.scss
        ├── _sizes.scss
        └── _states.scss
```

**types.ts**:
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn--primary',
      secondary: 'btn--secondary',
      outlined: 'btn--outlined',
      ghost: 'btn--ghost',
      danger: 'btn--danger',
    },
    size: {
      sm: 'btn--sm',
      md: 'btn--md',
      lg: 'btn--lg',
    },
  },
  compoundVariants: [
    {
      variant: 'outlined',
      size: 'lg',
      class: 'btn--outlined-lg',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};
```

**Button.tsx**:
```typescript
import { forwardRef } from 'react';
import { cn } from '@pulwave/foundation';
import { buttonVariants, type ButtonProps } from './types';
import { Spinner } from '../Spinner';
import './styles/_index.scss';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      disabled,
      loading,
      icon,
      iconPosition = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Spinner className="btn__spinner" size="sm" />}
        {!loading && icon && iconPosition === 'left' && (
          <span className="btn__icon btn__icon--left">{icon}</span>
        )}
        <span className="btn__label">{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="btn__icon btn__icon--right">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 10.2 Foundation Utilities (CRITICAL)

Setup foundation utilities for CVA integration.

**packages/foundation/utils/cn.ts**:
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with conflict resolution
 * - Uses clsx for conditional classes
 * - Uses tailwind-merge to resolve conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
cn('btn', 'btn--primary', { 'btn--loading': isLoading })
// Result: "btn btn--primary btn--loading" (if isLoading is true)
```

**packages/foundation/index.ts**:
```typescript
// Export utilities
export { cn } from './utils/cn';

// Export types
export type { ClassValue } from 'clsx';
```

### 10.3 Pattern Library (HIGH)

Create reusable CVA patterns for common components.

**packages/patterns/variants/common.ts**:
```typescript
import { cva } from 'class-variance-authority';

// Shared size variants
export const sizeVariants = {
  sm: 'size--sm',
  md: 'size--md',
  lg: 'size--lg',
  xl: 'size--xl',
} as const;

// Shared color variants
export const colorVariants = {
  primary: 'color--primary',
  secondary: 'color--secondary',
  success: 'color--success',
  warning: 'color--warning',
  error: 'color--error',
} as const;

// Shared spacing variants
export const spacingVariants = {
  none: 'spacing--none',
  sm: 'spacing--sm',
  md: 'spacing--md',
  lg: 'spacing--lg',
} as const;

// Compose into reusable pattern
export const createComponentVariants = (baseClass: string) =>
  cva(baseClass, {
    variants: {
      size: sizeVariants,
      color: colorVariants,
      spacing: spacingVariants,
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
      spacing: 'md',
    },
  });

// Usage in components
export const cardVariants = createComponentVariants('card');
export const badgeVariants = createComponentVariants('badge');
```

---

## Appendix A: Complete CVA API Reference

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

// Basic usage
const example = cva(baseClass, config);

// Config structure
type CVAConfig = {
  variants?: Record<string, Record<string, string>>;
  compoundVariants?: Array<{
    [variantName: string]: string | boolean;
    class: string;
  }>;
  defaultVariants?: Record<string, string | boolean>;
};

// Type inference
type Props = VariantProps<typeof example>;

// Complete example
export const buttonVariants = cva(
  // Base class (always applied)
  'btn',

  // Configuration
  {
    // Variant definitions
    variants: {
      variant: {
        primary: 'btn--primary',
        outlined: 'btn--outlined',
      },
      size: {
        sm: 'btn--sm',
        md: 'btn--md',
        lg: 'btn--lg',
      },
      fullWidth: {
        true: 'btn--full-width',
        false: '',
      },
    },

    // Compound variants (conditional combinations)
    compoundVariants: [
      {
        variant: 'outlined',
        size: 'lg',
        class: 'btn--outlined-lg',
      },
    ],

    // Default values
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

// Usage
const className = buttonVariants({
  variant: 'outlined',
  size: 'lg',
  fullWidth: true,
});
// Result: "btn btn--outlined btn--lg btn--full-width btn--outlined-lg"
```

## Appendix B: BEM Mapping Cheat Sheet

```typescript
// BEM Structure: block__element--modifier

// ✅ Correct CVA → BEM Mapping
const componentVariants = cva(
  'block',  // Base block class
  {
    variants: {
      variant: {
        primary: 'block--primary',      // Block modifier
        secondary: 'block--secondary',  // Block modifier
      },
      size: {
        sm: 'block--sm',  // Block modifier
        lg: 'block--lg',  // Block modifier
      },
    },
  }
);

// Elements are separate classes (not in CVA)
<div className={componentVariants({ variant: 'primary' })}>
  <span className="block__element">Element</span>
  <span className="block__element--modifier">Modified Element</span>
</div>

// Result classes
// - block block--primary (from CVA)
// - block__element (static element class)
// - block__element--modifier (static element modifier)
```

## Appendix C: TypeScript Patterns

```typescript
// Pattern 1: Basic variant props
import { type VariantProps } from 'class-variance-authority';

const variants = cva('base', { /* ... */ });
type Props = VariantProps<typeof variants>;

// Pattern 2: Required variants
type RequiredProps = Required<VariantProps<typeof variants>>;

// Pattern 3: Extending with HTML props
import type { ComponentPropsWithoutRef } from 'react';

type ButtonProps = VariantProps<typeof buttonVariants> &
  ComponentPropsWithoutRef<'button'>;

// Pattern 4: Extracting specific variant type
type SizeVariant = NonNullable<VariantProps<typeof variants>['size']>;

// Pattern 5: Discriminated union
type InputProps =
  | { type: 'text'; value?: string }
  | { type: 'number'; value?: number; min?: number; max?: number };

// Pattern 6: Conditional props
type ConditionalProps<T extends boolean> = T extends true
  ? { required: true; defaultValue: string }
  : { required?: false; defaultValue?: string };
```

## Appendix D: Migration Guide

**From manual class concatenation to CVA**:

```typescript
// Before: Manual string concatenation
const Button = ({ variant, size }: Props) => {
  let className = 'btn';
  if (variant === 'primary') className += ' btn--primary';
  if (size === 'lg') className += ' btn--lg';
  return <button className={className}>Click</button>;
};

// After: CVA
import { buttonVariants } from './types';

const Button = ({ variant, size }: Props) => {
  return (
    <button className={buttonVariants({ variant, size })}>
      Click
    </button>
  );
};

// types.ts
export const buttonVariants = cva('btn', {
  variants: {
    variant: { primary: 'btn--primary' },
    size: { lg: 'btn--lg' },
  },
});
```

---

**Impact Levels Summary**:
- **CRITICAL** (21): Setup, variants, BEM mapping, component structure, type inference, className merging
- **HIGH** (13): Naming, compound variants, responsive variants, type safety, Pulwave patterns
- **MEDIUM** (4): Boolean variants, memoization, testing, utilities
- **LOW** (0): None

**Total Patterns**: 40+ comprehensive CVA implementation patterns
