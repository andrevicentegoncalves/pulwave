/**
 * Color Scale Demo
 * Shows all color scales: primary, secondary, tertiary, neutral, and feedback colors
 */
import { Text, Card } from "@pulwave/ui";
import { DemoCard } from '@pulwave/features-style-guide';
import './ColorDemos.scss';

const codeUsage = `// Color Token Usage (Scale 100-900)
// Format: --color-[palette]-[shade]

.my-element {
    background-color: var(--color-primary-500);
    color: var(--color-neutral-0);
    border: 1px solid var(--color-neutral-200);
}`;

const shades = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const neutralShades = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const colorScales = [
    { name: 'Primary', token: 'primary' },
    { name: 'Secondary', token: 'secondary' },
    { name: 'Tertiary', token: 'tertiary' },
];

// All feedback scales from theme-mapping.scss
const feedbackColors = [
    { name: 'Success', token: 'feedback-success' },
    { name: 'Warning', token: 'feedback-warning' },
    { name: 'Error', token: 'feedback-error' },
    { name: 'Info', token: 'feedback-info' },
    { name: 'Critical', token: 'feedback-critical' },
    { name: 'Promotion', token: 'feedback-promotion' },
    { name: 'Premium', token: 'feedback-premium' },
    { name: 'Discovery', token: 'feedback-discovery' },
    { name: 'Maintenance', token: 'feedback-maintenance' },
    { name: 'Growth', token: 'feedback-growth' },
    { name: 'Urgent', token: 'feedback-urgent' },
];

const ColorScaleDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Color Scales"
        description="Complete color palette with all scales"
    >
        <div className="color-demo-container">
            {/* Brand Colors */}
            <Card className="color-demo-card" padding="none">
                <div className="card__body color-demo-card-body">
                    <Text as="h3" variant="heading-s" className="color-demo-header">Brand Colors</Text>

                    {colorScales.map(({ name, token }) => (
                        <div key={token}>
                            <Text variant="body-s" className="color-demo-scale-title">{name}</Text>
                            <div className="color-demo-scale-row">
                                {shades.map(shade => (
                                    <div
                                        key={shade}
                                        className="color-demo-swatch"
                                        style={{ background: `var(--color-${token}-${shade})` }}
                                        title={`--color-${token}-${shade}`}
                                    >
                                        <Text as="span" variant="label" className="color-demo-swatch-label">{shade}</Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Neutral Scale */}
            <Card className="color-demo-card" padding="none">
                <div className="card__body color-demo-card-body">
                    <Text as="h3" variant="heading-s" className="color-demo-header">Neutral Colors</Text>
                    <div className="color-demo-scale-row">
                        {neutralShades.map(shade => (
                            <div
                                key={shade}
                                className="color-demo-swatch"
                                style={{ background: `var(--color-neutral-${shade})` }}
                                title={`--color-neutral-${shade}`}
                            >
                                <Text as="span" variant="label" className="color-demo-swatch-label">{shade}</Text>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Feedback Colors */}
            <Card className="color-demo-card" padding="none">
                <div className="card__body color-demo-card-body">
                    <Text as="h3" variant="heading-s" className="color-demo-header">Feedback Colors</Text>

                    {feedbackColors.map(({ name, token }) => (
                        <div key={token}>
                            <Text variant="body-s" className="color-demo-scale-title">{name}</Text>
                            <div className="color-demo-scale-row">
                                {shades.map(shade => (
                                    <div
                                        key={shade}
                                        className="color-demo-swatch"
                                        style={{ background: `var(--color-${token}-${shade})` }}
                                        title={`--color-${token}-${shade}`}
                                    >
                                        <Text as="span" variant="label" className="color-demo-swatch-label">{shade}</Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </DemoCard>
);

export default ColorScaleDemo;


