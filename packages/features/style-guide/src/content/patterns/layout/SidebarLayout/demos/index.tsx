import { Box } from '@pulwave/ui';
import { SidebarLayout } from '@pulwave/widgets';

export const BasicUsage = () => (
    <div style={{ height: '300px', border: '1px solid var(--border-subtle)' }}>
        <SidebarLayout
            sidebar={
                <Box style={{ padding: '16px', background: 'var(--bg-muted)', height: '100%' }}>
                    Sidebar Content
                </Box>
            }
        >
            <Box style={{ padding: '16px', height: '100%' }}>
                Main Content Area
            </Box>
        </SidebarLayout>
    </div>
);
