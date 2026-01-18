/**
 * useSliderDrag Hook
 * Handles mouse and touch drag interactions for slider components.
 * Uses stable refs to avoid stale closure issues with event listeners.
 * 
 * @package @foundation/hooks
 */
import { useCallback, useRef, useEffect, RefObject } from 'react';

export interface UseSliderDragOptions {
    trackRef: RefObject<HTMLElement>;
    disabled?: boolean;
    vertical?: boolean;
    onDragStart?: (percentage: number, thumbIndex: number | null) => void;
    onDrag?: (percentage: number, thumbIndex: number | null) => void;
    onDragEnd?: () => void;
}

export interface UseSliderDragReturn {
    handlers: {
        onMouseDown: (e: React.MouseEvent, thumbIndex?: number) => void;
        onTouchStart: (e: React.TouchEvent, thumbIndex?: number) => void;
        onTrackClick: (e: React.MouseEvent) => void;
    };
}

export const useSliderDrag = ({
    trackRef,
    disabled = false,
    vertical = false,
    onDragStart,
    onDrag,
    onDragEnd,
}: UseSliderDragOptions): UseSliderDragReturn => {
    const callbacksRef = useRef({ onDragStart, onDrag, onDragEnd });
    const stateRef = useRef({
        isDragging: false,
        activeThumb: null as number | null,
    });

    useEffect(() => {
        callbacksRef.current = { onDragStart, onDrag, onDragEnd };
    });

    const getPercentageFromPosition = useCallback((clientX: number, clientY: number): number => {
        if (!trackRef.current) return 0;
        const rect = trackRef.current.getBoundingClientRect();

        if (vertical) {
            const offset = rect.bottom - clientY;
            const percentage = (offset / rect.height) * 100;
            return Math.min(Math.max(percentage, 0), 100);
        } else {
            const offset = clientX - rect.left;
            const percentage = (offset / rect.width) * 100;
            return Math.min(Math.max(percentage, 0), 100);
        }
    }, [trackRef, vertical]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!stateRef.current.isDragging || disabled) return;
        const percentage = getPercentageFromPosition(e.clientX, e.clientY);
        callbacksRef.current.onDrag?.(percentage, stateRef.current.activeThumb);
    }, [disabled, getPercentageFromPosition]);

    const handleMouseUp = useCallback(() => {
        if (stateRef.current.isDragging) {
            stateRef.current.isDragging = false;
            stateRef.current.activeThumb = null;
            callbacksRef.current.onDragEnd?.();
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!stateRef.current.isDragging || disabled || e.touches.length === 0) return;
        e.preventDefault();
        const touch = e.touches[0];
        const percentage = getPercentageFromPosition(touch.clientX, touch.clientY);
        callbacksRef.current.onDrag?.(percentage, stateRef.current.activeThumb);
    }, [disabled, getPercentageFromPosition]);

    const handleTouchEnd = useCallback(() => {
        if (stateRef.current.isDragging) {
            stateRef.current.isDragging = false;
            stateRef.current.activeThumb = null;
            callbacksRef.current.onDragEnd?.();
        }
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }, [handleTouchMove]);

    const handleMouseDown = useCallback((e: React.MouseEvent, thumbIndex = 0) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();

        stateRef.current.isDragging = true;
        stateRef.current.activeThumb = thumbIndex;

        const percentage = getPercentageFromPosition(e.clientX, e.clientY);
        callbacksRef.current.onDragStart?.(percentage, thumbIndex);
        callbacksRef.current.onDrag?.(percentage, thumbIndex);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [disabled, getPercentageFromPosition, handleMouseMove, handleMouseUp]);

    const handleTouchStart = useCallback((e: React.TouchEvent, thumbIndex = 0) => {
        if (disabled || e.touches.length === 0) return;

        stateRef.current.isDragging = true;
        stateRef.current.activeThumb = thumbIndex;

        const touch = e.touches[0];
        const percentage = getPercentageFromPosition(touch.clientX, touch.clientY);
        callbacksRef.current.onDragStart?.(percentage, thumbIndex);
        callbacksRef.current.onDrag?.(percentage, thumbIndex);

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
    }, [disabled, getPercentageFromPosition, handleTouchMove, handleTouchEnd]);

    const handleTrackClick = useCallback((e: React.MouseEvent) => {
        if (disabled) return;
        const target = e.target as HTMLElement;
        if (target.closest('.slider__thumb')) return;

        const percentage = getPercentageFromPosition(e.clientX, e.clientY);
        callbacksRef.current.onDrag?.(percentage, null);
        callbacksRef.current.onDragEnd?.();
    }, [disabled, getPercentageFromPosition]);

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    return {
        handlers: {
            onMouseDown: handleMouseDown,
            onTouchStart: handleTouchStart,
            onTrackClick: handleTrackClick,
        },
    };
};

export default useSliderDrag;
