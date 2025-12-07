import React from 'react';
import { Shield } from '../../../components/ui';
import { useAdminPermissions } from '../../../hooks/admin';
import { Badge, EmptyState, Spinner, Card, DataTable } from '../../../components/ui';

/**
 * Admin Permissions Manager
 * Uses DataTable component with grouping by category
 */
const PermissionsManager = () => {
    const { data, isLoading } = useAdminPermissions();
    const permissions = data || [];

    // Group permissions by category
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const category = perm.permission_category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(perm);
        return acc;
    }, {});

    // DataTable columns
    const columns = [
        {
            id: 'permission_name',
            title: 'Permission',
            sortable: true,
            render: (value) => <code>{value}</code>
        },
        {
            id: 'description',
            title: 'Description',
            sortable: false,
            render: (value) => value || '-'
        },
        {
            id: 'is_active',
            title: 'Status',
            sortable: true,
            render: (value) => (
                <Badge type={value ? 'success' : 'error'} variant="light" size="s">
                    {value ? 'Active' : 'Inactive'}
                </Badge>
            )
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
        <div className="admin-permissions">
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Permissions</h1>
                    <p className="admin-header__subtitle">View and manage system permissions</p>
                </div>
            </div>

            {Object.keys(groupedPermissions).length > 0 ? (
                Object.entries(groupedPermissions).map(([category, perms]) => (
                    <Card key={category} variant="elevated" className="admin-permissions-group">
                        <div className="data-table__header">
                            <h2 className="data-table__title">{category}</h2>
                        </div>
                        <DataTable
                            columns={columns}
                            data={perms}
                            pagination={false}
                        />
                    </Card>
                ))
            ) : (
                <Card variant="elevated">
                    <EmptyState
                        icon={<Shield />}
                        title="No permissions configured"
                        size="s"
                    />
                </Card>
            )}
        </div>
    );
};

export default PermissionsManager;
