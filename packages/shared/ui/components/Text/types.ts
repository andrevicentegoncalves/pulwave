import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const textVariants = cva('text', {
    variants: {
        category: {
            display: 'text--display',
            heading: 'text--heading',
            title: 'text--title',
            body: 'text--body',
            label: 'text--label',
            code: 'text--code',
        },
        size: {
            '3xl': 'text--3xl',
            '2xl': 'text--2xl',
            xl: 'text--xl',
            l: 'text--l',
            m: 'text--m',
            s: 'text--s',
            xs: 'text--xs',
        },
        weight: {
            regular: 'text--regular',
            medium: 'text--medium',
            semibold: 'text--semibold',
            bold: 'text--bold',
        },
        color: {
            default: 'text--default',
            muted: 'text--muted',
            primary: 'text--primary',
            success: 'text--success',
            warning: 'text--warning',
            error: 'text--error',
            info: 'text--info',
            inverted: 'text--inverted',
        },
        align: {
            left: 'text--left',
            center: 'text--center',
            right: 'text--right',
            justify: 'text--justify',
        },
        truncate: {
            true: 'text--truncate',
        },
        wrap: {
            false: 'text--nowrap',
        },
    },
    defaultVariants: {
        category: 'body',
        size: 'm',
        color: 'default',
    },
});

export type TextProps = Omit<React.HTMLAttributes<HTMLElement>, 'color'> &
    VariantProps<typeof textVariants> & {
        variant?: string; // Legacy support or alias
        as?: React.ElementType;
        id?: string;
        lineClamp?: number;
    };
