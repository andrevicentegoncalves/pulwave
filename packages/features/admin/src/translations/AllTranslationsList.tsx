import { useState, useCallback, useMemo } from 'react';
import { Database, Type, Layers, FileText, Table } from '@pulwave/ui';
import { GroupRow, GroupRowItem } from './components/GroupRow';
import { groupBy, toTitleCase } from '../utils';
import { useAdminContext } from '@pulwave/features-admin';

// ============================================================================
// Types
// ============================================================================

export interface TranslationItem {
    id?: string;
    source_type?: 'ui' | 'database' | 'enum' | 'content' | 'master_data';
    translation_key?: string;
    locale_code?: string;
    locale?: string;
    translated_text?: string;
    translated_label?: string;
    status?: string;
    // Schema specific
    table_name?: string;
    column_name?: string;
    column_count?: number;
    // Enum specific
    enum_name?: string;
    enum_value?: string;
    value_count?: number;
    // Content specific
    record_id?: string;
    // Master data
    item_id?: string;
    master_data_value_id?: string;
    item_type?: 'type' | 'value';
    type_key?: string;
    value_key?: string;
    display_label?: string;
    value_label?: string;
    locale_count?: number;
}

interface CommonListProps {
    items: TranslationItem[];
    totalLocales: number;
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
}

interface LazyListProps extends CommonListProps {
    loader: ReturnType<typeof useTranslationLoader>;
}

// ============================================================================
// Hook: useTranslationLoader
// ============================================================================

const useTranslationLoader = (service: any) => {
    // State for lazy-loaded translations
    const [loadedSchema, setLoadedSchema] = useState<Record<string, TranslationItem[]>>({});
    const [loadingTables, setLoadingTables] = useState<Record<string, boolean>>({});

    const [loadedEnums, setLoadedEnums] = useState<Record<string, TranslationItem[]>>({});
    const [loadingEnums, setLoadingEnums] = useState<Record<string, boolean>>({});

    const [loadedMasterData, setLoadedMasterData] = useState<Record<string, TranslationItem[]>>({});
    const [loadingMasterData, setLoadingMasterData] = useState<Record<string, boolean>>({});

    const loadTable = useCallback(async (tableName: string) => {
        if (loadedSchema[tableName] || loadingTables[tableName]) return;
        setLoadingTables(prev => ({ ...prev, [tableName]: true }));
        try {
            const response = await service.getSchemaTranslations({ table: tableName, limit: 1000 });
            setLoadedSchema(prev => ({ ...prev, [tableName]: response.data || [] }));
        } catch {
            // Silent error handling for schema translation load
        } finally {
            setLoadingTables(prev => ({ ...prev, [tableName]: false }));
        }
    }, [loadedSchema, loadingTables, service]);

    const loadEnum = useCallback(async (enumName: string) => {
        if (loadedEnums[enumName] || loadingEnums[enumName]) return;
        setLoadingEnums(prev => ({ ...prev, [enumName]: true }));
        try {
            const response = await service.getEnumTranslations({ enumName, limit: 1000 });
            setLoadedEnums(prev => ({ ...prev, [enumName]: response.data || [] }));
        } catch {
            // Silent error handling for enum translation load
        } finally {
            setLoadingEnums(prev => ({ ...prev, [enumName]: false }));
        }
    }, [loadedEnums, loadingEnums, service]);

    const loadMasterDataFn = useCallback(async (itemId: string, itemType: string = 'value') => {
        if (loadedMasterData[itemId] || loadingMasterData[itemId]) return;
        setLoadingMasterData(prev => ({ ...prev, [itemId]: true }));
        try {
            const params: any = { limit: 1000, target: itemType };
            if (itemType === 'type') params.masterDataTypeId = itemId;
            else params.masterDataValueId = itemId;

            const response = await service.getMasterDataTranslations(params);
            setLoadedMasterData(prev => ({ ...prev, [itemId]: response.data || [] }));
        } catch {
            // Silent error handling for master data translation load
        } finally {
            setLoadingMasterData(prev => ({ ...prev, [itemId]: false }));
        }
    }, [loadedMasterData, loadingMasterData, service]);

    return {
        schema: { data: loadedSchema, loading: loadingTables, load: loadTable },
        enums: { data: loadedEnums, loading: loadingEnums, load: loadEnum },
        masterData: { data: loadedMasterData, loading: loadingMasterData, load: loadMasterDataFn }
    };
};

