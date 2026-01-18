import { Breadcrumbs, Icon } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';
import { Home } from '@pulwave/ui';

const codeUsage = `<Breadcrumbs
    items={[
        { label: 'Home', href: '#', icon: <Icon><Home size={14} /></Icon> },
        { label: 'Components', href: '#' },
        { label: 'Navigation', href: '#' },
        { label: 'Breadcrumbs' },
    ]}
/>`;

const BreadcrumbsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Breadcrumbs" description="Navigation trail">
        <Breadcrumbs
            items={[
                { label: 'Home', href: '#', icon: <Icon><Home size={14} /></Icon> },
                { label: 'Components', href: '#' },
                { label: 'Navigation', href: '#' },
                { label: 'Breadcrumbs' },
            ]}
        />
    </DemoCard>
);

export default BreadcrumbsDemo;
