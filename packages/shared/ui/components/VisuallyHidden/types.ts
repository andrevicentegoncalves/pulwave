import { cva, type VariantProps } from 'class-variance-authority';
import type { ElementType, HTMLAttributes } from 'react';

export const visuallyHiddenVariants = cva('visually-hidden', {
    variants: {
        focusable: {
            true: 'visually-hidden--focusable',
            false: '',
        },
    },
    defaultVariants: {
        focusable: false,
    },
});

export type VisuallyHiddenVariants = VariantProps<typeof visuallyHiddenVariants>;

export interface VisuallyHiddenProps extends VisuallyHiddenVariants, HTMLAttributes<HTMLSpanElement> {
    as?: ElementType;
}
