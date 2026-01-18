/**
 * useSeriesVisibility Hook
 * 
 * Manages visibility state for chart series via legend interaction.
 * Reduces code duplication across multi-series charts.
 */
import { useState, useCallback } from 'react';

interface UseSeriesVisibilityReturn {
    /** Array of hidden series keys */
    hiddenSeries: string[];
    /** Toggle visibility of a series */
    toggleSeries: (key: string) => void;
    /** Check if a series is hidden */
    isHidden: (key: string) => boolean;
    /** Handle legend click - toggles series visibility */
    handleLegendClick: (payload: { dataKey?: string }) => void;
}

/**
 * Hook to manage series visibility state for charts with legend toggle functionality.
 * 
 * @example
 * const { hiddenSeries, handleLegendClick, isHidden } = useSeriesVisibility();
 * 
 * <Legend onClick={handleLegendClick} />
 * {yKeys.map(key => <Line key={key} hide={isHidden(key)} />)}
 */
export const useSeriesVisibility = (): UseSeriesVisibilityReturn => {
    const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

    const toggleSeries = useCallback((key: string) => {
        setHiddenSeries(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    }, []);

    const isHidden = useCallback((key: string) => {
        return hiddenSeries.includes(key);
    }, [hiddenSeries]);

    const handleLegendClick = useCallback(({ dataKey }: { dataKey?: string }) => {
        if (dataKey) {
            toggleSeries(dataKey);
        }
    }, [toggleSeries]);

    return {
        hiddenSeries,
        toggleSeries,
        isHidden,
        handleLegendClick,
    };
};

export default useSeriesVisibility;
