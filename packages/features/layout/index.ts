// @pulwave/features-layout - Unified Layout & Navigation Features
// Clean exports for both mobile and desktop structural components and hooks

// --- Hooks ---
export { useViewport } from './src/hooks/useViewport';
export * from './src/hooks/useSidebarState';

// --- Components ---

// Navigation (Desktop/Common)
export { Header } from './src/components/Header';
export type { HeaderProps } from './src/components/Header';

export { Menu } from './src/components/Menu';
export type { MenuItem, MenuProps } from './src/components/Menu';

export { Sidebar } from './src/components/Sidebar';
export type { SidebarProps } from './src/components/Sidebar';

export { NestedMenu } from './src/components/NestedMenu';
export type { NestedMenuProps, NavigationItem } from './src/components/NestedMenu';

// Deprecated - use NestedMenu instead
/** @deprecated Use NestedMenu instead */
export { NestedMenu as NestedSidebar } from './src/components/NestedMenu';
/** @deprecated Use NestedMenuProps instead */
export type { NestedMenuProps as NestedSidebarProps } from './src/components/NestedMenu';

// User Info
export { UserInfo } from './src/components/UserInfo/UserInfo';
export type { UserInfoProps } from './src/components/UserInfo/UserInfo';

// Mobile Shell Components
export { MobileHeader } from './src/components/MobileHeader/MobileHeader';
export type { MobileHeaderProps, MobileHeaderConfig } from './src/components/MobileHeader/types';

export { MobileBottomNav } from './src/components/MobileBottomNav/MobileBottomNav';
export type { MobileBottomNavProps, MobileBottomNavConfig, MobileBottomNavItem } from './src/components/MobileBottomNav/types';

export { MobileDrawer } from './src/components/MobileDrawer/MobileDrawer';
export type { MobileDrawerProps } from './src/components/MobileDrawer/types';

// Shared User Types
export type { UserData } from './src/types';
