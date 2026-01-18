import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const chipVariants = cva('chip', {
    variants: {
        variant: {
            filled: 'chip--filled',
            outline: 'chip--outline',
            subtle: 'chip--subtle',
            ghost: 'chip--ghost',
        },
        size: {
            s: 'chip--s',
            m: 'chip--m',
        },
        selected: {
            true: 'chip--selected',
            false: '',
        },
        disabled: {
            true: 'chip--disabled',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'outline',
        size: 'm',
        selected: false,
        disabled: false,
    },
});

export type ChipVariants = VariantProps<typeof chipVariants>;

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>, ChipVariants {
    children: ReactNode;
    icon?: ReactNode;
    avatar?: ReactNode;
    removable?: boolean;
    onRemove?: () => void;
    onSelect?: (selected: boolean) => void;
}
