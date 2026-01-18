/**
 * NestedSidebarShell Component
 *
 * Out-of-the-box secondary sidebar shell with:
 * - White variant sidebar container
 * - Nested menu navigation
 * - Collapse/expand toggle
 *
 * @package @pulwave/pages-shell
 */
import { useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { ChevronLeft, ChevronRight } from '@pulwave/ui';
import { nestedSidebarShellVariants, type NestedSidebarShellVariantProps } from './types';
import './styles/_index.scss';

export interface MenuItem {
    id?: string;
    label: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    path?: string;
    items?: MenuItem[];
}

export interface NestedSidebarShellProps extends NestedSidebarShellVariantProps {
    /** Child content (typically Menu component) */
    children?: React.ReactNode;
    /** Controlled expanded state */
    isExpanded?: boolean;
    /** Callback when expanded state changes */
    onExpandedChange?: (expanded: boolean) => void;
    /** Show toggle button */
    showToggle?: boolean;
    /** Additional CSS classes */
    className?: string;

    // Props injected by SectionLayout (need to be accepted but not used)
    isCollapsed?: boolean;
    toggleSidebar?: () => void;
    onExpand?: () => void;
    position?: string;
}

/**
 * NestedSidebarShell - Drop-in secondary navigation wrapper
 *
 * Usage:
 * ```tsx
 * <NestedSidebarShell isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
 *   <Menu items={items} activeItem={activeItem} onItemClick={handleClick} />
 * </NestedSidebarShell>
 * ```
 */
export const NestedSidebarShell = ({
    children,
    isExpanded: controlledIsExpanded,
    onExpandedChange,
    showToggle = true,
    className,
    variant = 'white',
    // Filter out props injected by SectionLayout to prevent DOM warnings
    isCollapsed: _isCollapsed,
    toggleSidebar: _toggleSidebar,
    onExpand: _onExpand,
    position: _position,
    ...props
}: NestedSidebarShellProps) => {
    // Internal state for uncontrolled mode
    const [internalIsExpanded, setInternalIsExpanded] = useState(true);

    // Determine if controlled or uncontrolled
    const isControlled = controlledIsExpanded !== undefined;
    const isExpanded = isControlled ? controlledIsExpanded : internalIsExpanded;

    // Toggle handler
    const handleToggle = useCallback(() => {
        const newValue = !isExpanded;
        if (isControlled && onExpandedChange) {
            onExpandedChange(newValue);
        } else {
            setInternalIsExpanded(newValue);
        }
    }, [isExpanded, isControlled, onExpandedChange]);

    return (
        <div
            className={cn(
                nestedSidebarShellVariants({ variant, collapsed: !isExpanded }),
                'nested-sidebar-shell',
                className
            )}
            {...props}
        >
            {showToggle && (
                <div className="nested-sidebar-shell__header">
                    <button
                        className="nested-sidebar-shell__toggle"
                        onClick={handleToggle}
                        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                        title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                        type="button"
                    >
                        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            )}

            <div className="nested-sidebar-shell__content">
                {children}
            </div>
        </div>
    );
};

NestedSidebarShell.displayName = 'NestedSidebarShell';

export default NestedSidebarShell;
