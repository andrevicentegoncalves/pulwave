import React from 'react';
import { Shield, Badge, EmptyState, Card, DataTable } from '../../../components/ui';
import { AdminPageHeader, AdminLoadingState } from '../../../components/admin';
import { useAdminPermissions } from '../../../hooks/admin';
import { groupBy } from '../../../utils';

/**
 * Admin Permissions Manager
 * Uses DataTable component with grouping by category
 */
const PermissionsManager = () => {
    const { data, isLoading } = useAdminPermissions();
    const permissions = data || [];

    // Group permissions by category using utility
    const groupedPermissions = groupBy(permissions, p => p.permission_category || 'Other');

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
        return <AdminLoadingState />;
    }

    return (
        <div className="admin-permissions">
            <AdminPageHeader title="Permissions" subtitle="View and manage system permissions" />

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
