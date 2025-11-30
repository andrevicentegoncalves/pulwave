import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../layout/Sidebar';

/**
 * DashboardLayout - Main application layout with sidebar
 * 
 * Features:
 * - Persistent sidebar state (localStorage)
 * - Responsive content area that adjusts to sidebar width
 * - Smooth transitions when sidebar expands/collapses
 * - Mobile-optimized with overlay behavior
 * 
 * @example
 * // In your router configuration:
 * <Route element={<DashboardLayout />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 *   <Route path="/property" element={<Property />} />
 * </Route>
 */
const DashboardLayout = ({ children }) => {
    // Initialize sidebar state from localStorage or default to expanded
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
        const saved = localStorage.getItem('sidebarExpanded');
        return saved !== null ? JSON.parse(saved) : true;
    });

    /**
     * Toggle sidebar and persist state
     */
    const toggleSidebar = () => {
        setIsSidebarExpanded((prev) => {
            const newState = !prev;
            localStorage.setItem('sidebarExpanded', JSON.stringify(newState));
            return newState;
        });
    };

    /**
     * Handle window resize - collapse sidebar on mobile by default
     */
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile && isSidebarExpanded) {
                setIsSidebarExpanded(false);
            }
        };

        handleResize(); // Check on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Only run on mount

    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content Area */}
            <main
                className={`dashboard-layout__main ${isSidebarExpanded ? 'dashboard-layout__main--shifted' : ''}`}
                role="main"
                aria-label="Main content"
            >
                {/* Render child routes or children */}
                {children || <Outlet />}
            </main>
        </div>
    );
};

DashboardLayout.propTypes = {
    children: PropTypes.node,
};

export default DashboardLayout;