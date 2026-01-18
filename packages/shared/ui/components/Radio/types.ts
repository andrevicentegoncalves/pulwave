import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const radioVariants = cva('radio', {
    variants: {
        size: {
            s: 'radio--s',
            m: 'radio--m',
            l: 'radio--l',
        },
        disabled: {
            true: 'radio--disabled',
        }
    },
    defaultVariants: {
        size: 'm',
        disabled: false
    },
});

export const radioLabelVariants = cva('radio__label', {
    variants: {},
    defaultVariants: {},
});

export const radioDescriptionVariants = cva('radio__description', {
    variants: {},
    defaultVariants: {},
});

export const radioControlVariants = cva('radio__control', {
    variants: {},
    defaultVariants: {},
});

export type RadioVariants = VariantProps<typeof radioVariants>;

export interface RadioProps extends Omit<HTMLAttributes<HTMLInputElement>, 'size' | 'className'>, RadioVariants {
    name?: string;
    value?: string;
    label?: string;
    description?: string;
    disabled?: boolean;
    required?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string; // Re-adding className to allow override
}

export type RadioSize = 's' | 'm' | 'l';

export interface RadioOption {
    label: string;
    value: string;
    description?: string;
    disabled?: boolean;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    name?: string;
    value?: string;
    defaultValue?: string;
    options?: RadioOption[];
    onChange?: (value: string) => void;
    size?: RadioSize;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    label?: string;
    description?: string;
    orientation?: 'horizontal' | 'vertical';
}
