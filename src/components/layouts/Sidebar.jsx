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
import { VisualEffect } from '../ui';
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
const Sidebar = ({ isExpanded, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [showWave, setShowWave] = useState(true);

    // Refs for measuring space
    const menuRef = useRef(null);

    // Menu configuration
    const menuItems = [
        { id: '/dashboard', icon: ChartNoAxesCombined, label: 'Dashboard' },
        { id: '/property', icon: Home, label: 'Property' },
        { id: '/buildings', icon: Building, label: 'Buildings' },
        { id: '/lights', icon: Lamp, label: 'Lights' },
        { id: '/security', icon: ShieldCheck, label: 'Security' },
        { id: '/location', icon: MapPin, label: 'Location' },
        { id: '/users', icon: Users, label: 'Users' },
        { id: '/analytics', icon: LayoutGrid, label: 'Analytics' },
        { id: '/settings', icon: Settings, label: 'Settings' },
        { id: '/profile', icon: User, label: 'Profile' },
        { id: '/style-guide', icon: Palette, label: 'Style Guide' },
    ];

    /**
     * Handle menu item click
     * Navigate to route and close sidebar on mobile
     */
    const handleItemClick = (path) => {
        navigate(path);

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
                console.log('Wave hidden: menu ref or not expanded', { menuRef: !!menuRef.current, isExpanded });
                setShowWave(false);
                return;
            }

            // Find the actual .menu element inside .sidebar__menu
            const actualMenu = menuRef.current.querySelector('.menu');
            if (!actualMenu) {
                console.log('Wave hidden: .menu element not found');
                setShowWave(false);
                return;
            }

            const menuRect = actualMenu.getBoundingClientRect();
            const sidebarRect = menuRef.current.closest('.sidebar').getBoundingClientRect();

            // Calculate space from bottom of menu to bottom of sidebar
            const availableSpace = sidebarRect.bottom - menuRect.bottom;

            console.log('Wave calculation:', {
                menuBottom: menuRect.bottom,
                sidebarBottom: sidebarRect.bottom,
                availableSpace,
                threshold: 300,
                willShow: availableSpace >= 300
            });

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

    // Get current path, defaulting to dashboard
    const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

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
                className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}
                aria-label="Main navigation"
            >
                <div className="sidebar">
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
                            isCollapsed={!isExpanded}
                        />
                    </div>

                    {/* User Profile Section - Responsive Orientation */}
                    <div className="sidebar-user">
                        <UserInfo
                            showAvatar={true}
                            showName={isExpanded}
                            showLogout={true}
                            orientation={isExpanded ? 'horizontal' : 'vertical'}
                        />
                    </div>

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
};

export default Sidebar;