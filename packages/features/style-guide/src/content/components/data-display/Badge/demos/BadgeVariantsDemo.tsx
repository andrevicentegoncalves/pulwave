/**
 * Badge Variants Demo (Matrix Layout)
 * Comprehensive view of all badge statuses versus visual variants
 */
import { Badge } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import type { BadgeType, BadgeVariant } from '@ui/components/Badge/types';

const demoCode = `import { Badge } from '@ui';

// Status (semantic color intent):
// primary, secondary, tertiary, neutral,
// success, warning, error, info, critical, urgent,
// promotion, premium, discovery, maintenance, growth

// Variant (visual style):
// heavy (solid), medium (soft), light (outlined)

// Solid badges
<Badge status="primary" variant="heavy">Primary</Badge>
<Badge status="success" variant="heavy">Success</Badge>
<Badge status="error" variant="heavy">Error</Badge>

// Soft badges
<Badge status="primary" variant="medium">Primary Soft</Badge>

// Outlined badges
<Badge status="primary" variant="light">Primary Outlined</Badge>

// With icon
<Badge status="info" variant="heavy">
    <Badge.Icon><InfoIcon /></Badge.Icon>
    <Badge.Text>Info</Badge.Text>
</Badge>

// Props: status, variant, size (s/m/l), dot, count`;

const BadgeVariantsDemo = () => {
    const brandStatuses: BadgeType[] = ['primary', 'secondary', 'tertiary'];
    const neutralStatuses: BadgeType[] = ['neutral'];
    const functionalStatuses: BadgeType[] = [
        'success', 'warning', 'error', 'info',
        'critical', 'urgent',
        'promotion', 'premium', 'discovery', 'maintenance', 'growth'
    ];

    // Badge visual variants: Solid, Soft, Outlined
    const variants: { key: BadgeVariant; label: string }[] = [
        { key: 'heavy', label: 'Solid' },
        { key: 'medium', label: 'Soft' },
        { key: 'light', label: 'Outlined' },
    ];

    const renderTable = (title: string, statuses: BadgeType[], description?: string) => (
        <div style={{ marginBottom: '40px' }}>
            <h4 style={{ marginBottom: '8px' }}>{title}</h4>
            {description && <p style={{ marginBottom: '16px', color: 'var(--color-on-surface-subtle)', fontSize: '0.875rem' }}>{description}</p>}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ borderSpacing: '12px 8px', borderCollapse: 'separate', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', minWidth: '100px' }}>Status</th>
                            {variants.map(v => (
                                <th key={v.key} style={{ textAlign: 'left', minWidth: '100px' }}>{v.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.map(status => (
                            <tr key={status || 'neutral'}>
                                <td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{status || 'Neutral'}</td>
                                {variants.map(v => (
                                    <td key={v.key}>
                                        <Badge status={status} variant={v.key}>
                                            {String(status || 'Neutral').charAt(0).toUpperCase() + String(status || 'neutral').slice(1)}
                                        </Badge>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <DemoCard
            title="Badge Variants"
            description="Comprehensive view of all badge statuses versus visual variants (Solid, Soft, Outlined)."
            sourceCode={demoCode}
            showSourceToggle={true}
        >
            <div className="badge-demo">
                {renderTable('Brand Colors', brandStatuses, 'Core brand identity colors.')}
                {renderTable('Neutral', neutralStatuses, 'Grayscale badges for less emphasis.')}
                {renderTable('Functional Colors', functionalStatuses, 'Semantic colors for feedback, status, and features.')}
            </div>
        </DemoCard>
    );
};

export default BadgeVariantsDemo;
