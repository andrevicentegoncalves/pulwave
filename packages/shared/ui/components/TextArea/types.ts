import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const textAreaVariants = cva('text-area', {
    variants: {
        fullWidth: {
            true: 'text-area--full-width',
        },
        disabled: {
            true: 'text-area--disabled',
        },
        error: {
            true: 'text-area--error',
        },
        success: {
            true: 'text-area--success',
        },
        resize: {
            none: 'text-area--resize-none',
            vertical: 'text-area--resize-vertical',
            horizontal: 'text-area--resize-horizontal',
            both: 'text-area--resize-both',
        }
    },
    defaultVariants: {
        fullWidth: false,
        resize: 'vertical'
    }
});

export interface TextAreaProps
    extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    Omit<VariantProps<typeof textAreaVariants>, 'disabled'> {
    label?: string;
    helperText?: React.ReactNode;
    size?: 's' | 'm' | 'l';
}
