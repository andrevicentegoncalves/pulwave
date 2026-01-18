import React from 'react';
import { classNames } from '@pulwave/utils';
import { Stack, Card, SearchInput, DataTable } from '@pulwave/ui';
import {
    filterableDataTableVariants,
    filterableDataTableHeaderVariants,
    filterableDataTableTitleVariants,
    filterableDataTableControlsWrapperVariants,
    filterableDataTableSearchVariants,
    type FilterableDataTableProps
} from './types';
import './styles/_index.scss';

export * from './types';

/**
 * FilterableDataTable - Composite pattern for data exploration
 */
export const FilterableDataTable = <T extends Record<string, unknown>>({
    data,
    columns,
    onSearch,
    searchValue,
    filterControls,
    title,
    actions,
    loading,
    emptyMessage,
    onRowClick,
    keyField,
    pagination,
}: FilterableDataTableProps<T>) => {
    return (
        <Card className={classNames(filterableDataTableVariants())} padding="none">
            {(title || onSearch || filterControls || actions) && (
                <div className={classNames(filterableDataTableHeaderVariants())}>
                    <Stack spacing={4} align="center" justify="between">
                        {/* Title if present */}
                        {title && <h3 className={classNames(filterableDataTableTitleVariants())}>{title}</h3>}

                        {/* Search and Filters area */}
                        <div
                            className={classNames(filterableDataTableControlsWrapperVariants())}
                            style={{ justifyContent: title ? 'flex-end' : 'flex-start' }}
                        >
                            {onSearch && (
                                <div className={classNames(filterableDataTableSearchVariants())}>
                                    <SearchInput
                                        placeholder="Search…"
                                        value={searchValue}
                                        onChange={(e) => onSearch(e.target.value)}
                                        size="m"
                                    />
                                </div>
                            )}
                            {filterControls}
                        </div>

                        {/* Right Actions */}
                        {actions && <div>{actions}</div>}
                    </Stack>
                </div>
            )}

            <DataTable
                data={data}
                columns={columns}
                loading={loading}
                emptyMessage={emptyMessage}
                onRowClick={onRowClick}
                keyField={keyField}
            />
        </Card>
    );
};

export default FilterableDataTable;
