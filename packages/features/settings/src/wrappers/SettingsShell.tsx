/**
 * SettingsShell - Settings Layout Wrapper
 * Provides consistent layout with sidebar navigation for settings pages
 * @package @pulwave/features/settings
 */
import { type ReactNode } from 'react';

export interface SettingsTab {
    id: string;
    label: string;
    icon?: ReactNode;
}

export interface SettingsShellProps {
    children: ReactNode;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    tabs?: SettingsTab[];
    title?: string;
}

const defaultTabs: SettingsTab[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'payment', label: 'Payment' },
    { id: 'notifications', label: 'Notifications' },
];

export const SettingsShell = ({
    children,
    activeTab = 'profile',
    onTabChange,
    tabs = defaultTabs,
    title = 'Settings',
}: SettingsShellProps) => {
    return (
        <div className="settings-shell">
            <header className="settings-shell__header">
                <h1>{title}</h1>
            </header>

            <div className="settings-shell__layout">
                <nav className="settings-shell__sidebar" role="tablist" aria-label="Settings sections">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`settings-panel-${tab.id}`}
                            id={`settings-tab-${tab.id}`}
                            className={`settings-shell__tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => onTabChange?.(tab.id)}
                        >
                            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <main
                    className="settings-shell__content"
                    role="tabpanel"
                    id={`settings-panel-${activeTab}`}
                    aria-labelledby={`settings-tab-${activeTab}`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default SettingsShell;
