import React, { useId } from 'react';
import { Dropdown, DropdownSelect } from './Dropdown';
import Input from './Input';
import Icon from './Icon';
import { ChevronDown } from './iconLibrary';
import PropTypes from 'prop-types';

import Skeleton from './Skeleton';

/**
 * Select Component
 * A form select input that uses the custom Dropdown and DropdownSelect components.
 * Supports optional search functionality, icons for options, and grouped options.
 */
const Select = ({
    label,
    value,
    options = [],
    onChange,
    placeholder = "Select...",
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id,
    searchable = false,
    searchPlaceholder = "Search...",
    loading = false,
    grouped = false,
    groupKey = 'group'
}) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    if (loading) {
        return (
            <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
                {label && <Skeleton variant="text" width="30%" height={20} className="input__skeleton-label" />}
                <Skeleton variant="rectangular" height={40} width="100%" />
            </div>
        );
    }

    return (
        <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
            {label && <label htmlFor={selectId} className="form-label">{label}</label>}
            <Dropdown
                disabled={disabled}
                trigger={
                    <Input
                        id={selectId}
                        name={name}
                        value={displayValue}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly
                        rightIcon={<Icon size="s"><ChevronDown /></Icon>}
                        className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
                        fullWidth
                    />
                }
                align="left"
            >
                <DropdownSelect
                    options={options}
                    onSelect={onChange}
                    searchable={searchable}
                    searchPlaceholder={searchPlaceholder}
                    grouped={grouped}
                    groupKey={groupKey}
                />
            </Dropdown>
        </div>
    );
};

Select.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        icon: PropTypes.node,
        searchTerms: PropTypes.arrayOf(PropTypes.string),
        group: PropTypes.string
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    searchable: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    loading: PropTypes.bool,
    grouped: PropTypes.bool,
    groupKey: PropTypes.string
};

export default Select;
