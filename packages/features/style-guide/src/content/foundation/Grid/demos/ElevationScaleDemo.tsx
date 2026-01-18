/**
 * Elevation Scale Demo
 * Shows all shadow elevation levels
 */
import { Text } from "@pulwave/ui";
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `// Usage of elevation tokens
// CSS Variables: --shadow-xs, --shadow-s, --shadow-m, --shadow-l, --shadow-xl

<div style={{ boxShadow: 'var(--shadow-s)' }}>
    Raised Content
</div>`;

const ElevationScaleDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Elevation Scale"
        description="Shadow levels from flat to maximum elevation"
    >
        <div className="elevation-scale-demo">
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
                    className="elevation-scale-demo__card"
                    style={{ boxShadow: `var(--shadow-${token})` }}
                >
                    <Text className="elevation-scale-demo__level" weight="bold">Level {level}</Text>
                    <Text className="elevation-scale-demo__token" size="s" color="muted">--shadow-{token}</Text>
                    <Text className="elevation-scale-demo__label">{label}</Text>
                </div>
            ))}
        </div>
    </DemoCard>
);

export default ElevationScaleDemo;
