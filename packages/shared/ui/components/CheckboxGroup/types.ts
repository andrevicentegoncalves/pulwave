import { cva, type VariantProps } from 'class-variance-authority';
import type { CheckboxSize, CheckboxColorVariant } from '../Checkbox/types';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const checkboxGroupVariants = cva('checkbox-group', {
    variants: {
        orientation: {
            vertical: 'checkbox-group--vertical',
            horizontal: 'checkbox-group--horizontal',
        },
        size: {
            s: 'checkbox-group--s',
            m: 'checkbox-group--m',
            l: 'checkbox-group--l',
        },
    },
    defaultVariants: {
        orientation: 'vertical',
        size: 'm',
    },
});

export type CheckboxGroupVariantProps = VariantProps<typeof checkboxGroupVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface CheckboxGroupOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}

export interface CheckboxGroupProps extends CheckboxGroupVariantProps {
    name: string;
    options: CheckboxGroupOption[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    label?: string;
    helperText?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    colorVariant?: CheckboxColorVariant;
    className?: string;
}
