import React, { useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { Checkbox } from '../Checkbox';
import { checkboxGroupVariants, type CheckboxGroupProps } from './types';
import './styles/_index.scss';

export const CheckboxGroup = ({
    name,
    options,
    value,
    defaultValue = [],
    onChange,
    label,
    helperText,
    error,
    required = false,
    disabled = false,
    size = 'm',
    colorVariant = 'primary',
    orientation = 'vertical',
    className,
}: CheckboxGroupProps) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    const handleChange = useCallback((optionValue: string, checked: boolean) => {
        const newValue = checked
            ? [...currentValue, optionValue]
            : currentValue.filter(v => v !== optionValue);

        if (!isControlled) {
            setInternalValue(newValue);
        }
        onChange?.(newValue);
    }, [currentValue, isControlled, onChange]);

    return (
        <div
            className={cn(checkboxGroupVariants({ orientation, size }), className)}
            role="group"
            aria-labelledby={label ? `${name}-label` : undefined}
        >
            {label && (
                <div id={`${name}-label`} className="checkbox-group__label">
                    {label}
                    {required && <span className="checkbox-group__required" aria-label="required">*</span>}
                </div>
            )}
            <div className="checkbox-group__options">
                {options.map((option) => (
                    <Checkbox
                        key={option.value}
                        name={`${name}[${option.value}]`}
                        id={`${name}-${option.value}`}
                        label={option.label}
                        checked={currentValue.includes(option.value)}
                        disabled={disabled || option.disabled}
                        size={size ?? 'm'}
                        colorVariant={colorVariant}
                        helperText={option.description}
                        onChange={(e) => handleChange(option.value, e.target.checked)}
                    />
                ))}
            </div>
            {(helperText || error) && (
                <div
                    className={cn('checkbox-group__helper', error && 'checkbox-group__helper--error')}
                    role={error ? 'alert' : undefined}
                >
                    {error || helperText}
                </div>
            )}
        </div>
    );
};

CheckboxGroup.displayName = 'CheckboxGroup';
