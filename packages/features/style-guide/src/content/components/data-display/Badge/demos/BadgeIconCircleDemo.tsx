import { Badge } from '@ui';
import type { BadgeProps } from '@ui/components/Badge/types';
import {
    Check,
    AlertTriangle,
    X,
    Info,
    Bell,
    Star,
    Heart,
    Flag,
    Bookmark,
    Settings,
    User,
    Shield,
    Zap,
    Activity,
} from '@ui';
import type { ElementType } from 'react';

import { DemoCard } from '@pulwave/features-style-guide';

const STATUS_ICONS: Record<string, ElementType> = {
    neutral: User,
    primary: Star,
    secondary: Heart,
    tertiary: Bookmark,
    success: Check,
    warning: AlertTriangle,
    error: X,
    info: Info,
    critical: Shield,
    promotion: Zap,
    premium: Star,
    discovery: Flag,
    maintenance: Settings,
    growth: Activity,
    urgent: Bell
};

const STATUSES: BadgeProps['status'][] = [
    'neutral', 'primary', 'secondary', 'tertiary',
    'success', 'warning', 'error', 'info',
    'critical', 'promotion', 'premium', 'discovery',
    'maintenance', 'growth', 'urgent'
];

const codeUsage = `import { Badge } from '@ui';
import { Check, Star, AlertTriangle, Info } from '@ui';

// Circle icon badges use icon + circle props
// Available variants: heavy (solid), medium (soft), light (outline)

// Solid (heavy variant)
<Badge status="primary" variant="heavy" icon={<Star size={12} />} circle />
<Badge status="success" variant="heavy" icon={<Check size={12} />} circle />

// Soft (medium variant - default)
<Badge status="warning" variant="medium" icon={<AlertTriangle size={12} />} circle />

// Outline (light variant)
<Badge status="info" variant="light" icon={<Info size={12} />} circle />

// All status options: neutral, primary, secondary, tertiary,
// success, warning, error, info, critical, promotion,
// premium, discovery, maintenance, growth, urgent

// Props: status, variant, icon, circle, size, className`;

const BadgeIconCircleDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Circle Icon Badges"
            description="Circular badges optimized for icons, available in Solid, Soft, and Outline variants"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                    <h4 style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-on-surface-subtle)' }}>Solid</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {STATUSES.map((status) => {
                            const Icon = STATUS_ICONS[status as string] || Check;
                            return (
                                <Badge
                                    key={`${status}-heavy`}
                                    status={status}
                                    variant="heavy"
                                    icon={<Icon size={12} />}
                                    circle
                                    title={`Solid ${status}`}
                                />
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h4 style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-on-surface-subtle)' }}>Soft</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {STATUSES.map((status) => {
                            const Icon = STATUS_ICONS[status as string] || Check;
                            return (
                                <Badge
                                    key={`${status}-soft`}
                                    status={status}
                                    variant="medium"
                                    icon={<Icon size={12} />}
                                    circle
                                    title={`Soft ${status}`}
                                />
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h4 style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-on-surface-subtle)' }}>Outline</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {STATUSES.map((status) => {
                            const Icon = STATUS_ICONS[status as string] || Check;
                            return (
                                <Badge
                                    key={`${status}-outline`}
                                    status={status}
                                    variant="light"
                                    icon={<Icon size={12} />}
                                    circle
                                    title={`Outline ${status}`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </DemoCard>
    );
};

export default BadgeIconCircleDemo;
