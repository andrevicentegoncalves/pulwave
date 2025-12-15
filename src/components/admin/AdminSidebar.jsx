import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import SidebarToggle from '../navigation/SidebarToggle';
import Menu from '../navigation/Menu';
import UserInfo from '../navigation/UserInfo';
import { ADMIN_NAV_SECTIONS } from './sidebarConfig';

/**
 * AdminSidebar - Navigation sidebar for admin backoffice
 * Matches the structure of the main Sidebar component but with admin routing and light styling.
 */
const AdminSidebar = ({ isCollapsed, onToggle, isMobileOpen, onMobileClose, width, position = 'fixed' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);

    // Check mobile state strictly for layout purposes (if needed internal checks)
    // But we largely rely on props from layout
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleItemClick = (path) => {
        navigate(path);
        if (isMobile && onMobileClose) {
            onMobileClose();
        }
    };

    // Determine expansion state
    const isExpanded = !isCollapsed;

    return (
        <>
            {/* Overlay for mobile sidebar (managed here or layout? Main sidebar does it here) */}
            <div
                className={`sidebar-overlay ${isMobileOpen ? 'visible' : ''}`}
                onClick={onMobileClose}
                aria-hidden="true"
            />

            <aside
                className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'} ${isMobile ? (isMobileOpen ? 'expanded' : '') : ''} ${position === 'static' ? 'sidebar-container--static' : ''} ${isMobile && !isMobileOpen ? 'sidebar-container--mobile-hidden' : ''}`}
                style={width ? { width } : undefined}
            >
                <div className="sidebar sidebar--compact">
                    {/* Header / Toggle */}
                    <SidebarToggle
                        isExpanded={isExpanded}
                        toggleSidebar={onToggle}
                        isMobile={isMobile}
                    />

                    {/* Navigation */}
                    <div className="sidebar__menu">
                        <div className="menu menu--admin-spacing">
                            {ADMIN_NAV_SECTIONS.map((section) => (
                                <div key={section.title} className="menu__section">
                                    {isExpanded && (
                                        <div className="menu__section-title">
                                            {section.title}
                                        </div>
                                    )}
                                    <Menu
                                        items={section.items.map(item => ({ ...item, id: item.to }))}
                                        activeItem={location.pathname}
                                        onItemClick={handleItemClick}
                                        isCollapsed={!isExpanded}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="sidebar-user">
                        <UserInfo
                            showAvatar={true}
                            showName={isExpanded}
                            showLogout={true}
                            orientation={isExpanded ? 'horizontal' : 'vertical'}
                        />
                    </div>
                </div>
            </aside>
        </>
    );
};

AdminSidebar.propTypes = {
    isCollapsed: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    isMobileOpen: PropTypes.bool,
    onMobileClose: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    position: PropTypes.oneOf(['fixed', 'static']),
};

export default AdminSidebar;
