import React from 'react';
import { Database, GroupRow } from '../../../components/ui';
import { groupBy, toTitleCase } from '../../../utils';

/**
 * SchemaTranslationList - Displays schema translations grouped by table, then by column
 * Uses GroupRow recursively:
 * - Table level: GroupRow with columns as children (if >1 column)
 * - Column level: GroupRow with translations as items (if >1 translation)
 */
const SchemaTranslationList = ({ translations, onEdit, onDelete, locales = [] }) => {
    const totalLocales = locales.length;

    // 1. Group by Table using utility
    const tableGroups = groupBy(translations, 'table_name');
    const sortedTables = Object.keys(tableGroups).sort();

    if (sortedTables.length === 0) return null;

    return (
        <div className="schema-translation-list space-y-2">
            {sortedTables.map(table => {
                const tableItems = tableGroups[table];

                // Group by Column within the Table using utility
                const columnGroups = groupBy(tableItems, t => t.column_name || '__TABLE_LABEL__');

                // Sort columns: Table Label first, then alphabetical
                const sortedColumns = Object.keys(columnGroups).sort((a, b) => {
                    if (a === '__TABLE_LABEL__') return -1;
                    if (b === '__TABLE_LABEL__') return 1;
                    return a.localeCompare(b);
                });

                const columnCount = sortedColumns.length;

                // Build column GroupRows
                const columnRows = sortedColumns.map(colKey => {
                    const colItems = columnGroups[colKey];
                    const isTableLabel = colKey === '__TABLE_LABEL__';
                    const label = isTableLabel ? 'Table Name' : toTitleCase(colKey);

                    const mappedItems = colItems.map(i => ({
                        ...i,
                        locale_code: i.locale_code || i.locale,
                        translated_text: i.translated_label
                    }));


                    const allPublished = colItems.every(i => i.status === 'published');

                    return (
                        <GroupRow
                            key={colKey}
                            title={label}
                            icon={<Database size={14} className="text-neutral-400" />}
                            items={mappedItems}
                            localeKey="locale_code"
                            textKey="translated_text"
                            allPublished={allPublished}
                            totalLocales={totalLocales}
                            isChild={columnCount > 1}
                            onEdit={(item) => onEdit({
                                ...item,
                                items: mappedItems,
                                source_table: table,
                                source_column: isTableLabel ? null : colKey
                            })}
                            onDelete={onDelete}
                        />
                    );
                });

                // If only 1 column, render column GroupRow directly (no table wrapper)
                if (columnCount === 1) {
                    const colKey = sortedColumns[0];
                    const colItems = columnGroups[colKey];
                    const isTableLabel = colKey === '__TABLE_LABEL__';
                    const label = isTableLabel ? toTitleCase(table) : `${toTitleCase(table)} → ${toTitleCase(colKey)}`;

                    const mappedItems = colItems.map(i => ({
                        ...i,
                        locale_code: i.locale_code || i.locale,
                        translated_text: i.translated_label
                    }));

                    const allPublished = colItems.every(i => i.status === 'published');

                    return (
                        <GroupRow
                            key={`${table}-${colKey}`}
                            title={label}
                            icon={<Database size={14} className="text-primary" />}
                            items={mappedItems}
                            localeKey="locale_code"
                            textKey="translated_text"
                            allPublished={allPublished}
                            totalLocales={totalLocales}
                            isChild={false}
                            onEdit={(item) => onEdit({
                                ...item,
                                items: mappedItems,
                                source_table: table,
                                source_column: isTableLabel ? null : colKey
                            })}
                            onDelete={onDelete}
                        />
                    );
                }

                // Multiple columns: Use nested GroupRow (parent → children)
                return (
                    <GroupRow
                        key={table}
                        title={toTitleCase(table)}
                        icon={<Database size={16} className="text-primary" />}
                        count={columnCount}
                        countLabel={columnCount === 1 ? 'column' : 'columns'}
                        isChild={false}
                    >
                        {columnRows}
                    </GroupRow>
                );
            })}
        </div>
    );
};

export default SchemaTranslationList;
