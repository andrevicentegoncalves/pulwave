
import React, { useState } from 'react';
import { Menu, MenuItem, Switch, Stack } from '@pulwave/ui';
import { Home, Settings, Users, FileText, BarChart, Bell } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Menu
    items={[
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        {
            label: 'Analytics',
            icon: BarChart,
            items: [
                { id: 'reports', label: 'Reports' },
                { id: 'performance', label: 'Performance' },
            ]
        },
        { id: 'users', label: 'Users', icon: Users },
    ]}
    activeItem={activeItem}
    onItemClick={setActiveItem}
    isCollapsed={isCollapsed}
/>`;

const MenuBasicDemo = () => {
    const [activeItem, setActiveItem] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        {
            label: 'Analytics',
            icon: BarChart,
            items: [
                { id: 'reports', label: 'Reports' },
                { id: 'performance', label: 'Performance' },
            ]
        },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Basic Menu"
            description="Interactive menu with collapsible state."
        >
            <Stack spacing={4}>
                <Switch
                    checked={isCollapsed}
                    onCheckedChange={setIsCollapsed}
                    label="Collapse Menu"
                />

                <div style={{
                    width: isCollapsed ? '80px' : '280px',
                    border: '1px solid var(--color-border-neutral-subtle)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--color-surface-default)',
                    transition: 'width 0.3s ease'
                }}>
                    <Menu
                        items={menuItems}
                        activeItem={activeItem}
                        onItemClick={setActiveItem}
                        isCollapsed={isCollapsed}
                    />
                </div>
            </Stack>
        </DemoCard>
    );
};

export default MenuBasicDemo;