// ============================================================================
// Sub-Components
// ============================================================================

const UITranslationsList = ({ items, totalLocales, onEdit, onDelete }: CommonListProps) => {
    const groups = useMemo(() => {
        return items.reduce((acc: any, t) => {
            const key = t.translation_key || 'unknown';
            if (!acc[key]) acc[key] = [];
            acc[key].push(t);
            return acc;
        }, {});
    }, [items]);

    return (
        <>
            {Object.keys(groups).sort().map(key => {
                const groupItems = groups[key];
                const mappedItems = groupItems.map((i: any) => ({
                    ...i,
                    locale_code: i.locale_code || i.locale,
                    translated_text: i.translated_text
                }));
                const allPublished = groupItems.every((i: any) => i.status === 'published');

                return (
                    <GroupRow
                        key={`ui-${key}`}
                        title={key}
                        icon={<Type size={14} className="text-neutral-500" />}
                        items={mappedItems}
                        localeKey="locale_code"
                        textKey="translated_text"
                        allPublished={allPublished}
                        totalLocales={totalLocales}
                        onEdit={(item: any) => onEdit({ ...item, items: mappedItems })}
                        onDelete={(item: GroupRowItem) => { if (item.id) onDelete(String(item.id)); }}
                        forceGroup={true}
                    />
                );
            })}
        </>
    );
};

