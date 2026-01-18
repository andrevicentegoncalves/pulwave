import React, { useState } from 'react';
import { ColumnChips, Stack, Button, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<ColumnChips
    data={data}
    editable
    onRemove={handleRemove}
    onRemoveColumn={handleRemoveColumn}
/>

<ColumnChips
    data={data}
    maxColumnsShown={2}
    size="xs"
/>`;

const initialData = {
    users: ['id', 'email', 'first_name', 'last_name', 'created_at'],
    products: ['id', 'sku', 'name', 'price', 'inventory_count', 'category_id'],
    orders: ['id', 'order_number', 'total'],
};

const ColumnChipsBasicDemo = () => {
    const [data, setData] = useState(initialData);

    const handleRemove = (table: string) => {
        const newData = { ...data };
        delete newData[table as keyof typeof newData];
        setData(newData);
    };

    const handleRemoveColumn = (table: string, column: string) => {
        const newData = { ...data };
        const cols = newData[table as keyof typeof newData];
        if (cols) {
            newData[table as keyof typeof newData] = cols.filter(c => c !== column);
            setData(newData);
        }
    };

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Column Chips" description="Interactive column selection chips">
            <Stack spacing="8">
                <Stack spacing="4">
                    <ColumnChips
                        data={data}
                        editable
                        onRemove={handleRemove}
                        onRemoveColumn={handleRemoveColumn}
                    />
                    <Button size="s" variant="outlined" onClick={() => setData(initialData)}>Reset Demo</Button>
                </Stack>

                <Stack spacing="4">
                    <Text size="s" color="muted" weight="medium">Read Only & Truncated</Text>
                    <ColumnChips
                        data={data}
                        maxColumnsShown={2}
                        size="xs"
                    />
                </Stack>
            </Stack>
        </DemoCard>
    );
};

export default ColumnChipsBasicDemo;

