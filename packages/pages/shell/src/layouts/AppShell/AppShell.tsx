/**
 * AppShell Component
 * 
 * Root application container - always delegates scrolling to children.
 * No scroll handling - children manage their own overflow.
 * 
 * @package @pulwave/pages-shell
 */
import React, { forwardRef } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@pulwave/utils';
import { appShellVariants, type AppShellVariantProps } from './types';
import './styles/_index.scss';

export interface AppShellProps extends AppShellVariantProps {
    /** Child content to render */
    children?: React.ReactNode;
    /** Additional CSS class */
    className?: string;
}

/**
 * AppShell Root - Main container component
 */
const AppShellRoot = forwardRef<HTMLDivElement, AppShellProps>(({
    children,
    className,
    loading,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(appShellVariants({ loading }), className)}
            {...props}
        >
            {children || <Outlet />}
        </div>
    );
});

AppShellRoot.displayName = 'AppShell';

/**
 * AppShell Compound Component
 */
export const AppShell = Object.assign(AppShellRoot, {
    displayName: 'AppShell',
});

export default AppShell;