const SchemaTranslationsList = ({ items, loader, totalLocales, onEdit, onDelete }: LazyListProps) => {
    const isLazyMode = items[0]?.column_count !== undefined && !items[0]?.translated_label;

    if (!isLazyMode) return null; // Simplified: assume lazy for now as per audit focus

    return (
        <>
            {items.map((tableInfo) => {
                const tableName = tableInfo.table_name || 'unknown';
                const columnCount = tableInfo.column_count || 0;
                const isLoading = loader.schema.loading[tableName];
                const loadedData = loader.schema.data[tableName];

                if (loadedData && loadedData.length > 0) {
                    const columnGroups = loadedData.reduce((acc: any, t) => {
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

                    const columnRows = sortedColumns.map(colKey => {
                        const colItems = columnGroups[colKey];
                        const isTableLabel = colKey === '__TABLE_LABEL__';
                        const label = isTableLabel ? 'Table Name' : toTitleCase(colKey);

                        const mappedItems = colItems.map((i: any) => ({
                            ...i,
                            locale_code: i.locale_code || i.locale,
                            translated_text: i.translated_label
                        }));
                        const allPublished = colItems.every((i: any) => i.status === 'published');

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
                                onEdit={(item: any) => onEdit({
                                    ...item,
                                    items: mappedItems,
                                    source_table: tableName,
                                    source_column: isTableLabel ? null : colKey
                                })}
                                onDelete={(item: GroupRowItem) => { if (item.id) onDelete(String(item.id)); }}
                                forceGroup={true}
                            />
                        );
                    });

                    return (
                        <GroupRow
                            key={`schema-${tableName}`}
                            title={toTitleCase(tableName)}
                            icon={<Database size={14} className="color-text-primary" />}
                            count={sortedColumns.length}
                            countLabel={sortedColumns.length === 1 ? 'column' : 'columns'}
                            defaultExpanded={true}
                        >
                            {columnRows}
                        </GroupRow>
                    );
                }

                return (
                    <GroupRow
                        key={`schema-${tableName}`}
                        title={toTitleCase(tableName)}
                        icon={<Database size={14} className="color-text-primary" />}
                        count={columnCount}
                        countLabel={columnCount === 1 ? 'column' : 'columns'}
                        isLoading={isLoading}
                        onToggle={(isExpanded: boolean) => {
                            if (isExpanded) loader.schema.load(tableName);
                        }}
                    >
                        {isLoading ? (
                            <div className="p-4 text-neutral-400 text-sm">Loading translations…</div>
                        ) : (
                            <div className="p-4 text-neutral-400 text-sm">Expand to load translations</div>
                        )}
                    </GroupRow>
                );
            })}
        </>
    );
};

const EnumTranslationsList = ({ items, loader, totalLocales, onEdit, onDelete }: LazyListProps) => {
    const isLazyMode = items[0]?.value_count !== undefined && !items[0]?.translated_label;
    if (!isLazyMode) return null;

    return (
        <>
            {items.map((enumInfo) => {
                const enumName = enumInfo.enum_name || 'unknown';
                const valueCount = enumInfo.value_count || 0;
                const isLoading = loader.enums.loading[enumName];
                const loadedData = loader.enums.data[enumName];

                if (loadedData && loadedData.length > 0) {
                    const valueGroups = loadedData.reduce((acc: any, t) => {
                        const val = t.enum_value || 'unknown';
                        if (!acc[val]) acc[val] = [];
                        acc[val].push(t);
                        return acc;
                    }, {});

                    const childRows = Object.keys(valueGroups).sort().map(valKey => {
                        const valItems = valueGroups[valKey];
                        const mappedItems = valItems.map((i: any) => ({
                            ...i,
                            locale_code: i.locale_code || i.locale,
                            translated_text: i.translated_label
                        }));
                        const allPublished = valItems.every((i: any) => i.status === 'published');

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
                                onEdit={(item: any) => onEdit({
                                    ...item,
                                    items: mappedItems,
                                    enum_name: enumName,
                                    enum_value: valKey
                                })}
                                onDelete={(item: GroupRowItem) => { if (item.id) onDelete(String(item.id)); }}
                                forceGroup={true}
                            />
                        );
                    });

                    return (
                        <GroupRow
                            key={`enum-${enumName}`}
                            title={toTitleCase(enumName)}
                            icon={<Layers size={14} className="text-purple-600" />}
                            count={Object.keys(valueGroups).length}
                            countLabel="values"
                            defaultExpanded={true}
                        >
                            {childRows}
                        </GroupRow>
                    );
                }

                return (
                    <GroupRow
                        key={`enum-${enumName}`}
                        title={toTitleCase(enumName)}
                        icon={<Layers size={14} className="text-purple-600" />}
                        count={valueCount}
                        countLabel="values"
                        isLoading={isLoading}
                        onToggle={(isExpanded: boolean) => {
                            if (isExpanded) loader.enums.load(enumName);
                        }}
                    >
                        {isLoading ? (
                            <div className="p-4 text-neutral-400 text-sm">Loading translations…</div>
                        ) : (
                            <div className="p-4 text-neutral-400 text-sm">Expand to load translations</div>
                        )}
                    </GroupRow>
                );
            })}
        </>
    );
};

const ContentTranslationsList = ({ items, totalLocales, onEdit, onDelete }: CommonListProps) => {
    const groups = useMemo(() => {
        return items.reduce((acc: any, t) => {
            const key = `${t.table_name}::${t.record_id}`;
            if (!acc[key]) acc[key] = { table_name: t.table_name, record_id: t.record_id, items: [] };
            acc[key].items.push(t);
            return acc;
        }, {});
    }, [items]);

    return (
        <>
            {Object.entries(groups).sort().map(([key, group]: [string, any]) => {
                const mappedItems = group.items.map((i: any) => ({
                    ...i,
                    locale_code: i.locale_code || i.locale,
                    translated_text: i.translated_text
                }));
                const allPublished = group.items.every((i: any) => i.status === 'published');

                return (
                    <GroupRow
                        key={`content-${key}`}
                        title={`${toTitleCase(group.table_name)} #${group.record_id}`}
                        icon={<FileText size={14} className="text-orange-600" />}
                        items={mappedItems}
                        localeKey="locale_code"
                        textKey="translated_text"
                        allPublished={allPublished}
                        totalLocales={totalLocales}
                        onEdit={(item: any) => onEdit({ ...item, items: mappedItems })}
                        onDelete={(item: GroupRowItem) => { if (item.id) onDelete(String(item.id)); }}
                        forceGroup={true}
                    />
                );
            })}
        </>
    );
};

