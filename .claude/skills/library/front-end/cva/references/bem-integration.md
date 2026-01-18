# BEM Integration

## CVA → BEM Mapping

Each CVA variant value maps to a BEM modifier:

```typescript
// CVA Config
export const buttonVariants = cva('button', {  // Base class (Block)
  variants: {
    variant: {
      filled: 'button--variant-filled',     // BEM modifier
      outlined: 'button--variant-outlined',
    },
    size: {
      s: 'button--s',
      m: 'button--m',
      l: 'button--l',
    },
  },
});

// Output: "button button--variant-filled button--m"
```

## BEM Naming in CVA

| CVA Concept | BEM Equivalent | Example |
|-------------|----------------|---------|
| Base class | Block | `button` |
| Variant value | Modifier | `button--primary` |
| Element variants | Element | `button__icon` |
| Compound | Complex modifier | `button--filled-primary` |

## SCSS Structure

```scss
// _base.scss
.button {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-md);
}

// _variants.scss
.button--variant-filled {
  background: var(--color-surface-brand);
}

.button--variant-outlined {
  background: transparent;
  border: 1px solid var(--color-border-default);
}

// _sizes.scss
.button--s {
  height: var(--spacing-8);
  padding: 0 var(--spacing-3);
  font-size: var(--font-size-sm);
}

.button--m {
  height: var(--spacing-10);
  padding: 0 var(--spacing-4);
  font-size: var(--font-size-base);
}
```

## Element Variants

For subcomponents:

```typescript
// CVA for elements
export const buttonIconVariants = cva('button__icon', {
  variants: {
    position: {
      left: 'button__icon--left',
      right: 'button__icon--right',
    },
  },
});
```

```scss
// SCSS
.button__icon {
  display: inline-flex;

  &--left {
    margin-right: var(--spacing-2);
  }

  &--right {
    margin-left: var(--spacing-2);
  }
}
```

## Design Token Integration

Always use CSS custom properties in SCSS:

```scss
// ✅ Correct
.button--kind-primary {
  background: var(--color-surface-brand);
  color: var(--color-text-on-brand);
}

// ❌ Wrong - hardcoded values
.button--kind-primary {
  background: #007bff;
  color: white;
}
```

## State Handling

```scss
.button {
  // Base interactive states
  &:hover:not(:disabled) {
    // hover styles
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
  }

  &:disabled,
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Loading state
  &--loading {
    pointer-events: none;
  }
}
```
