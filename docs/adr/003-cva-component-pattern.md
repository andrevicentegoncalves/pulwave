# ADR-003: CVA Component Pattern

**Status:** Accepted  
**Date:** 2026-01-12  
**Deciders:** UI Team

---

## Context and Problem Statement

How should we handle component styling variants to ensure consistency, type safety, and maintainability across 89+ UI components?

## Decision Drivers

- Need type-safe variant props
- Want to avoid className prop misuse
- Must support complex variant combinations
- Require excellent developer experience with autocomplete
- Need to maintain separation of styling and logic

## Considered Options

1. **Class Variance Authority (CVA) with modular SCSS**
2. Tailwind CSS utility classes
3. Styled-components CSS-in-JS
4. Plain className props with manual class strings

## Decision Outcome

**Chosen option:** "CVA with modular SCSS"

### Rationale

CVA provides:
- Type-safe variant definitions
- Compile-time variant validation
- Automatic TypeScript inference
- Clean component APIs
- Composable variants with compound variants

Combined with modular SCSS:
- Token-based design system
- BEM naming for clarity
- SCSS partials for organization
- No runtime CSS overhead

### Implementation Pattern

```typescript
// types.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('button', {
  variants: {
    kind: { primary: 'button--primary', secondary: 'button--secondary' },
    size: { sm: 'button--sm', md: 'button--md', lg: 'button--lg' },
  },
  defaultVariants: { kind: 'primary', size: 'md' }
});

export type ButtonProps = VariantProps<typeof buttonVariants>;

// Button.tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ kind, size, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ kind, size }), className)}
      {...props}
    />
  )
);
```

### Positive Consequences

- Excellent TypeScript autocomplete
- Impossible to pass invalid variants
- Consistent variant naming across components
- Easy to add/remove variants
- Clear separation: logic in `.tsx`, styles in `.scss`

### Negative Consequences

- Learning curve for CVA syntax
- Need to maintain both `.tsx` and `.scss` files
- More complex than simple className strings

## Migration Path

All 89 UI components have been migrated to follow this pattern with:
- `types.ts` for variant definitions
- `styles/` folder with SCSS partials
- Consistent `cn()` utility usage
- No inline styles or `classNames` library

## Links

- [CVA Documentation](https://cva.style)
- [Component Guidelines](../packages/shared/ui/GUIDELINES.md)

---

**Tags:** ui, styling, design-system, typescript  
**Related ADRs:** ADR-004
