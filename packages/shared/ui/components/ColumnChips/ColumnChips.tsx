/**
 * ColumnChips
 * 
 * Badge-style display for table→columns with remove functionality.
 * 
 * @package @ui
 */
import { type ReactNode } from 'react';
import { X } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { Badge } from '../Badge';
import { Tooltip } from '../Tooltip';
import { columnChipsVariants, type ColumnChipsProps, type ColumnChipsVariant } from './types';
import type { BadgeVariant } from '../Badge/types';
import './styles/_index.scss';

/**
 * ColumnChips - Table/column badge display
 */
export const ColumnChips = ({
    data = {} as Record<string, string[]>,
    onRemove,
    onRemoveColumn,
    maxTablesShown = 5,
    maxColumnsShown = 3,
    size = 's',
    variant = 'light' as ColumnChipsVariant,
    editable = false,
    emptyText = 'No items selected',
    className
}: ColumnChipsProps) => {
    // Map ColumnChipsVariant to BadgeVariant
    const badgeVariantMap: Record<ColumnChipsVariant, BadgeVariant> = {
        solid: 'heavy',
        light: 'light',
        outline: 'medium',
    };
    const badgeVariant = badgeVariantMap[variant];

    const tables = Object.keys(data);
    const isEmpty = tables.length === 0;

    if (isEmpty) {
        return (
            <div className={cn(columnChipsVariants({ empty: true }), className)}>
                <span className="column-chips__empty">{emptyText}</span>
            </div>
        );
    }

    const visibleTables = tables.slice(0, maxTablesShown);
    const hiddenCount = tables.length - maxTablesShown;

    return (
        <div className={cn(columnChipsVariants({ empty: false }), className)}>
            {visibleTables.map((table: string) => {
                const columns = data[table] || [];
                const visibleColumns = columns.slice(0, maxColumnsShown);
                const hiddenColumnsCount = columns.length - maxColumnsShown;

                return (
                    <div key={table} className="column-chips__table">
                        <div className="column-chips__table-header">
                            <Badge status="info" variant={badgeVariant} size={size}>
                                <span className="column-chips__table-name">{table}</span>
                                {editable && onRemove && (
                                    <button type="button" className="column-chips__remove" onClick={() => onRemove(table)} aria-label={`Remove ${table}`}>
                                        <X size={10} aria-hidden="true" />
                                    </button>
                                )}
                            </Badge>
                        </div>
                        {columns.length > 0 && (
                            <div className="column-chips__columns">
                                {visibleColumns.map(column => (
                                    <Badge key={column} status="neutral" variant={badgeVariant} size={size}>
                                        <span>{column}</span>
                                        {editable && onRemoveColumn && (
                                            <button type="button" className="column-chips__remove" onClick={() => onRemoveColumn(table, column)} aria-label={`Remove ${column}`}>
                                                <X size={10} aria-hidden="true" />
                                            </button>
                                        )}
                                    </Badge>
                                ))}
                                {hiddenColumnsCount > 0 && (
                                    <Tooltip content={columns.slice(maxColumnsShown).join(', ')} direction="top">
                                        <Badge status="neutral" variant="light" size={size} className="cursor-help">+{hiddenColumnsCount}</Badge>
                                    </Tooltip>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
            {hiddenCount > 0 && (
                <Tooltip content={tables.slice(maxTablesShown).map(t => `${t} (${data[t]?.length || 0})`).join(', ')} direction="top">
                    <Badge status="neutral" variant="light" size={size} className="cursor-help">+{hiddenCount} more tables</Badge>
                </Tooltip>
            )}
        </div>
    );
};

ColumnChips.displayName = 'ColumnChips';
export default ColumnChips;
