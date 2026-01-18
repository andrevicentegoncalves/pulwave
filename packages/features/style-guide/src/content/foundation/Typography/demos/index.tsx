/**
 * Typography Foundation - Demos Index
 *
 * Comprehensive demos for the typography system
 */
import { Text } from "@pulwave/ui";
import type { TextProps } from "@pulwave/ui";

type TextSize = NonNullable<TextProps['size']>;

// Type Scale Demo
export const TypeScaleDemo = () => (
    <div className="type-scale-demo">
        <h4>Title Category</h4>
        <div className="type-scale-demo__samples">
            {(['3xl', '2xl', 'xl', 'l', 'm', 's', 'xs'] satisfies TextSize[]).map(size => (
                <div key={size} className="type-scale-demo__sample">
                    <Text size="xs" color="muted" className="type-scale-demo__label">title-{size}</Text>
                    <Text category="title" size={size} className="type-scale-demo__text">
                        The quick brown fox
                    </Text>
                </div>
            ))}
        </div>

        <h4>Body Category</h4>
        <div className="type-scale-demo__samples">
            {(['l', 'm', 's'] satisfies TextSize[]).map(size => (
                <div key={size} className="type-scale-demo__sample">
                    <Text size="xs" color="muted" className="type-scale-demo__label">body-{size}</Text>
                    <Text category="body" size={size} className="type-scale-demo__text">
                        The quick brown fox jumps over the lazy dog.
                    </Text>
                </div>
            ))}
        </div>

        <h4>Caption Category</h4>
        <div className="type-scale-demo__samples">
            {(['m', 's'] satisfies TextSize[]).map(size => (
                <div key={size} className="type-scale-demo__sample">
                    <Text size="xs" color="muted" className="type-scale-demo__label">caption-{size}</Text>
                    <Text category="body" size={size} color="muted" className="type-scale-demo__text">
                        Helper text and fine print
                    </Text>
                </div>
            ))}
        </div>
    </div>
);

// Font Weights Demo
export const FontWeightsDemo = () => (
    <div className="font-weights-demo">
        {[
            { weight: 'regular', value: 400 },
            { weight: 'medium', value: 500 },
            { weight: 'semi-bold', value: 600 },
            { weight: 'bold', value: 700 },
        ].map(({ weight, value }) => (
            <div key={weight} className="font-weights-demo__row">
                <Text size="xs" color="muted" className="font-weights-demo__label">{weight} ({value})</Text>
                <Text
                    className="font-weights-demo__sample"
                    style={{ fontWeight: value }}
                >
                    The quick brown fox jumps over the lazy dog
                </Text>
            </div>
        ))}
    </div>
);

// Responsive Typography Demo
export const ResponsiveTypographyDemo = () => (
    <div className="responsive-typography-demo">
        <Text color="muted" className="responsive-typography-demo__note">
            Resize the window to see typography scale responsively
        </Text>
        <Text as="h1" category="title" size="2xl">Page Title (2xl)</Text>
        <Text as="h2" category="title" size="l">Section Heading (l)</Text>
        <Text size="m">
            Body text that adapts to screen size for optimal readability across devices.
        </Text>
    </div>
);

export const TypographyDemos = [TypeScaleDemo, FontWeightsDemo, ResponsiveTypographyDemo];
