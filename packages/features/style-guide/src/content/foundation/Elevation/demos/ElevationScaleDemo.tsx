/**
 * Elevation Scale Demo
 * Shows all shadow elevation levels in a horizontal row
 */
import { DemoCard } from '@pulwave/features-style-guide';
import { Text } from "@pulwave/ui";

const codeUsage = `// Usage of elevation tokens
// CSS Variables: --shadow-xs, --shadow-s, --shadow-m, --shadow-l, --shadow-xl

<div style={{
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--color-surface-default)',
    borderRadius: 'var(--border-radius-m)',
    boxShadow: 'var(--shadow-m)'
}}>
    Floating Content
</div>`;

const ElevationScaleDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Elevation Scale"
        description="Shadow levels from flat to maximum elevation"
    >
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-6)',
            alignItems: 'flex-end',
        }}>
            {[
                { level: 0, token: 'none', label: 'Flat' },
                { level: 1, token: 'xs', label: 'Subtle' },
                { level: 2, token: 's', label: 'Raised' },
                { level: 3, token: 'm', label: 'Floating' },
                { level: 4, token: 'l', label: 'Modal' },
                { level: 5, token: 'xl', label: 'Maximum' },
            ].map(({ level, token, label }) => (
                <div
                    key={level}
                    style={{
                        width: '120px',
                        padding: 'var(--spacing-4)',
                        backgroundColor: 'var(--color-surface-default)',
                        borderRadius: 'var(--border-radius-m)',
                        boxShadow: `var(--shadow-${token})`,
                        textAlign: 'center',
                    }}
                >
                    <Text variant="body-m" weight="semibold" className="mb-1 block">
                        Level {level}
                    </Text>
                    <Text as="code" variant="body-xs" className="block text-center">
                        --shadow-{token}
                    </Text>
                    <Text variant="body-xs" color="muted" className="mt-1 block">
                        {label}
                    </Text>
                </div>
            ))}
        </div>
    </DemoCard>
);

export default ElevationScaleDemo;
