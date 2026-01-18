import { useMemo } from 'react';
import { Select } from '@pulwave/ui';
import { useAdminMasterDataTypes } from '../../translations/useAdminTranslations';

// Type for master data type record
interface MasterDataType {
    id: string;
    type_key: string;
    display_name?: string;
}

interface MasterDataTypeSelectProps {
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
 * MasterDataTypeSelect - Single select for master data types
 * Fetches types from master_data_types table and displays them in a dropdown.
 */
export const MasterDataTypeSelect = ({
    value,
    onChange,
    label = 'Master Data Type',
    disabled = false,
    useId = false,
    ...props
}: MasterDataTypeSelectProps) => {
    const { data: types, isLoading } = useAdminMasterDataTypes();

    const options = useMemo(() => {
        if (!types) return [{ value: '', label: 'Loading…' }];

        return [
            { value: '', label: 'Select Type…' },
            ...(types as MasterDataType[]).map((t) => ({
                value: useId ? t.id : t.type_key,
                label: t.display_name || t.type_key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
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
