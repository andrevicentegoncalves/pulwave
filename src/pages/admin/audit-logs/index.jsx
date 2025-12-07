import React from 'react';
import { History } from '../../../components/ui';
import { useAdminActivity } from '../../../hooks/admin';
import { Badge, EmptyState, Spinner, Card, DataTable } from '../../../components/ui';

/**
 * Admin Audit Logs - Activity history viewer
 * Uses DataTable component for consistent styling
 */
const AuditLogs = () => {
    const { data, isLoading } = useAdminActivity();
    const activities = data || [];

    // DataTable columns
    const columns = [
        {
            id: 'created_at',
            title: 'Date',
            sortable: true,
            render: (value) => new Date(value).toLocaleString()
        },
        {
            id: 'action',
            title: 'Action',
            sortable: true,
            render: (value) => (
                <Badge variant="medium" type="info" size="s">
                    {value}
                </Badge>
            )
        },
        {
            id: 'entity_type',
            title: 'Entity',
            sortable: true,
        },
        {
            id: 'user_id',
            title: 'User',
            sortable: false,
            render: (value, row) => row.profiles?.email || value || '-'
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
        <div className="admin-audit-logs">
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Audit Logs</h1>
                    <p className="admin-header__subtitle">System activity history</p>
                </div>
            </div>

            <Card variant="elevated">
                {activities.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={activities}
                        pagination={true}
                        itemsPerPage={20}
                    />
                ) : (
                    <EmptyState
                        icon={<History />}
                        title="No activity logs"
                        description="Activity will appear here as users interact with the system"
                        size="s"
                    />
                )}
            </Card>
        </div>
    );
};

export default AuditLogs;
