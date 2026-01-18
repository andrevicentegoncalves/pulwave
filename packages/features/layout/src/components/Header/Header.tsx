/**
 * Header Component
 * 
 * Flexible header with optional title, theme toggle, and sidebar toggle.
 * Can be configured for different layout needs.
 * 
 * @package @pulwave/features-navigation
 */
import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { Icon, MenuIcon } from '@pulwave/ui';
import { headerVariants, type HeaderVariantProps } from './types';
import './styles/_index.scss';

export interface HeaderProps extends HeaderVariantProps {
    /** Sidebar toggle handler */
    toggleSidebar?: () => void;
    /** Whether sidebar is expanded */
    isExpanded?: boolean;
    /** Whether to show sidebar toggle button */
    showSidebarToggle?: boolean;
    /** Title to display */
    title?: string;
    /** Custom title component (overrides title prop) */
    titleComponent?: React.ReactNode;
    /** Whether to show title */
    hasTitle?: boolean;
    /** Theme toggle element */
    themeToggle?: React.ReactNode;
    /** Whether to show theme toggle */
    hasThemeToggle?: boolean;
    /** Right side content (e.g., user info) */
    rightContent?: React.ReactNode;
    /** Breadcrumbs component */
    breadcrumbs?: React.ReactNode;
    /** Additional class name */
    className?: string;
}

/**
 * Header Left Section - Sub-component
 */
const HeaderLeft = forwardRef<HTMLDivElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className }, ref) => (
    <div ref={ref} className={cn('app-header__left', className)}>
        {children}
    </div>
));

HeaderLeft.displayName = 'Header.Left';

/**
 * Header Right Section - Sub-component
 */
const HeaderRight = forwardRef<HTMLDivElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className }, ref) => (
    <div ref={ref} className={cn('app-header__right', className)}>
        {children}
    </div>
));

HeaderRight.displayName = 'Header.Right';

/**
 * Header Title - Sub-component
 */
const HeaderTitle = forwardRef<HTMLHeadingElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className }, ref) => (
    <h1 ref={ref} className={cn('app-header__title', className)}>
        {children}
    </h1>
));

HeaderTitle.displayName = 'Header.Title';

/**
 * Header Breadcrumbs - Sub-component
 */
const HeaderBreadcrumbs = forwardRef<HTMLDivElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className }, ref) => (
    <div ref={ref} className={cn('app-header__breadcrumbs', className)}>
        {children}
    </div>
));

HeaderBreadcrumbs.displayName = 'Header.Breadcrumbs';

/**
 * Header Root
 */
const HeaderRoot = forwardRef<HTMLElement, HeaderProps>(({
    toggleSidebar,
    isExpanded,
    showSidebarToggle = false,
    title,
    titleComponent,
    hasTitle = false,
    themeToggle,
    hasThemeToggle = false,
    rightContent,
    breadcrumbs,
    size,
    sticky,
    sidebarExpanded,
    className,
    ...props
}, ref) => {
    return (
        <header
            ref={ref}
            className={cn(headerVariants({ size, sticky, sidebarExpanded }), className)}
            {...props}
        >
            <div className="app-header__main">
                <HeaderLeft>
                    {showSidebarToggle && toggleSidebar && (
                        <button
                            className="app-header__menu-btn"
                            onClick={toggleSidebar}
                            aria-label="Toggle navigation menu"
                            type="button"
                        >
                            <MenuIcon size={24} aria-hidden="true" />
                        </button>
                    )}
                    {hasTitle && (
                        titleComponent || (title && <HeaderTitle>{title}</HeaderTitle>)
                    )}
                </HeaderLeft>

                <HeaderRight>
                    {hasThemeToggle && themeToggle}
                    {rightContent}
                </HeaderRight>
            </div>
            {breadcrumbs && <HeaderBreadcrumbs>{breadcrumbs}</HeaderBreadcrumbs>}
        </header>
    );
});

HeaderRoot.displayName = 'Header';

/**
 * Header Compound Component
 */
export const Header = Object.assign(HeaderRoot, {
    Left: HeaderLeft,
    Right: HeaderRight,
    Title: HeaderTitle,
    Breadcrumbs: HeaderBreadcrumbs,
});

export default Header;
