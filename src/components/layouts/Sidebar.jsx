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
import Wave from '../ui/Wave';
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
    const sidebarRef = useRef(null);
    const [showWave, setShowWave] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

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
     * Calculate if wave should be visible based on available space
     * Wave is 370px tall - only show if there's enough free space after menu items
     * This prevents wave from overlapping with menu items
     */
    useEffect(() => {
        const checkWaveVisibility = () => {
            // Hide wave when sidebar is collapsed
            if (!sidebarRef.current || !isExpanded) {
                setShowWave(false);
                return;
            }

            // Use actual DOM measurements for more accuracy
            const sidebar = sidebarRef.current;
            const sidebarInner = sidebar.querySelector('.sidebar');
            const menuContainer = sidebar.querySelector('.sidebar__menu') || sidebar.querySelector('.menu-items');
            const profileContainer = sidebar.querySelector('.user-info-container') || sidebar.querySelector('.sidebar-user');
            
            if (!sidebarInner) {
                setShowWave(false);
                return;
            }
            
            const sidebarHeight = sidebarInner.clientHeight;
            const waveHeight = 370; // Wave SVG fixed height
            const minClearance = 50; // Minimum safety margin
            
            // Get actual heights from DOM when available
            let contentHeight = 60; // Header fallback
            
            if (menuContainer) {
                contentHeight += menuContainer.offsetHeight + 20; // Add padding
            } else {
                // Fallback calculation
                contentHeight += menuItems.length * 56;
            }
            
            if (profileContainer) {
                contentHeight += profileContainer.offsetHeight + 20;
            } else {
                // Fallback
                contentHeight += 120;
            }
            
            // Calculate available space
            const availableSpace = sidebarHeight - contentHeight;
            const requiredSpace = waveHeight + minClearance;
            
            // Only show if there's clear space - no overlap allowed
            setShowWave(availableSpace >= requiredSpace);
        };

        // Initial check with slight delay to ensure DOM is ready
        const timeoutId = setTimeout(checkWaveVisibility, 100);
        
        // Recheck on window resize
        window.addEventListener('resize', checkWaveVisibility);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkWaveVisibility);
        };
    }, [menuItems.length, isExpanded]);

    // Get current path, defaulting to dashboard
    const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

    return (
        <>
            {/* Mobile Header - only visible on small screens */}
            <Header toggleSidebar={toggleSidebar} />

            {/* Overlay for mobile sidebar */}
            <div 
                className={`sidebar-overlay ${isExpanded && isMobile ? 'visible' : ''}`}
                onClick={toggleSidebar}
                aria-hidden="true"
            />

            {/* Main Sidebar Container */}
            <aside 
                className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}
                ref={sidebarRef}
                aria-label="Main navigation"
            >
                <div className="sidebar">
                    {/* Toggle Button - Desktop only */}
                    <SidebarToggle 
                        isExpanded={isExpanded} 
                        toggleSidebar={toggleSidebar}
                    />

                    {/* Navigation Menu */}
                    <div className="sidebar__menu">
                        <Menu
                            items={menuItems}
                            activeItem={currentPath}
                            onItemClick={handleItemClick}
                            isCollapsed={!isExpanded}
                        />
                    </div>

                    {/* User Profile Section - Responsive Orientation */}
                    <UserInfo 
                        showAvatar={true}
                        showName={isExpanded}
                        showLogout={isExpanded}
                        orientation={isExpanded ? 'horizontal' : 'vertical'}
                    />

                    {/* Decorative Wave - only when expanded AND sufficient space available */}
                    {showWave && <Wave />}
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