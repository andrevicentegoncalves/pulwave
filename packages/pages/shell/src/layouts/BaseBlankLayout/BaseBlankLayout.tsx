/**
 * BaseBlankLayout Component
 * 
 * Layout with mobile header only (no sidebar).
 * On mobile, delegates to MobileShell for consistent mobile UI.
 * 
 * @package @pulwave/pages-shell
 */
import React, { useState, useEffect, forwardRef } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@pulwave/utils';
import { MobileShell } from '../MobileShell';
import { BREAKPOINTS } from '../../utils/constants';
import type { MobileBottomNavItem } from '../MobileShell/types';
import { baseBlankLayoutVariants, type BaseBlankLayoutVariantProps } from './types';
import './styles/_index.scss';

export interface BaseBlankLayoutProps extends BaseBlankLayoutVariantProps {
    /** Child content to render */
    children?: React.ReactNode;
    /** Additional CSS class */
    className?: string;
    /** Mobile bottom navigation items */
    mobileBottomNavItems?: MobileBottomNavItem[];
    /** Active bottom nav item ID */
    mobileActiveSection?: string;
    /** Bottom nav selection handler */
    onMobileSectionChange?: (sectionId: string) => void;
    /** Mobile header title */
    mobileTitle?: string;
    /** User avatar URL */
    avatarUrl?: string;
    /** Profile click handler */
    onProfileClick?: () => void;
    /** Logout handler */
    onLogout?: () => void;
    /** Drawer content for mobile */
    mobileDrawer?: React.ReactNode;
}

/**
 * BaseBlankLayout Main - Content area sub-component
 */
const BaseBlankLayoutMain = forwardRef<HTMLElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className }, ref) => (
    <main ref={ref} className={cn('base-blank-layout__main', className)} role="main">
        {children}
    </main>
));

BaseBlankLayoutMain.displayName = 'BaseBlankLayout.Main';

/**
 * BaseBlankLayout Root - Mobile header only layout
 */
const BaseBlankLayoutRoot = forwardRef<HTMLDivElement, BaseBlankLayoutProps>(({
    showMobileHeader = true,
    children,
    className,
    mobileBottomNavItems,
    mobileActiveSection,
    onMobileSectionChange,
    mobileTitle = 'App',
    avatarUrl,
    onProfileClick,
    onLogout,
    mobileDrawer,
    ...props
}, ref) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= BREAKPOINTS.M);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mobile: Use MobileShell
    if (isMobile && showMobileHeader) {
        return (
            <MobileShell
                header={{
                    title: mobileTitle,
                    showHamburger: !!mobileDrawer,
                    avatarUrl,
                    onProfileClick,
                    onLogout
                }}
                drawer={mobileDrawer}
                bottomNav={mobileBottomNavItems ? {
                    items: mobileBottomNavItems,
                    activeId: mobileActiveSection || '',
                    onSelect: onMobileSectionChange || (() => { })
                } : undefined}
                className={className}
            >
                {children || <Outlet />}
            </MobileShell>
        );
    }

    // Desktop: Simple layout
    return (
        <div
            ref={ref}
            className={cn(baseBlankLayoutVariants({ showMobileHeader }), className)}
            {...props}
        >
            <BaseBlankLayoutMain>
                {children || <Outlet />}
            </BaseBlankLayoutMain>
        </div>
    );
});

BaseBlankLayoutRoot.displayName = 'BaseBlankLayout';

/**
 * BaseBlankLayout Compound Component
 */
export const BaseBlankLayout = Object.assign(BaseBlankLayoutRoot, {
    Main: BaseBlankLayoutMain,
});

export default BaseBlankLayout;

