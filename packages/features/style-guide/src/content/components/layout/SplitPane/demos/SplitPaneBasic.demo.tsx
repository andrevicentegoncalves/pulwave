
import React from 'react';
import { SplitPane, Box, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<div style={{ height: '300px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-m)' }}>
    <SplitPane direction="horizontal" defaultSize={30} minSize={20} maxSize={80}>
        <Box style={{ height: '100%', background: 'var(--color-background-neutral-subtle)' }}>
            <Text weight="medium">Sidebar</Text>
            <Text size="s" color="neutral">Resizable panel (min 20%, max 80%)</Text>
        </Box>
        <div style={{ height: '100%' }}>
            <SplitPane direction="vertical" defaultSize={70}>
                <Box style={{ height: '100%', background: 'var(--color-background-primary)' }}>
                    <Text weight="medium">Main Content area</Text>
                </Box>
                <Box style={{ height: '100%', background: 'var(--color-background-neutral-subtle)' }}>
                    <Text weight="medium">Terminal / Logs</Text>
                </Box>
            </SplitPane>
        </div>
    </SplitPane>
</div>`;

export default function SplitPaneBasic() {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic SplitPane" description="Resizable split panes.">
            <div style={{ height: '300px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-m)' }}>
                <SplitPane direction="horizontal" defaultSize={30} minSize={20} maxSize={80}>
                    <Box style={{ height: '100%', background: 'var(--color-background-neutral-subtle)' }}>
                        <Text weight="medium">Sidebar</Text>
                        <Text size="s" color="muted">Resizable panel (min 20%, max 80%)</Text>
                    </Box>
                    <div style={{ height: '100%' }}>
                        <SplitPane direction="vertical" defaultSize={70}>
                            <Box style={{ height: '100%', background: 'var(--color-background-primary)' }}>
                                <Text weight="medium">Main Content area</Text>
                            </Box>
                            <Box style={{ height: '100%', background: 'var(--color-background-neutral-subtle)' }}>
                                <Text weight="medium">Terminal / Logs</Text>
                            </Box>
                        </SplitPane>
                    </div>
                </SplitPane>
            </div>
        </DemoCard>
    );
}
