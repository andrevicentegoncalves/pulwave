import type { ChangeEvent } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Root CVA
export const checkboxVariants = cva('checkbox', {
    variants: {
        size: {
            s: 'checkbox--s',
            m: 'checkbox--m',
            l: 'checkbox--l',
        },
        colorVariant: {
            primary: 'checkbox--primary',
            neutral: 'checkbox--neutral',
            'neutral-light': 'checkbox--neutral-light',
            inverted: 'checkbox--inverted',
        },
    },
    defaultVariants: {
        size: 'm',
        colorVariant: 'primary',
    },
});

// Container CVA
export const checkboxContainerVariants = cva('checkbox__container', {
    variants: {
        size: {
            s: 'checkbox__container--size-s',
            m: 'checkbox__container--size-m',
            l: 'checkbox__container--size-l',
        }
    },
    defaultVariants: {
        size: 'm'
    }
});

// Input CVA
export const checkboxInputVariants = cva('checkbox__input', {
    variants: {
        size: {
            s: 'checkbox__input--size-s',
            m: 'checkbox__input--size-m',
            l: 'checkbox__input--size-l',
        },
        round: {
            true: 'checkbox__input--round',
        },
        error: {
            true: 'checkbox__input--error',
        },
        indeterminate: {
            true: 'checkbox__input--indeterminate',
        }
    },
    defaultVariants: {
        size: 'm',
        round: false,
        error: false,
        indeterminate: false,
    }
});

// Label CVA
export const checkboxLabelVariants = cva('checkbox__label', {
    variants: {
        size: {
            s: 'checkbox__label--size-s',
            m: 'checkbox__label--size-m',
            l: 'checkbox__label--size-l',
        },
        disabled: {
            true: 'checkbox__label--disabled',
        }
    },
    defaultVariants: {
        size: 'm',
        disabled: false
    }
});

// Helper CVA
export const checkboxHelperVariants = cva('checkbox__helper', {
    variants: {
        size: {
            s: 'checkbox__helper--size-s',
            m: 'checkbox__helper--size-m',
            l: 'checkbox__helper--size-l',
        },
        error: {
            true: 'checkbox__helper--error',
        }
    },
    defaultVariants: {
        size: 'm',
        error: false
    }
});

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;

export type CheckboxSize = 's' | 'm' | 'l';
export type CheckboxColorVariant = 'primary' | 'neutral' | 'neutral-light' | 'inverted';

export interface CheckboxProps extends CheckboxVariants {
    label?: string;
    name?: string;
    id?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    required?: boolean;
    size?: CheckboxSize;
    isSquare?: boolean;
    colorVariant?: CheckboxColorVariant;
    helperText?: string;
    error?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    readOnly?: boolean;
}
