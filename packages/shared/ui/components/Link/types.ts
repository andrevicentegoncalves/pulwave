import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef } from 'react';

export const linkVariants = cva('link', {
    variants: {
        variant: {
            default: 'link--default',
            neutral: 'link--neutral',
            subtle: 'link--subtle',
        },
        size: {
            s: 'link--s',
            m: 'link--m',
            l: 'link--l',
        },
        underline: {
            hover: 'link--underline-hover',
            always: 'link--underline-always',
            none: 'link--underline-none',
        },
        disabled: {
            true: 'link--disabled',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'm',
        underline: 'hover',
        disabled: false,
    },
});

export interface LinkProps
    extends ComponentPropsWithoutRef<'a'>,
    VariantProps<typeof linkVariants> {
    to?: string; // For router integration
    external?: boolean;
}
