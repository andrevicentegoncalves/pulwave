import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Skeleton from '../ui/Skeleton';

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
        const fetchProfile = async (currentUser) => {
            if (!currentUser) return;
            try {
                const { data: profileData, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('auth_user_id', currentUser.id)
                    .eq('auth_user_id', currentUser.id)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching profile:', error);
                } else {
                    setProfile(profileData);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        const init = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user);
            }
            setLoading(false);
        };

        init();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                fetchProfile(session.user);
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
        navigate('/settings');
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

    // Get avatar size based on size prop
    const getAvatarSize = () => {
        switch (size) {
            case 's':
                return 32;
            case 'default':
                return 40;
            case 'l':
                return 48;
            default:
                return 40;
        }
    };

    // Show skeleton during loading
    if (loading) {
        const avatarSize = getAvatarSize();
        return (
            <div
                className={`user-info user-info--${orientation} user-info--${size} ${className || ''}`}
                style={style}
                role="region"
                aria-label="User profile loading"
            >
                {/* Avatar Skeleton */}
                {showAvatar && (
                    <Skeleton
                        variant="circular"
                        width={avatarSize}
                        height={avatarSize}
                    />
                )}

                {/* Name Skeleton */}
                {showName && (
                    <div className="user-info__details">
                        <Skeleton variant="text" width={100} height={16} />
                    </div>
                )}

                {/* Logout Button Skeleton */}
                {showLogout && (
                    <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                    />
                )}
            </div>
        );
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