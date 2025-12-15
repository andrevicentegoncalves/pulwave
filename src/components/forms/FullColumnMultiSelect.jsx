// src/components/forms/FullColumnMultiSelect.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MultiSelectDropdown } from '../ui';
import schemaService from '../../services/schemaService';

/**
 * FullColumnMultiSelect
 * Multi-select dropdown showing ALL columns for a specific table
 */
const FullColumnMultiSelect = ({
    table,
    selectedValues = [],
    onChange,
    label,
    placeholder = 'Search columns...',
    excludeColumns = [],
    disabled = false,
    maxHeight = 200,
    ...rest
}) => {
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!table) {
            setColumns([]);
            return;
        }

        const fetchColumns = async () => {
            try {
                setLoading(true);
                const data = await schemaService.getTableColumns(table);
                setColumns(data);
            } catch (err) {
                console.error('Failed to fetch columns:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchColumns();
    }, [table]);

    const options = columns
        .filter(c => !excludeColumns.includes(c.column_name))
        .map(c => ({
            value: c.column_name,
            label: c.column_name
        }));

    const displayLabel = label || (table ? `Columns for "${table}"` : 'Select a table first');

    return (
        <MultiSelectDropdown
            label={displayLabel}
            options={options}
            selectedValues={selectedValues}
            onChange={onChange}
            placeholder={!table ? 'Select a table first' : loading ? 'Loading...' : placeholder}
            disabled={disabled || loading || !table}
            maxHeight={maxHeight}
            {...rest}
        />
    );
};

FullColumnMultiSelect.propTypes = {
    /** Table name to fetch columns for (required) */
    table: PropTypes.string,
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    excludeColumns: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    maxHeight: PropTypes.number
};

export default FullColumnMultiSelect;
