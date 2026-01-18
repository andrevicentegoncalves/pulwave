import { cva, type VariantProps } from 'class-variance-authority';

export const mobileHeaderVariants = cva('mobile-header', {
    variants: {},
    defaultVariants: {},
});

export const mobileHeaderMenuBtnVariants = cva('mobile-header__menu-btn', {
    variants: {},
    defaultVariants: {},
});

export const mobileHeaderAvatarVariants = cva('mobile-header__avatar', {
    variants: {},
    defaultVariants: {},
});

export const mobileHeaderLogoutBtnVariants = cva('mobile-header__logout-btn', {
    variants: {},
    defaultVariants: {},
});

export type MobileHeaderVariants = VariantProps<typeof mobileHeaderVariants>;

export interface MobileHeaderProps extends MobileHeaderVariants {
    /** Toggle sidebar handler */
    toggleSidebar: () => void;
    /** User avatar URL */
    avatarUrl?: string;
    /** Navigate to profile handler */
    onProfileClick?: () => void;
    /** Logout handler */
    onLogout?: () => void;
    /** Additional class name */
    className?: string;
}
