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
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import UserInfo from './UserInfo';
import SidebarWave from './SidebarWave';
import MobileHeader from './MobileHeader';

/**
 * Sidebar - Main navigation component
 * 
 * Features:
 * - Collapsible sidebar with smooth transitions
 * - Mobile-responsive with overlay
 * - Active route highlighting with curved design
 * - User profile section
 * - Decorative wave animation
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
     * Calculate if wave should be visible based on sidebar height and content
     * Wave is 370px tall - hide if it overlaps with menu items significantly
     */
    useEffect(() => {
        const checkWaveVisibility = () => {
            if (!sidebarRef.current) return;

            const sidebarHeight = sidebarRef.current.clientHeight;
            const headerHeight = 60;
            const menuHeight = menuItems.length * 60; // Approximate item height
            const profileHeight = 100;
            const waveHeight = 370;
            
            // Allow 100px overlap before hiding wave
            const availableSpace = sidebarHeight - headerHeight - menuHeight - profileHeight;
            setShowWave(availableSpace > (waveHeight - 100));
        };

        checkWaveVisibility();
        window.addEventListener('resize', checkWaveVisibility);
        return () => window.removeEventListener('resize', checkWaveVisibility);
    }, [menuItems.length, isExpanded]);

    // Get current path, defaulting to dashboard
    const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

    return (
        <>
            {/* Mobile Header - only visible on small screens */}
            <MobileHeader toggleSidebar={toggleSidebar} />

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
                    <SidebarHeader 
                        isExpanded={isExpanded} 
                        toggleSidebar={toggleSidebar}
                    />

                    {/* Navigation Menu */}
                    <SidebarMenu
                        items={menuItems}
                        activeItem={currentPath}
                        onItemClick={handleItemClick}
                        isExpanded={isExpanded}
                    />

                    {/* User Profile Section */}
                    <UserInfo 
                        showAvatar={true}
                        showName={isExpanded}      // Responsive to sidebar state
                        showLogout={isExpanded}    // Responsive to sidebar state
                        orientation="horizontal"
                    />

                    {/* Decorative Wave - only when expanded and space available */}
                    {isExpanded && showWave && <SidebarWave />}
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