import { cva, type VariantProps } from 'class-variance-authority';

export type ButtonKind =
    | 'primary' | 'secondary' | 'tertiary' | 'neutral'
    | 'success' | 'warning' | 'error' | 'info'
    | 'critical' | 'urgent' | 'promotion' | 'premium'
    | 'discovery' | 'maintenance' | 'growth';

export type ButtonVariant = 'filled' | 'outlined' | 'ghost' | 'soft' | 'link';

export const buttonVariants = cva('button', {
    variants: {
        kind: {
            primary: 'button--kind-primary',
            secondary: 'button--kind-secondary',
            tertiary: 'button--kind-tertiary',
            neutral: 'button--kind-neutral',
            success: 'button--kind-success',
            warning: 'button--kind-warning',
            error: 'button--kind-error',
            info: 'button--kind-info',
            critical: 'button--kind-critical',
            urgent: 'button--kind-urgent',
            promotion: 'button--kind-promotion',
            premium: 'button--kind-premium',
            discovery: 'button--kind-discovery',
            maintenance: 'button--kind-maintenance',
            growth: 'button--kind-growth',
        },
        variant: {
            filled: 'button--variant-filled',
            outlined: 'button--variant-outlined',
            ghost: 'button--variant-ghost',
            soft: 'button--variant-soft',
            link: 'button--variant-link',
            // Legacy mapping fallback
            text: 'button--variant-ghost',
        },
        size: {
            xs: 'button--xs',
            s: 'button--s',
            m: 'button--m',
            l: 'button--l',
            xl: 'button--xl',
            '2xl': 'button--2xl',
        },
        shape: {
            default: '',
            pill: 'button--shape-pill',
            circle: 'button--shape-circle',
            square: 'button--shape-square',
        },
        fullWidth: {
            true: 'button--full-width',
            false: '',
        },
        loading: {
            true: 'button--loading',
            false: '',
        },
    },
    defaultVariants: {
        kind: 'primary',
        variant: 'filled',
        size: 'm',
        shape: 'default',
        fullWidth: false,
        loading: false,
    },
});

export type ButtonProps = Omit<VariantProps<typeof buttonVariants>, 'fullWidth' | 'loading'> & {
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    loading?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>;
