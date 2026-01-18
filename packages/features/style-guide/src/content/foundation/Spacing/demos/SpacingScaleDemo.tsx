/**
 * Spacing Scale Demo
 * Shows all spacing token values with correct pixel values
 */
import { Text, Card } from "@pulwave/ui";
import { DemoCard } from '@pulwave/features-style-guide';
import '../../FoundationMiscDemos.scss';

const codeUsage = `// Spacing tokens (4px base)
// --spacing-1: 4px
// --spacing-2: 8px
// --spacing-4: 16px
// --spacing-6: 24px
// ...

<div style={{ margin: 'var(--spacing-4)', padding: 'var(--spacing-2)' }}>
    Spaced Content
</div>`;

const spacingScale = [
    { token: 0, value: '0px' },
    { token: 1, value: '4px' },
    { token: 2, value: '8px' },
    { token: 3, value: '12px' },
    { token: 4, value: '16px' },
    { token: 5, value: '20px' },
    { token: 6, value: '24px' },
    { token: 8, value: '32px' },
    { token: 10, value: '40px' },
    { token: 12, value: '48px' },
    { token: 14, value: '56px' },
    { token: 16, value: '64px' },
    { token: 20, value: '80px' },
    { token: 24, value: '96px' },
    { token: 28, value: '112px' },
    { token: 32, value: '128px' },
    { token: 36, value: '144px' },
    { token: 40, value: '160px' },
    { token: 48, value: '192px' },
    { token: 64, value: '256px' },
    { token: 96, value: '384px' },
    { token: 144, value: '576px' },
];

const SpacingScaleDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Spacing Scale"
        description="All spacing tokens with visual representation"
    >
        <Card className="spacing-scale-demo__card" padding="none">
            <div className="card__body spacing-scale-demo__card-body">
                <div className="spacing-scale-demo">
                    {spacingScale.map(({ token, value }) => (
                        <div key={token} className="spacing-scale-demo__row">
                            <Text className="spacing-scale-demo__label" size="s" color="muted">--spacing-{token}</Text>
                            <div
                                className="spacing-scale-demo__bar"
                                style={{ width: `var(--spacing-${token})` }}
                            />
                            <Text className="spacing-scale-demo__value" size="s">{value}</Text>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    </DemoCard>
);

export default SpacingScaleDemo;


