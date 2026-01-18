import { Button, Card, usePulwaveContext, Text, Stack, Badge, Select, type Density } from "@pulwave/ui";


const DensityDemo = () => {
    const { density, setDensity } = usePulwaveContext();

    const handleDensityChange = (value: string) => {
        setDensity(value as Density);
    };

    return (
        <Stack gap={6}>
            <div className="flex items-center gap-4">
                <Text>Current Density: <Text as="strong">{density.toUpperCase()}</Text></Text>
                <Select
                    value={density}
                    onChange={(val) => handleDensityChange(val as string)}
                    options={[
                        { label: 'Compact', value: 'compact' },
                        { label: 'Comfortable', value: 'comfortable' },
                        { label: 'Spacious', value: 'spacious' }
                    ]}
                />
            </div>

            <Card style={{ maxWidth: '400px' }}>
                <div className="p-4 space-y-4">
                    <Stack gap={4}>
                        <div className="flex items-center justify-between">
                            <Text category="title" size="m">Project Dashboard</Text>
                            <Badge status="success">Active</Badge>
                        </div>

                        <Text>
                            The spacing between these elements should change based on the density setting.
                            We would use CSS variables (like --spacing-4) that are redefined under
                            [data-density="compact"].
                        </Text>

                        <div className="flex gap-2">
                            <Button kind="primary" variant="filled">Save Changes</Button>
                            <Button kind="tertiary" variant="ghost">Cancel</Button>
                        </div>

                        <ul className="space-y-2 border rounded p-2">
                            <li className="flex justify-between p-2 bg-neutral-100 rounded">
                                <Text>Task 1</Text>
                                <Text>Pending</Text>
                            </li>
                            <li className="flex justify-between p-2 bg-neutral-100 rounded">
                                <Text>Task 2</Text>
                                <Text>Done</Text>
                            </li>
                            <li className="flex justify-between p-2 bg-neutral-100 rounded">
                                <Text>Task 3</Text>
                                <Text>In Progress</Text>
                            </li>
                        </ul>
                    </Stack>
                </div>
            </Card>
        </Stack>
    );
};

export default DensityDemo;
