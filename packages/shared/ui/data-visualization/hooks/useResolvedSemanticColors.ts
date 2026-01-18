import { useMemo } from 'react';
import { useChartContext, type SemanticColors } from '../providers/ChartProvider';
import { resolveCssColor } from './useChartColors';

/**
 * useResolvedSemanticColors Hook
 *
 * Returns semantic colors with CSS variables resolved to actual RGB values.
 * Required for SVG inline attributes (fill, stroke) which don't support CSS custom properties.
 *
 * @example
 * const colors = useResolvedSemanticColors();
 * <circle fill={colors.primary} stroke={colors.border} />
 */
export const useResolvedSemanticColors = (): SemanticColors => {
    const { semanticColors } = useChartContext();

    return useMemo(() => ({
        grid: resolveCssColor(semanticColors.grid),
        axis: resolveCssColor(semanticColors.axis),
        text: resolveCssColor(semanticColors.text),
        textMuted: resolveCssColor(semanticColors.textMuted),
        background: resolveCssColor(semanticColors.background),
        backgroundElevated: resolveCssColor(semanticColors.backgroundElevated),
        border: resolveCssColor(semanticColors.border),
        primary: resolveCssColor(semanticColors.primary),
        success: resolveCssColor(semanticColors.success),
        warning: resolveCssColor(semanticColors.warning),
        error: resolveCssColor(semanticColors.error),
    }), [semanticColors]);
};

export default useResolvedSemanticColors;
