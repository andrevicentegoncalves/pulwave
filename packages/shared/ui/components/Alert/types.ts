import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva('alert', {
    variants: {
        status: {
            info: 'alert--info',
            success: 'alert--success',
            warning: 'alert--warning',
            error: 'alert--error',
        },
        variant: {
            subtle: 'alert--subtle',
            solid: 'alert--solid',
            outlined: 'alert--outlined',
        }
    },
    defaultVariants: {
        status: 'info',
        variant: 'subtle',
    },
});

export type AlertProps = VariantProps<typeof alertVariants> & {
    children?: React.ReactNode;
    className?: string;
    dismissible?: boolean;
    onDismiss?: () => void;
    title?: string;
};
