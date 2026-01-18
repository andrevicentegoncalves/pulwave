import { useMemo } from 'react';
import { Select } from '@pulwave/ui';
import { useAdminMasterDataValues } from '../../translations/useAdminTranslations';

// Type for master data value record
interface MasterDataValue {
    id: string;
    value_key: string;
    display_name?: string;
}

interface MasterDataValueSelectProps {
    typeKey: string;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    disabled?: boolean;
    useId?: boolean;
    placeholder?: string;
    fullWidth?: boolean;
    size?: 's' | 'm' | 'l';
    searchable?: boolean;
}

/**
 * MasterDataValueSelect - Single select for master data values
 * Fetches values from master_data_values table filtered by type.
 */
export const MasterDataValueSelect = ({
    typeKey,
    value,
    onChange,
    label = 'Master Data Value',
    disabled = false,
    useId = false,
    ...props
}: MasterDataValueSelectProps) => {
    const { data: values, isLoading } = useAdminMasterDataValues(typeKey);

    const options = useMemo(() => {
        if (!typeKey) return [{ value: '', label: 'Select Type First…' }];
        if (isLoading) return [{ value: '', label: 'Loading…' }];
        if (!values || values.length === 0) return [{ value: '', label: 'No values found' }];

        return [
            { value: '', label: 'Select Value…' },
            ...(values as MasterDataValue[]).map((v) => ({
                value: useId ? v.id : v.value_key,
                label: v.display_name || v.value_key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
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
