import { PulwaveProvider, Button, Text, Stack, usePulwaveContext } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const ContextConsumer = () => {
    const { theme, setTheme, direction, setDirection, density, setDensity } = usePulwaveContext();

    return (
        <Stack gap="4">
            <Text>Current Theme: <strong>{theme}</strong></Text>
            <Stack direction="row" gap="2">
                <Button size="s" variant="outlined" onClick={() => setTheme('light')}>Light</Button>
                <Button size="s" variant="outlined" onClick={() => setTheme('dark')}>Dark</Button>
            </Stack>

            <Text>Current Density: <strong>{density}</strong></Text>
            <Stack direction="row" gap="2">
                <Button size="s" variant="outlined" onClick={() => setDensity('compact')}>Compact</Button>
                <Button size="s" variant="outlined" onClick={() => setDensity('comfortable')}>Comfortable</Button>
            </Stack>
        </Stack>
    );
};

export const PulwaveProviderBasicDemo = () => {
    return (
        <DemoCard title="Global Configuration" description="Configure theme, direction, and density globally.">
            {/* Note: In a real app, this wraps the root. Nested here for demo. */}
            <PulwaveProvider defaultTheme="light">
                <ContextConsumer />
            </PulwaveProvider>
        </DemoCard>
    );
};


