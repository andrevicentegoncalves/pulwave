import React, { useState, useEffect, useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import { colord } from 'colord';
import { cn } from '@pulwave/utils';
import { Popover } from '../Popover';
import { Button } from '../Button';
import { Input } from '../Input';
import { Text } from '../Text';
import { colorPickerVariants, type ColorPickerProps } from './types';
import './styles/_index.scss';

export const ColorPicker = ({
    value,
    onChange,
    format = 'hex',
    label,
    disabled = false,
    size = 'm',
    className,
    placeholder = '#000000',
}: ColorPickerProps) => {
    const [inputValue, setInputValue] = useState(value);

    // Sync input with prop value
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Validate and update color
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        const color = colord(newValue);
        if (color.isValid()) {
            onChange(format === 'hex' ? color.toHex() : color.toRgbString());
        }
    };

    // Handle picker change
    const handlePickerChange = (newColor: string) => {
        onChange(newColor);
        setInputValue(newColor);
    };

    // Color preview style
    const previewStyle = useMemo(() => ({
        backgroundColor: value,
    }), [value]);

    return (
        <div className={cn(colorPickerVariants({ size, disabled }), className)}>
            {label && (
                <Text size="s" weight="medium" className="color-picker__label">
                    {label}
                </Text>
            )}

            <Popover
                trigger={
                    <Button
                        kind="secondary"
                        variant="outlined"
                        disabled={disabled ?? false}
                        className="color-picker__trigger"
                    >
                        <div className="color-picker__swatch" style={previewStyle} />
                        <span className="color-picker__value">{value || placeholder}</span>
                    </Button>
                }
                placement="bottom-start"
            >
                <div className="color-picker__popover-content">
                    <HexColorPicker color={value} onChange={handlePickerChange} />
                    <div className="color-picker__manual-input">
                        <Input
                            value={inputValue}
                            onChange={handleInputChange}
                            size="s"
                            placeholder={placeholder}
                            leftIcon={
                                <div
                                    className="color-picker__input-swatch"
                                    style={{ backgroundColor: value }}
                                />
                            }
                        />
                    </div>
                </div>
            </Popover>
        </div>
    );
};

ColorPicker.displayName = 'ColorPicker';
