import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { authService } from '../../services';
import { Spinner } from '../../components/ui';

/**
 * AdminLayout - Main layout wrapper for admin backoffice
 * 
 * Features:
 * - Role-based access control (admin/super_admin only)
 * - Collapsible sidebar with localStorage persistence
 * - Responsive design with mobile overlay
 * - Dev bypass support for local development
 */
const AdminLayout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('adminSidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Fetch user profile and check admin access
    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const { hasAccess, profile: userProfile } = await authService.verifyAdminAccess();

                if (!hasAccess) {
                    // Redirect to home if not admin or not logged in
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
    }, [navigate]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => {
            const newState = !prev;
            localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
            return newState;
        });
    };

    // Close mobile sidebar on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileOpen) {
                setIsMobileOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileOpen]);

    if (loading) {
        return (
            <div className="admin-loading">
                <Spinner className="admin-loading__spinner" size={32} />
            </div>
        );
    }

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="admin-layout__overlay"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            {/* Sidebar (Handles its own implementation and overlay) */}
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={toggleSidebar}
                user={profile}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
            />

            {/* Main Content */}
            <main
                className={`admin-layout__main ${isSidebarCollapsed ? 'admin-layout__main--collapsed' : ''}`}
                role="main"
                aria-label="Admin content"
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
