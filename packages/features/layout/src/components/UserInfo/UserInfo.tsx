/**
 * UserInfo Component
 *
 * Displays user avatar, name, email, and logout button.
 * Self-contained - receives user data and callbacks as props.
 *
 * @package @pulwave/pages-shell
 */
import { Avatar, Icon, Power } from '@pulwave/ui';
import { cn } from '@pulwave/utils';
import './styles/_index.scss';

import { type UserData } from '../../types';

export interface UserInfoProps {
    /** User data to display */
    user?: UserData | null;
    /** Show avatar */
    showAvatar?: boolean;
    /** Show name and email */
    showName?: boolean;
    /** Show logout button */
    showLogout?: boolean;
    /** Layout orientation */
    orientation?: 'horizontal' | 'vertical';
    /** Size variant */
    size?: 's' | 'm' | 'l';
    /** Logout callback */
    onLogout?: () => void;
    /** Profile click callback - navigates to settings */
    onProfileClick?: () => void;
    /** Additional className */
    className?: string;
}

/**
 * UserInfo - User profile display component
 */
const UserInfo = ({
    user,
    showAvatar = true,
    showName = true,
    showLogout = true,
    orientation = 'horizontal',
    size = 'm',
    onLogout,
    onProfileClick,
    className = '',
}: UserInfoProps) => {
    if (!user) return null;

    const userName = user.fullName || user.email?.split('@')[0] || 'User';
    const userEmail = user.email;
    const avatarUrl = user.avatarUrl;

    const sizeMap = {
        s: 's' as const,
        m: 'm' as const,
        l: 'l' as const,
    };

    return (
        <div className={cn('user-info', `user-info--${orientation}`, `user-info--${size}`, className)}>
            {showAvatar && (
                <button
                    type="button"
                    className="user-info__avatar-button"
                    onClick={onProfileClick}
                    title="Go to settings"
                >
                    <Avatar
                        src={avatarUrl}
                        fallback={userName?.[0]?.toUpperCase() || 'U'}
                        size={sizeMap[size]}
                    />
                </button>
            )}
            {showName && (
                <button
                    type="button"
                    className="user-info__details"
                    onClick={onProfileClick}
                    title="Go to settings"
                >
                    <span className="user-info__name">{userName}</span>
                    {userEmail && <span className="user-info__email">{userEmail}</span>}
                </button>
            )}
            {showLogout && onLogout && (
                <button
                    className="user-info__logout flex items-center justify-center"
                    onClick={onLogout}
                    title="Sign out"
                    type="button"
                >
                    <Icon size={size === 's' ? 's' : 'm'}>
                        <Power />
                    </Icon>
                </button>
            )}
        </div>
    );
};

UserInfo.displayName = 'UserInfo';

export { UserInfo };
export default UserInfo;


