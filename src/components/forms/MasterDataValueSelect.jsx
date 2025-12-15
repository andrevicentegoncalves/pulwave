import React, { useMemo } from 'react';
import { Select } from '../ui';
import { useAdminMasterDataValues } from '../../hooks/admin';

/**
 * MasterDataValueSelect - Single select for master data values
 * Fetches values from master_data_values table filtered by type.
 * 
 * @param {string} typeKey - The master data type key to filter values
 * @param {string} value - Currently selected value_key or id
 * @param {function} onChange - Callback with selected value_key
 * @param {string} label - Label for the select
 * @param {boolean} disabled - Disable the select
 * @param {boolean} useId - If true, use value id instead of value_key as value
 */
const MasterDataValueSelect = ({
    typeKey,
    value,
    onChange,
    label = 'Master Data Value',
    disabled = false,
    useId = false,
    ...props
}) => {
    const { data: values, isLoading } = useAdminMasterDataValues(typeKey);

    const options = useMemo(() => {
        if (!typeKey) return [{ value: '', label: 'Select Type First...' }];
        if (isLoading) return [{ value: '', label: 'Loading...' }];
        if (!values || values.length === 0) return [{ value: '', label: 'No values found' }];

        return [
            { value: '', label: 'Select Value...' },
            ...values.map(v => ({
                value: useId ? v.id : v.value_key,
                label: v.display_name || v.value_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            }))
        ];
    }, [values, typeKey, useId, isLoading]);

    return (
        <Select
            label={label}
            value={value || ''}
            onChange={onChange}
            options={options}
            disabled={disabled || isLoading || !typeKey}
            {...props}
        />
    );
};

export default MasterDataValueSelect;
