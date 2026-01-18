/**
 * SidebarBase Component
 *
 * Pure structural sidebar primitive with scoped tokens.
 * Features/Experience layers extend this with business-specific content.
 *
 * @package @pulwave/ui
 */
import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import {
    sidebarBaseVariants,
    type SidebarBaseProps,
    type SidebarBaseHeaderProps,
    type SidebarBaseContentProps,
    type SidebarBaseFooterProps,
} from './types';
import './styles/_index.scss';

// ==========================================================================
// Sub-Components
// ==========================================================================

/**
 * SidebarBase.Header - Header area for logo, toggle, etc.
 */
const SidebarBaseHeader = forwardRef<HTMLElement, SidebarBaseHeaderProps>(
    ({ children, className, ...props }, ref) => (
        <header
            ref={ref}
            className={cn('sidebar-base__header', className)}
            {...props}
        >
            {children}
        </header>
    )
);

SidebarBaseHeader.displayName = 'SidebarBase.Header';

/**
 * SidebarBase.Content - Main scrollable content area
 */
const SidebarBaseContent = forwardRef<HTMLDivElement, SidebarBaseContentProps>(
    ({ children, className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('sidebar-base__content', className)}
            {...props}
        >
            {children}
        </div>
    )
);

SidebarBaseContent.displayName = 'SidebarBase.Content';

/**
 * SidebarBase.Footer - Footer area for user info, etc.
 */
const SidebarBaseFooter = forwardRef<HTMLElement, SidebarBaseFooterProps>(
    ({ children, className, ...props }, ref) => (
        <footer
            ref={ref}
            className={cn('sidebar-base__footer', className)}
            {...props}
        >
            {children}
        </footer>
    )
);

SidebarBaseFooter.displayName = 'SidebarBase.Footer';

// ==========================================================================
// Root Component
// ==========================================================================

/**
 * SidebarBase - Pure structural sidebar primitive
 */
const SidebarBaseRoot = forwardRef<HTMLElement, SidebarBaseProps>(
    ({ children, className, collapsed, position, variant, ...props }, ref) => (
        <aside
            ref={ref}
            className={cn(
                sidebarBaseVariants({ collapsed, position, variant }),
                className
            )}
            {...props}
        >
            {children}
        </aside>
    )
);

SidebarBaseRoot.displayName = 'SidebarBase';

// ==========================================================================
// Compound Component Export
// ==========================================================================

export const SidebarBase = Object.assign(SidebarBaseRoot, {
    Header: SidebarBaseHeader,
    Content: SidebarBaseContent,
    Footer: SidebarBaseFooter,
});

export default SidebarBase;
