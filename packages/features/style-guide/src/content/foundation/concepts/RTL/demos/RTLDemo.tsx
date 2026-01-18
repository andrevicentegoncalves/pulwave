import { Button, Card, usePulwaveContext, Text, Stack, Alert, Badge } from "@pulwave/ui";
import { ArrowLeft, ArrowRight } from "@pulwave/ui";

const RTLDemo = () => {
    const { direction, setDirection } = usePulwaveContext();

    const toggleDirection = () => {
        setDirection(direction === 'ltr' ? 'rtl' : 'ltr');
    };

    return (
        <Stack gap={6}>
            <div className="flex items-center gap-4">
                <Text>Current Direction: <strong>{direction.toUpperCase()}</strong></Text>
                <Button onClick={toggleDirection} kind="secondary" variant="outlined">
                    Toggle Direction
                </Button>
            </div>

            <Card style={{ maxWidth: '400px' }}>
                <div className="p-4 space-y-4">
                    <Stack gap={4}>
                        <div className="flex items-center justify-between">
                            <Text category="title" size="m">Card Title</Text>
                            <Badge status="success">Active</Badge>
                        </div>

                        <Text>
                            This text should align according to the document direction.
                            In RTL, it should align right.
                            Logical properties (start/end) ensure padding and margins flip correctly.
                        </Text>

                        <div className="flex gap-2">
                            <Button kind="primary" variant="filled">Primary Action</Button>
                            <Button kind="tertiary" variant="ghost">Cancel</Button>
                        </div>

                        <Alert status="info" title="Logical Properties">
                            The arrow icon below should flip if using standard icons,
                            but directional icons (ArrowRight) usually need manual flipping
                            or swapping based on context if they indicate flow.
                        </Alert>

                        <div className="flex items-center gap-2 p-2 bg-neutral-100 rounded">
                            {direction === 'ltr' ? <ArrowRight /> : <ArrowLeft />}
                            <Text size="s">Directional Icon</Text>
                        </div>
                    </Stack>
                </div>
            </Card>
        </Stack>
    );
};

export default RTLDemo;
