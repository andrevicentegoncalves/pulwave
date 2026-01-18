# TypeScript Integration

## VariantProps Type

Extract types from CVA config:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('button', {
  variants: {
    variant: { primary: '', secondary: '' },
    size: { s: '', m: '', l: '' },
  },
});

// Automatically typed from variants
type ButtonVariants = VariantProps<typeof buttonVariants>;
// { variant?: 'primary' | 'secondary'; size?: 's' | 'm' | 'l' }
```

## Extending Props

Combine with HTML attributes:

```typescript
export type ButtonProps = VariantProps<typeof buttonVariants> & {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>;
```

## Omitting Variant Props

When variant maps to different prop type:

```typescript
// Boolean variants return 'true' | 'false' | undefined
// But we want actual boolean props

export type ButtonProps = Omit<
  VariantProps<typeof buttonVariants>,
  'fullWidth' | 'loading'
> & {
  fullWidth?: boolean;  // Real boolean
  loading?: boolean;    // Real boolean
};

// In component, cast to variant type
buttonVariants({
  fullWidth: !!fullWidth,  // boolean → 'true' | 'false'
  loading: !!loading,
})
```

## Separate Type Exports

Export variant types for external use:

```typescript
// types.ts
export type ButtonKind = 'primary' | 'secondary' | 'success' | 'error';
export type ButtonVariant = 'filled' | 'outlined' | 'ghost';
export type ButtonSize = 's' | 'm' | 'l';

// Use in CVA
export const buttonVariants = cva('button', {
  variants: {
    kind: {
      primary: '...',
      secondary: '...',
      // ...
    } satisfies Record<ButtonKind, string>,
  },
});
```

## Consuming in Components

```tsx
// Fully typed component
export const Button = ({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </button>
);

// Usage - TypeScript validates props
<Button variant="primary" size="l">Click</Button>
<Button variant="invalid" />  // ❌ Type error
```
