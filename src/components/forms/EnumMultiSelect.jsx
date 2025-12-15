// src/components/forms/EnumMultiSelect.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MultiSelectDropdown } from '../ui';
import { adminService } from '../../services';

/**
 * EnumMultiSelect
 * Multi-select dropdown showing ALL database enums
 */
const EnumMultiSelect = ({
    selectedValues = [],
    onChange,
    label = 'Select Enums',
    placeholder = 'Search enums...',
    disabled = false,
    maxHeight = 280,
    ...rest
}) => {
    const [enums, setEnums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnums = async () => {
            try {
                setLoading(true);
                const data = await adminService.getDatabaseEnums();
                // Get unique enum names
                const uniqueEnums = [...new Set(data.map(e => e.enum_name))];
                setEnums(uniqueEnums);
            } catch (err) {
                console.error('Failed to fetch enums:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEnums();
    }, []);

    const options = enums.map(name => ({
        value: name,
        label: name
    }));

    return (
        <MultiSelectDropdown
            label={label}
            options={options}
            selectedValues={selectedValues}
            onChange={onChange}
            placeholder={loading ? 'Loading...' : placeholder}
            disabled={disabled || loading}
            maxHeight={maxHeight}
            {...rest}
        />
    );
};

EnumMultiSelect.propTypes = {
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    maxHeight: PropTypes.number
};

export default EnumMultiSelect;
