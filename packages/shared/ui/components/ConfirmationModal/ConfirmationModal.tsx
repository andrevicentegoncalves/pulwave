
import React from 'react';
import { AlertTriangle, Info, HelpCircle } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Icon } from '../Icon';
import {
    confirmationModalVariants,
    confirmationModalIconVariants,
    type ConfirmationModalProps,
    type ConfirmationVariant
} from './types';
import './styles/_index.scss';

const iconMap: Record<ConfirmationVariant, React.ReactNode> = {
    danger: <AlertTriangle size={24} aria-hidden="true" />,
    warning: <AlertTriangle size={24} aria-hidden="true" />,
    info: <Info size={24} aria-hidden="true" />,
    question: <HelpCircle size={24} aria-hidden="true" />
};

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
    loading = false,
    children
}: ConfirmationModalProps) => {
    const handleConfirm = () => { onConfirm(); if (!loading && onClose) onClose(); };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="s"
            showCloseButton={false}
            closeOnBackdropClick={!loading}
            closeOnEscape={!loading}
        >
            <div className={cn(confirmationModalVariants({ variant }))}>
                <div className="confirmation-modal__header">
                    <div className={cn(confirmationModalIconVariants({ variant }))} aria-hidden="true">
                        {variant && iconMap[variant as ConfirmationVariant]}
                    </div>
                    <h3 className="confirmation-modal__title">{title}</h3>
                </div>
                <div className="confirmation-modal__body">
                    {message && <p className="confirmation-modal__message">{message}</p>}
                    {children}
                </div>
                <div className="confirmation-modal__actions">
                    {cancelText && (
                        <Button
                            kind="secondary"
                            variant="outlined"
                            onClick={onClose}
                            disabled={loading}
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        kind={variant === 'danger' ? 'error' : 'primary'}
                        onClick={handleConfirm}
                        loading={loading}
                        disabled={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

ConfirmationModal.displayName = 'ConfirmationModal';
