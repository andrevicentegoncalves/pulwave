import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../navigation/Sidebar';
import { authService } from '../../services';
import { Spinner } from '../ui';
import { ADMIN_NAV_SECTIONS } from '../admin/sidebarConfig';

/**
 * DashboardLayout - Unified application layout with sidebar
 * 
 * Features:
 * - Supports both app and admin modes via `mode` prop
 * - Persistent sidebar state (localStorage)
 * - Responsive content area that adjusts to sidebar width
 * - Admin mode includes role-based access control
 * - Mobile-optimized with overlay behavior
 * 
 * @example
 * // App mode (default)
 * <Route element={<DashboardLayout />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 * 
 * // Admin mode
 * <Route element={<DashboardLayout mode="admin" />}>
 *   <Route path="/admin/*" element={<AdminPage />} />
 * </Route>
 */
const DashboardLayout = ({ children, mode = 'app' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Admin-specific state
    const [loading, setLoading] = useState(mode === 'admin');
    const [profile, setProfile] = useState(null);

    // Different localStorage keys for app vs admin sidebar
    const storageKey = mode === 'admin' ? 'adminSidebarCollapsed' : 'sidebarExpanded';

    // Initialize sidebar state from localStorage
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (mode === 'admin') {
            // Admin stores "collapsed" state, invert for expanded
            return saved !== null ? !JSON.parse(saved) : true;
        }
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Admin access check
    useEffect(() => {
        if (mode !== 'admin') return;

        const checkAdminAccess = async () => {
            try {
                const { hasAccess, profile: userProfile } = await authService.verifyAdminAccess();

                if (!hasAccess) {
                    navigate(userProfile ? '/' : '/auth', { replace: true });
                    return;
                }

                setProfile(userProfile);
            } catch (error) {
                console.error('Admin access check failed:', error);
                navigate('/auth', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        checkAdminAccess();
    }, [mode, navigate]);

    /**
     * Toggle sidebar and persist state
     */
    const toggleSidebar = () => {
        setIsSidebarExpanded((prev) => {
            const newState = !prev;
            if (mode === 'admin') {
                localStorage.setItem(storageKey, JSON.stringify(!newState));
            } else {
                localStorage.setItem(storageKey, JSON.stringify(newState));
            }
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

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show loading spinner for admin mode
    if (loading) {
        return (
            <div className="dashboard-layout dashboard-layout--loading">
                <Spinner size={32} />
            </div>
        );
    }

    // Admin uses same branded sidebar as app - neutral is for secondary sidebars in SectionLayout
    const sidebarVariant = 'primary';

    // Convert admin nav sections to flat items for Sidebar
    const adminItems = mode === 'admin'
        ? ADMIN_NAV_SECTIONS.flatMap(section =>
            section.items.map(item => ({
                ...item,
                id: item.to,
                path: item.to,
                section: section.title,
            }))
        )
        : undefined;

    return (
        <div className={`dashboard-layout dashboard-layout--${mode}`}>
            {/* Sidebar Navigation */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
                variant={sidebarVariant}
                items={adminItems}
                activeItem={location.pathname}
            />

            {/* Main Content Area */}
            <main
                className={`dashboard-layout__main ${isSidebarExpanded ? 'dashboard-layout__main--shifted' : ''}`}
                role="main"
                aria-label={mode === 'admin' ? 'Admin content' : 'Main content'}
            >
                {children || <Outlet />}
            </main>
        </div>
    );
};

DashboardLayout.propTypes = {
    children: PropTypes.node,
    /** Layout mode: 'app' (default) or 'admin' */
    mode: PropTypes.oneOf(['app', 'admin']),
};

export default DashboardLayout;