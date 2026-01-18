import { useState } from 'react';
import { SegmentedControl, Button } from '@pulwave/ui';
import { FilterableDataTable } from '@pulwave/widgets';
import { DemoCard } from '@pulwave/features-style-guide';
import { Download } from '@pulwave/ui';
import demoCode from './BasicUsageDemo.tsx?raw';

interface User {
    [key: string]: unknown;
    id: number;
    name: string;
    role: string;
    status: string;
}

const initialData: User[] = [
    { id: 1, name: 'Alice Johnson', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Smith', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Charlie Brown', role: 'Viewer', status: 'Inactive' },
    { id: 4, name: 'Diana Prince', role: 'Admin', status: 'Active' },
    { id: 5, name: 'Evan Wright', role: 'Editor', status: 'Inactive' },
];

const FilterableDataTableBasicDemo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredData = initialData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'role', header: 'Role' },
        { key: 'status', header: 'Status' },
    ];

    return (
        <DemoCard sourceCode={demoCode} showSourceToggle={true}
            title="Filterable Data Table"
            description="A complete data exploration pattern with search and custom filters."
        >
            <FilterableDataTable
                title="System Users"
                data={filteredData}
                columns={columns}
                onSearch={setSearchTerm}
                searchValue={searchTerm}
                keyField="id"
                filterControls={
                    <SegmentedControl
                        value={statusFilter}
                        onChange={setStatusFilter}
                        size="s"
                        options={[
                            { label: 'All', value: 'all' },
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                        ]}
                    />
                }
                actions={
                    <Button variant="outlined" size="s" leftIcon={<Download size={14} />}>
                        Export
                    </Button>
                }
            />
        </DemoCard>
    );
};

export default FilterableDataTableBasicDemo;

