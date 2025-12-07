import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../navigation/Sidebar';

/**
 * BaseLayout - Main application layout with sidebar
 * 
 * This is the base layout wrapper for all authenticated pages in the app.
 * It provides a consistent structure with a sidebar and main content area.
 * 
 * Features:
 * - Persistent sidebar state (localStorage)
 * - Responsive content area that adjusts to sidebar width
 * - Smooth transitions when sidebar expands/collapses
 * - Mobile-optimized with overlay behavior
 * 
 * @example
 * // In your router configuration:
 * <Route element={<BaseLayout />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 *   <Route path="/profile" element={<Profile />} />
 * </Route>
 */
const BaseLayout = ({ children }) => {
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
        <div className="base-layout">
            {/* Sidebar Navigation */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content Area */}
            <main
                className={`base-layout__content ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}
                role="main"
                aria-label="Main content"
            >
                {/* Render child routes or children */}
                {children || <Outlet />}
            </main>
        </div>
    );
};

BaseLayout.propTypes = {
    children: PropTypes.node,
};

export default BaseLayout;
