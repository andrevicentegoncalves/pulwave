import { Card, EmptyState, DataTable, Badge, Activity } from '@pulwave/ui';

export interface ActivityLog {
    id: string;
    action: string;
    entity_type: string;
    description: string;
    created_at: string;
    [key: string]: any;
}

interface RecentActivityTableProps {
    activities: ActivityLog[];
}

const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

/**
 * RecentActivityTable - Displays the latest admin actions
 */
export const RecentActivityTable = ({ activities }: RecentActivityTableProps) => {
    const columns = [
        {
            id: 'action',
            title: 'Action',
            sortable: true,
            width: '150px',
            render: (value: string) => (
                <span className="font-weight-medium text-slate-700 dark:text-slate-200 capitalize">
                    {value.replace(/_/g, ' ')}
                </span>
            )
        },
        {
            id: 'entity_type',
            title: 'Entity',
            sortable: true,
            width: '120px',
            render: (value: string) => (
                <Badge status="neutral" size="m">
                    {value}
                </Badge>
            )
        },
        {
            id: 'description',
            title: 'Description',
            sortable: false,
            // display-flex grow
        },
        {
            id: 'created_at',
            title: 'Date',
            sortable: true,
            width: '150px',
            render: (value: string) => formatDate(value)
        }
    ];

    return (
        <Card variant="elevated" className="admin-activity-card h-full">
            <div className="display-flex align-items-center justify-between margin-bottom-4">
                <h2 className="text-lg font-weight-semibold text-slate-800 dark:text-white">Recent Activity</h2>
            </div>

            {activities && activities.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={activities}
                    className="w-full"
                />
            ) : (
                <EmptyState
                    icon={<Activity aria-hidden="true" />}
                    title="No recent activity"
                    description="Activity will appear here as users interact with the system"
                    size="s"
                />
            )}
        </Card>
    );
};

export default RecentActivityTable;
