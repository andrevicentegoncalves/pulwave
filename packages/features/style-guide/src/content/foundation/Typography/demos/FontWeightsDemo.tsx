/**
 * Font Weights Demo
 * Shows all font weight variants
 */
import { DemoCard } from '@pulwave/features-style-guide';
import { Card, Text } from "@pulwave/ui";
import './TypographyDemos.scss';

const codeUsage = `// Font Weight Tokens
// --font-weight-regular: 400
// --font-weight-medium: 500
// --font-weight-semibold: 600
// --font-weight-bold: 700

<div style={{ fontWeight: 'var(--font-weight-bold)' }}>
    Bold Text
</div>`;

const FontWeightsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Font Weights"
        description="Available font weight values"
    >
        <Card className="typography-demo__card" padding="none">
            <div className="card__body typography-demo__card-body">
                <div className="font-weights-demo">
                    {[
                        { weight: 'regular', value: 400 },
                        { weight: 'medium', value: 500 },
                        { weight: 'semi-bold', value: 600 },
                        { weight: 'bold', value: 700 },
                    ].map(({ weight, value }) => (
                        <div key={weight} className="font-weights-demo__row">
                            <Text as="span" variant="body-m" className="font-weights-demo__label">
                                {weight} ({value})
                            </Text>
                            <Text
                                as="span"
                                variant="body-m"
                                className="font-weights-demo__sample"
                                style={{ fontWeight: value }}
                            >
                                The quick brown fox jumps over the lazy dog
                            </Text>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    </DemoCard>
);

export default FontWeightsDemo;


