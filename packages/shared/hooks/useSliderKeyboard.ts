/**
 * useSliderKeyboard Hook
 * Handles keyboard navigation for slider components.
 * 
 * @package @foundation/hooks
 */
import { useCallback } from 'react';

export interface UseSliderKeyboardOptions {
    value: number;
    min: number;
    max: number;
    step?: number;
    disabled?: boolean;
    vertical?: boolean;
    onChange: (value: number) => void;
}

export interface UseSliderKeyboardReturn {
    onKeyDown: (e: React.KeyboardEvent) => void;
}

export const useSliderKeyboard = ({
    value,
    min,
    max,
    step = 1,
    disabled = false,
    vertical = false,
    onChange,
}: UseSliderKeyboardOptions): UseSliderKeyboardReturn => {
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (disabled) return;

        let newValue = value;
        const largeStep = (max - min) / 10;

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                e.preventDefault();
                newValue = vertical
                    ? (e.key === 'ArrowUp' ? value + step : value)
                    : (e.key === 'ArrowRight' ? value + step : value);
                break;

            case 'ArrowLeft':
            case 'ArrowDown':
                e.preventDefault();
                newValue = vertical
                    ? (e.key === 'ArrowDown' ? value - step : value)
                    : (e.key === 'ArrowLeft' ? value - step : value);
                break;

            case 'PageUp':
                e.preventDefault();
                newValue = value + largeStep;
                break;

            case 'PageDown':
                e.preventDefault();
                newValue = value - largeStep;
                break;

            case 'Home':
                e.preventDefault();
                newValue = min;
                break;

            case 'End':
                e.preventDefault();
                newValue = max;
                break;

            default:
                return;
        }

        // Clamp to range and snap to step
        newValue = Math.min(Math.max(newValue, min), max);
        if (step > 0) {
            newValue = Math.round((newValue - min) / step) * step + min;
            newValue = Math.min(newValue, max);
        }

        if (newValue !== value) {
            onChange(newValue);
        }
    }, [value, min, max, step, disabled, vertical, onChange]);

    return {
        onKeyDown: handleKeyDown,
    };
};

export default useSliderKeyboard;
