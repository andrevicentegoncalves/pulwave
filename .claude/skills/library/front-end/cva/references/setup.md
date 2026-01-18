# CVA Setup

## Installation

```bash
npm install class-variance-authority
```

## File Structure

```
ComponentName/
├── ComponentName.tsx   # Component implementation
├── types.ts            # CVA variants + TypeScript types
├── index.ts            # Barrel export
└── styles/
    └── _index.scss     # BEM styles for variants
```

## Basic Configuration

```typescript
// types.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const componentVariants = cva('component', {
  variants: {
    // Each key is a prop name
    variant: {
      primary: 'component--primary',
      secondary: 'component--secondary',
    },
    size: {
      s: 'component--s',
      m: 'component--m',
      l: 'component--l',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'm',
  },
});

export type ComponentProps = VariantProps<typeof componentVariants> & {
  children?: React.ReactNode;
  className?: string;
};
```

## Component Implementation

```tsx
// Component.tsx
import { cn } from '@pulwave/foundation';
import { componentVariants, type ComponentProps } from './types';
import './styles/_index.scss';

export const Component = ({ variant, size, className, children }: ComponentProps) => (
  <div className={cn(componentVariants({ variant, size }), className)}>
    {children}
  </div>
);
```

## The `cn` Utility

Combines classes, filters falsy values:

```typescript
// @pulwave/foundation
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
