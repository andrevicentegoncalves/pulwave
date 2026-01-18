/**
 * SpacingTokenSection - Token table for Spacing documentation
 */
import { TokenTable } from '@pulwave/features-style-guide';
import { getSpacingTokens, type Token } from '@pulwave/features-style-guide';

/**
 * Visual preview for spacing token
 */
const SpacingPreview = ({ token }: { token: Token }) => (
    <span
        style={{
            display: 'inline-block',
            width: token.value,
            height: '16px',
            backgroundColor: 'var(--color-brand-primary)',
            borderRadius: '2px',
            opacity: 0.7,
            maxWidth: '100px',
        }}
    />
);

export const SpacingTokenSection = () => {
    const spacingTokens = getSpacingTokens();

    return (
        <section className="spacing-token-section">
            <h3>Spacing Tokens</h3>
            <p>
                The spacing scale is based on a 4px grid. Use the scale tokens
                for consistent spacing throughout the UI.
            </p>
            <TokenTable
                tokens={[{ variant: 'Default', states: spacingTokens.map(t => ({ state: t.name, textToken: t.cssVar, backgroundToken: t.value })) }]}
            />
        </section>
    );
};

export default SpacingTokenSection;
