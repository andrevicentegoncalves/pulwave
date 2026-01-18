import { useState, useCallback, useRef } from 'react';

export interface SVGTooltipState {
    content: string;
    x: number;
    y: number;
    visible: boolean;
}

/**
 * useSVGTooltip Hook
 *
 * Provides tooltip functionality for SVG elements
 * Returns state and handlers to attach to SVG elements
 *
 * Performance optimizations:
 * - Uses RAF for position updates to batch with browser repaint
 * - Throttles position updates to prevent excessive re-renders
 */
export const useSVGTooltip = () => {
    const [tooltip, setTooltip] = useState<SVGTooltipState>({
        content: '',
        x: 0,
        y: 0,
        visible: false,
    });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rafRef = useRef<number | null>(null);
    const visibleRef = useRef(false); // Track visibility without re-renders

    const showTooltip = useCallback((content: string, event: React.MouseEvent<Element>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        visibleRef.current = true;

        const rect = event.currentTarget.getBoundingClientRect();
        setTooltip({
            content,
            x: rect.left + rect.width / 2,
            y: rect.top,
            visible: true,
        });
    }, []);

    const hideTooltip = useCallback(() => {
        visibleRef.current = false;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setTooltip((prev) => ({ ...prev, visible: false }));
        }, 100);
    }, []);

    const updatePosition = useCallback((e: React.MouseEvent<Element>) => {
        if (!visibleRef.current) return;

        // Cancel any pending RAF to prevent stacking
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        // Capture the target element before RAF (React events are pooled and recycled)
        const target = e.currentTarget;
        if (!target) return;

        // Use RAF to batch position updates with browser repaint
        rafRef.current = requestAnimationFrame(() => {
            const rect = target.getBoundingClientRect();
            setTooltip(prev => ({
                ...prev,
                x: rect.left + rect.width / 2,
                y: rect.top,
            }));
        });
    }, []);

    const getHandlers = useCallback((content: string) => ({
        onMouseEnter: (e: React.MouseEvent<Element>) => showTooltip(content, e),
        onMouseLeave: hideTooltip,
        onMouseMove: updatePosition,
    }), [showTooltip, hideTooltip, updatePosition]);

    return {
        tooltip,
        showTooltip,
        hideTooltip,
        getHandlers,
    };
};
