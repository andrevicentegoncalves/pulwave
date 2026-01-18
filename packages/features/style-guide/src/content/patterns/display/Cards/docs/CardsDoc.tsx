import { ComponentDoc } from '@pulwave/features-style-guide';

const CardsDoc: ComponentDoc = {
    name: 'Cards',
    description: 'Specialized cards for displaying metrics, KPIs, and statistics in dashboards.',
    usage: `
\`\`\`tsx
import { KpiCard, StatCard } from '@pulwave/ui';
import { DollarSign } from '@pulwave/ui';

// Simple KPI Card
<KpiCard
    title="Revenue"
    value="$10k"
    status="success"
    icon={<DollarSign />}
/>

// Composable Stat Card
<StatCard
    icon={<DollarSign />}
    label="Revenue"
    value="$10k"
/>
\`\`\`
`,
    props: [
        { name: 'KpiCard.title', type: "string", description: 'Card title.' },
        { name: 'KpiCard.value', type: "string | number", description: 'Main numeric value.' },
        { name: 'KpiCard.status', type: "'neutral' | 'primary' | 'success' | …", description: 'Affects icon color.' },
        { name: 'StatCard.variant', type: "'primary' | 'success' | …", description: 'Color theme of the card.' },
    ]
};

export default CardsDoc;
