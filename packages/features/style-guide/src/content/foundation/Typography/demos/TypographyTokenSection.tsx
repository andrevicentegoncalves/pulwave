/**
 * TypographyTokenSection - Token table for Typography documentation
 */
import { TokenTable } from '@pulwave/features-style-guide';
import { getTypographyTokens, type Token } from '@pulwave/features-style-guide';

/**
 * Typography preview for font size token
 */
const TypographyPreview = ({ token }: { token: Token }) => {
    if (token.name.includes('fontSize')) {
        return (
            <span style={{ fontSize: token.value, lineHeight: 1 }}>
                Aa
            </span>
        );
    }
    if (token.name.includes('fontWeight')) {
        return (
            <span style={{ fontWeight: token.value }}>
                Aa
            </span>
        );
    }
    return null;
};

export const TypographyTokenSection = () => {
    const typographyTokens = getTypographyTokens();

    return (
        <section className="typography-token-section">
            <h3>Typography Tokens</h3>
            <p>
                Font sizes, weights, line heights, and letter spacing tokens.
            </p>
            <TokenTable
                tokens={[{ variant: 'Default', states: typographyTokens.map(t => ({ state: t.name, textToken: t.cssVar, backgroundToken: t.value })) }]}
            />
        </section>
    );
};

export default TypographyTokenSection;
