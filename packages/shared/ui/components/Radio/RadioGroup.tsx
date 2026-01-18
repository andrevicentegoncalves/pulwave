/**
 * RadioGroup Component
 * 
 * Group of radio buttons for single selection.
 */
import { type ReactNode, type ChangeEvent } from 'react';
import { cn } from '@pulwave/utils';
import { Radio } from './Radio';
import type { RadioGroupProps } from './types';

export const RadioGroup = ({
    name,
    options = [],
    value,
    onChange,
    size = 'm',
    orientation = 'vertical',
    disabled = false,
    className,
    label,
    required = false,
}: RadioGroupProps) => {
    const groupClasses = cn(
        'radio-group',
        `radio-group--${orientation}`,
        disabled && 'radio-group--disabled',
        className
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    return (
        <fieldset className={groupClasses} disabled={disabled}>
            {label && (
                <legend className="radio-group__label">
                    {label}
                    {required && <span className="radio-group__required">*</span>}
                </legend>
            )}
            <div className="radio-group__options">
                {options.map((option) => (
                    <Radio
                        key={option.value}
                        name={name}
                        value={option.value}
                        label={option.label}
                        description={option.description}
                        size={size}
                        checked={value === option.value}
                        onChange={handleChange}
                        disabled={disabled || option.disabled}
                    />
                ))}
            </div>
        </fieldset>
    );
};

RadioGroup.displayName = 'RadioGroup';
