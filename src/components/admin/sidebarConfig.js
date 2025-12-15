import {
    LayoutDashboard,
    Users,
    Languages,
    Shield,
    ScrollText,
    Settings,
    Database,
    ToggleLeft,
} from 'lucide-react';

export const ADMIN_NAV_SECTIONS = [
    {
        title: 'Overview',
        items: [
            { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        ],
    },
    {
        title: 'Management',
        items: [
            { to: '/admin/users', icon: Users, label: 'Users' },
            { to: '/admin/permissions', icon: Shield, label: 'Permissions' },
        ],
    },
    {
        title: 'Content',
        items: [
            { to: '/admin/translations', icon: Languages, label: 'Translations' },
            { to: '/admin/master-data', icon: Database, label: 'Master Data' },
        ],
    },
    {
        title: 'Operations',
        items: [
            { to: '/admin/audit-logs', icon: ScrollText, label: 'Audit Logs' },
            { to: '/admin/configuration', icon: Settings, label: 'Configuration' },
            { to: '/admin/retention', icon: Database, label: 'Retention' },
            { to: '/admin/feature-flags', icon: ToggleLeft, label: 'Feature Flags' },
        ],
    },
];
