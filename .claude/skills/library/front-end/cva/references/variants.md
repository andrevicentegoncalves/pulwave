# Variant Patterns

## Standard Variants

### Kind/Color Variants
Semantic color meanings:

```typescript
kind: {
  primary: 'button--kind-primary',
  secondary: 'button--kind-secondary',
  success: 'button--kind-success',
  warning: 'button--kind-warning',
  error: 'button--kind-error',
  info: 'button--kind-info',
  neutral: 'button--kind-neutral',
}
```

### Style Variants
Visual presentation:

```typescript
variant: {
  filled: 'button--variant-filled',
  outlined: 'button--variant-outlined',
  ghost: 'button--variant-ghost',
  soft: 'button--variant-soft',
  link: 'button--variant-link',
}
```

### Size Variants
Component scale:

```typescript
size: {
  xs: 'component--xs',
  s: 'component--s',
  m: 'component--m',
  l: 'component--l',
  xl: 'component--xl',
}
```

## Boolean Variants

For on/off states:

```typescript
variants: {
  fullWidth: {
    true: 'button--full-width',
    false: '',  // No class when false
  },
  loading: {
    true: 'button--loading',
    false: '',
  },
  disabled: {
    true: 'button--disabled',
  },
}
```

## Compound Variants

Apply classes when multiple conditions match:

```typescript
export const buttonVariants = cva('button', {
  variants: {
    variant: {
      filled: 'button--filled',
      outlined: 'button--outlined',
    },
    kind: {
      primary: 'button--primary',
      danger: 'button--danger',
    },
  },
  compoundVariants: [
    {
      variant: 'filled',
      kind: 'danger',
      class: 'button--filled-danger', // Extra class for this combination
    },
    {
      variant: 'outlined',
      kind: 'primary',
      class: 'button--outlined-primary',
    },
  ],
  defaultVariants: {
    variant: 'filled',
    kind: 'primary',
  },
});
```

## Element Variants

For subcomponents (BEM elements):

```typescript
// Parent component variants
export const cardVariants = cva('card', { ... });

// Element variants
export const cardHeaderVariants = cva('card__header', {
  variants: {
    padded: {
      true: 'card__header--padded',
    },
  },
});

export const cardBodyVariants = cva('card__body', {
  variants: {
    scrollable: {
      true: 'card__body--scrollable',
    },
  },
});
```
