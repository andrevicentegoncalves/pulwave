import React, { useMemo } from 'react';
import { Select } from '../ui';
import { useAdminMasterDataTypes } from '../../hooks/admin';

/**
 * MasterDataTypeSelect - Single select for master data types
 * Fetches types from master_data_types table and displays them in a dropdown.
 * 
 * @param {string} value - Currently selected type_key or id
 * @param {function} onChange - Callback with selected type_key
 * @param {string} label - Label for the select
 * @param {boolean} disabled - Disable the select
 * @param {boolean} useId - If true, use type id instead of type_key as value
 */
const MasterDataTypeSelect = ({
    value,
    onChange,
    label = 'Master Data Type',
    disabled = false,
    useId = false,
    ...props
}) => {
    const { data: types, isLoading } = useAdminMasterDataTypes();

    const options = useMemo(() => {
        if (!types) return [{ value: '', label: 'Loading...' }];

        return [
            { value: '', label: 'Select Type...' },
            ...types.map(t => ({
                value: useId ? t.id : t.type_key,
                label: t.display_name || t.type_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            }))
        ];
    }, [types, useId]);

    return (
        <Select
            label={label}
            value={value || ''}
            onChange={onChange}
            options={options}
            disabled={disabled || isLoading}
            {...props}
        />
    );
};

export default MasterDataTypeSelect;
