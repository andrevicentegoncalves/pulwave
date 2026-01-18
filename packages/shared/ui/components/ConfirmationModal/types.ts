
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export type ConfirmationVariant = 'danger' | 'warning' | 'info' | 'question';

export const confirmationModalVariants = cva('confirmation-modal', {
    variants: {
        variant: {
            danger: 'confirmation-modal--danger',
            warning: 'confirmation-modal--warning',
            info: 'confirmation-modal--info',
            question: 'confirmation-modal--question',
        }
    },
    defaultVariants: {
        variant: 'warning'
    }
});

export const confirmationModalIconVariants = cva('confirmation-modal__icon', {
    variants: {
        variant: {
            danger: 'confirmation-modal__icon--danger',
            warning: 'confirmation-modal__icon--warning',
            info: 'confirmation-modal__icon--info',
            question: 'confirmation-modal__icon--question',
        }
    }
});

export interface ConfirmationModalProps extends VariantProps<typeof confirmationModalVariants> {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    children?: React.ReactNode;
}
