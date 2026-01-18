import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

// Root / Button CVA
export const switchVariants = cva('switch', {
    variants: {
        size: {
            s: 'switch--s',
            m: 'switch--m',
            l: 'switch--l',
        },
        colorVariant: {
            primary: 'switch--primary',
            neutral: 'switch--neutral',
            success: 'switch--success',
            warning: 'switch--warning',
            critical: 'switch--critical',
        },
        checked: {
            true: 'switch--checked',
        },
        disabled: {
            true: 'switch--disabled',
        },
        error: {
            true: 'switch--has-error',
        }
    },
    defaultVariants: {
        size: 'm',
        colorVariant: 'primary',
        checked: false,
        disabled: false,
        error: false,
    },
});

export const switchContainerVariants = cva('switch-container', {
    variants: {
        size: {
            s: 'switch-container--s',
            m: 'switch-container--m',
            l: 'switch-container--l',
        }
    },
    defaultVariants: { size: 'm' }
});

export const switchThumbVariants = cva('switch__thumb', {
    variants: {
        size: {
            s: 'switch__thumb--s',
            m: 'switch__thumb--m',
            l: 'switch__thumb--l',
        },
        checked: {
            true: 'switch__thumb--checked',
        }
    },
    defaultVariants: { size: 'm', checked: false }
});

export const switchLabelVariants = cva('switch__label', {
    variants: {
        size: {
            s: 'switch__label--s',
            m: 'switch__label--m',
            l: 'switch__label--l',
        },
        disabled: {
            true: 'switch__label--disabled',
        }
    },
    defaultVariants: { size: 'm', disabled: false }
});

export const switchHelperVariants = cva('switch__helper', {
    variants: {
        size: {
            s: 'switch__helper--s',
            m: 'switch__helper--m',
            l: 'switch__helper--l',
        },
        error: {
            true: 'switch__helper--error',
        }
    },
    defaultVariants: { size: 'm', error: false }
});

export type SwitchVariants = VariantProps<typeof switchVariants>;

export type SwitchSize = 's' | 'm' | 'l';
export type SwitchColorVariant = 'primary' | 'neutral' | 'success' | 'warning' | 'critical';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'color' | 'size' | 'className' | 'disabled'>, Omit<SwitchVariants, 'error'> {
    label?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    helperText?: string;
    error?: string;
    onCheckedChange?: (checked: boolean) => void;
    // For compatibility with form libraries
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string; // Re-adding className for root override
}
