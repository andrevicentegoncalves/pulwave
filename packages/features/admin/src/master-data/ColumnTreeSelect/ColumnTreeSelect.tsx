import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, Database } from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';

// Service interface (placeholder until actual service package is linked)
interface ColumnTreeService {
    getAllDatabaseTables: () => Promise<Array<{ table_name: string }>>;
    getAllTableColumns: (tableName: string) => Promise<Array<{ column_name: string; data_type: string }>>;
}

export interface ColumnTreeSelectProps {
    value?: Record<string, string[]>;
    onChange: (value: Record<string, string[]>) => void;
    showTextColumns?: boolean;
    label?: string;
    placeholder?: string;
    className?: string;
    adminService: ColumnTreeService; // Helper injected
}

/**
 * ColumnTreeSelect - Tree select for database tables and columns using Select
 */
export const ColumnTreeSelect = ({
    value = {},
    onChange,
    showTextColumns = true,
    label = 'Select Tables & Columns',
    placeholder = 'Select tables and columns…',
    className,
    adminService
}: ColumnTreeSelectProps) => {
    const [loadedTables, setLoadedTables] = useState<Set<string>>(new Set());
    const [columnsCache, setColumnsCache] = useState<Record<string, Array<{ column_name: string; data_type: string }>>>({});
    const [loadingNodes, setLoadingNodes] = useState<string[]>([]);

    const { data: allTablesData, isLoading: tablesLoading } = useQuery({
        queryKey: ['admin', 'all-database-tables'],
        queryFn: () => adminService.getAllDatabaseTables(),
        staleTime: 300000
    });

    // Convert to Select tree options format
    const treeOptions: SelectOption<string>[] = useMemo(() => {
        const tables = allTablesData || [];
        return tables.map(table => ({
            value: table.table_name,
            label: table.table_name,
            icon: <Database size={14} />,
            isExpandable: true,
            children: columnsCache[table.table_name]?.map(col => ({
                value: `${table.table_name}.${col.column_name}`,
                label: col.column_name,
            })) || []
        }));
    }, [allTablesData, columnsCache]);

    // Convert value object to flat array of selected item IDs
    const selectedItems = useMemo(() => {
        const items: string[] = [];
        Object.entries(value).forEach(([tableName, columns]) => {
            columns.forEach(col => {
                items.push(`${tableName}.${col}`);
            });
        });
        return items;
    }, [value]);

    // Convert flat array back to value object format
    const handleChange = useCallback((newSelectedItems: string[]) => {
        const result: Record<string, string[]> = {};
        newSelectedItems.forEach(item => {
            const [tableName, ...colParts] = item.split('.');
            const colName = colParts.join('.');
            if (colName) { // Only include if it's a column (has dot notation)
                if (!result[tableName]) {
                    result[tableName] = [];
                }
                result[tableName].push(colName);
            }
        });
        onChange(result);
    }, [onChange]);

    const loadColumnsForTable = useCallback(async (tableName: string) => {
        if (loadedTables.has(tableName)) return;
        setLoadingNodes(prev => [...prev, tableName]);

        try {
            const columns = await adminService.getAllTableColumns(tableName);
            let filteredColumns = columns || [];

            if (showTextColumns && filteredColumns.length > 0) {
                const textTypes = ['text', 'varchar', 'character varying', 'char', 'name', 'citext'];
                filteredColumns = filteredColumns.filter(c =>
                    (c.data_type && textTypes.some(t => c.data_type.toLowerCase().includes(t))) ||
                    (c.column_name && (
                        c.column_name.includes('name') ||
                        c.column_name.includes('title') ||
                        c.column_name.includes('description') ||
                        c.column_name.includes('label') ||
                        c.column_name.includes('content')
                    ))
                );
            }

            setColumnsCache(prev => ({ ...prev, [tableName]: filteredColumns }));
            setLoadedTables(prev => new Set([...prev, tableName]));
        } catch {
            // Silent error handling - columns load failed
        } finally {
            setLoadingNodes(prev => prev.filter(id => id !== tableName));
        }
    }, [loadedTables, showTextColumns, adminService]);

    // Pre-load columns for tables that are in the initial value
    useEffect(() => {
        Object.keys(value).forEach(tableName => {
            if (!loadedTables.has(tableName)) {
                loadColumnsForTable(tableName);
            }
        });
    }, [value, loadedTables, loadColumnsForTable]);

    // Handle node expansion (lazy load columns)
    const handleExpand = useCallback((nodeValue: string) => {
        loadColumnsForTable(nodeValue);
    }, [loadColumnsForTable]);

    return (
        <div className={className}>
            <Select<string>
                multiple
                tree
                recursiveSelection
                label={label}
                options={treeOptions}
                value={selectedItems}
                onChange={handleChange}
                onExpand={handleExpand}
                loadingNodes={loadingNodes}
                loading={tablesLoading}
                placeholder={placeholder}
                searchPlaceholder="Search tables and columns…"
                searchable
                showSelectAll
                showFooter
                fullWidth
            />
        </div>
    );
};
