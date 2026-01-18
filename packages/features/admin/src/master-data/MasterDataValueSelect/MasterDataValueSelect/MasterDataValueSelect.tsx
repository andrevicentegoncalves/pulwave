import { useMemo } from 'react';
import { Select } from '@pulwave/ui';

interface MasterDataValue {
    id: string;
    value_key: string;
    display_name?: string;
}

export interface MasterDataValueSelectProps {
    typeKey: string;
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    disabled?: boolean;
    useId?: boolean;
    values?: MasterDataValue[]; // Injected data
    isLoading?: boolean;
}

export const MasterDataValueSelect = ({
    typeKey,
    value,
    onChange,
    label = 'Master Data Value',
    disabled = false,
    useId = false,
    values,
    isLoading = false,
    ...props
}: MasterDataValueSelectProps) => {
    const options = useMemo(() => {
        if (!typeKey) return [{ value: '', label: 'Select Type First…' }];
        if (isLoading) return [{ value: '', label: 'Loading…' }];
        if (!values || values.length === 0) return [{ value: '', label: 'No values found' }];

        return [
            { value: '', label: 'Select Value…' },
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
