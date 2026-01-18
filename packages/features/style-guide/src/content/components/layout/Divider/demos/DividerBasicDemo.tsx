/**
 * Divider Basic Demo
 * Separation lines for content organization.
 */
import { Divider, Box, Stack, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const DividerBasicDemo = () => (
    <DemoCard title="Divider" description="Separation lines">
        <Stack gap={10}>
            {/* List Divider Example */}
            <Box className="w-full max-w-sm border border-neutral-200 rounded-m overflow-hidden bg-surface">
                <Box padding={4}>
                    <Text variant="body-s" weight="bold">Settings</Text>
                </Box>
                <Divider spacing="none" />
                <Box padding={4} className="hover:bg-surface-subtle cursor-pointer">
                    <Text>Account</Text>
                </Box>
                <Divider spacing="none" />
                <Box padding={4} className="hover:bg-surface-subtle cursor-pointer">
                    <Text>Notifications</Text>
                </Box>
                <Divider spacing="none" />
                <Box padding={4} className="hover:bg-surface-subtle cursor-pointer">
                    <Text>Privacy</Text>
                </Box>
            </Box>

            {/* Vertical Divider Example */}
            <Box
                className="flex items-center border border-neutral-200 rounded-m h-12 bg-surface px-4"
                style={{ gap: 'var(--spacing-2)' }}
            >
                <Text>Blog</Text>
                <Divider orientation="vertical" spacing="default" className="h-4" />
                <Text>Docs</Text>
                <Divider orientation="vertical" spacing="default" className="h-4" />
                <Text>Source</Text>
            </Box>

            {/* Variants Example */}
            <Box className="w-full max-w-sm space-y-4">
                <Text variant="body-s" className="text-neutral-500">Default Variant</Text>
                <Divider />

                <Text variant="body-s" className="text-neutral-500">Subtle Variant</Text>
                <Divider variant="subtle" />
            </Box>
        </Stack>
    </DemoCard>
);

export default DividerBasicDemo;
