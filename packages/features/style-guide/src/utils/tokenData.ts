/**
 * Token Data Utility
 * 
 * Provides functions to filter and format tokens for documentation.
 */
import { tokens } from '@pulwave/tokens';

export interface Token {
    name: string;
    value: string;
    cssVar: string;
    description?: string;
}

/**
 * Gets tokens by prefix (e.g., 'color.', 'spacing.')
 */
export const getTokensByGroup = (prefix: string): Token[] => {
    return Object.entries(tokens)
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, value]) => ({
            name: key,
            value: value as string,
            cssVar: `--${key.replace(/\./g, '-')}`,
        }));
};

export const getColorTokens = () => getTokensByGroup('color.');
export const getSpacingTokens = () => getTokensByGroup('spacing.');
export const getTypographyTokens = () => getTokensByGroup('font-size.');
export const getZIndexTokens = () => getTokensByGroup('z-index.');
export const getBorderTokens = () => getTokensByGroup('border-radius.');
export const getBreakpointTokens = () => getTokensByGroup('breakpoint.');
