
import React, { useState } from 'react';
import { Text, Settings, User, Box, Layout } from '@pulwave/ui';
import { NestedSidebar, type NavigationItem } from '@pulwave/features-layout';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<NestedSidebar
    sections={navigationData}
    activeItem={activeItem}
    activeCategory={activeCategory}
    activeSection={activeSection}
    onSelect={handleSelect}
/>`;

const NestedSidebarBasicDemo = () => {
    const [activeItem, setActiveItem] = useState('profile');
    const [activeCategory, setActiveCategory] = useState('account');
    const [activeSection, setActiveSection] = useState('settings');

    const navigationData: NavigationItem[] = [
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            categories: [
                {
                    id: 'account',
                    label: 'Account',
                    items: ['profile', 'security', 'notifications']
                },
                {
                    id: 'billing',
                    label: 'Billing',
                    items: ['invoices', 'payment-methods']
                }
            ]
        },
        {
            id: 'components',
            label: 'Components',
            icon: Box,
            categories: [
                {
                    id: 'forms',
                    label: 'Forms',
                    items: ['input', 'select', 'checkbox']
                }
            ]
        }
    ];

    const handleSelect = (itemId: string, categoryId: string, sectionId: string) => {
        setActiveItem(itemId);
        setActiveCategory(categoryId);
        setActiveSection(sectionId);
    };

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Interactive Sidebar"
            description="Nested sidebar with search and selection state."
        >
            <div style={{ height: '500px', border: '1px solid var(--color-border-neutral-subtle)', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '280px', borderRight: '1px solid var(--color-border-neutral-subtle)', background: 'var(--color-bg-surface-1)' }}>
                    <NestedSidebar
                        sections={navigationData}
                        activeItem={activeItem}
                        activeCategory={activeCategory}
                        activeSection={activeSection}
                        onSelect={handleSelect}
                    />
                </div>
                <div style={{ flex: 1, padding: '2rem', background: 'var(--color-surface-subtle)' }}>
                    <Text category="title" size="m">Selected Context</Text>
                    <Text as="pre" size="xs" style={{ background: 'var(--color-surface-strong)', padding: '1rem', borderRadius: '4px', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify({ activeSection, activeCategory, activeItem }, null, 2)}
                    </Text>
                </div>
            </div>
        </DemoCard>
    );
};

export default NestedSidebarBasicDemo;
