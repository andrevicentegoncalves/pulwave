import React, { useMemo } from 'react';
import { DataTable } from '../../../../../components/ui';
import { Badge, Avatar } from '../../../../../components/ui';

export default function Tables() {
    const columns = useMemo(() => [
        {
            id: 'user',
            title: 'User',
            sortable: true,
            width: '250px',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <Avatar src={row.avatar} alt={row.name} size="s" />
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{row.name}</span>
                        <span className="text-xs text-muted-foreground">{row.email}</span>
                    </div>
                </div>
            )
        },
        {
            id: 'role',
            title: 'Role',
            sortable: true,
            width: '150px',
            render: (role) => (
                <span className="capitalize text-sm">{role}</span>
            )
        },
        {
            id: 'status',
            title: 'Status',
            sortable: true,
            width: '120px',
            render: (status) => {
                const variants = {
                    active: 'success',
                    pending: 'warning',
                    inactive: 'secondary'
                };
                return <Badge variant={variants[status]}>{status}</Badge>;
            }
        },
        {
            id: 'lastActive',
            title: 'Last Active',
            sortable: true,
            width: '150px',
            render: (date) => <span className="text-sm font-mono text-muted-foreground">{date}</span>
        }
    ], []);

    const data = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? 'admin' : i % 2 === 0 ? 'editor' : 'viewer',
        status: i % 4 === 0 ? 'inactive' : i % 3 === 0 ? 'pending' : 'active',
        lastActive: '2023-12-05',
        avatar: null
    }));

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Data Table</h3>
                <p className="text-muted-foreground mb-6">
                    Advanced table component with built-in sorting, pagination, column resizing, and drag-and-drop reordering.
                </p>

                <div className="border rounded-lg overflow-hidden bg-card">
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        itemsPerPage={5}
                        onRowReorder={(startIndex, endIndex) => console.log('Reorder', startIndex, endIndex)}
                    />
                </div>
            </div>
        </div>
    );
}
