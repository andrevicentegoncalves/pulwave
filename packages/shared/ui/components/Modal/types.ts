
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const modalVariants = cva('modal', {
    variants: {
        size: {
            s: 'modal--s',
            m: 'modal--m',
            l: 'modal--l',
            xl: 'modal--xl',
            full: 'modal--full',
        },
        scrollable: {
            true: 'modal--scrollable',
            false: '',
        }
    },
    defaultVariants: {
        size: 'm',
        scrollable: false,
    },
});

export interface ModalProps extends VariantProps<typeof modalVariants> {
    isOpen: boolean;
    onClose?: () => void;
    title?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    scrollableBody?: boolean;
    className?: string;
}
