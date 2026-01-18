import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastType = ToastVariant;
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

// CVA for the Toast Container (positioning)
export const toastContainerVariants = cva('toast-container', {
    variants: {
        position: {
            'top-left': 'toast-container--top-left',
            'top-right': 'toast-container--top-right',
            'bottom-left': 'toast-container--bottom-left',
            'bottom-right': 'toast-container--bottom-right',
            'top-center': 'toast-container--top-center',
            'bottom-center': 'toast-container--bottom-center',
        },
    },
    defaultVariants: {
        position: 'bottom-right',
    },
});

export type ToastContainerVariantProps = VariantProps<typeof toastContainerVariants>;

export interface ToastProps {
    message: ReactNode;
    variant?: ToastVariant;
    onClose?: () => void;
    className?: string; // Add className prop
}

export interface ToastProviderProps extends ToastContainerVariantProps {
    children: ReactNode;
    className?: string;
}
