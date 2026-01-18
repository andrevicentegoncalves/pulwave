import { Text, Card, Stack } from "@pulwave/ui";
import { Guidance } from '@pulwave/features-style-guide';
import { IconSizeScaleDemo, IconStrokeWidthDemo } from '../../demos';
import './styles/_index.scss';

export const IconGuidelinesPage = () => {
    return (
        <div className="iconography-guidelines">
            {/* Introduction */}
            <section className="iconography-guidelines__section">
                <Text variant="body-l" className="text-neural-600">
                    Icons provide visual shortcuts for actions, navigation, and status.
                    Consistent iconography improves usability and reduces cognitive load
                    by establishing a recognizable visual language across the platform.
                </Text>
            </section>

            {/* When to Use Section - Using Guidance Component */}
            <section className="iconography-guidelines__section">
                <Guidance
                    positive={{
                        title: 'Do',
                        items: [
                            'Use icons from a single library exclusively for visual consistency',
                            'Match icon size to surrounding text (M 24px for body text)',
                            'Always provide accessible labels (aria-label or adjacent text)',
                            'Use consistent stroke width (2px default) across your interface',
                            'Pair icons with text labels for complex actions',
                        ]
                    }}
                    negative={{
                        title: "Don't",
                        items: [
                            'Mix multiple icon libraries within the same project',
                            'Use icons without accessible labels for screen readers',
                            'Scale icons beyond the defined size scale',
                            'Use icons as the sole conveyor of complex meaning',
                            'Use inconsistent stroke widths within the same interface',
                        ]
                    }}
                />
            </section>

            {/* Code Implementation Section */}
            <section className="iconography-guidelines__section">
                <Text category="title" size="xl" weight="bold" className="iconography-guidelines__subtitle">Code Implementation</Text>
                <Text variant="body-m" className="iconography-guidelines__description">
                    Icons are exported directly from the @ui package for tree-shaking optimization.
                </Text>
                <Card className="bg-surface-subtle overflow-hidden" padding="md">
                    <div className="p-4 font-mono text-sm leading-relaxed">
                        <div className="text-neutral-500">// Import icons directly</div>
                        <div><span className="text-brand-primary font-semibold">import</span> {'{'} Home, Settings, User {'}'} <span className="text-brand-primary font-semibold">from</span> <span className="text-success-700">'@ui'</span>;</div>
                        <br />
                        <div className="text-neutral-500">// Basic usage with size prop</div>
                        <div>&lt;<span className="text-warning-700">Home</span> <span className="text-info-700">size</span>={'{'}24{'}'} /&gt;</div>
                        <br />
                        <div className="text-neutral-500">// With custom stroke width</div>
                        <div>&lt;<span className="text-warning-700">Settings</span> <span className="text-info-700">size</span>={'{'}24{'}'} <span className="text-info-700">strokeWidth</span>={'{'}2{'}'} /&gt;</div>
                        <br />
                        <div className="text-neutral-500">// With custom color</div>
                        <div>&lt;<span className="text-warning-700">User</span> <span className="text-info-700">size</span>={'{'}24{'}'} <span className="text-info-700">color</span>="<span className="text-success-700">var(--color-brand-primary)</span>" /&gt;</div>
                    </div>
                </Card>
            </section>

            {/* Size Scale Section - Using Demo Card */}
            <section className="iconography-guidelines__section">
                <IconSizeScaleDemo />
            </section>

            {/* Stroke Width Section - Using Demo Card */}
            <section className="iconography-guidelines__section">
                <IconStrokeWidthDemo />
            </section>

            {/* Accessibility Section */}
            <section className="iconography-guidelines__section">
                <Text category="title" size="xl" weight="bold" className="iconography-guidelines__subtitle">Accessibility</Text>
                <div className="iconography-guidelines__card-grid">
                    <Card padding="l">
                        <Text variant="body-m" weight="bold" className="mb-2">Screen Readers</Text>
                        <Text variant="body-m" className="text-neural-600">
                            Icons are hidden from screen readers by default (aria-hidden).
                            For interactive icons, always provide an aria-label or visible adjacent text.
                        </Text>
                    </Card>
                    <Card padding="l">
                        <Text variant="body-m" weight="bold" className="mb-2">Color Contrast</Text>
                        <Text variant="body-m" className="text-neural-600">
                            Ensure icon color meets WCAG 2.1 contrast requirements (4.5:1 for text-size icons,
                            3:1 for large icons).
                        </Text>
                    </Card>
                    <Card padding="l">
                        <Text variant="body-m" weight="bold" className="mb-2">Touch Targets</Text>
                        <Text variant="body-m" className="text-neural-600">
                            Interactive icons should have a minimum touch target of 44x44px.
                            Use Button component with icon-only pattern for proper sizing.
                        </Text>
                    </Card>
                </div>
            </section>
        </div>
    );
};
