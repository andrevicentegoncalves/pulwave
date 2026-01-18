import React, { useEffect, useCallback } from 'react';
import { cn, useMediaQuery } from '@pulwave/utils';
import { X } from '../../icon-library';
import { drawerVariants, type DrawerProps, type DrawerPosition } from './types';
import { FocusTrap } from '../FocusTrap';
import { Text } from '../Text';
import './styles/_index.scss';

const DrawerRoot = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    position = 'right',
    size = 'm',
    closeOnBackdropClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    responsive = false,
    className,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
}: DrawerProps) => {
    const isMobile = useMediaQuery('md');
    const effectivePosition: DrawerPosition = responsive && !isMobile ? 'bottom' : position;

    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = originalOverflow; };
    }, [isOpen]);

    const handleEscape = useCallback(() => {
        if (closeOnEscape) onClose?.();
    }, [closeOnEscape, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    const titleId = ariaLabelledBy || (title ? 'drawer-title' : undefined);

    return (
        <div className="drawer-backdrop" onClick={handleBackdropClick} onKeyDown={(e) => e.key === 'Escape' && onClose?.()} role="presentation">
            <FocusTrap
                active={isOpen}
                onEscape={handleEscape}
                initialFocus={`.drawer__close, .drawer__body button`}
            >
                <aside
                    className={cn(drawerVariants({ position: effectivePosition, size }), className)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={ariaDescribedBy}
                >
                    {(title || showCloseButton) && (
                        <header className="drawer__header">
                            {title && (
                                <Text as="h2" category="title" size="m" id={titleId} className="drawer__title">
                                    {title}
                                </Text>
                            )}
                            {showCloseButton && (
                                <button type="button" className="drawer__close" onClick={onClose} aria-label="Close drawer">
                                    <X size={20} aria-hidden="true" />
                                </button>
                            )}
                        </header>
                    )}
                    <div className="drawer__body">{children}</div>
                    {footer && <footer className="drawer__footer">{footer}</footer>}
                </aside>
            </FocusTrap>
        </div>
    );
};
DrawerRoot.displayName = 'Drawer';

// Compound Sub-components
const DrawerHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <header className={cn('drawer__header', className)}>{children}</header>
);
DrawerHeader.displayName = 'Drawer.Header';

const DrawerBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('drawer__body', className)}>{children}</div>
);
DrawerBody.displayName = 'Drawer.Body';

const DrawerFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <footer className={cn('drawer__footer', className)}>{children}</footer>
);
DrawerFooter.displayName = 'Drawer.Footer';

const DrawerClose = ({ onClose, className }: { onClose?: () => void; className?: string }) => (
    <button type="button" className={cn('drawer__close', className)} onClick={onClose} aria-label="Close drawer">
        <X size={20} aria-hidden="true" />
    </button>
);
DrawerClose.displayName = 'Drawer.Close';

export const Drawer = Object.assign(DrawerRoot, {
    Header: DrawerHeader,
    Body: DrawerBody,
    Footer: DrawerFooter,
    Close: DrawerClose,
});
