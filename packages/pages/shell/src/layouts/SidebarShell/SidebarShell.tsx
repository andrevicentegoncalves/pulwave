/**
 * SidebarShell Component
 *
 * Experience-layer wrapper around UI SidebarBase.
 * Provides app-level composition and can add analytics, feature flags, etc.
 *
 * @package @pulwave/pages-shell
 */
import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { SidebarBase } from '@pulwave/ui';
import { sidebarShellVariants, type SidebarShellVariantProps } from './types';
import './styles/_index.scss';

export interface SidebarShellProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className'>, SidebarShellVariantProps {
    /** Child content (Sidebar inner content) */
    children?: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Position behavior */
    position?: 'fixed' | 'static' | 'sticky';
    /** Color variant */
    variant?: 'primary' | 'neutral' | 'white';
}

/**
 * SidebarShell Header - Wraps SidebarBase.Header
 */
const SidebarShellHeader = forwardRef<HTMLElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className, ...props }, ref) => (
    <SidebarBase.Header ref={ref} className={cn('sidebar-shell__header', className)} {...props}>
        {children}
    </SidebarBase.Header>
));

SidebarShellHeader.displayName = 'SidebarShell.Header';

/**
 * SidebarShell Content - Wraps SidebarBase.Content
 */
const SidebarShellContent = forwardRef<HTMLDivElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className, ...props }, ref) => (
    <SidebarBase.Content ref={ref} className={cn('sidebar-shell__content', className)} {...props}>
        {children}
    </SidebarBase.Content>
));

SidebarShellContent.displayName = 'SidebarShell.Content';

/**
 * SidebarShell Footer - Wraps SidebarBase.Footer
 */
const SidebarShellFooter = forwardRef<HTMLElement, {
    children?: React.ReactNode;
    className?: string;
}>(({ children, className, ...props }, ref) => (
    <SidebarBase.Footer ref={ref} className={cn('sidebar-shell__footer', className)} {...props}>
        {children}
    </SidebarBase.Footer>
));

SidebarShellFooter.displayName = 'SidebarShell.Footer';

/**
 * SidebarShell Root - Wraps SidebarBase with experience-level concerns
 */
const SidebarShellRoot = forwardRef<HTMLElement, SidebarShellProps & { isCollapsed?: boolean; isExpanded?: boolean }>(({
    children,
    className,
    collapsed,
    isCollapsed,
    isExpanded, // Extract to prevent DOM leak
    position = 'static',
    variant,
    ...props
}, ref) => {
    // Determine collapsed state from either prop
    const isCollapsedState = collapsed ?? isCollapsed ?? false;

    return (
        <SidebarBase
            ref={ref}
            collapsed={isCollapsedState}
            position={position}
            variant={variant}
            className={cn(sidebarShellVariants({ collapsed: isCollapsedState }), className)}
            {...props}
        >
            {children}
        </SidebarBase>
    );
});

SidebarShellRoot.displayName = 'SidebarShell';

/**
 * SidebarShell Compound Component
 */
export const SidebarShell = Object.assign(SidebarShellRoot, {
    Header: SidebarShellHeader,
    Content: SidebarShellContent,
    Footer: SidebarShellFooter,
});

export default SidebarShell;

