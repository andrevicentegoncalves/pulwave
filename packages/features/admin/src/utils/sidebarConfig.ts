import {
    LayoutDashboard, Users, Languages, Shield, Database,
    Settings, ToggleLeft, ScrollText, Home, Palette
} from '@pulwave/ui';

export const ADMIN_NAV_SECTIONS = [
    {
        title: 'Overview',
        items: [
            { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' }
        ]
    },
    {
        title: 'Users & Permissions',
        items: [
            { path: '/admin/users', icon: Users, label: 'Users' },
            { path: '/admin/permissions', icon: Shield, label: 'Permissions' }
        ]
    },
    {
        title: 'Content',
        items: [
            { path: '/admin/translations', icon: Languages, label: 'Translations' },
            { path: '/admin/master-data', icon: Database, label: 'Master Data' }
        ]
    },
    {
        title: 'System',
        items: [
            { path: '/admin/configuration', icon: Settings, label: 'Configuration' },
            { path: '/admin/feature-flags', icon: ToggleLeft, label: 'Feature Flags' },
            { path: '/admin/audit-logs', icon: ScrollText, label: 'Audit Logs' },
            { path: '/admin/retention', icon: Database, label: 'Retention' },
            { path: '/style-guide', icon: Palette, label: 'Style Guide' }
        ]
    },
    {
        title: '',
        items: [
            { path: '/', icon: Home, label: 'Back to App' }
        ]
    }
];
