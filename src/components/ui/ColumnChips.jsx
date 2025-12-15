import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { X } from 'lucide-react';
import Badge from './Badge';
import Tooltip from './Tooltip';

/**
 * ColumnChips Component
 * Badge-style display for table→columns with optional remove functionality
 * Provides a compact, visual representation of hierarchical data
 */
const ColumnChips = ({
    data = {},
    onRemove,
    onRemoveColumn,
    maxTablesShown = 5,
    maxColumnsShown = 3,
    size = 's',
    variant = 'light',
    editable = false,
    emptyText = 'No items selected',
    className,
}) => {
    const tables = Object.keys(data);

    if (tables.length === 0) {
        return (
            <div className={clsx('column-chips', 'column-chips--empty', className)}>
                <span className="column-chips__empty">{emptyText}</span>
            </div>
        );
    }

    const visibleTables = tables.slice(0, maxTablesShown);
    const hiddenCount = tables.length - maxTablesShown;

    return (
        <div className={clsx('column-chips', className)}>
            {visibleTables.map(table => {
                const columns = data[table] || [];
                const visibleColumns = columns.slice(0, maxColumnsShown);
                const hiddenColumnsCount = columns.length - maxColumnsShown;

                return (
                    <div key={table} className="column-chips__table">
                        {/* Table badge */}
                        <div className="column-chips__table-header">
                            <Badge type="info" variant={variant} size={size}>
                                <span className="column-chips__table-name">{table}</span>
                                {editable && onRemove && (
                                    <button
                                        type="button"
                                        className="column-chips__remove"
                                        onClick={() => onRemove(table)}
                                        aria-label={`Remove ${table}`}
                                    >
                                        <X size={10} />
                                    </button>
                                )}
                            </Badge>
                        </div>

                        {/* Column chips */}
                        {columns.length > 0 && (
                            <div className="column-chips__columns">
                                {visibleColumns.map(column => (
                                    <Badge key={column} type="neutral" variant={variant} size={size}>
                                        <span>{column}</span>
                                        {editable && onRemoveColumn && (
                                            <button
                                                type="button"
                                                className="column-chips__remove"
                                                onClick={() => onRemoveColumn(table, column)}
                                                aria-label={`Remove ${column} from ${table}`}
                                            >
                                                <X size={10} />
                                            </button>
                                        )}
                                    </Badge>
                                ))}
                                {hiddenColumnsCount > 0 && (
                                    <Tooltip content={columns.slice(maxColumnsShown).join(', ')} position="top">
                                        <Badge type="neutral" variant="outline" size={size} className="cursor-help">
                                            +{hiddenColumnsCount}
                                        </Badge>
                                    </Tooltip>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            {hiddenCount > 0 && (
                <Tooltip
                    content={tables.slice(maxTablesShown).map(t => `${t} (${data[t]?.length || 0})`).join(', ')}
                    position="top"
                >
                    <Badge type="neutral" variant="outline" size={size} className="cursor-help">
                        +{hiddenCount} more tables
                    </Badge>
                </Tooltip>
            )}
        </div>
    );
};

ColumnChips.propTypes = {
    /** Data object: { table_name: ['column1', 'column2'] } */
    data: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    /** Callback when a table is removed */
    onRemove: PropTypes.func,
    /** Callback when a column is removed: (table, column) => void */
    onRemoveColumn: PropTypes.func,
    /** Max tables to show before "+N more" */
    maxTablesShown: PropTypes.number,
    /** Max columns per table to show */
    maxColumnsShown: PropTypes.number,
    /** Badge size */
    size: PropTypes.oneOf(['xs', 's', 'm']),
    /** Badge variant */
    variant: PropTypes.oneOf(['solid', 'light', 'outline']),
    /** Show remove buttons */
    editable: PropTypes.bool,
    /** Text shown when empty */
    emptyText: PropTypes.string,
    className: PropTypes.string,
};

export default ColumnChips;
