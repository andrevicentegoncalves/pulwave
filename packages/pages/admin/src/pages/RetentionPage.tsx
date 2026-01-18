import { useState, useMemo } from 'react';
import { Database } from '@pulwave/ui';
import { Badge, EmptyState, Card, DataTable, SearchInput, SectionHeader } from '@pulwave/ui';
import { ContentLayout, DataTransferButton } from '@pulwave/widgets';
import { useAdminRetentionPolicies } from '@pulwave/features-admin';

/**
 * Admin Data Retention Policies
 */
const RetentionPage = () => {
    const { data, isLoading } = useAdminRetentionPolicies();
    const policies = data || [];
    const [search, setSearch] = useState('');

    // Client-side filtering
    const filteredPolicies = useMemo(() => {
        if (!search.trim()) return policies;
        const q = search.toLowerCase();
        return policies.filter((p: any) =>
            p.data_category?.toLowerCase().includes(q) ||
            p.table_name?.toLowerCase().includes(q) ||
            p.legal_basis?.toLowerCase().includes(q)
        );
    }, [policies, search]);

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
            render: (value: string) => <code className="bg-neutral-100 px-1 py-0.5 rounded text-sm text-primary-700">{value}</code>
        },
        {
            id: 'active_retention_days',
            title: 'Active (days)',
            sortable: true,
            render: (value: number) => value || '-'
        },
        {
            id: 'soft_delete_retention_days',
            title: 'Soft Delete (days)',
            sortable: true,
            render: (value: number) => value || '-'
        },
        {
            id: 'legal_basis',
            title: 'Legal Basis',
            sortable: false,
            render: (value: string) => value || '-'
        },
        {
            id: 'is_enabled',
            title: 'Status',
            sortable: true,
            render: (value: boolean) => (
                <Badge status={value ? 'success' : 'error'} variant="light" size="s">
                    {value ? 'Enabled' : 'Disabled'}
                </Badge>
            )
        }
    ];

    return (
        <ContentLayout>
            <SectionHeader title="Data Retention" />
            <p className="mb-4 color-muted">Manage data retention policies</p>
            <Card variant="elevated">
                <div className="data-table__header p-4 border-b border-neutral-100 flex justify-between items-center">
                    <h2 className="data-table__title text-lg font-semibold">{filteredPolicies.length} Policies</h2>
                    <div className="data-table__filters display-flex display-flex-direction-row align-items-center gap-3">
                        <SearchInput
                            value={search}
                            onChange={(e: any) => setSearch(e.target.value)}
                            onClear={() => setSearch('')}
                            placeholder="Search policies…"
                            size="s"
                        />
                        <DataTransferButton
                            entityName="Retention Policies"
                            data={filteredPolicies}
                        />
                    </div>
                </div>
                {!isLoading && filteredPolicies.length === 0 ? (
                    <EmptyState
                        icon={<Database />}
                        title={search ? "No policies match your search" : "No retention policies"}
                        description={search ? undefined : "Configure data retention policies for GDPR compliance"}
                        size="s"
                    />
                ) : (
                    <DataTable
                        columns={columns}
                        data={policies}
                        loading={isLoading}
                    />
                )}
            </Card>
        </ContentLayout>
    );
};

export default RetentionPage;
