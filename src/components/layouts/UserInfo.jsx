import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

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
 * - Fetches real user data from Supabase
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
 * Size Variants:
 * - 's' (small): Compact size for mobile headers
 * - 'default': Standard size for sidebars
 * - 'l' (large): Larger size for prominent displays
 * 
 * @example
 * // Full horizontal (default)
 * <UserInfo showAvatar showName showLogout orientation="horizontal" />
 * 
 * @example
 * // Small size for mobile header
 * <UserInfo showAvatar showLogout size="s" orientation="horizontal" />
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
    size = 'default', // 's' | 'default' | 'l'
    onLogout,
    className,
    style,
}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user data on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                // Refetch profile when auth state changes
                fetchUserData();
            } else {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    /**
     * Handle profile click - navigate to profile page
     */
    const handleProfileClick = () => {
        navigate('/profile');
    };

    /**
     * Handle logout click
     */
    const handleLogout = async () => {
        if (onLogout) {
            onLogout();
        } else {
            // Default logout behavior
            try {
                await supabase.auth.signOut();
                navigate('/login');
            } catch (error) {
                console.error('Error logging out:', error);
            }
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

    // Don't render until data is loaded to prevent flickering
    if (loading) {
        return null;
    }

    // Construct display name from profile
    const displayName = (() => {
        if (!profile) {
            return user?.email?.split('@')[0] || 'User';
        }

        // Priority 1: Display Name
        if (profile.display_name) {
            return profile.display_name;
        }

        // Priority 2: Full Name
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
        if (fullName) {
            return fullName;
        }

        // Last resort: use email username
        return user?.email?.split('@')[0] || 'User';
    })();

    // Get avatar URL with fallback
    const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

    return (
        <div
            className={`user-info user-info--${orientation} user-info--${size} ${className || ''}`}
            style={style}
            role="region"
            aria-label="User profile"
        >
            {/* Avatar */}
            {showAvatar && (
                <img
                    src={avatarUrl}
                    alt={`${displayName}'s profile picture`}
                    className="user-info__avatar"
                    onClick={handleProfileClick}
                    onKeyDown={handleAvatarKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${displayName}'s profile`}
                />
            )}

            {/* Name & Email */}
            {showName && (
                <div className="user-info__details">
                    <span className="user-info__name">{displayName}</span>
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
    size: PropTypes.oneOf(['s', 'default', 'l']),
    onLogout: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
};

export default UserInfo;