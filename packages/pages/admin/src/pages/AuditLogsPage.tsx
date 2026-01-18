import { useState, useMemo } from 'react';
import { Badge, EmptyState, Card, DataTable, SearchInput, SectionHeader } from '@pulwave/ui';
import { DataTransferButton, ContentLayout } from '@pulwave/widgets';
import { History } from '@pulwave/ui';
import { useAdminActivityLogs } from '@pulwave/features-admin';

// Type definition for activity log
interface ActivityLog {
    id?: string | number;
    created_at: string;
    action: string;
    entity_type?: string;
    user_id?: string;
    description?: string;
    profiles?: {
        email?: string;
    };
}

interface ActivityLogResponse {
    data?: ActivityLog[];
}

/**
 * Admin Audit Logs - Activity history viewer
 */
const AuditLogsPage = () => {
    const { data, isLoading } = useAdminActivityLogs();
    const activities: ActivityLog[] = Array.isArray(data) ? data : ((data as ActivityLogResponse)?.data || []);
    const [search, setSearch] = useState('');

    // Client-side filtering
    const filteredActivities = useMemo(() => {
        if (!search.trim()) return activities;
        const q = search.toLowerCase();
        return activities.filter((a: ActivityLog) =>
            a.action?.toLowerCase().includes(q) ||
            a.entity_type?.toLowerCase().includes(q) ||
            a.description?.toLowerCase().includes(q) ||
            a.profiles?.email?.toLowerCase().includes(q)
        );
    }, [activities, search]);

    // DataTable columns
    const columns = [
        {
            id: 'created_at',
            title: 'Date',
            sortable: true,
            render: (value: string) => new Date(value).toLocaleString()
        },
        {
            id: 'action',
            title: 'Action',
            sortable: true,
            render: (value: string) => (
                <Badge variant="light" status="info" size="s">
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
            render: (value: string, row: ActivityLog) => row.profiles?.email || value || '-'
        },
        {
            id: 'description',
            title: 'Description',
            sortable: false,
            render: (value: string) => value || '-'
        }
    ];

    return (
        <ContentLayout>
            <SectionHeader title="Audit Logs" />
            <p className="mb-4 color-muted">System activity history</p>
            <Card variant="elevated">
                <div className="data-table__header p-4 border-b border-neutral-100 display-flex justify-between align-items-center">
                    <h2 className="data-table__title text-lg font-semibold">{filteredActivities.length} Logs</h2>
                    <div className="data-table__filters display-flex display-flex-direction-row align-items-center gap-3">
                        <SearchInput
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                            onClear={() => setSearch('')}
                            placeholder="Search logs…"
                            size="s"
                        />
                        <DataTransferButton
                            entityName="Audit Logs"
                            data={filteredActivities}
                        />
                    </div>
                </div>
                {!isLoading && filteredActivities.length === 0 ? (
                    <EmptyState
                        icon={<History />}
                        title="No activity logs"
                        description={search ? "No logs match your search" : "Activity will appear here as users interact with the system"}
                        size="s"
                    />
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredActivities}
                        loading={isLoading}
                    />
                )}
            </Card>
        </ContentLayout>
    );
};

export default AuditLogsPage;
