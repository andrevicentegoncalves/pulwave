
/**
 * Accessibility Demo - Focus and contrast visualization
 */
import { DemoCard } from '@pulwave/features-style-guide';
import { Button, Text } from "@pulwave/ui";

const focusRingCode = `<div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
    <Button kind="primary">Primary Button</Button>
    <Button kind="secondary" variant="outlined">Secondary Button</Button>
    <input type="text" placeholder="Input field" />
    <a href="#">Link example</a>
</div>`;

const contrastCode = `<div style={{ backgroundColor: 'var(--color-primary-500)', color: 'var(--color-on-primary)' }}>
    4.5:1 Contrast Ratio (Accessible)
</div>`;

const touchTargetCode = `<div style={{ minWidth: '44px', minHeight: '44px' }}>
    Touch Target
</div>`;

export const FocusRingDemo = () => (
    <DemoCard sourceCode={focusRingCode} showSourceToggle={true} title="Focus Ring Examples" description="Tab through these elements to see focus indicators.">
        {() => (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
                <Button kind="primary">Primary Button</Button>
                <Button kind="secondary" variant="outlined">Secondary Button</Button>
                <Button kind="tertiary" variant="ghost">Tertiary Button</Button>
                <input
                    type="text"
                    placeholder="Input field…"
                    aria-label="Example text input"
                    style={{
                        padding: 'var(--spacing-3)',
                        borderRadius: 'var(--border-radius-m)',
                        border: '1px solid var(--color-border-default)',
                    }}
                />
                <a href="#" style={{ padding: 'var(--spacing-2)', color: 'var(--color-primary-500)', textDecoration: 'underline' }}>
                    Link example
                </a>
            </div>
        )}
    </DemoCard>
);

export const ContrastDemo = () => (
    <DemoCard sourceCode={contrastCode} showSourceToggle={true} title="Color Contrast Requirements" description="Text on background color contrast ratios.">
        {() => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div
                        style={{
                            width: '120px',
                            height: '48px',
                            backgroundColor: 'var(--color-surface-default)',
                            color: 'var(--color-on-surface-default)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--border-radius-m)',
                            border: '1px solid var(--color-border-subtle)',
                        }}
                    >
                        4.5:1 ✓
                    </div>
                    <Text>Body text on surface</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div
                        style={{
                            width: '120px',
                            height: '48px',
                            backgroundColor: 'var(--color-primary-500)',
                            color: 'var(--color-on-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--border-radius-m)',
                            fontWeight: 600,
                        }}
                    >
                        4.5:1 ✓
                    </div>
                    <Text>Text on primary color</Text>
                </div>
            </div>
        )}
    </DemoCard>
);

export const TouchTargetDemo = () => (
    <DemoCard sourceCode={touchTargetCode} showSourceToggle={true} title="Touch Target Sizes" description="Minimum 44×44px for touch accessibility.">
        {() => (
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
                <div
                    style={{
                        width: '44px',
                        height: '44px',
                        backgroundColor: 'var(--color-feedback-success-subtle)',
                        border: '2px dashed var(--color-feedback-success)',
                        borderRadius: 'var(--border-radius-m)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--font-size-xs)',
                    }}
                >
                    44px
                </div>
                <Text>← Minimum touch target</Text>
            </div>
        )}
    </DemoCard>
);

FocusRingDemo.displayName = 'FocusRingDemo';
ContrastDemo.displayName = 'ContrastDemo';
TouchTargetDemo.displayName = 'TouchTargetDemo';
