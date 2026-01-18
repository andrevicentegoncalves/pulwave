import { cva, type VariantProps } from 'class-variance-authority';

// CVA for Spinner component - using BEM class names
export const spinnerVariants = cva('spinner', {
    variants: {
        size: {
            xs: 'spinner--xs',
            s: 'spinner--s',
            m: 'spinner--m',
            l: 'spinner--l',
            xl: 'spinner--xl',
        },
        color: {
            primary: 'spinner--primary',
            secondary: 'spinner--secondary',
            neutral: 'spinner--neutral',
            inherit: 'spinner--inherit',
            success: 'spinner--success',
            error: 'spinner--error',
            warning: 'spinner--warning',
            info: 'spinner--info',
        },
    },
    defaultVariants: {
        size: 'm',
        color: 'primary',
    },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;

export type SpinnerSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type SpinnerColor = 'primary' | 'secondary' | 'neutral' | 'inherit' | 'success' | 'error' | 'warning' | 'info';

export interface SpinnerProps extends SpinnerVariants {
    size?: SpinnerSize;
    color?: SpinnerColor;
    className?: string;
    testId?: string;
}
