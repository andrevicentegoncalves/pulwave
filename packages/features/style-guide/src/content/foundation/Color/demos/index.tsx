/**
 * Color Foundation - Demos Index
 *
 * Comprehensive demos for the color system
 */

// Color Scale Demo
export const ColorScaleDemo = () => (
    <div className="color-scale-demo">
        <h4>Primary Scale</h4>
        <div className="color-scale-demo__row">
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                <div
                    key={shade}
                    className="color-scale-demo__swatch"
                    style={{ background: `var(--color-primary-${shade})` }}
                >
                    <span className="color-scale-demo__label">{shade}</span>
                </div>
            ))}
        </div>

        <h4>Neutral Scale</h4>
        <div className="color-scale-demo__row">
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                <div
                    key={shade}
                    className="color-scale-demo__swatch"
                    style={{ background: `var(--color-neutral-${shade})` }}
                >
                    <span className="color-scale-demo__label">{shade}</span>
                </div>
            ))}
        </div>
    </div>
);

// Semantic Colors Demo
export const SemanticColorsDemo = () => (
    <div className="semantic-colors-demo">
        <div className="semantic-colors-demo__group">
            <h4>Surface Tokens</h4>
            <div className="semantic-colors-demo__row">
                {['default', 'subtle', 'strong', 'hover'].map(variant => (
                    <div
                        key={variant}
                        className="semantic-colors-demo__box"
                        style={{ background: `var(--color-surface-${variant})` }}
                    >
                        <span>--color-surface-{variant}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="semantic-colors-demo__group">
            <h4>Feedback Colors</h4>
            <div className="semantic-colors-demo__row">
                {['success', 'warning', 'error', 'info'].map(variant => (
                    <div
                        key={variant}
                        className="semantic-colors-demo__box"
                        style={{
                            background: `var(--color-feedback-${variant})`,
                            color: `var(--color-on-feedback-${variant})`
                        }}
                    >
                        {variant}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Theme Comparison Demo
export const ThemeComparisonDemo = () => (
    <div className="theme-comparison-demo">
        <div className="theme-comparison-demo__side" data-theme="light">
            <h4>Light Theme</h4>
            <div className="theme-comparison-demo__card">
                <p>Surface Default</p>
                <button className="theme-comparison-demo__button">Primary Button</button>
            </div>
        </div>
        <div className="theme-comparison-demo__side" data-theme="dark">
            <h4>Dark Theme</h4>
            <div className="theme-comparison-demo__card">
                <p>Surface Default</p>
                <button className="theme-comparison-demo__button">Primary Button</button>
            </div>
        </div>
    </div>
);

export const ColorDemos = [ColorScaleDemo, SemanticColorsDemo, ThemeComparisonDemo];
