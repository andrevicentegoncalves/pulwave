/**
 * MobileHeader Component
 *
 * Mobile-only header with hamburger menu, title, and user actions.
 * Fixed position at top. Uses Avatar component for user profile.
 *
 * @package @pulwave/pages-shell
 */
import { MenuIcon, Power } from '@pulwave/ui';
import { Icon, Avatar } from '@pulwave/ui';
import { cn } from '@pulwave/utils';
import type { MobileHeaderProps } from './types';

export const MobileHeader = ({
    title,
    showHamburger = true,
    rightActions,
    avatarUrl,
    onProfileClick,
    onLogout,
    onMenuToggle,
    className
}: MobileHeaderProps) => {
    return (
        <header className={cn('mobile-shell__header', className)}>
            {/* Left Side - Menu Toggle */}
            <div className="mobile-shell__header-left">
                {showHamburger && (
                    <button
                        className="mobile-shell__icon-btn"
                        onClick={onMenuToggle}
                        aria-label="Toggle navigation menu"
                        type="button"
                    >
                        <MenuIcon size={24} aria-hidden="true" />
                    </button>
                )}
            </div>

            {/* Center - Title */}
            {title && (
                <div className="mobile-shell__header-center">
                    <span className="mobile-shell__title">{title}</span>
                </div>
            )}

            {/* Right Side - User Actions */}
            <div className="mobile-shell__header-right">
                {rightActions}

                {avatarUrl && (
                    <button
                        className="mobile-shell__icon-btn"
                        onClick={onProfileClick}
                        aria-label="Open profile"
                        type="button"
                    >
                        <Avatar
                            src={avatarUrl}
                            alt="User profile"
                            size="s"
                        />
                    </button>
                )}

                {onLogout && (
                    <button
                        className="mobile-shell__icon-btn"
                        onClick={onLogout}
                        aria-label="Logout"
                        type="button"
                    >
                        <Power size={20} aria-hidden="true" />
                    </button>
                )}
            </div>
        </header>
    );
};

MobileHeader.displayName = 'MobileShell.Header';

export default MobileHeader;


