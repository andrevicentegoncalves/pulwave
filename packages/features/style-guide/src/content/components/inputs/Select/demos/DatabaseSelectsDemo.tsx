/**
 * DataSelectsDemo
 * 
 * Showcases database-related Select implementations:
 * - Tables & Columns tree select with icons
 */
import React, { useState } from 'react';
import { DemoCard } from '@pulwave/features-style-guide';
import { Select, Icon, Text, Database, Table, Columns, FolderTree } from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';

// Mock tree data for tables and columns
const MOCK_TABLE_TREE: SelectOption<string>[] = [
    {
        value: 'users',
        label: 'users',
        icon: <Icon size="s"><Table /></Icon>,
        isExpandable: true,
        children: [
            { value: 'users.id', label: 'id', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'users.name', label: 'name', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'users.email', label: 'email', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'users.created_at', label: 'created_at', icon: <Icon size="xs"><Columns /></Icon> },
        ]
    },
    {
        value: 'profiles',
        label: 'profiles',
        icon: <Icon size="s"><Table /></Icon>,
        isExpandable: true,
        children: [
            { value: 'profiles.id', label: 'id', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'profiles.user_id', label: 'user_id', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'profiles.bio', label: 'bio', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'profiles.avatar', label: 'avatar', icon: <Icon size="xs"><Columns /></Icon> },
        ]
    },
    {
        value: 'orders',
        label: 'orders',
        icon: <Icon size="s"><Table /></Icon>,
        isExpandable: true,
        children: [
            { value: 'orders.id', label: 'id', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'orders.user_id', label: 'user_id', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'orders.total', label: 'total', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'orders.status', label: 'status', icon: <Icon size="xs"><Columns /></Icon> },
        ]
    },
    {
        value: 'products',
        label: 'products',
        icon: <Icon size="s"><Table /></Icon>,
        isExpandable: true,
        children: [
            { value: 'products.id', label: 'id', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'products.name', label: 'name', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'products.description', label: 'description', icon: <Icon size="xs"><Columns /></Icon> },
            { value: 'products.price', label: 'price', icon: <Icon size="xs"><Columns /></Icon> },
        ]
    },
];

const codeUsage = `<Select
    multiple
    tree
    recursiveSelection
    options={tableTreeData}
    value={selectedItems}
    onChange={setSelectedItems}
    triggerIcon={<Database />}
    searchable
    showSelectAll
    showFooter
    fullWidth
/>`;

const DataSelectsDemo = () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    return (
        <DemoCard
            title="Database Tree Select"
            description="Hierarchical selection for database tables and columns. Supports recursive selection, search filtering, and lazy loading."
            showPrimaryToggle
            sourceCode={codeUsage}
            showSourceToggle
        >
            <div style={{ maxWidth: '500px' }}>
                <Text category="label" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                    <Icon size="s"><FolderTree /></Icon> Tables & Columns
                </Text>
                <Select<string>
                    multiple
                    tree
                    recursiveSelection
                    options={MOCK_TABLE_TREE}
                    value={selectedItems}
                    onChange={setSelectedItems}
                    placeholder="Select tables and columns…"
                    triggerIcon={<Icon size="s"><Database /></Icon>}
                    searchable
                    searchPlaceholder="Search tables and columns…"
                    showSelectAll
                    showFooter
                    fullWidth
                />
            </div>
        </DemoCard>
    );
};

export default DataSelectsDemo;
