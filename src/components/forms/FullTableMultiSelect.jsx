// src/components/forms/FullTableMultiSelect.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MultiSelectDropdown } from '../ui';
import schemaService from '../../services/schemaService';

/**
 * FullTableMultiSelect
 * Multi-select dropdown showing ALL tables from the database
 */
const FullTableMultiSelect = ({
    selectedValues = [],
    onChange,
    label = 'Select Tables',
    placeholder = 'Search tables...',
    excludeTables = [],
    disabled = false,
    maxHeight = 280,
    ...rest
}) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                setLoading(true);
                const data = await schemaService.getAllTables();
                setTables(data);
            } catch (err) {
                console.error('Failed to fetch tables:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    const options = tables
        .filter(t => !excludeTables.includes(t.table_name))
        .map(t => ({
            value: t.table_name,
            label: t.table_name
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

FullTableMultiSelect.propTypes = {
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    excludeTables: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    maxHeight: PropTypes.number
};

export default FullTableMultiSelect;
