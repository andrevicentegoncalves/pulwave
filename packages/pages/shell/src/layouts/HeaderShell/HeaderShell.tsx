/**
 * HeaderShell Component
 *
 * Pure page header component (title bar + breadcrumbs).
 * Does NOT wrap content - use as sibling to other layouts.
 *
 * @package @pulwave/pages-shell
 */
import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { Text } from '@pulwave/ui';
import { headerShellVariants, type HeaderShellVariantProps } from './types';
import './styles/_index.scss';

export interface HeaderShellProps extends HeaderShellVariantProps {
    /** Page title */
    title?: string;
    /** Icon to display before the title */
    icon?: React.ElementType;
    /** Breadcrumb navigation (renders below title) */
    breadcrumbs?: React.ReactNode;
    /** Action elements (e.g., ThemeToggle) */
    actions?: React.ReactNode;
    /** Additional CSS class */
    className?: string;
}

/**
 * HeaderShell Title - Sub-component for title
 */
const HeaderShellTitle = forwardRef<HTMLHeadingElement, {
    children?: React.ReactNode;
    icon?: React.ElementType;
    className?: string;
}>(({ children, icon: Icon, className }, ref) => (
    <Text
        ref={ref}
        as="h1"
        category="heading"
        size="xl"
        weight="bold"
        className={cn('header-shell__title', className)}
    >
        {Icon && <Icon size={24} className="header-shell__title-icon" aria-hidden="true" />}
        <span className="header-shell__title-text">{children}</span>
    </Text>
));

HeaderShellTitle.displayName = 'HeaderShell.Title';

/**
 * HeaderShell Actions - Sub-component for action buttons
 */
const HeaderShellActions = forwardRef<HTMLDivElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className }, ref) => (
    <div ref={ref} className={cn('header-shell__actions', className)}>
        {children}
    </div>
));

HeaderShellActions.displayName = 'HeaderShell.Actions';

/**
 * HeaderShell Breadcrumbs - Sub-component for breadcrumb navigation
 */
const HeaderShellBreadcrumbs = forwardRef<HTMLDivElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className }, ref) => (
    <div ref={ref} className={cn('header-shell__breadcrumbs', className)}>
        {children}
    </div>
));

HeaderShellBreadcrumbs.displayName = 'HeaderShell.Breadcrumbs';

/**
 * HeaderShell Root - Pure page header (no content wrapper)
 *
 * Usage:
 * <>
 *   <HeaderShell title="Page" icon={Icon} actions={...} breadcrumbs={...} />
 *   <SectionLayout sidebar={...}>{content}</SectionLayout>
 * </>
 */
const HeaderShellRoot = forwardRef<HTMLDivElement, HeaderShellProps>(({
    title,
    icon,
    breadcrumbs,
    actions,
    size,
    sticky,
    className,
    ...props
}, ref) => {
    const hasHeader = title || actions;

    if (!hasHeader && !breadcrumbs) {
        return null;
    }

    return (
        <div ref={ref} className="header-shell-wrapper" {...props}>
            {/* Header bar with title and actions */}
            {hasHeader && (
                <header className={cn(headerShellVariants({ size, sticky }), className)}>
                    {title && <HeaderShellTitle icon={icon}>{title}</HeaderShellTitle>}
                    {actions && <HeaderShellActions>{actions}</HeaderShellActions>}
                </header>
            )}

            {/* Breadcrumbs - below header */}
            {breadcrumbs && <HeaderShellBreadcrumbs>{breadcrumbs}</HeaderShellBreadcrumbs>}
        </div>
    );
});

HeaderShellRoot.displayName = 'HeaderShell';

/**
 * HeaderShell Compound Component
 */
export const HeaderShell = Object.assign(HeaderShellRoot, {
    Title: HeaderShellTitle,
    Actions: HeaderShellActions,
    Breadcrumbs: HeaderShellBreadcrumbs,
});

export default HeaderShell;

