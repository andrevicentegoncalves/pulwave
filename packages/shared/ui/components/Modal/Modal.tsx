
import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@pulwave/utils';
import { modalVariants, type ModalProps } from './types';
import { FocusTrap } from '../FocusTrap';
import { Button } from '../Button';
import { X } from '../../icon-library';
import './styles/_index.scss';

export const ModalRoot = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'm',
    closeOnBackdropClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    scrollableBody = false,
    className,
}: ModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleEscape = useCallback(() => {
        if (closeOnEscape) onClose?.();
    }, [closeOnEscape, onClose]);

    if (!mounted || !isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return createPortal(
        <div className="modal-backdrop" onClick={handleBackdropClick} onKeyDown={(e) => e.key === 'Escape' && onClose?.()} role="presentation">
            <FocusTrap
                active={isOpen}
                onEscape={handleEscape}
                initialFocus={`.modal__close, .modal__body button, .modal__body input, .modal__footer button`}
            >
                <div
                    className={cn(modalVariants({ size, scrollable: scrollableBody }), className)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? 'modal-title' : undefined}
                >
                    {(title || showCloseButton) && (
                        <div className="modal__header">
                            {title && (
                                <h2 id="modal-title" className="modal__title">
                                    {title}
                                </h2>
                            )}
                            {showCloseButton && (
                                <button type="button" className="modal__close" onClick={onClose} aria-label="Close modal">
                                    <X size={20} aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    )}
                    <div className={cn('modal__body', scrollableBody && 'modal__body--scrollable')}>
                        {children}
                    </div>
                    {footer && <div className="modal__footer">{footer}</div>}
                </div>
            </FocusTrap>
        </div>,
        document.body
    );
};

ModalRoot.displayName = 'Modal';

// Subcomponents
const ModalHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('modal__header', className)}>{children}</div>
);
ModalHeader.displayName = 'Modal.Header';

const ModalBody = ({ children, className, scrollable }: { children: React.ReactNode; className?: string; scrollable?: boolean }) => (
    <div className={cn('modal__body', scrollable && 'modal__body--scrollable', className)}>{children}</div>
);
ModalBody.displayName = 'Modal.Body';

const ModalFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('modal__footer', className)}>{children}</div>
);
ModalFooter.displayName = 'Modal.Footer';

export const Modal = Object.assign(ModalRoot, {
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
});
