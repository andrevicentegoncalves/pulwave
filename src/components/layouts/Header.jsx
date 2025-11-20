import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Header - Unified header component
 * 
 * Features:
 * - Mobile: Shows hamburger menu, profile image, and logout button
 * - Desktop: Can be extended for future desktop header needs
 * - Fixed position at top on mobile
 * - Responsive visibility controls
 * 
 * @example
 * <Header toggleSidebar={handleToggle} />
 */
const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        // TODO: Implement actual logout logic
        console.log('Logout clicked');
    };

    return (
        <header className="mobile-header">
            {/* Menu Toggle */}
            <button 
                className="mobile-menu-btn" 
                onClick={toggleSidebar}
                aria-label="Toggle navigation menu"
                type="button"
            >
                <Menu size={24} aria-hidden="true" />
            </button>

            {/* Right Side Actions */}
            <div className="mobile-header-right">
                {/* User Profile Image */}
                <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User profile"
                    className="mobile-profile-image"
                    onClick={handleProfileClick}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleProfileClick();
                        }
                    }}
                    role="button"
                    tabIndex={0}
                />

                {/* Logout Button */}
                <button 
                    className="mobile-logout-btn" 
                    onClick={handleLogout}
                    aria-label="Logout"
                    title="Logout"
                    type="button"
                >
                    <Power size={20} aria-hidden="true" />
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
};

export default Header;