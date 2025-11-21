import React from 'react';
import { Dropdown, DropdownItem } from './Dropdown';
import Input from './Input';
import Icon from './Icon';
import { ChevronDown } from './iconLibrary';
import PropTypes from 'prop-types';

/**
 * Select Component
 * A form select input that uses the custom Dropdown component.
 */
const Select = ({
    label,
    value,
    options = [],
    onChange,
    placeholder = "Select...",
    disabled = false,
    fullWidth = false,
    className = ''
}) => {
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    return (
        <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
            {label && <label className="form-label">{label}</label>}
            <Dropdown
                trigger={
                    <Input
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
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {options.map((opt) => (
                        <DropdownItem
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            disabled={opt.disabled}
                        >
                            {opt.label}
                        </DropdownItem>
                    ))}
                </div>
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
        disabled: PropTypes.bool
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string
};

export default Select;
