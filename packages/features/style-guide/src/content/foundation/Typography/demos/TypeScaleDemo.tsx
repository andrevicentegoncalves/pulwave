/**
 * Type Scale Demo
 * Shows all typography categories with size variants
 */
import { DemoCard } from '@pulwave/features-style-guide';
import { Text, Card } from "@pulwave/ui";
import type { TextProps } from "@pulwave/ui";
import './TypographyDemos.scss';

type TextSize = NonNullable<TextProps['size']>;

const codeUsage = `// Typography Mixins (SCSS)
// @include typography-title($size: 'l');
// @include typography-body($size: 'm');
// @include typography-caption($size: 's');

// React Component Props
<Text category="title" size="l">Title Large</Text>
<Text category="body" size="m">Body Medium</Text>
<Text category="caption" size="s">Caption Small</Text>`;

const TypeScaleDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Type Scale"
        description="All typography categories with size variants"
    >
        <div className="typography-demo">
            {/* Title Category */}
            <Card className="typography-demo__card" padding="none">
                <div className="card__body typography-demo__card-body">
                    <Text as="h3" variant="heading-s" className="typography-demo__section-title">
                        Title Category
                    </Text>
                    <div className="typography-demo__list">
                        {([
                            { size: '3xl', px: '48px' },
                            { size: '2xl', px: '36px' },
                            { size: 'xl', px: '28px' },
                            { size: 'l', px: '24px' },
                            { size: 'm', px: '20px' },
                            { size: 's', px: '18px' },
                        ] satisfies Array<{ size: TextSize; px: string }>).map(({ size, px }) => (
                            <div key={size} className="typography-demo__row">
                                <Text as="code" variant="body-s" className="typography-demo__meta">
                                    title-{size}
                                </Text>
                                <Text as="span" variant="body-s" className="typography-demo__meta">
                                    {px}
                                </Text>
                                <Text category="title" size={size}>
                                    The quick brown fox
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Body Category */}
            <Card className="typography-demo__card" padding="none">
                <div className="card__body typography-demo__card-body">
                    <Text as="h3" variant="heading-s" className="typography-demo__section-title">
                        Body Category
                    </Text>
                    <div className="typography-demo__list">
                        {([
                            { size: 'l', px: '18px' },
                            { size: 'm', px: '16px' },
                            { size: 's', px: '14px' },
                        ] satisfies Array<{ size: TextSize; px: string }>).map(({ size, px }) => (
                            <div key={size} className="typography-demo__row">
                                <Text as="code" variant="body-s" className="typography-demo__meta">
                                    body-{size}
                                </Text>
                                <Text as="span" variant="body-s" className="typography-demo__meta">
                                    {px}
                                </Text>
                                <Text category="body" size={size}>
                                    The quick brown fox jumps over the lazy dog.
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Caption Category */}
            <Card className="typography-demo__card" padding="none">
                <div className="card__body typography-demo__card-body">
                    <Text as="h3" variant="heading-s" className="typography-demo__section-title">
                        Caption Category
                    </Text>
                    <div className="typography-demo__list">
                        {([
                            { size: 'm', px: '13px' },
                            { size: 's', px: '12px' },
                        ] satisfies Array<{ size: TextSize; px: string }>).map(({ size, px }) => (
                            <div key={size} className="typography-demo__row">
                                <Text as="code" variant="body-s" className="typography-demo__meta">
                                    caption-{size}
                                </Text>
                                <Text as="span" variant="body-s" className="typography-demo__meta">
                                    {px}
                                </Text>
                                <Text category="label" size={size}>
                                    Caption text for descriptions and fine print.
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    </DemoCard>
);

export default TypeScaleDemo;