const MasterDataTranslationsList = ({ items, loader, onEdit, onDelete }: LazyListProps) => {
    const isLazyMode = items[0]?.locale_count !== undefined && !items[0]?.translated_label;
    if (!isLazyMode) return null;

    return (
        <>
            {items.map((itemInfo) => {
                const itemId = itemInfo.item_id || itemInfo.master_data_value_id;
                const itemType = itemInfo.item_type || 'value';
                const typeKey = itemInfo.type_key || 'unknown';
                const valueKey = itemInfo.value_key;
                const displayLabel = itemInfo.display_label || itemInfo.value_label || itemInfo.type_key || 'unknown';
                const isLoading = loader.masterData.loading[itemId];
                const loadedData = loader.masterData.data[itemId];

                const title = itemType === 'type'
                    ? `[Type] ${toTitleCase(typeKey || displayLabel)}`
                    : `${toTitleCase(typeKey)} → ${displayLabel}`;

                if (loadedData && loadedData.length > 0) {
                    const mappedItems = loadedData.map((i: any) => ({
                        ...i,
                        locale_code: i.locale_code || i.locale,
                        translated_text: i.translated_label || i.translated_text
                    }));

                    return (
                        <GroupRow
                            key={`master_data-${itemType}-${itemId}`}
                            title={title}
                            icon={<Table size={14} className="text-teal-600" />}
                            items={mappedItems}
                            localeKey="locale_code"
                            textKey="translated_text"
                            defaultExpanded={true}
                            onEdit={(item: any) => onEdit({
                                ...item,
                                items: mappedItems,
                                master_data_item_type: itemType,
                                master_data_type_id: itemType === 'type' ? itemId : null,
                                master_data_value_id: itemType === 'value' ? itemId : null,
                                master_data_type_key: typeKey,
                                master_data_value_key: valueKey
                            })}
                            onDelete={(item: GroupRowItem) => { if (item.id) onDelete(String(item.id)); }}
                            forceGroup={true}
                        />
                    );
                }

                return (
                    <GroupRow
                        key={`master_data-${itemType}-${itemId}`}
                        title={title}
                        icon={<Table size={14} className="text-teal-600" />}
                        isLoading={isLoading}
                        onToggle={(isExpanded: boolean) => {
                            if (isExpanded) loader.masterData.load(itemId, itemType);
                        }}
                    >
                        {isLoading ? (
                            <div className="p-4 text-neutral-400 text-sm">Loading translations…</div>
                        ) : (
                            <div className="p-4 text-neutral-400 text-sm">Expand to load translations</div>
                        )}
                    </GroupRow>
                );
            })}
        </>
    );
};

// ============================================================================
// Main Component
// ============================================================================

interface AllTranslationsListProps {
    translations: TranslationItem[];
    locales?: any[];
    onEdit: (item: any) => void;
    onDeleteTranslation: (id: string) => void;
}

const AllTranslationsList = ({
    translations,
    locales = [],
    onEdit,
    onDeleteTranslation
}: AllTranslationsListProps) => {
    const { service } = useAdminContext();
    const loader = useTranslationLoader(service);

    // Group translations by source type props
    const bySourceType: Record<string, TranslationItem[]> = useMemo(() =>
        groupBy(translations, (t: TranslationItem) => t.source_type || 'ui'),
        [translations]);

    const commonProps = {
        totalLocales: locales.length,
        onEdit,
        onDelete: onDeleteTranslation
    };

    return (
        <div className="space-y-4 admin-list-optimized">
            {bySourceType.ui?.length > 0 && (
                <UITranslationsList items={bySourceType.ui} {...commonProps} />
            )}

            {bySourceType.database?.length > 0 && (
                <SchemaTranslationsList items={bySourceType.database} loader={loader} {...commonProps} />
            )}

            {bySourceType.enum?.length > 0 && (
                <EnumTranslationsList items={bySourceType.enum} loader={loader} {...commonProps} />
            )}

            {bySourceType.content?.length > 0 && (
                <ContentTranslationsList items={bySourceType.content} {...commonProps} />
            )}

            {bySourceType.master_data?.length > 0 && (
                <MasterDataTranslationsList items={bySourceType.master_data} loader={loader} {...commonProps} />
            )}
        </div>
    );
};

export default AllTranslationsList;
