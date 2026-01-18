/**
 * MobileHeader
 * 
 * Mobile-only header with menu toggle and user actions.
 * Fixed position at top. Only visible on mobile (<= 767px).
 * 
 * @package @ui
 */
import { type ReactNode } from 'react';
import { MenuIcon, Power } from '../../icon-library';
import { cn } from '@pulwave/utils';
import {
    mobileHeaderVariants,
    mobileHeaderMenuBtnVariants,
    mobileHeaderAvatarVariants,
    mobileHeaderLogoutBtnVariants,
    type MobileHeaderProps
} from './types';
import './styles/_index.scss';

/**
 * MobileHeader - Mobile navigation header
 */
export const MobileHeader = ({
    toggleSidebar,
    avatarUrl,
    onProfileClick,
    onLogout,
    className
}: MobileHeaderProps) => {
    return (
        <header className={cn(mobileHeaderVariants(), className)}>
            {/* Left Side - Menu Toggle */}
            <div className="mobile-header__left">
                <button
                    className={cn(mobileHeaderMenuBtnVariants())}
                    onClick={toggleSidebar}
                    aria-label="Toggle navigation menu"
                    type="button"
                >
                    <MenuIcon size={24} aria-hidden="true" />
                </button>
            </div>

            {/* Right Side - User Info */}
            <div className="mobile-header__right">
                <div className="mobile-header__user">
                    {/* User Profile Image */}
                    {avatarUrl && onProfileClick && (
                        <button
                            type="button"
                            className="mobile-header__profile-btn"
                            onClick={onProfileClick}
                            aria-label="Open profile"
                        >
                            <img
                                src={avatarUrl}
                                alt=""
                                width={32}
                                height={32}
                                className={cn(mobileHeaderAvatarVariants())}
                            />
                        </button>
                    )}
                    {avatarUrl && !onProfileClick && (
                        <img
                            src={avatarUrl}
                            alt="User profile"
                            width={32}
                            height={32}
                            className={cn(mobileHeaderAvatarVariants())}
                        />
                    )}

                    {/* Logout Button */}
                    {onLogout && (
                        <button
                            className={cn(mobileHeaderLogoutBtnVariants())}
                            onClick={onLogout}
                            aria-label="Logout"
                            title="Logout"
                            type="button"
                        >
                            <Power size={20} aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

MobileHeader.displayName = 'MobileHeader';

export default MobileHeader;
