import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const formGridVariants = cva('form-grid', {
    variants: {},
    defaultVariants: {}
});

export const formGridRowVariants = cva('form-grid-row', {
    variants: {
        columns: {
            1: 'form-grid-row--cols-1',
            2: 'form-grid-row--cols-2',
            3: 'form-grid-row--cols-3',
        }
    },
    defaultVariants: {
        columns: 2,
    },
});

export type FormGridRowVariantProps = VariantProps<typeof formGridRowVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface FormGridProps {
    children: ReactNode;
    className?: string;
}

export interface FormGridRowProps extends FormGridRowVariantProps {
    children: ReactNode;
    className?: string;
    // columns handled by VariantProps
}
