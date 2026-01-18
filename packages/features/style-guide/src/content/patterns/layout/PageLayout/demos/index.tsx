import { Button } from '@pulwave/ui';
import { PageLayout } from '@pulwave/widgets';

export const BasicUsage = () => (
    <div style={{ border: '1px solid var(--border-subtle)', height: '400px', overflow: 'hidden' }}>
        <PageLayout
            title="Overview"
            subtitle="View your key metrics and activity."
            breadcrumbs={[
                { label: 'Dashboard', href: '#' },
                { label: 'Overview' }
            ]}
            actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outlined">Export</Button>
                    <Button>Create New</Button>
                </div>
            }
        >
            <div style={{ padding: '20px', background: 'var(--bg-subtle)', height: '100%' }}>
                Page Content
            </div>
        </PageLayout>
    </div>
);
