/**
 * MobileDrawer Component
 *
 * Full-screen slide-in drawer for mobile navigation.
 * Contains primary sidebar content (user info, app nav, etc.)
 *
 * @package @pulwave/pages-shell
 */
import { useEffect } from 'react';
import { X } from '@pulwave/ui';
import { Icon } from '@pulwave/ui';
import { cn } from '@pulwave/utils';
import type { MobileDrawerProps } from './types';

export const MobileDrawer = ({
    isOpen,
    onClose,
    children,
    className
}: MobileDrawerProps) => {
    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    'mobile-shell__drawer-backdrop',
                    isOpen && 'mobile-shell__drawer-backdrop--open'
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                className={cn(
                    'mobile-shell__drawer',
                    isOpen && 'mobile-shell__drawer--open',
                    className
                )}
                aria-hidden={!isOpen}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                <div className="mobile-shell__drawer-header">
                    <button
                        className="mobile-shell__drawer-close"
                        onClick={onClose}
                        aria-label="Close menu"
                        type="button"
                    >
                        <X size={24} aria-hidden="true" />
                    </button>
                </div>

                <div className="mobile-shell__drawer-content">
                    {children}
                </div>
            </aside>
        </>
    );
};

MobileDrawer.displayName = 'MobileShell.Drawer';

export default MobileDrawer;

