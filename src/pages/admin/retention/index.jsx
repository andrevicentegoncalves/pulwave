import React from 'react';
import { Database } from '../../../components/ui';
import { useAdminRetentionPolicies } from '../../../hooks/admin';
import { Badge, EmptyState, Spinner, Card, DataTable } from '../../../components/ui';

/**
 * Admin Data Retention Policies
 * Uses DataTable component for consistent styling
 */
const RetentionPolicies = () => {
    const { data, isLoading } = useAdminRetentionPolicies();
    const policies = data || [];

    // DataTable columns
    const columns = [
        {
            id: 'data_category',
            title: 'Category',
            sortable: true,
        },
        {
            id: 'table_name',
            title: 'Table',
            sortable: true,
            render: (value) => <code>{value}</code>
        },
        {
            id: 'active_retention_days',
            title: 'Active (days)',
            sortable: true,
            render: (value) => value || '-'
        },
        {
            id: 'soft_delete_retention_days',
            title: 'Soft Delete (days)',
            sortable: true,
            render: (value) => value || '-'
        },
        {
            id: 'legal_basis',
            title: 'Legal Basis',
            sortable: false,
            render: (value) => value || '-'
        },
        {
            id: 'is_enabled',
            title: 'Status',
            sortable: true,
            render: (value) => (
                <Badge type={value ? 'success' : 'error'} variant="light" size="s">
                    {value ? 'Enabled' : 'Disabled'}
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
        <div className="admin-retention">
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Data Retention</h1>
                    <p className="admin-header__subtitle">Manage data retention policies</p>
                </div>
            </div>

            <Card variant="elevated">
                {policies.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={policies}
                        pagination={false}
                    />
                ) : (
                    <EmptyState
                        icon={<Database />}
                        title="No retention policies"
                        description="Configure data retention policies for GDPR compliance"
                        size="s"
                    />
                )}
            </Card>
        </div>
    );
};

export default RetentionPolicies;
