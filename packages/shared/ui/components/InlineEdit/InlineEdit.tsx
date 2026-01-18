import React, { useState, useEffect, KeyboardEvent } from 'react';
import { cn } from '@pulwave/utils';
import { Input } from '../Input';
import { Text } from '../Text';
import { Edit2 } from '../../icon-library';
import { inlineEditVariants, type InlineEditProps } from './types';
import './styles/_index.scss';

export const InlineEdit = React.forwardRef<HTMLDivElement, InlineEditProps>(({
    value: controlledValue,
    defaultValue = '',
    onSave,
    onCancel,
    onChange,
    label,
    placeholder = 'Click to edit',
    disabled = false,
    as = 'input',
    className,
    showEditIcon = true,
    fullWidth = false,
    size = 'm',
    inputProps,
}, ref) => {
    const [isEditing, setIsEditing] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    const [tempValue, setTempValue] = useState(value);

    // Sync temp value when entering edit mode or external value changes
    useEffect(() => {
        if (!isEditing) {
            setTempValue(value);
        }
    }, [value, isEditing]);

    const handleEditStart = () => {
        if (disabled) return;
        setIsEditing(true);
        setTempValue(value); // Reset temp value to current confirmed value
    };

    const handleSave = () => {
        if (!isControlled) {
            setInternalValue(tempValue);
        }
        onSave?.(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value); // Revert
        onCancel?.();
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newValue = e.target.value;
        setTempValue(newValue);
        onChange?.(newValue);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (as === 'textarea' && e.shiftKey) return; // Allow newlines in textarea
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault(); // Prevent modal closure if needed
            handleCancel();
        }
    };

    const handleBlur = () => {
        // Save on blur
        handleSave();
    };

    return (
        <div
            ref={ref}
            className={cn(
                inlineEditVariants({ fullWidth, disabled, editing: isEditing, size }),
                className
            )}
        >
            {label && <Text category="label" size="s" className="inline-edit__label">{label}</Text>}

            {isEditing ? (
                <div className="inline-edit__input-wrapper">
                    <Input
                        value={tempValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown as React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>}
                        onBlur={handleBlur}
                        autoFocus
                        fullWidth={fullWidth}
                        placeholder={placeholder}
                        disabled={disabled}
                        as={as}
                        {...inputProps}
                        className={cn('inline-edit__input', inputProps?.className)}
                    />
                </div>
            ) : (
                <button
                    type="button"
                    className="inline-edit__view"
                    onClick={handleEditStart}
                    disabled={disabled}
                    aria-label={`Edit ${label || 'text'}`}
                >
                    <Text
                        className={cn(
                            'inline-edit__text',
                            !value && 'inline-edit__text--placeholder'
                        )}
                    >
                        {value || placeholder}
                    </Text>

                    {!disabled && showEditIcon && (
                        <span className="inline-edit__icon" aria-hidden="true">
                            <Edit2 size={16} />
                        </span>
                    )}
                </button>
            )}
        </div>
    );
});

InlineEdit.displayName = 'InlineEdit';
