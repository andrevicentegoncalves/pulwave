import React from 'react';
import { Database, Type, Layers, FileText, GroupRow } from '../../../components/ui';
import { groupBy, toTitleCase } from '../../../utils';

/**
 * AllTranslationsList - Unified component for displaying all translations
 * Works for all source types: UI, Schema, Enum, Content
 * Uses hierarchical GroupRow for proper nesting
 */
const AllTranslationsList = ({ translations, locales = [], onEdit, onDelete }) => {
    const totalLocales = locales.length;

    // Separate by source_type using utility
    const bySourceType = groupBy(translations, t => t.source_type || 'ui');

    const getIcon = (type) => {
        switch (type) {
            case 'database': return <Database size={14} className="text-primary" />;
            case 'enum': return <Layers size={14} className="text-purple-600" />;
            case 'content': return <FileText size={14} className="text-orange-600" />;
            default: return <Type size={14} className="text-neutral-500" />;
        }
    };

    const allRows = [];

    // ============ UI Translations ============
    if (bySourceType.ui?.length > 0) {
        const uiGroups = bySourceType.ui.reduce((acc, t) => {
            const key = t.translation_key;
            if (!acc[key]) acc[key] = [];
            acc[key].push(t);
            return acc;
        }, {});

        Object.keys(uiGroups).sort().forEach(key => {
            const items = uiGroups[key];
            const mappedItems = items.map(i => ({
                ...i,
                locale_code: i.locale_code || i.locale,
                translated_text: i.translated_text
            }));
            const allPublished = items.every(i => i.status === 'published');

            allRows.push(
                <GroupRow
                    key={`ui-${key}`}
                    title={key}
                    icon={getIcon('ui')}
                    items={mappedItems}
                    localeKey="locale_code"
                    textKey="translated_text"
                    allPublished={allPublished}
                    totalLocales={totalLocales}
                    onEdit={(item) => onEdit({ ...item, items: mappedItems })}
                    onDelete={onDelete}
                    forceGroup={true}
                />
            );
        });
    }

    // ============ Schema (Database) Translations ============
    if (bySourceType.database?.length > 0) {
        const tableGroups = bySourceType.database.reduce((acc, t) => {
            const table = t.table_name;
            if (!acc[table]) acc[table] = [];
            acc[table].push(t);
            return acc;
        }, {});

        Object.keys(tableGroups).sort().forEach(tableName => {
            const tableItems = tableGroups[tableName];

            // Group by column within table
            const columnGroups = tableItems.reduce((acc, t) => {
                const col = t.column_name || '__TABLE_LABEL__';
                if (!acc[col]) acc[col] = [];
                acc[col].push(t);
                return acc;
            }, {});

            const sortedColumns = Object.keys(columnGroups).sort((a, b) => {
                if (a === '__TABLE_LABEL__') return -1;
                if (b === '__TABLE_LABEL__') return 1;
                return a.localeCompare(b);
            });

            const columnCount = sortedColumns.length;

            // Check if ALL columns have ALL locales filled (for parent globe icon)
            const allColumnsComplete = sortedColumns.every(colKey => {
                const colItems = columnGroups[colKey];
                return colItems.length >= totalLocales;
            });

            // Check if ALL items in ALL columns are published
            const allColumnsPublished = tableItems.every(i => i.status === 'published');

            // Build column rows
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
                        depth={1}
                        onEdit={(item) => onEdit({
                            ...item,
                            items: mappedItems,
                            source_table: tableName,
                            source_column: isTableLabel ? null : colKey
                        })}
                        onDelete={onDelete}
                        forceGroup={true}
                    />
                );
            });

            // Single column: render directly
            if (columnCount === 1) {
                const colKey = sortedColumns[0];
                const colItems = columnGroups[colKey];
                const isTableLabel = colKey === '__TABLE_LABEL__';
                const label = isTableLabel ? toTitleCase(tableName) : `${toTitleCase(tableName)} → ${toTitleCase(colKey)}`;

                const mappedItems = colItems.map(i => ({
                    ...i,
                    locale_code: i.locale_code || i.locale,
                    translated_text: i.translated_label
                }));

                const allPublished = colItems.every(i => i.status === 'published');

                allRows.push(
                    <GroupRow
                        key={`schema-${tableName}-${colKey}`}
                        title={label}
                        icon={getIcon('database')}
                        items={mappedItems}
                        localeKey="locale_code"
                        textKey="translated_text"
                        allPublished={allPublished}
                        totalLocales={totalLocales}
                        onEdit={(item) => onEdit({
                            ...item,
                            items: mappedItems,
                            source_table: tableName,
                            source_column: isTableLabel ? null : colKey
                        })}
                        onDelete={onDelete}
                        forceGroup={true}
                    />
                );
            } else {
                // Multiple columns: nested GroupRow with parent-level status
                allRows.push(
                    <GroupRow
                        key={`schema-${tableName}`}
                        title={toTitleCase(tableName)}
                        icon={getIcon('database')}
                        count={columnCount}
                        countLabel={columnCount === 1 ? 'column' : 'columns'}
                        totalLocales={allColumnsComplete ? 1 : 0} // Trick: set to 1 if complete to show globe
                        items={allColumnsComplete ? [{ id: 'complete' }] : []} // Fake items to trigger allLocalesFilled
                        allPublished={allColumnsPublished}
                    >
                        {columnRows}
                    </GroupRow>
                );
            }
        });
    }

    // ============ Enum Translations ============
    if (bySourceType.enum?.length > 0) {
        // 1. Group by Enum Name
        const enumGroups = bySourceType.enum.reduce((acc, t) => {
            const name = t.enum_name;
            if (!acc[name]) acc[name] = [];
            acc[name].push(t);
            return acc;
        }, {});

        Object.keys(enumGroups).sort().forEach(enumName => {
            const enumItems = enumGroups[enumName];

            // 2. Group by Enum Value within Name
            const valueGroups = enumItems.reduce((acc, t) => {
                const val = t.enum_value;
                if (!acc[val]) acc[val] = [];
                acc[val].push(t);
                return acc;
            }, {});

            const sortedValues = Object.keys(valueGroups).sort();
            const valueCount = sortedValues.length;

            // Check parent status
            const allValuesComplete = sortedValues.every(valKey => {
                const valItems = valueGroups[valKey];
                return valItems.length >= totalLocales;
            });
            const allValuesPublished = enumItems.every(i => i.status === 'published');

            // Build child rows
            const childRows = sortedValues.map(valKey => {
                const valItems = valueGroups[valKey];
                const mappedItems = valItems.map(i => ({
                    ...i,
                    locale_code: i.locale_code || i.locale,
                    translated_text: i.translated_label
                }));
                const allPublished = valItems.every(i => i.status === 'published');

                return (
                    <GroupRow
                        key={valKey}
                        title={valKey}
                        icon={<Layers size={14} className="text-neutral-400" />}
                        items={mappedItems}
                        localeKey="locale_code"
                        textKey="translated_text"
                        allPublished={allPublished}
                        depth={1}
                        onEdit={(item) => onEdit({
                            ...item,
                            items: mappedItems,
                            enum_name: enumName,
                            enum_value: valKey
                        })}
                        onDelete={onDelete}
                        forceGroup={true}
                    />
                );
            });

            if (valueCount === 1) {
                // Single value: render flat
                const valKey = sortedValues[0];
                const valItems = valueGroups[valKey];
                const mappedItems = valItems.map(i => ({
                    ...i,
                    locale_code: i.locale_code || i.locale,
                    translated_text: i.translated_label
                }));
                const allPublished = valItems.every(i => i.status === 'published');

                allRows.push(
                    <GroupRow
                        key={`enum-${enumName}-${valKey}`}
                        title={`${toTitleCase(enumName)} → ${valKey}`}
                        icon={getIcon('enum')}
                        items={mappedItems}
                        localeKey="locale_code"
                        textKey="translated_text"
                        allPublished={allPublished}
                        totalLocales={totalLocales}
                        onEdit={(item) => onEdit({
                            ...item,
                            items: mappedItems,
                            enum_name: enumName,
                            enum_value: valKey
                        })}
                        onDelete={onDelete}
                        forceGroup={true}
                    />
                );
            } else {
                // Multiple values: render parent + children
                allRows.push(
                    <GroupRow
                        key={`enum-${enumName}`}
                        title={toTitleCase(enumName)}
                        icon={getIcon('enum')}
                        count={valueCount}
                        countLabel={valueCount === 1 ? 'value' : 'values'}
                        totalLocales={allValuesComplete ? 1 : 0}
                        items={allValuesComplete ? [{ id: 'complete' }] : []} // Fake items for globe
                        allPublished={allValuesPublished}
                    >
                        {childRows}
                    </GroupRow>
                );
            }
        });
    }

    // ============ Content Translations ============
    if (bySourceType.content?.length > 0) {
        const contentGroups = bySourceType.content.reduce((acc, t) => {
            const key = `${t.table_name}::${t.record_id}`;
            if (!acc[key]) acc[key] = { table_name: t.table_name, record_id: t.record_id, items: [] };
            acc[key].items.push(t);
            return acc;
        }, {});

        Object.keys(contentGroups).sort().forEach(key => {
            const group = contentGroups[key];
            const mappedItems = group.items.map(i => ({
                ...i,
                locale_code: i.locale_code || i.locale,
                translated_text: i.translated_text
            }));
            const allPublished = group.items.every(i => i.status === 'published');

            allRows.push(
                <GroupRow
                    key={`content-${key}`}
                    title={`${toTitleCase(group.table_name)} #${group.record_id}`}
                    icon={getIcon('content')}
                    items={mappedItems}
                    localeKey="locale_code"
                    textKey="translated_text"
                    allPublished={allPublished}
                    totalLocales={totalLocales}
                    onEdit={(item) => onEdit({ ...item, items: mappedItems })}
                    onDelete={onDelete}
                    forceGroup={true}
                />
            );
        });
    }

    if (allRows.length === 0) return null;

    return (
        <div className="all-translations-list space-y-0">
            {allRows}
        </div>
    );
};

export default AllTranslationsList;
