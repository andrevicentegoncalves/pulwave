import { useAnnounce, Button, Stack, Text, Card } from "@pulwave/ui";

const AnnounceDemo = () => {
    const { announcePolite, announceAssertive } = useAnnounce();

    return (
        <Stack gap={6}>
            <Card>
                <Stack gap={4} className="p-4">
                    <Text>
                        Click these buttons while running a screen reader (NVDA, VoiceOver) to verify announcements.
                    </Text>
                    <div className="flex gap-4">
                        <Button
                            kind="secondary"
                            variant="outlined"
                            onClick={() => announcePolite('Operation completed successfully.')}
                        >
                            Trigger Polite Announcement
                        </Button>
                        <Button
                            kind="primary"
                            onClick={() => announceAssertive('Error: Connection lost!')}
                        >
                            Trigger Assertive Announcement
                        </Button>
                    </div>
                </Stack>
            </Card>
        </Stack>
    );
};

export default AnnounceDemo;
