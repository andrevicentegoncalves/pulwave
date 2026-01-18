import { Button } from '@pulwave/ui';
import { HeaderLayout } from '@pulwave/widgets';

export const BasicUsage = () => (
    <HeaderLayout
        title="Settings"
        subtitle="Manage your account preferences."
        breadcrumbs={[
            { label: 'Home', href: '#' },
            { label: 'Settings' }
        ]}
        actions={<Button size="s">Save Changes</Button>}
    />
);
