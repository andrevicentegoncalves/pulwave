/**
 * Admin Shell - Layout and Navigation
 *
 * Full standalone admin layout with:
 * - AppShell wrapper
 * - BaseSidebarLayout with primary Sidebar
 * - HeaderShell with title, breadcrumbs, actions
 * - SectionLayout with secondary navigation Menu
 * - MobileShell for responsive mobile layout
 *
 * @package @pulwave/pages-admin
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    AppShell,
    BaseSidebarLayout,
    HeaderShell,
    SidebarShell,
    NestedSidebarShell,
    MobileShell,
    type UserData,
    type MobileBottomNavItem
} from '@pulwave/pages-shell';
import {
    Breadcrumbs,
    ThemeToggle,
    ToastProvider,
    LayoutDashboard,
    Users,
    Shield,
    Languages,
    Database,
    Settings,
    ToggleLeft,
    ScrollText,
    Archive,
    Home,
    Palette,
    Globe,
    MapPin,
    Building,
    Tag,
    Clock,
    CreditCard
} from '@pulwave/ui';
import { SectionLayout } from '@pulwave/widgets';
import { NestedMenu, Sidebar } from '@pulwave/features-layout';
import { useAdminNavigation } from '../hooks';
import '../styles/_index.scss';

// =============================================================================
// TYPES
// =============================================================================

export interface AdminShellProps {
    children?: React.ReactNode;
    user?: UserData | null;
    onLogout?: () => void;
}

// =============================================================================
// NAVIGATION DATA
// =============================================================================

// Primary sidebar items (top-level app navigation)
const PRIMARY_SIDEBAR_ITEMS = [
    { id: '/', icon: Home, label: 'Back to App', path: '/' },
    { id: '/style-guide', icon: Palette, label: 'Style Guide', path: '/style-guide' }
];

// Admin navigation for secondary sidebar (SectionLayout)
// Mix of flat items and nested sections
const ADMIN_NAV_SECTIONS = [
    { id: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { id: '/admin/users', icon: Users, label: 'Users' },
    { id: '/admin/permissions', icon: Shield, label: 'Permissions' },
    { id: '/admin/translations', icon: Languages, label: 'Translations' },
    // Master Data with nested categories
    {
        id: '/admin/master-data',
        icon: Database,
        label: 'Master Data',
        categories: [
            {
                id: 'data-types',
                label: 'Data Types',
                icon: Database,
                items: ['master_data_types']
            },
            {
                id: 'geography',
                label: 'Geography',
                icon: Globe,
                items: ['countries', 'admin_divisions', 'localities', 'regional_blocks']
            },
            {
                id: 'translations',
                label: 'Translations',
                icon: Languages,
                items: ['translation_categories', 'translatable_tables', 'translatable_enums']
            },
            {
                id: 'system',
                label: 'System',
                icon: Database,
                items: ['locales', 'timezones', 'setting_categories']
            },
            {
                id: 'billing',
                label: 'Billing',
                icon: CreditCard,
                items: ['subscription_plans', 'payment_icons']
            },
            {
                id: 'roles',
                label: 'Roles',
                icon: Shield,
                items: ['app_role', 'user_role']
            }
        ]
    },
    { id: '/admin/configuration', icon: Settings, label: 'Configuration' },
    { id: '/admin/feature-flags', icon: ToggleLeft, label: 'Feature Flags' },
    { id: '/admin/audit-logs', icon: ScrollText, label: 'Audit Logs' },
    { id: '/admin/retention', icon: Archive, label: 'Retention' }
];

// Mobile bottom nav
const MOBILE_NAV_ITEMS: MobileBottomNavItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'content', icon: Languages, label: 'Content' },
    { id: 'system', icon: Settings, label: 'System' },
    { id: 'home', icon: Home, label: 'Home' }
];

// =============================================================================
// HELPERS
// =============================================================================

const getPageInfo = (pathname: string) => {
    const pages: Record<string, { title: string; icon: React.ElementType; section: string }> = {
        '/admin': { title: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
        '/admin/users': { title: 'Users', icon: Users, section: 'Users & Permissions' },
        '/admin/permissions': { title: 'Permissions', icon: Shield, section: 'Users & Permissions' },
        '/admin/translations': { title: 'Translations', icon: Languages, section: 'Content' },
        '/admin/master-data': { title: 'Master Data', icon: Database, section: 'Content' },
        '/admin/configuration': { title: 'Configuration', icon: Settings, section: 'System' },
        '/admin/feature-flags': { title: 'Feature Flags', icon: ToggleLeft, section: 'System' },
        '/admin/audit-logs': { title: 'Audit Logs', icon: ScrollText, section: 'System' },
        '/admin/retention': { title: 'Retention', icon: Archive, section: 'System' }
    };
    return pages[pathname] || pages['/admin'];
};

const getMobileSection = (pathname: string): string => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname.includes('/users') || pathname.includes('/permissions')) return 'users';
    if (pathname.includes('/translations') || pathname.includes('/master-data')) return 'content';
    return 'system';
};

// =============================================================================
// COMPONENT
// =============================================================================

export const AdminShell = ({
    children,
    user,
    onLogout
}: AdminShellProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Navigation state (from hook)
    const { activeSection, activeCategory, activeItem, handleSelect } = useAdminNavigation();

    // UI State
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isSecondarySidebarExpanded, setIsSecondarySidebarExpanded] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth <= 768 : false
    );

    // Resize handler
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Theme toggle
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    // Current page info
    const pageInfo = useMemo(() => getPageInfo(location.pathname), [location.pathname]);
    const mobileSection = useMemo(() => getMobileSection(location.pathname), [location.pathname]);

    // Mobile navigation handler
    const handleMobileSectionChange = useCallback((sectionId: string) => {
        const paths: Record<string, string> = {
            dashboard: '/admin',
            users: '/admin/users',
            content: '/admin/translations',
            system: '/admin/configuration',
            home: '/'
        };
        navigate(paths[sectionId] || '/admin');
    }, [navigate]);

    // Breadcrumbs
    const breadcrumbItems = useMemo(() => {
        const items = [
            { id: 'admin', label: 'Admin', href: '/admin', icon: <Shield size={14} /> },
            { id: 'section', label: pageInfo.section, href: location.pathname }
        ];
        if (pageInfo.title !== 'Dashboard') {
            items.push({ id: 'page', label: pageInfo.title, href: location.pathname });
        }
        return items;
    }, [pageInfo, location.pathname]);

    // ==========================================================================
    // MOBILE LAYOUT
    // ==========================================================================
    if (isMobile) {
        return (
            <AppShell>
                <ToastProvider>
                    <MobileShell
                        header={{
                            title: 'Admin',
                            showHamburger: true,
                            avatarUrl: user?.avatarUrl,
                            onLogout
                        }}
                        drawer={
                            <Sidebar
                                variant="primary"
                                position="static"
                                isExpanded={true}
                                toggleSidebar={() => {}}
                                items={PRIMARY_SIDEBAR_ITEMS}
                                user={user || undefined}
                                onLogout={onLogout}
                                showUserInfo={true}
                                logoSubtitle=""
                            />
                        }
                        bottomNav={{
                            items: MOBILE_NAV_ITEMS,
                            activeId: mobileSection,
                            onSelect: handleMobileSectionChange
                        }}
                    >
                        <div className="admin-shell__mobile">
                            <div className="admin-shell__mobile-nav">
                                <NestedMenu
                                    sections={ADMIN_NAV_SECTIONS}
                                    activeItem={activeItem}
                                    activeCategory={activeCategory}
                                    activeSection={activeSection}
                                    onSelect={handleSelect}
                                    size="md"
                                    spacing="normal"
                                    isCollapsed={false}
                                    variant="white"
                                />
                            </div>
                            <div className="admin-shell__mobile-content">
                                {children ?? <Outlet />}
                            </div>
                        </div>
                    </MobileShell>
                </ToastProvider>
            </AppShell>
        );
    }

    // ==========================================================================
    // DESKTOP LAYOUT
    // ==========================================================================
    const sidebarContainerStyle = {
        '--sidebar-width': '18rem',
        '--sidebar-collapsed-width': '5rem',
        height: '100%'
    } as React.CSSProperties;

    return (
        <AppShell>
            <ToastProvider>
                <div style={sidebarContainerStyle} className="admin-shell">
                    <BaseSidebarLayout
                        variant="structural"
                        sidebarCollapsed={!isSidebarExpanded}
                        fixedMain={true}
                        sidebar={
                            <SidebarShell isCollapsed={!isSidebarExpanded} className="sidebar-shell--floating">
                                <Sidebar
                                    variant="primary"
                                    position="static"
                                    isExpanded={isSidebarExpanded}
                                    toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
                                    items={PRIMARY_SIDEBAR_ITEMS}
                                    user={user || undefined}
                                    onLogout={onLogout}
                                    showUserInfo={true}
                                    logoSubtitle=""
                                />
                            </SidebarShell>
                        }
                    >
                        <HeaderShell
                            title={pageInfo.title}
                            icon={pageInfo.icon}
                            breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
                            actions={<ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />}
                        />
                        <SectionLayout
                            stickySidebar
                            sidebarVariant="white"
                            isExpanded={isSecondarySidebarExpanded}
                            onExpandedChange={setIsSecondarySidebarExpanded}
                            sidebar={
                                <NestedSidebarShell
                                    variant="white"
                                    isExpanded={isSecondarySidebarExpanded}
                                    onExpandedChange={setIsSecondarySidebarExpanded}
                                >
                                    <NestedMenu
                                        sections={ADMIN_NAV_SECTIONS}
                                        activeItem={activeItem}
                                        activeCategory={activeCategory}
                                        activeSection={activeSection}
                                        onSelect={handleSelect}
                                        size="md"
                                        spacing="normal"
                                        isCollapsed={!isSecondarySidebarExpanded}
                                        variant="white"
                                    />
                                </NestedSidebarShell>
                            }
                        >
                            {children ?? <Outlet />}
                        </SectionLayout>
                    </BaseSidebarLayout>
                </div>
            </ToastProvider>
        </AppShell>
    );
};

AdminShell.displayName = 'AdminShell';

export default AdminShell;
