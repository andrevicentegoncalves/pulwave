import { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Input } from '../Input';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const inlineEditVariants = cva('inline-edit', {
    variants: {
        size: {
            s: 'inline-edit--s',
            m: 'inline-edit--m',
            l: 'inline-edit--l',
        },
        fullWidth: {
            true: 'inline-edit--full-width',
        },
        disabled: {
            true: 'inline-edit--disabled',
        },
        editing: {
            true: 'inline-edit--editing',
        }
    },
    defaultVariants: {
        size: 'm',
        fullWidth: false,
        disabled: false,
        editing: false,
    },
});

export type InlineEditVariantProps = VariantProps<typeof inlineEditVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export type InlineEditProps = Omit<InlineEditVariantProps, 'disabled'> & {
    /** Disabled state */
    disabled?: boolean;
    /** Controlled value */
    value?: string;
    /** Default value for uncontrolled usage */
    defaultValue?: string;
    /** Callback when value is validated/saved */
    onSave?: (value: string) => void;
    /** Callback when edit is cancelled */
    onCancel?: () => void;
    /** Callback on input change */
    onChange?: (value: string) => void;
    /** Layout label */
    label?: string;
    /** Placeholder when empty */
    placeholder?: string;
    /** Render as input or textarea */
    as?: 'input' | 'textarea';
    /** Custom class name */
    className?: string;
    /** Icon to display in view mode on hover */
    showEditIcon?: boolean;
    /** Input props to pass through */
    inputProps?: ComponentProps<typeof Input>;
};
