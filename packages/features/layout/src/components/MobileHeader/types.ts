import React from 'react';

export interface MobileHeaderConfig {
    /** Title to display in header */
    title?: string;
    /** Show hamburger menu button */
    showHamburger?: boolean;
    /** Right side actions */
    rightActions?: React.ReactNode;
    /** User avatar URL for profile button */
    avatarUrl?: string;
    /** Profile click handler */
    onProfileClick?: () => void;
    /** Logout handler */
    onLogout?: () => void;
}

export interface MobileHeaderProps extends MobileHeaderConfig {
    /** Toggle drawer handler */
    onMenuToggle?: () => void;
    /** Additional class name */
    className?: string;
}
