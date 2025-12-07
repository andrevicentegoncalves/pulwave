import React, { useState, useId, useMemo } from 'react';
import { Dropdown, DropdownItem, useDropdown } from '../ui/Dropdown';
import { Input, Icon, Button } from '../ui';
import { ChevronDown, Search, MapPin, Check } from '../ui/iconLibrary';
import PropTypes from 'prop-types';

/**
 * Internal component to access DropdownContext
 */
const IconSelectContent = ({
    options,
    value,
    onChange,
    searchQuery,
    onSearchChange,
    onAutoLocate,
    locating,
    showAutoLocate,
    getOptionIcon,
    getOptionLabel,
    getOptionValue,
    getOptionKey,
    searchPlaceholder
}) => {
    const { onClose } = useDropdown();

    const handleAutoLocateClick = async () => {
        await onAutoLocate();
        onClose();
    };

    const handleOptionClick = (optionValue) => {
        onChange(optionValue);
        onSearchChange({ target: { value: '' } });
        onClose();
    };

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) {
            return options;
        }

        const query = searchQuery.toLowerCase();
        return options.filter(option => {
            const label = getOptionLabel(option).toLowerCase();
            const value = getOptionValue(option).toString().toLowerCase();
            return label.includes(query) || value.includes(query);
        });
    }, [options, searchQuery, getOptionLabel, getOptionValue]);

    return (
        <div className="dropdown-select">
            {/* Search Input */}
            <div className="dropdown-select__search">
                <Input
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder={searchPlaceholder}
                    leftIcon={<Icon size="s"><Search /></Icon>}
                    fullWidth
                    autoFocus
                />
            </div>

            {/* Auto-locate Button */}
            {showAutoLocate && (
                <div className="dropdown-select__action">
                    <Button
                        variant="ghost"
                        size="s"
                        onClick={handleAutoLocateClick}
                        disabled={locating}
                        fullWidth
                        className="btn--align-start"
                    >
                        <Icon size="s"><MapPin /></Icon>
                        {locating ? 'Locating...' : 'Locate automatically'}
                    </Button>
                </div>
            )}

            {/* Options List */}
            <div className="dropdown-select__list">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => {
                        const optionValue = getOptionValue(option);
                        const optionLabel = getOptionLabel(option);
                        const optionIcon = getOptionIcon(option);
                        const optionKey = getOptionKey ? getOptionKey(option) : optionValue;

                        return (
                            <DropdownItem
                                key={optionKey}
                                onClick={() => handleOptionClick(optionValue)}
                                icon={optionIcon}
                            >
                                <div className="dropdown-item__content">
                                    <span>{optionLabel}</span>
                                    {value === optionValue && (
                                        <Icon size="s" className="icon--primary">
                                            <Check />
                                        </Icon>
                                    )}
                                </div>
                            </DropdownItem>
                        );
                    })
                ) : (
                    <div className="dropdown-select__empty">
                        No results found
                    </div>
                )}
            </div>
        </div>
    );
};

IconSelectContent.propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onAutoLocate: PropTypes.func,
    locating: PropTypes.bool,
    showAutoLocate: PropTypes.bool,
    getOptionIcon: PropTypes.func.isRequired,
    getOptionLabel: PropTypes.func.isRequired,
    getOptionValue: PropTypes.func.isRequired,
    getOptionKey: PropTypes.func,
    searchPlaceholder: PropTypes.string
};

/**
 * IconSelect Component
 * Generic dropdown component for selections with icon display
 * 
 * @param {string} label - Label for the select
 * @param {any} value - Selected value
 * @param {function} onChange - Change handler
 * @param {array} options - Array of options
 * @param {function} getOptionIcon - Function to get icon for an option
 * @param {function} getOptionLabel - Function to get label for an option
 * @param {function} getOptionValue - Function to get value for an option
 * @param {function} getSelectedIcon - Function to get icon for selected value
 * @param {string} placeholder - Placeholder text
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {boolean} showAutoLocate - Whether to show auto-locate button
 * @param {function} onAutoLocate - Auto-locate handler
 * @param {boolean} disabled - Whether the select is disabled
 * @param {boolean} fullWidth - Whether to take full width
 * @param {string} className - Additional CSS classes
 * @param {string} name - Input name
 * @param {string} id - Input ID
 */
const IconSelect = ({
    label,
    value,
    onChange,
    options = [],
    getOptionIcon,
    getOptionLabel,
    getOptionValue,
    getOptionKey,
    getSelectedIcon,
    getSelectedLabel,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    showAutoLocate = false,
    onAutoLocate,
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id
}) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    const [searchQuery, setSearchQuery] = useState('');
    const [locating, setLocating] = useState(false);

    // Get selected option details
    const selectedOption = options.find(o => getOptionValue(o) === value);
    const displayValue = selectedOption
        ? (getSelectedLabel ? getSelectedLabel(selectedOption) : getOptionLabel(selectedOption))
        : placeholder;
    const selectedIcon = selectedOption && getSelectedIcon ? getSelectedIcon(selectedOption) : null;

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAutoLocate = async () => {
        if (!onAutoLocate) return;

        try {
            setLocating(true);
            await onAutoLocate();
        } catch (err) {
            console.error('Error auto-locating:', err);
        } finally {
            setLocating(false);
        }
    };

    return (
        <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
            {label && <label htmlFor={selectId} className="form-label">{label}</label>}
            <Dropdown
                trigger={
                    <div className="dropdown-trigger-wrapper">
                        <Input
                            id={selectId}
                            name={name}
                            value={displayValue}
                            placeholder={placeholder}
                            disabled={disabled}
                            readOnly
                            leftIcon={selectedIcon}
                            rightIcon={<Icon size="s"><ChevronDown /></Icon>}
                            className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
                            fullWidth
                        />
                    </div>
                }
                align="left"
            >
                <IconSelectContent
                    options={options}
                    value={value}
                    onChange={onChange}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    onAutoLocate={handleAutoLocate}
                    locating={locating}
                    showAutoLocate={showAutoLocate}
                    getOptionIcon={getOptionIcon}
                    getOptionLabel={getOptionLabel}
                    getOptionValue={getOptionValue}
                    getOptionKey={getOptionKey}
                    searchPlaceholder={searchPlaceholder}
                />
            </Dropdown>
        </div>
    );
};

IconSelect.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    getOptionIcon: PropTypes.func.isRequired,
    getOptionLabel: PropTypes.func.isRequired,
    getOptionValue: PropTypes.func.isRequired,
    getOptionKey: PropTypes.func,
    getSelectedIcon: PropTypes.func,
    getSelectedLabel: PropTypes.func,
    placeholder: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    showAutoLocate: PropTypes.bool,
    onAutoLocate: PropTypes.func,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string
};

export default IconSelect;
