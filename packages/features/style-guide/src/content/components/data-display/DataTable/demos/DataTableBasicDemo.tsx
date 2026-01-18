/**
 * DataTable Basic Demo
 */
import { DataTable } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<DataTable data={data}>
    <DataTable.Column key="name" header="Name" />
    <DataTable.Column key="email" header="Email" />
    <DataTable.Column key="role" header="Role" />
</DataTable>`;

const data = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
];

const DataTableBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic DataTable" description="Declarative data table using DataTable.Column">
        <DataTable data={data}>
            <DataTable.Column key="name" header="Name" />
            <DataTable.Column key="email" header="Email" />
            <DataTable.Column key="role" header="Role" />
        </DataTable>
    </DemoCard>
);

export default DataTableBasicDemo;
