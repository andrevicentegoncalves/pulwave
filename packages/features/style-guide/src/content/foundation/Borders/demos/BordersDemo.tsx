/**
 * Borders Demo - Visual token showcase
 */
import { DemoCard } from '@pulwave/features-style-guide';
import { Text } from "@pulwave/ui";

const borderRadiusCode = `<div style={{ borderRadius: 'var(--border-radius-m)' }}>
    Rounded Container
</div>`;

const borderWidthCode = `<div style={{ border: 'var(--border-width-thin) solid var(--color-border-default)' }}>
    Bordered Element
</div>`;

const borderRadii = [
    { token: '--border-radius-none', label: 'None', value: '0' },
    { token: '--border-radius-xs', label: 'XS', value: '2px' },
    { token: '--border-radius-s', label: 'S', value: '4px' },
    { token: '--border-radius-m', label: 'M', value: '8px' },
    { token: '--border-radius-l', label: 'L', value: '12px' },
    { token: '--border-radius-xl', label: 'XL', value: '16px' },
    { token: '--border-radius-round', label: 'Round', value: '9999px' },
];

const borderWidths = [
    { token: '--border-width-thin', label: 'Thin', value: '1px' },
    { token: '--border-width-medium', label: 'Medium', value: '2px' },
    { token: '--border-width-thick', label: 'Thick', value: '3px' },
];

export const BorderRadiusDemo = () => (
    <DemoCard sourceCode={borderRadiusCode} showSourceToggle={true} title="Border Radius Scale" description="Visual progression of corner rounding tokens.">
        {() => (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
                {borderRadii.map(({ token, label, value }) => (
                    <div key={token} style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'var(--color-primary-500)',
                                borderRadius: `var(${token})`,
                            }}
                        />
                        <Text style={{ marginTop: 'var(--spacing-2)', fontWeight: 600 }}>{label}</Text>
                        <Text as="code" size="s">{value}</Text>
                    </div>
                ))}
            </div>
        )}
    </DemoCard>
);

export const BorderWidthDemo = () => (
    <DemoCard sourceCode={borderWidthCode} showSourceToggle={true} title="Border Width Scale" description="Border thickness tokens for different emphasis levels.">
        {() => (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
                {borderWidths.map(({ token, label, value }) => (
                    <div key={token} style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                width: '100px',
                                height: '60px',
                                border: `var(${token}) solid var(--color-border-strong)`,
                                borderRadius: 'var(--border-radius-m)',
                            }}
                        />
                        <Text style={{ marginTop: 'var(--spacing-2)', fontWeight: 600 }}>{label}</Text>
                        <Text as="code" size="s">{value}</Text>
                    </div>
                ))}
            </div>
        )}
    </DemoCard>
);

BorderRadiusDemo.displayName = 'BorderRadiusDemo';
BorderWidthDemo.displayName = 'BorderWidthDemo';
