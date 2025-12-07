import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';
import Input from './Input';

/**
 * SearchInput Component
 * A specialized input for search functionality with search icon and clear button.
 * 
 * @example
 * <SearchInput
 *   value={search}
 *   onChange={(e) => setSearch(e.target.value)}
 *   onClear={() => setSearch('')}
 *   placeholder="Search users..."
 * />
 */
const SearchInput = forwardRef(({
    value,
    onChange,
    onClear,
    placeholder = 'Search...',
    size = 'md',
    fullWidth = false,
    disabled = false,
    className,
    ...rest
}, ref) => {
    const handleClear = () => {
        if (onClear) {
            onClear();
        } else if (onChange) {
            // Create a synthetic event if no onClear provided
            onChange({ target: { value: '' } });
        }
    };

    const hasValue = value && value.length > 0;

    return (
        <Input
            ref={ref}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled}
            leftIcon={<Search size={16} />}
            rightIcon={
                hasValue && !disabled ? (
                    <button
                        type="button"
                        className="search-input__clear"
                        onClick={handleClear}
                        aria-label="Clear search"
                        tabIndex={-1}
                    >
                        <X size={14} />
                    </button>
                ) : undefined
            }
            className={clsx('search-input', className)}
            {...rest}
        />
    );
});

SearchInput.displayName = 'SearchInput';

SearchInput.propTypes = {
    /** Current search value */
    value: PropTypes.string,
    /** Change handler */
    onChange: PropTypes.func,
    /** Clear handler (optional, will use onChange with empty string if not provided) */
    onClear: PropTypes.func,
    /** Placeholder text */
    placeholder: PropTypes.string,
    /** Input size */
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    /** Full width */
    fullWidth: PropTypes.bool,
    /** Disabled state */
    disabled: PropTypes.bool,
    /** Additional CSS classes */
    className: PropTypes.string,
};

export default SearchInput;
