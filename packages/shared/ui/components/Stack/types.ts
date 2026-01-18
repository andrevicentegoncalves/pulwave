import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const stackVariants = cva('stack', {
    variants: {
        direction: {
            row: 'stack--row',
            column: 'stack--column',
            'row-reverse': 'stack--row-reverse',
            'column-reverse': 'stack--column-reverse',
        },
        align: {
            start: 'stack--align-start',
            center: 'stack--align-center',
            end: 'stack--align-end',
            stretch: 'stack--align-stretch',
            baseline: 'stack--align-baseline',
        },
        justify: {
            start: 'stack--justify-start',
            center: 'stack--justify-center',
            end: 'stack--justify-end',
            between: 'stack--justify-between',
            around: 'stack--justify-around',
        },
        wrap: {
            true: 'stack--wrap',
            false: 'stack--nowrap',
            reverse: 'stack--wrap-reverse',
        },
        gap: {
            0: 'stack--gap-0',
            1: 'stack--gap-1',
            2: 'stack--gap-2',
            3: 'stack--gap-3',
            4: 'stack--gap-4',
            5: 'stack--gap-5',
            6: 'stack--gap-6',
            8: 'stack--gap-8',
            10: 'stack--gap-10',
            12: 'stack--gap-12',
            16: 'stack--gap-16',
            20: 'stack--gap-20',
            24: 'stack--gap-24',
            32: 'stack--gap-32',
        },
    },
    defaultVariants: {
        direction: 'column',
        align: 'stretch',
        justify: 'start',
        wrap: false,
        gap: 0,
    },
});

export type StackProps = React.HTMLAttributes<HTMLElement> &
    Omit<VariantProps<typeof stackVariants>, 'gap'> & {
        as?: React.ElementType;
        reverse?: boolean;
        fullWidth?: boolean;
        fullHeight?: boolean;
        padding?: number | string;
        gap?: number | string;
        spacing?: number | string;
    };
