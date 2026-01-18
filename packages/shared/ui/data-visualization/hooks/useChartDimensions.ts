import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

export interface ChartDimensionsOptions {
    defaultWidth?: number;
    defaultHeight?: number;
    aspectRatio?: number | null;
    minHeight?: number;
    maxHeight?: number;
}

export interface ChartDimensionsResult {
    ref: RefObject<HTMLDivElement | null>;
    width: number;
    height: number;
    isReady: boolean;
}

/**
 * useChartDimensions Hook
 * Provides responsive dimensions for charts using ResizeObserver.
 */
export const useChartDimensions = ({
    defaultWidth = 400,
    defaultHeight = 300,
    aspectRatio = null,
    minHeight = 150,
    maxHeight = 600,
}: ChartDimensionsOptions = {}): ChartDimensionsResult => {
    const ref = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({
        width: defaultWidth,
        height: defaultHeight,
        isReady: false,
    });

    const calculateHeight = useCallback((width: number) => {
        if (aspectRatio) {
            const calculatedHeight = width / aspectRatio;
            return Math.min(maxHeight, Math.max(minHeight, calculatedHeight));
        }
        return defaultHeight;
    }, [aspectRatio, defaultHeight, minHeight, maxHeight]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;
                if (width > 0) {
                    setDimensions({
                        width: Math.floor(width),
                        height: calculateHeight(width),
                        isReady: true,
                    });
                }
            }
        });

        resizeObserver.observe(element);

        // Initial measurement
        const rect = element.getBoundingClientRect();
        if (rect.width > 0) {
            setDimensions({
                width: Math.floor(rect.width),
                height: calculateHeight(rect.width),
                isReady: true,
            });
        }

        return () => resizeObserver.disconnect();
    }, [calculateHeight]);

    return {
        ref,
        width: dimensions.width,
        height: dimensions.height,
        isReady: dimensions.isReady,
    };
};

export default useChartDimensions;
