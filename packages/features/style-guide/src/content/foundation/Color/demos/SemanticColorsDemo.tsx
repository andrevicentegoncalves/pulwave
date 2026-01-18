/**
 * Semantic Colors Demo
 * Shows comprehensive semantic tokens for the system
 */
import { Text } from "@pulwave/ui";
import { DemoCard } from '@pulwave/features-style-guide';
import './ColorDemos.scss';

const codeUsage = `// Semantic Token Usage (Recommended)
// Use these tokens to ensure automatic dark mode support

.card {
    background-color: var(--color-surface-default);
    color: var(--color-on-surface-default);
    border: 1px solid var(--color-border-subtle);
}

.primary-button {
    background-color: var(--color-primary-500);
    color: var(--color-on-primary);
}`;

const SemanticColorsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Semantic Colors"
        description="Purpose-based color tokens that adapt to theme"
    >
        <div className="color-demo-container">
            {/* Brand Semantic */}
            <div className="color-demo-section">
                <Text as="h3" variant="heading-s" className="color-demo-header">Brand (Semantic)</Text>
                <div className="color-demo-scale-row">
                    {[
                        { token: 'primary', label: 'Primary' },
                        { token: 'secondary', label: 'Secondary' },
                        { token: 'tertiary', label: 'Tertiary' },
                    ].map(({ token, label }) => (
                        <div key={token} className="color-demo-semantic-card">
                            <div
                                className="color-demo-semantic-preview"
                                style={{ background: `var(--color-${token})` }}
                            />
                            <Text variant="body-s" className="color-demo-token-name">{label}</Text>
                            <Text as="code" variant="body-s" className="color-demo-token-value">--color-{token}</Text>
                        </div>
                    ))}
                </div>
                {/* Brand States - just showing primary for brevity, or list all if needed. User asked for 'missing' feedback, not brand details. */}
            </div>

            {/* Surface Tokens */}
            <div className="color-demo-section">
                <Text as="h3" variant="heading-s" className="color-demo-header">Surface</Text>
                <div className="color-demo-scale-row">
                    {[
                        { token: 'surface-default', label: 'Default' },
                        { token: 'surface-subtle', label: 'Subtle' },
                        { token: 'surface-strong', label: 'Strong' },
                        { token: 'surface-inverse-default', label: 'Inverse' },
                    ].map(({ token, label }) => (
                        <div key={token} className="color-demo-semantic-card">
                            <div
                                className="color-demo-semantic-preview"
                                style={{ background: `var(--color-${token})` }}
                            />
                            <Text variant="body-s" className="color-demo-token-name">{label}</Text>
                            <Text as="code" variant="body-s" className="color-demo-token-value">{token}</Text>
                        </div>
                    ))}
                </div>
            </div>

            {/* Text Tokens */}
            <div className="color-demo-section">
                <Text as="h3" variant="heading-s" className="color-demo-header">Text (On-Surface)</Text>
                <div className="color-demo-scale-row">
                    {[
                        { token: 'on-surface-default', label: 'Default' },
                        { token: 'on-surface-secondary', label: 'Secondary' },
                        { token: 'on-surface-muted', label: 'Muted' },
                        { token: 'on-surface-inverse-default', label: 'Inverse' },
                    ].map(({ token, label }) => (
                        <div key={token} className="color-demo-semantic-card">
                            <div
                                className="color-demo-semantic-preview"
                                style={{
                                    background: token.includes('inverse') ? 'var(--color-surface-default)' : 'var(--color-surface-inverse-default)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <span style={{ color: `var(--color-${token})`, fontSize: '24px', fontWeight: 600 }}>Aa</span>
                            </div>
                            <Text variant="body-s" className="color-demo-token-name">{label}</Text>
                            <Text as="code" variant="body-s" className="color-demo-token-value">{token}</Text>
                        </div>
                    ))}
                </div>
            </div>

            {/* Links & Focus */}
            <div className="color-demo-section">
                <Text as="h3" variant="heading-s" className="color-demo-header">Interaction</Text>
                <div className="color-demo-scale-row">
                    {[
                        { token: 'link-default', label: 'Link' },
                        { token: 'focus-ring', label: 'Focus Ring' },
                        { token: 'focus-ring-error', label: 'Focus Error' },
                    ].map(({ token, label }) => (
                        <div key={token} className="color-demo-semantic-card">
                            <div
                                className="color-demo-semantic-preview"
                                style={{
                                    background: 'transparent',
                                    border: token.includes('ring') ? `4px solid var(--color-${token})` : 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                {!token.includes('ring') && <span style={{ color: `var(--color-${token})`, fontWeight: 600 }}>Link</span>}
                            </div>
                            <Text variant="body-s" className="color-demo-token-name">{label}</Text>
                            <Text as="code" variant="body-s" className="color-demo-token-value">{token}</Text>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feedback Semantic */}
            <div className="color-demo-section">
                <Text as="h3" variant="heading-s" className="color-demo-header">Feedback (Semantic)</Text>
                <div className="color-demo-scale-row">
                    {[
                        'success', 'warning', 'error', 'info',
                        'critical', 'promotion', 'premium', 'discovery',
                        'maintenance', 'growth', 'urgent'
                    ].map(type => (
                        <div key={type} className="color-demo-semantic-card">
                            <div
                                className="color-demo-semantic-preview"
                                style={{ background: `var(--color-feedback-${type})` }}
                            />
                            <Text variant="body-s" className="color-demo-token-name" style={{ textTransform: 'capitalize' }}>{type}</Text>
                            <Text as="code" variant="body-s" className="color-demo-token-value">feedback-{type}</Text>
                        </div>
                    ))}
                </div>
            </div>

            {/* On-Feedback */}
            <div className="color-demo-section">
                <Text as="h3" variant="heading-s" className="color-demo-header">Text On-Feedback</Text>
                <div className="color-demo-scale-row">
                    {['success', 'warning', 'error', 'info'].map(type => (
                        <div key={type} className="color-demo-semantic-card">
                            <div
                                className="color-demo-semantic-preview"
                                style={{
                                    background: `var(--color-feedback-${type})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <span style={{ color: `var(--color-on-${type})` }}>Text</span>
                            </div>
                            <Text variant="body-s" className="color-demo-token-name" style={{ textTransform: 'capitalize' }}>{type}</Text>
                            <Text as="code" variant="body-s" className="color-demo-token-value">on-{type}</Text>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </DemoCard>
);

export default SemanticColorsDemo;
