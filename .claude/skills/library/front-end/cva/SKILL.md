---
name: cva
description: Manage component variants with Class Variance Authority (CVA) for type-safe, BEM-compatible styling.
version: 1.0.0
tags: [CVA, Variants, Components, BEM, TypeScript]
---

# Class Variance Authority (CVA)

Type-safe component variant management with BEM class generation.

## When to Use

- Component variant systems (size, color, state)
- Type-safe prop-to-class mapping
- BEM class name generation
- Design system components

## Quick Reference

### Basic Setup
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
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

export type ButtonProps = VariantProps<typeof buttonVariants>;
```

### Component Usage
```tsx
import { cn } from '@pulwave/foundation';
import { buttonVariants, type ButtonProps } from './types';

export const Button = ({ variant, size, className, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);
```

## Workflow

1. **Define Variants**: Create CVA config in `types.ts`
2. **Map to BEM**: Each variant value → BEM modifier class
3. **Set Defaults**: Specify default variant values
4. **Type Props**: Use `VariantProps<>` for type inference
5. **Apply in Component**: Call variant function with props

## Scoring (0-10)

- **10**: Full CVA setup, BEM mapping, TypeScript types, compound variants
- **7**: Basic CVA usage, some variants, defaults set
- **3**: Manual class concatenation, no type safety
- **0**: Hardcoded classes, no variant system

## Full Compiled Guide

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive CVA (Class Variance Authority) guide (40+ patterns)

### What's in AGENTS.md

**CVA Fundamentals** (CRITICAL):
- Basic setup and installation
- Variant definition with type-safe mappings
- Default variants for consistent behavior
- Type inference with VariantProps

**BEM Integration** (CRITICAL):
- Mapping CVA variants to BEM modifier classes
- Handling Block__Element--Modifier patterns
- BEM naming conventions for variants
- Separating elements from modifiers

**Component Patterns** (CRITICAL):
- Component structure (types.ts, Component.tsx, styles/)
- Props interface with VariantProps extension
- className merging with cn() utility
- Forwarding refs properly

**Compound Variants** (CRITICAL):
- Compound variant basics for specific combinations
- Multi-condition compound variants
- Use cases (outlined + lg, error states, etc.)

**Advanced Variants** (HIGH):
- Responsive variants for different screen sizes
- Boolean variants (fullWidth, loading, etc.)
- Conditional classes based on props

**Type Safety** (CRITICAL):
- VariantProps type for automatic inference
- Component props extension with native HTML props
- Discriminated unions for conditional prop types
- Strict typing enforcement

**Utility Integration** (CRITICAL/HIGH):
- cn() utility for class merging
- clsx and tailwind-merge integration
- Custom class utilities

**Performance** (HIGH):
- Runtime performance considerations
- Bundle size optimization
- Memoization strategies

**Testing** (CRITICAL/HIGH):
- Variant testing patterns
- Type testing with TypeScript
- Snapshot testing for components

**Pulwave Integration** (CRITICAL):
- UI component integration with CVA + SCSS
- Foundation utilities (cn() implementation)
- Pattern library for reusable variant patterns

**Appendices**:
- Complete CVA API reference
- BEM mapping cheat sheet
- TypeScript patterns for variants
- Migration guide from manual concatenation to CVA

## Additional Resources

- `references/setup.md` - CVA configuration
- `references/variants.md` - Variant patterns
- `references/typescript.md` - Type integration
- `references/bem-integration.md` - BEM mapping
