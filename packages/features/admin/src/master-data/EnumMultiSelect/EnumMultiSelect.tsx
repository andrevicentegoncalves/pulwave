import { useState, useEffect, useMemo } from 'react';
import { Select } from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';

interface EnumService {
    getDatabaseEnums: () => Promise<Array<{ enum_name: string }>>;
}

export interface EnumMultiSelectProps {
    selectedValues?: string[];
    onChange: (values: string[]) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    adminService: EnumService; // Injected service
    /** Full width */
    fullWidth?: boolean;
}

/**
 * EnumMultiSelect - Multi-select for database enums using Select
 */
export const EnumMultiSelect = ({
    selectedValues = [],
    onChange,
    label = 'Select Enums',
    placeholder = 'Search enums…',
    disabled = false,
    adminService,
    fullWidth = true,
    ...rest
}: EnumMultiSelectProps) => {
    const [enums, setEnums] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnums = async () => {
            try {
                setLoading(true);
                const data = await adminService.getDatabaseEnums();
                const uniqueEnums = [...new Set(data.map(e => e.enum_name))];
                setEnums(uniqueEnums);
            } catch {
                // Silent error handling - enums fetch failed
            } finally {
                setLoading(false);
            }
        };

        fetchEnums();
    }, [adminService]);

    const options: SelectOption<string>[] = useMemo(() => {
        return enums.map(name => ({
            value: name,
            label: name
        }));
    }, [enums]);

    return (
        <Select<string>
            multiple
            label={label}
            options={options}
            value={selectedValues}
            onChange={onChange}
            placeholder={loading ? 'Loading…' : placeholder}
            disabled={disabled || loading}
            loading={loading}
            fullWidth={fullWidth}
            searchable
            showSelectAll
            showFooter
            {...rest}
        />
    );
};
