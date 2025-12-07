import React, { useState, useMemo, useId } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { Dropdown } from './Dropdown';
import Input from './Input';
import Icon from './Icon';

/**
 * MultiSelectDropdown Component
 * A dropdown with multi-select capability using round checkboxes and search filter
 * Uses the existing Dropdown component for consistent styling
 */
const MultiSelectDropdown = ({
    label,
    options = [],
    selectedValues = [],
    onChange,
    placeholder = 'Select items...',
    searchPlaceholder = 'Search...',
    maxHeight = 280,
    disabled = false,
    fullWidth = false,
    className,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const generatedId = useId();

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options;
        const query = searchQuery.toLowerCase();
        return options.filter(opt =>
            opt.label.toLowerCase().includes(query) ||
            opt.value.toLowerCase().includes(query)
        );
    }, [options, searchQuery]);

    // Toggle selection
    const handleToggle = (value, e) => {
        e.stopPropagation(); // Prevent dropdown from closing
        if (disabled) return;
        const isSelected = selectedValues.includes(value);
        if (isSelected) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    // Check if value is selected
    const isSelected = (value) => selectedValues.includes(value);

    // Display value for trigger button
    const displayValue = selectedValues.length > 0
        ? `${selectedValues.length} selected`
        : placeholder;

    return (
        <div className={clsx('form-item', fullWidth && 'form-item--full-width', className)}>
            {label && <label htmlFor={generatedId} className="form-label">{label}</label>}
            <Dropdown
                trigger={
                    <Input
                        id={generatedId}
                        value={displayValue}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly
                        rightIcon={<Icon size="s"><ChevronDown /></Icon>}
                        className={clsx('cursor-pointer', disabled && 'cursor-not-allowed')}
                        fullWidth
                    />
                }
                align="left"
                closeOnItemClick={false}
            >
                <div className="multi-select-dropdown">
                    {/* Search Input */}
                    <div className="multi-select-dropdown__search">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            leftIcon={<Icon size="s"><Search /></Icon>}
                            rightIcon={searchQuery ? (
                                <button
                                    type="button"
                                    className="multi-select-dropdown__clear"
                                    onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }}
                                >
                                    <X size={14} />
                                </button>
                            ) : null}
                            fullWidth
                            autoFocus
                        />
                    </div>

                    {/* Options List */}
                    <div className="multi-select-dropdown__list" style={{ maxHeight }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={clsx(
                                        'multi-select-dropdown__item',
                                        isSelected(option.value) && 'multi-select-dropdown__item--selected'
                                    )}
                                    onClick={(e) => handleToggle(option.value, e)}
                                >
                                    <div className={clsx(
                                        'multi-select-dropdown__checkbox',
                                        isSelected(option.value) && 'multi-select-dropdown__checkbox--checked'
                                    )}>
                                        {isSelected(option.value) && <Check size={12} />}
                                    </div>
                                    <span className="multi-select-dropdown__item-label">{option.label}</span>
                                </button>
                            ))
                        ) : (
                            <div className="multi-select-dropdown__empty">
                                {searchQuery ? 'No matches found' : 'No options available'}
                            </div>
                        )}
                    </div>

                    {/* Selection Summary */}
                    {selectedValues.length > 0 && (
                        <div className="multi-select-dropdown__footer">
                            <span>{selectedValues.length} selected</span>
                            <button
                                type="button"
                                className="multi-select-dropdown__clear-all"
                                onClick={(e) => { e.stopPropagation(); onChange([]); }}
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </Dropdown>
        </div>
    );
};

MultiSelectDropdown.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    maxHeight: PropTypes.number,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default MultiSelectDropdown;
