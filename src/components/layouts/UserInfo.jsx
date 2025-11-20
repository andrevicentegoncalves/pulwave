import React from 'react';
import PropTypes from 'prop-types';
import { Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * UserInfo - Flexible user profile component with multiple layout configurations
 * 
 * Features:
 * - Horizontal (default): Avatar, Name, and Logout on same line
 * - Vertical: Avatar, Name, and Logout stacked vertically
 * - Configurable visibility for each element
 * - Responsive to sidebar collapsed state
 * - Keyboard accessible
 * - WCAG AA compliant
 * 
 * Layout Rules:
 * HORIZONTAL (orientation="horizontal"):
 * - Full: Avatar + Name + Logout (same line)
 * - Avatar + Name only (same line)
 * - Avatar + Logout only (same line)
 * - Avatar only
 * - Logout only
 * 
 * VERTICAL (orientation="vertical"):
 * - Full: Avatar + Name + Logout (stacked)
 * - Avatar + Name (stacked)
 * - Avatar + Logout (stacked)
 * 
 * @example
 * // Full horizontal (default)
 * <UserInfo showAvatar showName showLogout orientation="horizontal" />
 * 
 * @example
 * // Avatar + Name vertical
 * <UserInfo showAvatar showName orientation="vertical" />
 * 
 * @example
 * // Avatar only
 * <UserInfo showAvatar />
 */
const UserInfo = ({
    showAvatar = true,
    showName = true,
    showLogout = true,
    orientation = 'horizontal', // 'horizontal' | 'vertical'
    userName = 'Sarah Connor',
    userEmail = 'sarah.connor@pulwave.com',
    avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    onLogout,
    className,
}) => {
    const navigate = useNavigate();

    /**
     * Handle profile click - navigate to profile page
     */
    const handleProfileClick = () => {
        navigate('/profile');
    };

    /**
     * Handle logout click
     */
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            // Default logout behavior
            console.log('Logout clicked - implement your logout logic');
            // Example: logout(), navigate('/login')
        }
    };

    /**
     * Handle keyboard events for avatar
     */
    const handleAvatarKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProfileClick();
        }
    };

    return (
        <div 
            className={`user-info user-info--${orientation} ${className || ''}`}
            role="region"
            aria-label="User profile"
        >
            {/* Avatar */}
            {showAvatar && (
                <img
                    src={avatarUrl}
                    alt={`${userName}'s profile picture`}
                    className="user-info__avatar"
                    onClick={handleProfileClick}
                    onKeyDown={handleAvatarKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${userName}'s profile`}
                />
            )}

            {/* Name & Email */}
            {showName && (
                <div className="user-info__details">
                    <span className="user-info__name">{userName}</span>
                    {userEmail && (
                        <span className="user-info__email">{userEmail}</span>
                    )}
                </div>
            )}

            {/* Logout Button */}
            {showLogout && (
                <button
                    className="user-info__logout"
                    onClick={handleLogout}
                    aria-label="Logout"
                    title="Logout"
                    type="button"
                >
                    <Power size={20} aria-hidden="true" />
                </button>
            )}
        </div>
    );
};

UserInfo.propTypes = {
    showAvatar: PropTypes.bool,
    showName: PropTypes.bool,
    showLogout: PropTypes.bool,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    userName: PropTypes.string,
    userEmail: PropTypes.string,
    avatarUrl: PropTypes.string,
    onLogout: PropTypes.func,
    className: PropTypes.string,
};

export default UserInfo;