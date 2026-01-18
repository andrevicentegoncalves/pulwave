import React from 'react';
import { classNames } from '@pulwave/utils';
import './styles/_index.scss';

export interface SidebarLayoutProps {
    /** The sidebar content (usually <Sidebar>) */
    sidebar: React.ReactNode;
    /** The main content area */
    children: React.ReactNode;
    /** Whether the sidebar is currently hidden/collapsed (visual state) */
    sidebarCollapsed?: boolean;
    /** Whether to hide the sidebar entirely */
    sidebarHidden?: boolean;
    /** Fixed layout mode (full height, no scroll on body) */
    fixed?: boolean;
    /** Additional classes */
    className?: string;
}

export const SidebarLayout = React.forwardRef<HTMLDivElement, SidebarLayoutProps & React.HTMLAttributes<HTMLDivElement>>(({
    sidebar,
    children,
    sidebarCollapsed,
    sidebarHidden,
    fixed = false,
    className,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={classNames(
                'sidebar-layout',
                {
                    'sidebar-layout--fixed': fixed,
                    'sidebar-layout--collapsed': sidebarCollapsed,
                    'sidebar-layout--hidden': sidebarHidden
                },
                className
            )} {...props}>
            {!sidebarHidden && (
                <aside className="sidebar-layout__sidebar">
                    {sidebar}
                </aside>
            )}
            <main className="sidebar-layout__main">
                {children}
            </main>
        </div>
    );
});

SidebarLayout.displayName = 'SidebarLayout';
