import React, { useId, useState, useMemo } from 'react';
import { Dropdown, DropdownItem } from './Dropdown';
import Input from './Input';
import Icon from './Icon';
import { ChevronDown, Search } from './iconLibrary';
import PropTypes from 'prop-types';

import Skeleton from './Skeleton';

/**
 * Select Component
 * A form select input that uses the custom Dropdown component.
 * Supports optional search functionality and icons for options.
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
    loading = false
}) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    const [searchQuery, setSearchQuery] = useState('');

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchable || !searchQuery.trim()) {
            return options;
        }

        const query = searchQuery.toLowerCase();
        return options.filter(opt =>
            opt.label.toLowerCase().includes(query) ||
            (opt.searchTerms && opt.searchTerms.some(term => term.toLowerCase().includes(query)))
        );
    }, [options, searchQuery, searchable]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

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
                <div>
                    {searchable && (
                        <div className="dropdown-select__search-container">
                            <Input
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder={searchPlaceholder}
                                leftIcon={<Icon size="s"><Search /></Icon>}
                                fullWidth
                                autoFocus
                            />
                        </div>
                    )}
                    <div className="dropdown-select__options-container">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <DropdownItem
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setSearchQuery('');
                                    }}
                                    disabled={opt.disabled}
                                    icon={opt.icon}
                                >
                                    {opt.label}
                                </DropdownItem>
                            ))
                        ) : (
                            <div className="dropdown-select__empty-state">
                                No results found
                            </div>
                        )}
                    </div>
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
        disabled: PropTypes.bool,
        icon: PropTypes.node,
        searchTerms: PropTypes.arrayOf(PropTypes.string)
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
    loading: PropTypes.bool
};

export default Select;

