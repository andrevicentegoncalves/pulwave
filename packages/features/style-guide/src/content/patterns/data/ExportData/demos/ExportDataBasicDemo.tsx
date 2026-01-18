import { ExportData } from '@pulwave/widgets';
import { Stack, Card, Text } from '@pulwave/ui';

const sampleData = [
    { id: 1, name: 'Alice Smith', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Jones', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Charlie Day', role: 'Viewer', status: 'Inactive' },
];

const ExportDataBasicDemo = () => {
    return (
        <Stack spacing={8}>
            <Stack spacing={4}>
                <Text>Simple Export</Text>
                <ExportData
                    data={sampleData}
                    filename="users_export"
                />
            </Stack>

            <Stack spacing={4}>
                <Text>Custom Formats (CSV Only)</Text>
                <ExportData
                    data={sampleData}
                    filename="users_csv_only"
                    variant="outline"
                />
            </Stack>
        </Stack>
    );
};

export default ExportDataBasicDemo;
