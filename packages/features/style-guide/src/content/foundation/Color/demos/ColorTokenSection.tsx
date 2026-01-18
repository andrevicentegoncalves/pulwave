/**
 * ColorTokenSection - Token table for Color documentation
 */
import { TokenTable } from '@pulwave/features-style-guide';
import { getColorTokens, type Token } from '@pulwave/features-style-guide';

/**
 * Color swatch preview for token value
 */
const ColorPreview = ({ token }: { token: Token }) => (
    <span
        style={{
            display: 'inline-block',
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            backgroundColor: token.value,
            border: '1px solid var(--color-border-subtle)',
            marginRight: '8px',
        }}
    />
);

export const ColorTokenSection = () => {
    const colorTokens = getColorTokens();

    return (
        <section className="color-token-section">
            <h3>Color Tokens</h3>
            <p>
                These are the semantic color tokens available. Use CSS variables
                for automatic dark mode support.
            </p>
            <TokenTable
                tokens={[{ variant: 'Default', states: colorTokens.map(t => ({ state: t.name, textToken: t.cssVar, backgroundToken: t.value })) }]}
            />
        </section>
    );
};

export default ColorTokenSection;
