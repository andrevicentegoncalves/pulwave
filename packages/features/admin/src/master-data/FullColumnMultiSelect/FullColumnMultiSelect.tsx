import { useState, useEffect, useMemo } from 'react';
import { Select } from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';

interface SchemaService {
    getTableColumns: (table: string) => Promise<Array<{ column_name: string }>>;
}

export interface FullColumnMultiSelectProps {
    table?: string;
    selectedValues?: string[];
    onChange: (values: string[]) => void;
    label?: string;
    placeholder?: string;
    excludeColumns?: string[];
    disabled?: boolean;
    schemaService: SchemaService;
    /** Full width */
    fullWidth?: boolean;
}

/**
 * FullColumnMultiSelect - Multi-select for database columns using Select
 */
export const FullColumnMultiSelect = ({
    table,
    selectedValues = [],
    onChange,
    label,
    placeholder = 'Search columns…',
    excludeColumns = [],
    disabled = false,
    schemaService,
    fullWidth = true,
    ...rest
}: FullColumnMultiSelectProps) => {
    const [columns, setColumns] = useState<Array<{ column_name: string }>>([]);
    const [loading, setLoading] = useState(false);

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
            } catch {
                // Silent error handling - columns fetch failed
            } finally {
                setLoading(false);
            }
        };

        fetchColumns();
    }, [table, schemaService]);

    const options: SelectOption<string>[] = useMemo(() => {
        return columns
            .filter(c => !excludeColumns.includes(c.column_name))
            .map(c => ({
                value: c.column_name,
                label: c.column_name
            }));
    }, [columns, excludeColumns]);

    const displayLabel = label || (table ? `Columns for "${table}"` : 'Select a table first');

    return (
        <Select<string>
            multiple
            label={displayLabel}
            options={options}
            value={selectedValues}
            onChange={onChange}
            placeholder={!table ? 'Select a table first' : loading ? 'Loading…' : placeholder}
            disabled={disabled || loading || !table}
            loading={loading}
            fullWidth={fullWidth}
            searchable
            showSelectAll
            showFooter
            {...rest}
        />
    );
};
