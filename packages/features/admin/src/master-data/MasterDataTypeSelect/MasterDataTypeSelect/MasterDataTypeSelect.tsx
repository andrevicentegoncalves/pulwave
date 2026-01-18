import { useMemo } from 'react';
import { Select } from '@pulwave/ui';

// Interface for the hook return value passed as prop or imported
interface MasterDataType {
    id: string;
    type_key: string;
    display_name?: string;
}

export interface MasterDataTypeSelectProps {
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    disabled?: boolean;
    useId?: boolean;
    // Assuming data is passed in or we use a hook. 
    // For migration, I'll assume we pass data or a hook. 
    // The original used `useAdminMasterDataTypes`.
    // I'll make it explicit that data comes from outside or mock it for now.
    types?: MasterDataType[]; // Injected data
    isLoading?: boolean;
}

export const MasterDataTypeSelect = ({
    value,
    onChange,
    label = 'Master Data Type',
    disabled = false,
    useId = false,
    types,
    isLoading = false,
    ...props
}: MasterDataTypeSelectProps) => {
    const options = useMemo(() => {
        if (!types) return [{ value: '', label: 'Loading…' }];

        return [
            { value: '', label: 'Select Type…' },
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
