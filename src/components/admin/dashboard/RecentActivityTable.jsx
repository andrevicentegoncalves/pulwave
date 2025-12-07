import React from 'react';
import PropTypes from 'prop-types';
import { Activity } from 'lucide-react';
import { Card, EmptyState, DataTable, Badge } from '../../ui';
import { formatDate } from '../../../utils/dateHelpers';

/**
 * RecentActivityTable - Displays the latest admin actions
 */
const RecentActivityTable = ({ activities }) => {
    const columns = [
        {
            id: 'action',
            title: 'Action',
            sortable: true,
            width: '150px',
            render: (value) => (
                <span className="font-medium text-slate-700 dark:text-slate-200 capitalize">
                    {value.replace(/_/g, ' ')}
                </span>
            )
        },
        {
            id: 'entity_type',
            title: 'Entity',
            sortable: true,
            width: '120px',
            render: (value) => (
                <Badge variant="neutral" size="sm">
                    {value}
                </Badge>
            )
        },
        {
            id: 'description',
            title: 'Description',
            sortable: false,
            // flex grow
        },
        {
            id: 'created_at',
            title: 'Date',
            sortable: true,
            width: '150px',
            render: (value) => formatDate(value)
        }
    ];

    return (
        <Card variant="elevated" className="admin-activity-card h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Activity</h2>
            </div>

            {activities && activities.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={activities}
                    pagination={false}
                    className="w-full"
                />
            ) : (
                <EmptyState
                    icon={<Activity />}
                    title="No recent activity"
                    description="Activity will appear here as users interact with the system"
                    size="s"
                    variant="simple"
                />
            )}
        </Card>
    );
};

RecentActivityTable.propTypes = {
    activities: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            action: PropTypes.string.isRequired,
            entity_type: PropTypes.string.isRequired,
            description: PropTypes.string,
            created_at: PropTypes.string.isRequired,
        })
    ),
};

RecentActivityTable.defaultProps = {
    activities: [],
};

export default RecentActivityTable;
