import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva('input', {
    variants: {
        fullWidth: {
            true: 'input--full-width',
        },
        disabled: {
            true: 'input--disabled',
        },
        error: {
            true: 'input--error',
        },
        success: {
            true: 'input--success',
        }
    },
    defaultVariants: {
        fullWidth: false,
    }
});

export const inputContainerVariants = cva('input__container', {
    variants: {
        size: {
            s: 'input__container--s',
            m: 'input__container--m',
            l: 'input__container--l',
        },
        hasLeftIcon: { true: 'input__container--has-left-icon' },
        hasRightIcon: { true: 'input__container--has-right-icon' },
    },
    defaultVariants: {
        size: 'm',
    }
});

export type InputProps = VariantProps<typeof inputVariants> &
    VariantProps<typeof inputContainerVariants> &
    Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> & {
        label?: React.ReactNode;
        helperText?: React.ReactNode;
        leftIcon?: React.ReactNode;
        rightIcon?: React.ReactNode;
        as?: 'input' | 'textarea';
    };
