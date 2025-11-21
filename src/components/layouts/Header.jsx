import React from 'react';
import PropTypes from 'prop-types';
import SidebarToggle from './SidebarToggle';
import UserInfo from './UserInfo';

/**
 * Header - Unified header component
 * 
 * Features:
 * - Mobile: Shows sidebar toggle and user profile
 * - Uses SidebarToggle and UserInfo components
 * - Fixed position at top on mobile
 */
const Header = ({ toggleSidebar, isExpanded }) => {
    const handleLogout = () => {
        // TODO: Implement actual logout logic
        console.log('Logout clicked');
    };

    return (
        <header className="mobile-header">
            <div className="mobile-header__left">
                <SidebarToggle isExpanded={isExpanded} toggleSidebar={toggleSidebar} isMobile={true} />
            </div>

            <div className="mobile-header__right">
                <UserInfo
                    showAvatar={true}
                    showName={false}
                    showLogout={true}
                    orientation="horizontal"
                    size="s"
                    onLogout={handleLogout}
                    className="mobile-header-userinfo"
                />
            </div>
        </header>
    );
};

Header.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool,
};

export default Header;