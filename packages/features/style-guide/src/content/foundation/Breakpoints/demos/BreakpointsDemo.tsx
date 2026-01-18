/**
 * Breakpoints Demo - Visual representation of responsive thresholds
 */
import { DemoCard } from '@pulwave/features-style-guide';
import { Text } from "@pulwave/ui";

const breakpointsCode = `// Breakpoint tokens (SCSS)
// $bp-xs: 0;
// $bp-sm: 576px;
// $bp-md: 768px;
// $bp-lg: 992px;
// $bp-xl: 1200px;
// $bp-xxl: 1400px;

// Usage in SCSS:
// @include bp-up(md) { ... }
// @include bp-down(sm) { ... }`;

const breakpoints = [
    { name: 'xs', value: '0', description: 'Mobile portrait' },
    { name: 'sm', value: '576px', description: 'Mobile landscape' },
    { name: 'md', value: '768px', description: 'Tablets' },
    { name: 'lg', value: '992px', description: 'Small desktops' },
    { name: 'xl', value: '1200px', description: 'Standard desktops' },
    { name: 'xxl', value: '1400px', description: 'Large screens' },
];

export const BreakpointsScaleDemo = () => (
    <DemoCard sourceCode={breakpointsCode} showSourceToggle={true} title="Breakpoint Scale" description="Visual reference for responsive design thresholds.">
        {() => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {breakpoints.map(({ name, value, description }, index) => (
                    <div
                        key={name}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-3)',
                        }}
                    >
                        <div
                            style={{
                                width: `${(index + 1) * 15}%`,
                                maxWidth: '100%',
                                height: '32px',
                                backgroundColor: `hsl(${220 + index * 20}, 70%, 60%)`,
                                borderRadius: 'var(--border-radius-s)',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: 'var(--spacing-3)',
                                color: 'white',
                                fontWeight: 600,
                            }}
                        >
                            {name.toUpperCase()}
                        </div>
                        <Text as="code" style={{ minWidth: '70px' }}>{value}</Text>
                        <Text as="span" style={{ color: 'var(--color-on-surface-muted)' }}>{description}</Text>
                    </div>
                ))}
            </div>
        )}
    </DemoCard>
);

BreakpointsScaleDemo.displayName = 'BreakpointsScaleDemo';
