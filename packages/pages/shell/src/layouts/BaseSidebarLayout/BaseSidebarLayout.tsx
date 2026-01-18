/**
 * BaseSidebarLayout Component
 * 
 * Layout with primary sidebar and main content area.
 * On mobile, delegates to MobileShell for consistent mobile UI.
 * 
 * @package @pulwave/pages-shell
 */
import React, { forwardRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@pulwave/utils';
import { Sidebar, useViewport, useSidebarState } from '@pulwave/features-layout';
import { SidebarLayout } from '@pulwave/widgets';
import { MobileShell } from '../MobileShell';
import type { MobileBottomNavItem } from '../MobileShell/types';
import {
    baseSidebarLayoutVariants,
    baseSidebarLayoutMainVariants,
    type BaseSidebarLayoutVariantProps
} from './types';
import './styles/_index.scss';

// Re-export UserData from layout feature
import type { UserData } from '@pulwave/features-layout';
export type { UserData };

/**
 * Navigation item in sidebar
 */
export interface NavItem {
    label: string;
    path: string;
    icon?: React.ComponentType<{ size?: number }>;
}

/**
 * Navigation section with grouped items
 */
export interface NavSection {
    title: string;
    items: NavItem[];
}

export interface BaseSidebarLayoutProps extends Omit<BaseSidebarLayoutVariantProps, 'expanded'> {
    /** Navigation items for sidebar */
    sidebarItems?: NavSection[];
    /** User data for sidebar UserInfo */
    user?: UserData | null;
    /** Logout callback */
    onLogout?: () => void;
    /** Profile click callback */
    onProfileClick?: () => void;
    /** Settings path for default profile navigation */
    settingsPath?: string;
    /** Storage key for sidebar state persistence */
    storageKey?: string;
    /** Fixed main behavior (height 100vh, overflow hidden) */
    fixedMain?: boolean;
    /** Optional sidebar content for structural variant */
    sidebar?: React.ReactNode;
    /** Whether sidebar is collapsed (for structural variant) */
    sidebarCollapsed?: boolean;
    /** Child content */
    children?: React.ReactNode;
    /** Additional class name */
    className?: string;
    /** Mobile bottom navigation items */
    mobileBottomNavItems?: MobileBottomNavItem[];
    /** Active bottom nav item ID */
    mobileActiveSection?: string;
    /** Bottom nav selection handler */
    onMobileSectionChange?: (sectionId: string) => void;
    /** Mobile header title */
    mobileTitle?: string;
}

/**
 * BaseSidebarLayout Main - Content area sub-component
 */
const BaseSidebarLayoutMain = forwardRef<HTMLElement, {
    children?: React.ReactNode;
    fixed?: boolean;
    className?: string;
}>(({ children, fixed, className }, ref) => (
    <main
        ref={ref}
        className={cn(baseSidebarLayoutMainVariants({ fixed }), className)}
        role="main"
    >
        {children}
    </main>
));

BaseSidebarLayoutMain.displayName = 'BaseSidebarLayout.Main';

/**
 * BaseSidebarLayout Sidebar - Sidebar container sub-component
 */
const BaseSidebarLayoutSidebar = forwardRef<HTMLDivElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className }, ref) => (
    <div
        ref={ref}
        className={cn('base-sidebar-layout__sidebar', className)}
        role="navigation"
        aria-label="Main navigation"
    >
        {children}
    </div>
));

BaseSidebarLayoutSidebar.displayName = 'BaseSidebarLayout.Sidebar';

/**
 * BaseSidebarLayout Root - Primary sidebar layout
 */
const BaseSidebarLayoutRoot = forwardRef<HTMLDivElement, BaseSidebarLayoutProps>(({
    sidebarItems,
    user,
    onLogout,
    onProfileClick,
    settingsPath = '/settings',
    storageKey = 'sidebarExpanded',
    children,
    fixedMain = false,
    hideSidebar = false,
    variant = 'default',
    sidebar,
    sidebarCollapsed,
    className,
    mobileBottomNavItems,
    mobileActiveSection,
    onMobileSectionChange,
    mobileTitle = 'App',
    ...props
}, ref) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isMobile } = useViewport();

    const {
        isExpanded: isSidebarExpanded,
        toggleSidebar
    } = useSidebarState({ storageKey });

    // Flatten section-based nav items if needed
    const navItems = sidebarItems
        ? (Array.isArray(sidebarItems[0]?.items)
            ? sidebarItems.flatMap(section =>
                (section.items || []).map((item) => ({
                    ...item,
                    id: item.path,
                    path: item.path,
                }))
            )
            : sidebarItems
        )
        : undefined;

    // Mobile drawer content - renders the sidebar
    const drawerContent = !hideSidebar && (
        <Sidebar
            isExpanded={true}
            toggleSidebar={() => { }}
            variant="primary"
            items={navItems}
            activeItem={location.pathname}
            user={user}
            onLogout={onLogout}
            onProfileClick={onProfileClick || (() => navigate(settingsPath))}
        />
    );

    // Mobile: Use MobileShell
    if (isMobile) {
        return (
            <MobileShell
                header={{
                    title: mobileTitle,
                    showHamburger: !hideSidebar,
                    avatarUrl: user?.avatarUrl,
                    onProfileClick: onProfileClick || (() => navigate(settingsPath)),
                    onLogout
                }}
                drawer={drawerContent}
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

    // Structural Variant: Two fixed containers (sidebar + main)
    if (variant === 'structural') {
        return (
            <SidebarLayout
                ref={ref}
                sidebar={sidebar}
                sidebarCollapsed={sidebarCollapsed}
                sidebarHidden={!!hideSidebar}
                fixed={fixedMain}
                className={className}
                {...props}
            >
                {children}
            </SidebarLayout>
        );
    }

    // Default Variant: Managed Sidebar + Main (Desktop)
    return (
        <SidebarLayout
            ref={ref}
            sidebar={!hideSidebar && (
                <Sidebar
                    isExpanded={isSidebarExpanded}
                    toggleSidebar={toggleSidebar}
                    variant="primary"
                    items={navItems}
                    activeItem={location.pathname}
                    user={user}
                    onLogout={onLogout}
                    onProfileClick={onProfileClick || (() => navigate(settingsPath))}
                    width="100%"
                    position="static"
                />
            )}
            sidebarCollapsed={!isSidebarExpanded}
            sidebarHidden={!!hideSidebar}
            fixed={fixedMain}
            className={className}
            {...props}
        >
            {children || <Outlet />}
        </SidebarLayout>
    );
});

BaseSidebarLayoutRoot.displayName = 'BaseSidebarLayout';

/**
 * BaseSidebarLayout Compound Component
 */
export const BaseSidebarLayout = Object.assign(BaseSidebarLayoutRoot, {
    Main: BaseSidebarLayoutMain,
    Sidebar: BaseSidebarLayoutSidebar,
});

export default BaseSidebarLayout;

