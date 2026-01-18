/**
 * MobileShell Component
 * 
 * Unified mobile layout container that encapsulates all mobile-specific UI patterns.
 * Provides header, bottom nav, and drawer - shared by all layout components.
 * 
 * Only renders on mobile viewports. On desktop, renders children directly.
 * 
 * @package @pulwave/pages-shell
 */
import { useState, useEffect } from 'react';
import { cn } from '@pulwave/utils';
import { MobileHeader, MobileBottomNav, MobileDrawer, useViewport } from '@pulwave/features-layout';
import type { MobileShellProps } from './types';
import './styles/_index.scss';

export const MobileShell = ({
    children,
    header,
    drawer,
    bottomNav,
    className
}: MobileShellProps) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { isMobile } = useViewport();

    // Close drawer when viewport changes to desktop
    useEffect(() => {
        if (!isMobile && isDrawerOpen) {
            setIsDrawerOpen(false);
        }
    }, [isMobile, isDrawerOpen]);

    const handleMenuToggle = () => {
        setIsDrawerOpen(prev => !prev);
    };

    // On desktop, just render children (no mobile shell)
    if (!isMobile) {
        return <>{children}</>;
    }

    return (
        <div className={cn('mobile-shell', className)}>
            {/* Header */}
            {header && (
                <MobileHeader
                    {...header}
                    onMenuToggle={handleMenuToggle}
                />
            )}

            {/* Main Content */}
            <main className="mobile-shell__content">
                {children}
            </main>

            {/* Bottom Navigation */}
            {bottomNav && (
                <MobileBottomNav
                    items={bottomNav.items}
                    activeId={bottomNav.activeId}
                    onSelect={bottomNav.onSelect}
                />
            )}

            {/* Drawer */}
            {drawer && (
                <MobileDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                >
                    {drawer}
                </MobileDrawer>
            )}
        </div>
    );
};

MobileShell.displayName = 'MobileShell';

export default MobileShell;

