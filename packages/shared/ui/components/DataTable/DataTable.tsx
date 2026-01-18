
import React from 'react';
import { cn } from '@pulwave/utils';
import { Skeleton } from '../Skeleton';
import { dataTableVariants, type DataTableProps, type DataTableColumnProps, type DataTableColumn } from './types';
import './styles/_index.scss';

/**
 * DataTable.Column - Sub-component for declarative column definition
 */
const DataTableColumn = <T extends Record<string, unknown>>(_: DataTableColumnProps<T>) => {
    return null;
};
DataTableColumn.displayName = 'DataTable.Column';

/**
 * DataTable Component
 */
const DataTableRoot = <T extends Record<string, unknown>>({
    data,
    columns: columnsProp,
    children,
    keyField = 'id',
    loading = false,
    emptyMessage = 'No data available',
    onRowClick,
    className,
    density = 'normal'
}: DataTableProps<T>) => {
    // Extract columns from children or use columnsProp
    const columns = React.useMemo(() => {
        let cols: DataTableColumn<T>[] = columnsProp || [];

        if (children) {
            const childColumns: DataTableColumn<T>[] = [];
            React.Children.forEach(children, (child) => {
                if (React.isValidElement(child) && child.type === DataTableColumn) {
                    childColumns.push(child.props as DataTableColumn<T>);
                }
            });

            if (childColumns.length > 0) {
                cols = [...cols, ...childColumns];
            }
        }

        return cols;
    }, [columnsProp, children]);

    // Helper to normalize columns
    const normalizedColumns = columns.map(col => ({
        ...col,
        key: col.key || col.id || '',
        header: col.header || col.title || '',
    }));

    if (loading) {
        return (
            <div className={cn(dataTableVariants({ density }), className)}>
                <div className="data-table__scroll-wrapper">
                    <table>
                        <thead>
                            <tr className="data-table__header">
                                {normalizedColumns.map((col, i) => (
                                    <th key={col.key || i} className="data-table__cell">
                                        <Skeleton variant="text" width="60%" height={16} />
                                    </th>
                                ))}
                                {normalizedColumns.length === 0 && (
                                    <th className="data-table__cell">
                                        <Skeleton variant="text" width="60%" height={16} />
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="data-table__row">
                                    {normalizedColumns.length > 0 ? (
                                        normalizedColumns.map((col, j) => (
                                            <td key={col.key || j} className="data-table__cell">
                                                <Skeleton variant="text" width="80%" height={14} />
                                            </td>
                                        ))
                                    ) : (
                                        <td className="data-table__cell">
                                            <Skeleton variant="text" width="80%" height={14} />
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={cn(dataTableVariants({ density }), 'data-table--empty', className)}>
                {typeof emptyMessage === 'string' ? <p>{emptyMessage}</p> : emptyMessage}
            </div>
        );
    }

    return (
        <div className={cn(dataTableVariants({ density }), className)}>
            <div className="data-table__scroll-wrapper">
                <table>
                    <thead>
                        <tr className="data-table__header">
                            {normalizedColumns.map((col, i) => (
                                <th
                                    key={col.key || i}
                                    style={col.width ? { width: col.width } : undefined}
                                    className={cn('data-table__cell', col.className)}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr
                                key={String((row as Record<string, unknown>)[keyField] ?? i)}
                                onClick={() => onRowClick?.(row)}
                                onKeyDown={(e) => {
                                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        onRowClick(row);
                                    }
                                }}
                                tabIndex={onRowClick ? 0 : undefined}
                                role={onRowClick ? 'button' : undefined}
                                className={cn(
                                    'data-table__row',
                                    onRowClick && 'data-table__row--clickable'
                                )}
                            >
                                {normalizedColumns.map((col, j) => {
                                    const value = (row as Record<string, unknown>)[col.key];
                                    return (
                                        <td key={col.key || j} className={cn('data-table__cell', col.className)}>
                                            {col.render
                                                ? col.render(value, row)
                                                : String(value ?? '')
                                            }
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

DataTableRoot.displayName = 'DataTable';

export const DataTable = Object.assign(DataTableRoot, {
    Column: DataTableColumn,
});
