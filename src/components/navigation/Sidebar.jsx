import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    ChartNoAxesCombined,
    Home,
    Building,
    Lamp,
    ShieldCheck,
    MapPin,
    Users,
    LayoutGrid,
    Settings,
    User,
    Palette,
} from 'lucide-react';
import SidebarToggle from './SidebarToggle';
import Menu from './Menu';
import UserInfo from './UserInfo';
import VisualEffect from '../ui/VisualEffect.jsx';
import Header from './Header';

/**
 * Sidebar - Main navigation component
 * 
 * Features:
 * - Collapsible sidebar with smooth transitions
 * - Mobile-responsive with overlay
 * - Active route highlighting with curved design
 * - User profile section with responsive orientation
 * - Decorative wave animation (only when space available)
 * - Full keyboard navigation support
 * - WCAG AA compliant
 * 
 * @example
 * <Sidebar isExpanded={true} toggleSidebar={handleToggle} />
 */
const Sidebar = ({
    isExpanded,
    toggleSidebar,
    items,
    showUserInfo = true,
    variant = 'primary', // 'primary' | 'neutral'
    compact = false,     // Compact mode for denser item spacing
    position = 'fixed',   // 'fixed' | 'static'
    onSelect,
    activeItem,
    width // Optional width override
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [showWave, setShowWave] = useState(false);
    const menuRef = useRef(null);

    const handleItemClick = (path) => {
        // If onSelect callback is provided, use it instead of navigation
        // This allows components like Master Data to handle selection without routing
        if (onSelect && typeof onSelect === 'function') {
            onSelect(path);
            // Auto-close sidebar on mobile after selection
            if (isMobile && isExpanded) {
                toggleSidebar();
            }
            return;
        }

        // Default behavior: navigate to the path
        if (typeof path === 'string') {
            navigate(path);
        }

        // Auto-close sidebar on mobile after navigation
        if (isMobile && isExpanded) {
            toggleSidebar();
        }
    };

    /**
     * Check if device is mobile
     */
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    /**
     * Calculate available space and show/hide wave
     * Wave only shows when there's at least 300px from bottom of menu to bottom of sidebar
     */
    useEffect(() => {
        const calculateSpace = () => {
            if (!menuRef.current || !isExpanded) {
                setShowWave(false);
                return;
            }

            // Find the actual .menu element inside .sidebar__menu
            const actualMenu = menuRef.current.querySelector('.menu');
            if (!actualMenu) {
                setShowWave(false);
                return;
            }

            const menuRect = actualMenu.getBoundingClientRect();
            // Check if closest .sidebar exists
            const sidebarEl = menuRef.current.closest('.sidebar');
            if (!sidebarEl) return;

            const sidebarRect = sidebarEl.getBoundingClientRect();

            // Calculate space from bottom of menu to bottom of sidebar
            const availableSpace = sidebarRect.bottom - menuRect.bottom;

            // Show wave only if there's at least 300px of space
            setShowWave(availableSpace >= 300);
        };

        // Calculate on mount and when expanded state changes
        calculateSpace();

        // Recalculate on window resize
        window.addEventListener('resize', calculateSpace);

        // Use ResizeObserver to detect menu content changes
        const resizeObserver = new ResizeObserver(calculateSpace);
        if (menuRef.current) {
            resizeObserver.observe(menuRef.current);
        }

        return () => {
            window.removeEventListener('resize', calculateSpace);
            resizeObserver.disconnect();
        };
    }, [isExpanded]);

    // Menu configuration
    const defaultMenuItems = [
        { id: '/dashboard', icon: ChartNoAxesCombined, label: 'Dashboard' },
        { id: '/assets', icon: Building, label: 'Assets' },
        { id: '/lights', icon: Lamp, label: 'Lights' },
        { id: '/security', icon: ShieldCheck, label: 'Security' },
        { id: '/location', icon: MapPin, label: 'Location' },
        { id: '/users', icon: Users, label: 'Users' },
        { id: '/analytics', icon: LayoutGrid, label: 'Analytics' },
        { id: '/settings', icon: Settings, label: 'Settings' },
        { id: '/profile', icon: User, label: 'Profile' },
        { id: '/style-guide', icon: Palette, label: 'Style Guide' },
    ];

    const menuItems = items || defaultMenuItems;

    // Get current path, defaulting to dashboard, or use provided activeItem
    const currentPath = activeItem || (location.pathname === '/' ? '/dashboard' : location.pathname);

    return (
        <>
            {/* Mobile Header - only visible on small screens */}
            <Header toggleSidebar={toggleSidebar} isExpanded={isExpanded} />

            {/* Overlay for mobile sidebar */}
            <div
                className={`sidebar-overlay ${isExpanded && isMobile ? 'visible' : ''}`}
                onClick={toggleSidebar}
                aria-hidden="true"
            />

            {/* Main Sidebar Container */}
            <aside
                className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'} ${position === 'static' ? 'sidebar-container--static' : ''}`}
                aria-label="Main navigation"
                style={width ? { width } : {}}
            >
                <div className={`sidebar ${variant === 'neutral' ? 'sidebar--neutral' : ''} ${compact ? 'sidebar--compact' : ''}`}>
                    {/* Toggle Button - Desktop only */}
                    <SidebarToggle
                        isExpanded={isExpanded}
                        toggleSidebar={toggleSidebar}
                    />

                    {/* Navigation Menu */}
                    <div className="sidebar__menu" ref={menuRef}>
                        <Menu
                            items={menuItems}
                            activeItem={currentPath}
                            onItemClick={handleItemClick}
                            isCollapsed={!isExpanded && !isMobile}
                        />
                    </div>

                    {/* User Profile Section - Responsive Orientation */}
                    {showUserInfo && (
                        <div className="sidebar-user">
                            <UserInfo
                                showAvatar={true}
                                showName={isExpanded || isMobile}
                                showLogout={true}
                                orientation={(isExpanded || isMobile) ? 'horizontal' : 'vertical'}
                            />
                        </div>
                    )}

                    {/* Decorative Wave - only show when there's enough space */}
                    {isExpanded && showWave && <VisualEffect variant="sidebar-wave" />}
                </div>
            </aside>
        </>
    );
};

Sidebar.propTypes = {
    isExpanded: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    items: PropTypes.array,
    showUserInfo: PropTypes.bool,
    variant: PropTypes.oneOf(['primary', 'neutral']),
    compact: PropTypes.bool,
    position: PropTypes.oneOf(['fixed', 'static']),
    onSelect: PropTypes.func,
    activeItem: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Sidebar;