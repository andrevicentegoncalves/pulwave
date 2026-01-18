import { DataTransferButton } from '@pulwave/widgets';
import { Stack, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<DataTransferButton
    data={mockData}
    entityName="products"
    onImport={handleImport}
/>

<DataTransferButton
    data={mockData}
    entityName="products_readonly"
    exportOnly
    supportedFormats={['csv', 'xls']}
/>`;

const mockData = [
    { id: 101, name: 'Product A', price: 99.99, stock: 50 },
    { id: 102, name: 'Product B', price: 149.50, stock: 20 },
    { id: 103, name: 'Product C', price: 49.99, stock: 100 },
];

const DataTransferBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Data Transfer Button" description="Import and export functionality">
            <Stack spacing="8" className="min-h-[400px]">
                <Stack spacing="4">
                    <Text weight="bold">Full Capability (Export & Import)</Text>
                    <DataTransferButton
                        data={mockData}
                        entityName="products"
                        onImport={async (parsed, filename) => {
                            console.log('Importing from', filename, parsed);
                            alert(`Imported ${parsed.length} rows from ${filename}`);
                        }}
                    />
                </Stack>

                <Stack spacing="4">
                    <Text weight="bold">Export Only (CSV/Excel)</Text>
                    <DataTransferButton
                        data={mockData}
                        entityName="products_readonly"
                        exportOnly
                        supportedFormats={['csv', 'xls']}
                    />
                </Stack>
            </Stack>
        </DemoCard>
    );
};

export default DataTransferBasicDemo;
