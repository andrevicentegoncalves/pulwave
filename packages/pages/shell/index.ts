// @pulwave/pages-shell - V2 Shell Components
// Clean exports - NO backward compatibility aliases

// Layout Components
export { AppShell } from './src/layouts/AppShell';
export { BaseSidebarLayout } from './src/layouts/BaseSidebarLayout';
export { BaseBlankLayout } from './src/layouts/BaseBlankLayout';
export { HeaderShell } from './src/layouts/HeaderShell';
export { MobileShell } from './src/layouts/MobileShell';
export { SidebarShell } from './src/layouts/SidebarShell';
export { NestedSidebarShell } from './src/layouts/NestedSidebarShell';

// Component Props & Types
export type { AppShellProps } from './src/layouts/AppShell';
export type { BaseSidebarLayoutProps, UserData, NavItem, NavSection } from './src/layouts/BaseSidebarLayout';
export type { BaseBlankLayoutProps } from './src/layouts/BaseBlankLayout';
export type { HeaderShellProps } from './src/layouts/HeaderShell';
export type {
    MobileShellProps,
    MobileHeaderConfig,
    MobileBottomNavConfig,
    MobileBottomNavItem
} from './src/layouts/MobileShell';
export type { NestedSidebarShellProps, MenuItem as NestedMenuItem } from './src/layouts/NestedSidebarShell';

// Utils
export { BREAKPOINTS } from './src/utils/constants';

