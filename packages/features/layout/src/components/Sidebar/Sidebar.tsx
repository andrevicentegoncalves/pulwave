/**
 * Sidebar Component
 * 
 * Main navigation sidebar with menu, user info, and visual effects.
 * Self-contained - receives user data and callbacks as props.
 * 
 * @package @pulwave/features-navigation
 */
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@pulwave/utils';
import { SidebarToggle, VisualEffect, Logo } from '@pulwave/ui';
import { Menu } from '../Menu';
import { UserInfo } from '../UserInfo/UserInfo';
import type { UserData } from '@pulwave/features-layout';
import { BREAKPOINTS } from '@pulwave/utils';
import { sidebarContainerVariants, sidebarVariants, type SidebarContainerVariantProps, type SidebarVariantProps } from './types';
import './styles/_index.scss';

export interface SidebarProps extends Omit<SidebarContainerVariantProps, 'expanded'>, Omit<SidebarVariantProps, 'collapsed'> {
    // ... no changes to interface ...
    isExpanded?: boolean;
    toggleSidebar?: () => void;
    items?: any[];
    showUserInfo?: boolean;
    onSelect?: (path: string) => void;
    activeItem?: string;
    width?: string | number;
    user?: UserData | null;
    onLogout?: () => void;
    onProfileClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    /** Loading state */
    loading?: boolean;
    /** Logo subtitle (e.g. "Admin") */
    logoSubtitle?: string;
}

// Sub-components for compound pattern
const SidebarOverlay = ({ visible, onClick }: { visible: boolean; onClick: () => void }) => {
    if (!visible) return null;
    return (
        <div
            className="sidebar-overlay"
            onClick={onClick}
            aria-hidden="true"
        />
    );
};

const SidebarMenu = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
    ({ children }, ref) => (
        <div ref={ref} className="sidebar-menu">
            {children}
        </div>
    )
);
SidebarMenu.displayName = 'SidebarMenu';

const SidebarUser = ({ children }: { children: React.ReactNode }) => (
    <div className="sidebar-user">
        {children}
    </div>
);

const SidebarRoot = forwardRef<HTMLElement, SidebarProps>(({
    isExpanded: isExpandedProp,
    toggleSidebar: toggleSidebarProp,
    items,
    showUserInfo = true,
    variant = 'primary',
    compact = false,
    position = 'fixed',
    onSelect,
    activeItem,
    width,
    user,
    onLogout,
    onProfileClick,
    loading = false, // Add loading props if needed or ignore
    logoSubtitle,
    children,
    className,
    ...props
}, ref) => {
    // ... hook logic ...
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [showWave, setShowWave] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Internal state fallback
    const [internalExpanded, setInternalExpanded] = useState(true);

    const isExpanded = isExpandedProp !== undefined ? isExpandedProp : internalExpanded;
    const toggleSidebar = toggleSidebarProp || (() => setInternalExpanded(prev => !prev));

    const handleItemClick = (path: string) => {
        if (onSelect) {
            onSelect(path);
            if (isMobile && isExpanded) {
                toggleSidebar();
            }
            return;
        }

        if (typeof path === 'string') {
            navigate(path);
        }

        if (isMobile && isExpanded) {
            toggleSidebar();
        }
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= BREAKPOINTS.M);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const calculateSpace = () => {
            if (!menuRef.current || !isExpanded) {
                setShowWave(false);
                return;
            }

            const actualMenu = menuRef.current.querySelector('.menu');
            if (!actualMenu) {
                setShowWave(false);
                return;
            }

            const menuRect = actualMenu.getBoundingClientRect();
            const sidebarEl = menuRef.current.closest('.sidebar');
            if (!sidebarEl) return;

            const sidebarRect = sidebarEl.getBoundingClientRect();
            const availableSpace = sidebarRect.bottom - menuRect.bottom;

            setShowWave(availableSpace >= 300);
        };

        calculateSpace();
        window.addEventListener('resize', calculateSpace);
        const resizeObserver = new ResizeObserver(calculateSpace);
        if (menuRef.current) {
            resizeObserver.observe(menuRef.current);
        }

        return () => {
            window.removeEventListener('resize', calculateSpace);
            resizeObserver.disconnect();
        };
    }, [isExpanded]);


    // V2: Items are required - no default fallback
    // Note: items prop is required in V2

    const menuItems = items || [];
    const currentPath = activeItem || location.pathname;

    return (
        <>
            {/* Overlay for mobile - only for fixed sidebars */}
            {position !== 'static' && (
                <SidebarOverlay
                    visible={isExpanded && isMobile}
                    onClick={toggleSidebar}
                />
            )}

            <aside
                ref={ref}
                className={cn(sidebarContainerVariants({ expanded: isExpanded, position }), className)}
                aria-label="Main navigation"
                style={width ? { width } : {}}
                {...props}
            >
                <div className={cn(sidebarVariants({ variant, compact, collapsed: !isExpanded }))}>
                    <div className="sidebar-header">
                        <Logo collapsed={!isExpanded} subtitle={logoSubtitle} />
                        <SidebarToggle
                            isExpanded={isExpanded}
                            toggleSidebar={toggleSidebar}
                        />
                    </div>

                    <SidebarMenu ref={menuRef}>
                        {children ? (
                            React.Children.map(children, child => {
                                if (React.isValidElement(child)) {
                                    return React.cloneElement(child as React.ReactElement<any>, {
                                        isCollapsed: !isExpanded,
                                        onExpand: () => setInternalExpanded(true)
                                    });
                                }
                                return child;
                            })
                        ) : (
                            <Menu
                                items={menuItems}
                                activeItem={currentPath}
                                onItemClick={handleItemClick}
                                isCollapsed={!isExpanded && !isMobile}
                            />
                        )}
                    </SidebarMenu>

                    {showUserInfo && user && (
                        <SidebarUser>
                            <UserInfo
                                user={user}
                                showAvatar={true}
                                showName={isExpanded || isMobile}
                                showLogout={true}
                                orientation={(isExpanded || isMobile) ? 'horizontal' : 'vertical'}
                                onLogout={onLogout}
                                onProfileClick={onProfileClick}
                            />
                        </SidebarUser>
                    )}

                    {isExpanded && showWave && <VisualEffect variant="sidebar-wave" />}
                </div>
            </aside>
        </>
    );
});

SidebarRoot.displayName = 'Sidebar';

/**
 * Sidebar Compound Component
 */
export const Sidebar = Object.assign(SidebarRoot, {
    Menu: SidebarMenu,
    User: SidebarUser,
    Overlay: SidebarOverlay,
});

export default Sidebar;
