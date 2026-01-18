import { useState, useEffect, useMemo } from 'react';
import { Select } from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';

interface SchemaService {
    getAllTables: () => Promise<Array<{ table_name: string }>>;
}

export interface FullTableMultiSelectProps {
    selectedValues?: string[];
    onChange: (values: string[]) => void;
    label?: string;
    placeholder?: string;
    excludeTables?: string[];
    disabled?: boolean;
    schemaService: SchemaService;
    /** Full width */
    fullWidth?: boolean;
}

/**
 * FullTableMultiSelect - Multi-select for database tables using Select
 */
export const FullTableMultiSelect = ({
    selectedValues = [],
    onChange,
    label = 'Select Tables',
    placeholder = 'Search tables…',
    excludeTables = [],
    disabled = false,
    schemaService,
    fullWidth = true,
    ...rest
}: FullTableMultiSelectProps) => {
    const [tables, setTables] = useState<Array<{ table_name: string }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                setLoading(true);
                const data = await schemaService.getAllTables();
                setTables(data);
            } catch {
                // Silent error handling - tables fetch failed
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, [schemaService]);

    const options: SelectOption<string>[] = useMemo(() => {
        return tables
            .filter(t => !excludeTables.includes(t.table_name))
            .map(t => ({
                value: t.table_name,
                label: t.table_name
            }));
    }, [tables, excludeTables]);

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
