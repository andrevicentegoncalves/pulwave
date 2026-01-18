import { type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { segmentedControlVariants, type SegmentedControlProps } from './types';
import './styles/_index.scss';

/**
 * SegmentedControl - Exclusive selection group
 */
export const SegmentedControl = ({
    options,
    value,
    onChange,
    name,
    size = 'm',
    fullWidth = false,
    className,
}: SegmentedControlProps) => {
    return (
        <div
            className={cn(
                segmentedControlVariants({ size, fullWidth }),
                className
            )}
            role="radiogroup"
            aria-label={name}
        >
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        className={cn(
                            'segmented-control__item',
                            isSelected && 'segmented-control__item--selected',
                            option.disabled && 'segmented-control__item--disabled'
                        )}
                        onClick={() => !option.disabled && onChange(option.value)}
                        disabled={option.disabled}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={isSelected ? 0 : -1}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

export default SegmentedControl;
