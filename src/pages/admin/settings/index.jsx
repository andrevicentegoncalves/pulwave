import React from 'react';
import { Settings } from '../../../components/ui';
import { useAdminSettings } from '../../../hooks/admin';
import { EmptyState, Spinner, Card, DataTable } from '../../../components/ui';

/**
 * Admin System Settings
 * Uses DataTable component with grouping by category
 */
const SystemSettings = () => {
    const { data, isLoading } = useAdminSettings();
    const settings = data || [];

    // Group settings by category
    const groupedSettings = settings.reduce((acc, setting) => {
        const category = setting.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(setting);
        return acc;
    }, {});

    const formatValue = (value) => {
        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    };

    // DataTable columns
    const columns = [
        {
            id: 'setting_key',
            title: 'Key',
            sortable: true,
            render: (value) => <code>{value}</code>
        },
        {
            id: 'setting_value',
            title: 'Value',
            sortable: false,
            render: (value) => <code>{formatValue(value)}</code>
        },
        {
            id: 'description',
            title: 'Description',
            sortable: false,
            render: (value) => value || '-'
        }
    ];

    if (isLoading) {
        return (
            <div className="admin-loading">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="admin-settings-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">System Settings</h1>
                    <p className="admin-header__subtitle">Configure system parameters</p>
                </div>
            </div>

            {Object.keys(groupedSettings).length > 0 ? (
                Object.entries(groupedSettings).map(([category, categorySettings]) => (
                    <Card key={category} variant="elevated" className="admin-settings-group">
                        <div className="data-table__header">
                            <h2 className="data-table__title">{category}</h2>
                        </div>
                        <DataTable
                            columns={columns}
                            data={categorySettings}
                            pagination={false}
                        />
                    </Card>
                ))
            ) : (
                <Card variant="elevated">
                    <EmptyState
                        icon={<Settings />}
                        title="No settings configured"
                        size="s"
                    />
                </Card>
            )}
        </div>
    );
};

export default SystemSettings;
