import { useState } from 'react';
import { Button, Card, Checkbox, Stack, Text } from '@pulwave/ui';
import { BulkActionBar } from '@pulwave/widgets';
import { DemoCard } from '@pulwave/features-style-guide';
import { Trash, Archive, Download } from '@pulwave/ui';
import demoCode from './BasicUsageDemo.tsx?raw';

const items = [
    { id: 1, label: 'Report_Q1_2025.pdf' },
    { id: 2, label: 'Invoice_10234.pdf' },
    { id: 3, label: 'Contract_Draft_v2.docx' },
    { id: 4, label: 'Meeting_Notes.txt' },
    { id: 5, label: 'UserData_Export.csv' },
];

const BulkActionBarBasicDemo = () => {
    const [selected, setSelected] = useState<number[]>([]);

    const toggleItem = (id: number) => {
        setSelected(prev => {
            if (prev.includes(id)) {
                return prev.filter((i) => i !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const clearSelection = () => setSelected([]);

    return (
        <DemoCard sourceCode={demoCode} showSourceToggle={true}
            title="Bulk Action Bar"
            description="Select items to reveal the floating action bar."
        // Since it uses Portal (body), it will appear at the bottom of the viewport.
        // For demo purposes, we might want to disable Portal or accept that it covers the bottom of the screen.
        // I'll disable portal for the demo so it stays inside the card if possible? 
        // But the implementation defaults to portal. 
        // I'll leave it as portal for true experience, users will see it at bottom of screen.
        >
            <Stack gap={3}>
                <Text variant="body-s" color="muted">Select items below:</Text>
                {items.map((item) => (
                    <Card key={item.id} padding="m" style={{ border: selected.includes(item.id) ? '1px solid var(--color-primary-500)' : undefined }}>
                        <Stack direction="row" align="center" gap={3}>
                            <Checkbox
                                checked={selected.includes(item.id)}
                                onChange={() => toggleItem(item.id)}
                            />
                            <Text>{item.label}</Text>
                        </Stack>
                    </Card>
                ))}
            </Stack>

            <BulkActionBar
                open={selected.length > 0}
                selectedCount={selected.length}
                totalCount={items.length}
                onClearSelection={clearSelection}
                actions={
                    <>
                        {/* We use buttons that look good on dark background, usually default secondary or special inverse variant */}
                        <Button size="s" kind="secondary" variant="outlined" leftIcon={<Archive size={14} />}>Archive</Button>
                        <Button size="s" kind="secondary" variant="outlined" leftIcon={<Download size={14} />}>Export</Button>
                        <Button size="s" kind="error" variant="ghost" leftIcon={<Trash size={14} />}>Delete</Button>
                    </>
                }
            />
        </DemoCard>
    );
};

export default BulkActionBarBasicDemo;
