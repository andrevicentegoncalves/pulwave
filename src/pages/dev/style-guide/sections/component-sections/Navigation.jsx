import React, { useState } from 'react';
import { SidebarSection, SectionHeader } from '../../../../../components/ui';
import { Users, Globe, Database, Shield } from 'lucide-react';

const SidebarSectionDemo = () => {
    const [selectedKey, setSelectedKey] = useState('profile');

    const items = [
        { key: 'profile', label: 'Profile', icon: Users },
        { key: 'localization', label: 'Localization', icon: Globe },
        { key: 'database', label: 'Database', icon: Database },
        { key: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="component-section">
            <SectionHeader
                title="Sidebar Section"
                subtitle="Navigation component for sidebar sub-menus or card-based navigation."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="demo-block">
                    <h4 className="demo-block__title">Default Usage</h4>
                    <p className="demo-block__description">
                        Standard sidebar section (Card encapsulated).
                    </p>
                    <div style={{ maxWidth: '300px' }}>
                        <SidebarSection
                            title="System Settings"
                            items={items}
                            activeKey={selectedKey}
                            onSelect={(item) => setSelectedKey(item.key)}
                        />
                    </div>
                </div>

                <div className="demo-block">
                    <h4 className="demo-block__title">Props</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-600">
                        <li><code>title</code>: Section header title</li>
                        <li><code>items</code>: Array of navigation objects (key, label, icon)</li>
                        <li><code>activeKey</code>: Currently selected item key</li>
                        <li><code>onSelect</code>: Function called on item click</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default function Navigation() {
    return (
        <div className="component-group">
            <SidebarSectionDemo />
        </div>
    );
}
