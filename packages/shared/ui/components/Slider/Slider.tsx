import React, { useState, useRef, useCallback, useEffect, MouseEvent, TouchEvent } from 'react';
import { cn } from '@pulwave/utils';
import { sliderVariants, type SliderProps } from './types';
import './styles/_index.scss';



export const Slider = ({
    value: controlledValue,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    onChangeEnd,
    disabled = false,
    size = 'm',
    color = 'primary',
    showValue = false,
    showTooltip = false,
    marks,
    label,
    className
}: SliderProps) => {
    const [internalValue, setInternalValue] = useState(controlledValue ?? defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const value = controlledValue ?? internalValue;
    const percentage = ((value - min) / (max - min)) * 100;

    const getValueFromPosition = useCallback((clientX: number) => {
        if (!trackRef.current) return value;
        const rect = trackRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawValue = min + percent * (max - min);
        // Better rounding to step decimals
        const stepDecimals = (step.toString().split('.')[1] || '').length;
        const steppedValue = Math.round(rawValue / step) * step;
        return Number(steppedValue.toFixed(stepDecimals));
    }, [min, max, step, value]);

    const handleMove = useCallback((clientX: number) => {
        const newValue = getValueFromPosition(clientX);
        if (newValue !== value) {
            setInternalValue(newValue);
            onChange?.(newValue);
        }
    }, [getValueFromPosition, value, onChange]);

    const handleStart = (e: MouseEvent | TouchEvent) => {
        if (disabled) return;
        // Don't prevent default on touch to allow scrolling if not handled? 
        // Actually for slider we usually want to prevent scroll while dragging.
        // But let's keep original behavior: e.preventDefault()
        if (e.type === 'mousedown') e.preventDefault();

        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        handleMove(clientX);
    };

    useEffect(() => {
        if (!isDragging) return;
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            e.preventDefault();
            handleMove(e.clientX);
        };
        const handleTouchMove = (e: globalThis.TouchEvent) => {
            // e.preventDefault(); // Prevent scrolling while dragging slider
            handleMove(e.touches[0].clientX);
        };
        const handleEnd = () => { setIsDragging(false); onChangeEnd?.(value); };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, handleMove, onChangeEnd, value]);

    return (
        <div className={cn(sliderVariants({ size, color, disabled, isDragging }), className)}>
            {label && (
                <div className="slider__label">
                    <span>{label}</span>
                </div>
            )}
            <div className="slider__wrapper">
                <div ref={trackRef} className="slider__track" onMouseDown={handleStart} onTouchStart={handleStart}>
                    <div className="slider__fill" style={{ width: `${percentage}%` }} />
                    <div
                        className="slider__thumb"
                        style={{ left: `${percentage}%` }}
                        role="slider"
                        aria-valuenow={value}
                        aria-valuemin={min}
                        aria-valuemax={max}
                        tabIndex={disabled ? -1 : 0}
                        onKeyDown={(e) => {
                            if (disabled) return;
                            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                                const newValue = Math.min(max, value + step);
                                setInternalValue(newValue);
                                onChange?.(newValue);
                                onChangeEnd?.(newValue);
                            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                                const newValue = Math.max(min, value - step);
                                setInternalValue(newValue);
                                onChange?.(newValue);
                                onChangeEnd?.(newValue);
                            }
                        }}
                    >
                        {(showTooltip || isDragging) && <div className="slider__tooltip">{value}</div>}
                    </div>
                    {marks && (
                        <div className="slider__marks">
                            {marks.map(m => (
                                <div
                                    key={m.value}
                                    className="slider__mark"
                                    style={{ left: `${((m.value - min) / (max - min)) * 100}%` }}
                                >
                                    {m.label && <span className="slider__mark-label">{m.label}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {showValue && <span className="slider__value">{value}</span>}
            </div>
        </div>
    );
};
Slider.displayName = 'Slider';
