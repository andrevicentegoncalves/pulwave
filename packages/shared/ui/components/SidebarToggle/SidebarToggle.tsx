
import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { ChevronLeft, MenuIcon } from '../../icon-library';
import { sidebarToggleVariants, type SidebarToggleProps } from './types';
import './styles/_index.scss';

/**
 * SidebarToggle - Sidebar expand/collapse button
 * Uses CSS class for rotation to ensure smooth animation synced with sidebar
 */
export const SidebarToggle = forwardRef<HTMLDivElement, SidebarToggleProps>(({
    isExpanded,
    toggleSidebar,
    isMobile,
    className,
    variant = 'primary',
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(sidebarToggleVariants({ variant }), className)}
            {...props}
        >
            <button
                className={cn('toggle-btn', !isExpanded && 'toggle-btn--collapsed')}
                onClick={toggleSidebar}
                aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-expanded={isExpanded}
                type="button"
            >
                {isMobile ? (
                    <MenuIcon size={24} aria-hidden="true" />
                ) : (
                    <ChevronLeft
                        size={20}
                        aria-hidden="true"
                        className="toggle-icon"
                    />
                )}
            </button>
        </div>
    );
});

SidebarToggle.displayName = 'SidebarToggle';

export default SidebarToggle;
