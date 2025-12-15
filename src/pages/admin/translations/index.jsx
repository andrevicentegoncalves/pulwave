import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../../services';
import {
    useAdminLocales,
    useAdminTranslations,
    useSaveBatchAdminTranslations,
    useDeleteAdminTranslation,
    useAdminTranslationsByKey,
    useAdminSettings,
    useSaveAdminSchemaTranslation,
    useSaveAdminEnumTranslation,
    useSaveAdminContentTranslation,
    useGenerateTranslationBundles
} from '../../../hooks/admin';
import {
    Button, Input, Select, TextArea, Badge, Spinner, EmptyState, Modal, ConfirmationModal, DataTable,
    SearchInput, Pagination, Card, CircleFlag, Tooltip, Info,
    Languages, Type, Database, Edit2, Trash2, Download, Plus, Save, AlertCircle, FileJson, Layers, FileText
} from '../../../components/ui';
import LocaleSelect from '../../../components/forms/LocaleSelect';
import GroupedTranslationList from './GroupedTranslationList';
import SchemaTranslationList from './SchemaTranslationList';
import AllTranslationsList from './AllTranslationsList';
import TranslationFormModal from './TranslationFormModal';

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'needs_review', label: 'Needs Review' },
];


const sourceTypes = [
    { value: '', label: 'All', icon: Languages },
    { value: 'ui', label: 'UI Strings', icon: Type },
    { value: 'database', label: 'Schema', icon: Database },
    { value: 'enum', label: 'Enums', icon: Layers },
    { value: 'content', label: 'Content', icon: FileText },
    { value: 'master_data', label: 'Master Data', icon: Database },
];

/**
 * Admin Translations Editor - Comprehensive Management
 */
const TranslationsEditor = () => {
    // Filters & Pagination
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [localeFilter, setLocaleFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sourceType, setSourceType] = useState(''); // '', 'ui', 'json_config', 'database', 'enum', 'content'

    // Type-specific filters
    const [tableFilter, setTableFilter] = useState(''); // For Schema & Content & JSON Config
    const [enumFilter, setEnumFilter] = useState('');   // For Enums

    // Debounce search input (500ms delay)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Page size configuration (persisted to localStorage)
    const [pageSize, setPageSize] = useState(() => {
        const saved = localStorage.getItem('admin_translations_pageSize');
        return saved ? parseInt(saved, 10) : 10;
    });

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        localStorage.setItem('admin_translations_pageSize', newSize.toString());
        setPage(1); // Reset to first page
    };

    const pageSizeOptions = [
        { value: 10, label: '10 per page' },
        { value: 25, label: '25 per page' },
        { value: 50, label: '50 per page' },
        { value: 100, label: '100 per page' },
    ];

    // For schema/grouped views, we need more rows to get enough unique groups
    // Fetch extra rows to ensure we have enough grouped items to display
    // UDPATE: Repository now handles Group-Based Pagination (Two-Step Fetch),
    // so we can request the exact page size.
    const fetchLimit = pageSize;

    // Modal state
    const [editModal, setEditModal] = useState({ isOpen: false, data: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, translation: null });

    // Form State (Shared structure, adapted logic)
    const [formData, setFormData] = useState({
        // Common
        translation_key: '',
        locale_code: '',
        translated_text: '', // Or translated_label
        status: 'published',

        // UI / JSON
        category: 'common',
        source_type: 'ui',

        // Schema
        table_name: '',
        column_name: '',
        translated_description: '',

        // Enum
        enum_name: '',
        enum_value: '',

        // Content
        record_id: '',

        // Bulk Edits (Locale -> Text map)
        translations: {},
    });
    const [formErrors, setFormErrors] = useState({});

    // Formatting helpers
    const formatTableName = (t) => t ? t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

    // ================= DATA FETCHING =================

    // 1. Locales
    const { data: localesData, isLoading: localesLoading, error: localesError } = useAdminLocales();
    const locales = localesData || [];

    // Debug logging
    useEffect(() => {
        console.log('[TranslationsEditor] Locales state:', {
            loading: localesLoading,
            error: localesError,
            dataLength: localesData?.length,
            data: localesData
        });
    }, [localesData, localesLoading, localesError]);

    // 2. Translations (Main List)
    const { data, isLoading, refetch } = useAdminTranslations({
        page,
        limit: fetchLimit,
        search: debouncedSearch,
        locale: localeFilter,
        category: categoryFilter,
        source_type: sourceType,
        table: tableFilter,
        enumName: enumFilter
    });



    // 3. Configurations (Tables, Cols, Enums)
    const { data: settings } = useAdminSettings();

    const configuredTables = useMemo(() => {
        const s = settings?.find(x => x.setting_key === 'TRANSLATABLE_TABLES');
        let val = s?.setting_value;
        if (typeof val === 'string') try { val = JSON.parse(val); } catch { val = []; }
        return Array.isArray(val) ? val : [];
    }, [settings]);

    const configuredEnums = useMemo(() => {
        const s = settings?.find(x => x.setting_key === 'TRANSLATABLE_ENUMS');
        let val = s?.setting_value;
        if (typeof val === 'string') try { val = JSON.parse(val); } catch { val = []; }
        return Array.isArray(val) ? val : [];
    }, [settings]);

    const configuredColumns = useMemo(() => {
        const s = settings?.find(x => x.setting_key === 'TRANSLATABLE_COLUMNS');
        let val = s?.setting_value;
        if (typeof val === 'string') try { val = JSON.parse(val); } catch { val = {}; }
        return typeof val === 'object' && !Array.isArray(val) ? val : {};
    }, [settings]);

    // User-specific translatable tables (for non-admin content translations)
    const userConfiguredTables = useMemo(() => {
        const s = settings?.find(x => x.setting_key === 'USER_TRANSLATABLE_TABLES');
        let val = s?.setting_value;
        if (typeof val === 'string') try { val = JSON.parse(val); } catch { val = {}; }
        return typeof val === 'object' && !Array.isArray(val) ? Object.keys(val) : [];
    }, [settings]);

    const userConfiguredColumns = useMemo(() => {
        const s = settings?.find(x => x.setting_key === 'USER_TRANSLATABLE_COLUMNS');
        let val = s?.setting_value;
        if (typeof val === 'string') try { val = JSON.parse(val); } catch { val = {}; }
        return typeof val === 'object' && !Array.isArray(val) ? val : {};
    }, [settings]);


    // ... hook calls ...
    const deleteTranslation = useDeleteAdminTranslation();
    const generateBundles = useGenerateTranslationBundles();

    // ================= OPTIONS =================

    // Translation Categories
    const { data: categoriesData } = useQuery({
        queryKey: ['admin', 'master-data-values', 'translation_categories'],
        queryFn: () => adminService.getMasterDataValues('translation_categories'),
    });
    const categories = categoriesData || [];

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...categories.map(c => ({
            value: c.value_key,
            label: c.value_label,
            group: c.value_data?.group || null // Include group for grouped dropdown
        }))
    ];

    const localeOptions = [
        { value: '', label: 'All Locales' },
        ...locales.map((l) => ({ value: l.code, label: l.name, countryCode: l.code.includes('-') ? l.code.split('-')[1] : null })),
    ];

    // Options from Configuration
    const tableOptions = [
        { value: '', label: 'Select Table...' },
        ...configuredTables.map(t => ({ value: t, label: formatTableName(t) }))
    ];

    // 4. Database Enums (for Dropdown)
    const { data: dbEnums } = useQuery({
        queryKey: ['admin', 'database-enums'],
        queryFn: () => adminService.getDatabaseEnums(),
    });

    const enumOptions = [
        { value: '', label: 'Select Enum...' },
        ...Array.from(new Set((dbEnums || []).map(e => e.enum_name)))
            .map(name => ({ value: name, label: name }))
    ];

    // Build enum_name -> [enum_values] map
    const enumValueOptions = useMemo(() => {
        if (!dbEnums) return {};
        return dbEnums.reduce((acc, e) => {
            if (!acc[e.enum_name]) acc[e.enum_name] = [];
            if (e.enum_value) acc[e.enum_name].push(e.enum_value);
            return acc;
        }, {});
    }, [dbEnums]);

    // ================= ERROR HANDLING =================
    // Error State Handling
    if (isLoading) return <div className="admin-loading"><Spinner size="lg" /></div>;

    if (data === undefined && !isLoading && sourceType === 'content') {
        // This handles the specific case where the table might not exist yet (400 error)
        // calling refetch would just fail again.
        // We can show a specific empty state or error.
    }

    // ================= HANDLERS =================

    // Open Create
    const openCreateModal = () => {
        setEditModal({ isOpen: true, data: null });
    };

    // Open Edit
    const openEditModal = (item) => {
        // Prepare data for the modal
        let dataToEdit = { ...item };

        // Check if items were pre-passed (from GroupRow/SchemaTranslationList)
        // If so, use them directly instead of recomputing from query result
        if (item.items && item.items.length > 0) {
            dataToEdit.items = item.items;
            dataToEdit.siblings = item.items; // For backward compatibility
        } else {
            // Find siblings for bulk editing (all locales) from current query result
            let siblings = [];
            if (item.source_type === 'ui') {
                siblings = data?.data?.filter(t => t.translation_key === item.translation_key) || [];
            } else if (item.source_type === 'database') {
                siblings = data?.data?.filter(t => t.table_name === item.table_name && t.column_name === item.column_name) || [];
            } else if (item.source_type === 'enum') {
                siblings = data?.data?.filter(t => t.enum_name === item.enum_name && t.enum_value === item.enum_value) || [];
            } else if (item.source_type === 'content') {
                siblings = data?.data?.filter(t => t.table_name === item.table_name && t.record_id === item.record_id) || [];
            }

            // Ensure at least the item itself is in siblings
            if (siblings.length === 0) siblings = [item];

            dataToEdit.siblings = siblings;
            dataToEdit.items = siblings;
        }

        setEditModal({ isOpen: true, data: dataToEdit });
    };

    // Regenerate Bundles
    const handleRegenerate = async () => {
        if (!confirm("This will regenerate all static translation JSON bundles for the frontend. Continue?")) return;
        try {
            await generateBundles.mutateAsync(null); // null = all locales
            alert("Bundles queued for regeneration.");
        } catch (e) {
            alert("Failed: " + e.message);
        }
    };

    // Export (Keep simple for now, just current view)
    const handleExport = () => {
        const jsonString = JSON.stringify(data?.data || [], null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `translations_export.json`;
        a.click();
    };


    // ================= RENDER HELPERS =================

    const getStatusBadge = (s) => (
        <Badge type={s === 'published' ? 'success' : s === 'draft' ? 'warning' : 'neutral'} variant="light" size="s">{s}</Badge>
    );

    // Columns for the generic DataTable (fallback view)
    const columns = [
        {
            id: 'key_info',
            title: 'Key / Source',
            render: (_, row) => {
                if (row.translation_key) return <code>{row.translation_key}</code>;
                if (row.table_name) return <span>{formatTableName(row.table_name)} {row.column_name ? ` > ${formatTableName(row.column_name)}` : ' (Table Limit)'}</span>;
                if (row.enum_name) return <code>{row.enum_name}.{row.enum_value}</code>;
                return '-';
            }
        },
        {
            id: 'locale',
            title: 'Locale',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <CircleFlag countryCode={(row.locale_code || row.locale || '').split('-')[1]} size="s" />
                    <span>{row.locale_code || row.locale}</span>
                </div>
            )
        },
        {
            id: 'value',
            title: 'Translation',
            render: (_, row) => <span className="font-medium">{row.translated_text || row.translated_label}</span>
        },
        {
            id: 'actions',
            title: '',
            render: (_, row) => (
                <Button variant="icon-circle" size="s" onClick={() => openEditModal(row)}><Edit2 size={14} /></Button>
            )
        }
    ];

    if (isLoading) return <div className="admin-loading"><Spinner size="lg" /></div>;

    // Error State
    if (!data && !isLoading) {
        return (
            <div className="admin-translations">
                <div className="admin-header">
                    <h1 className="admin-header__title">Translations</h1>
                </div>
                <div className="admin-filters-row mb-4">
                    {/* Render filters even on error so user can switch back */}
                    <div className="admin-filters-row__toggle flex gap-2 overflow-x-auto pb-2">
                        {sourceTypes.map(t => (
                            <Button
                                key={t.value}
                                variant={sourceType === t.value ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => { setSourceType(t.value); setPage(1); }}
                                leftIcon={<t.icon size={14} />}
                                className={sourceType === t.value ? '' : 'bg-white border-neutral-200'}
                            >
                                {t.label}
                            </Button>
                        ))}
                    </div>
                </div>
                <EmptyState
                    icon={<AlertCircle />}
                    title="Could not load translations"
                    description="There was a problem loading the data. The table might be missing or the server is unreachable."
                    action={<Button onClick={() => refetch()} variant="secondary" leftIcon={<Layers size={14} />}>Retry</Button>}
                />
            </div>
        );
    }

    // Compute proper counts based on view type
    const rawCount = data?.count || 0;
    const displayData = data?.data || [];

    // For grouped views, count unique parent items
    const getGroupCount = useMemo(() => {
        if (sourceType === 'database') {
            // Schema: count unique tables
            const uniqueTables = new Set(displayData.map(t => t.table_name));
            return uniqueTables.size;
        } else if (sourceType === 'ui') {
            // UI: count unique translation keys
            const uniqueKeys = new Set(displayData.map(t => t.translation_key));
            return uniqueKeys.size;
        } else if (sourceType === 'enum') {
            // Enum: count unique enum_name (hierarchical grouping)
            const uniqueEnums = new Set(displayData.map(t => t.enum_name));
            return uniqueEnums.size;
        } else if (sourceType === 'content') {
            // Content: count unique table + record_id pairs
            const uniqueContent = new Set(displayData.map(t => `${t.table_name}::${t.record_id}`));
            return uniqueContent.size;
        } else {
            // All: sum of UI keys + Schema tables + Enum names + Content items
            const uiItems = displayData.filter(t => t.source_type === 'ui');
            const schemaItems = displayData.filter(t => t.source_type === 'database');
            const enumItems = displayData.filter(t => t.source_type === 'enum');
            const contentItems = displayData.filter(t => t.source_type === 'content');

            const uniqueKeys = new Set(uiItems.map(t => t.translation_key));
            const uniqueTables = new Set(schemaItems.map(t => t.table_name));
            const uniqueEnums = new Set(enumItems.map(t => t.enum_name));
            const uniqueContent = new Set(contentItems.map(t => `${t.table_name}::${t.record_id}`));

            return uniqueKeys.size + uniqueTables.size + uniqueEnums.size + uniqueContent.size;
        }
    }, [displayData, sourceType]);

    // All views now use group counting
    const totalCount = getGroupCount;
    const totalPages = Math.ceil(rawCount / fetchLimit); // Use raw count for backend pagination

    return (
        <div className="admin-translations">
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">
                        Translations
                        <Tooltip
                            content={
                                <div style={{ textAlign: 'left', maxWidth: '320px' }}>
                                    <p style={{ marginBottom: '8px' }}><strong>Translation Types:</strong></p>
                                    <p style={{ marginBottom: '6px' }}><strong>UI Strings:</strong> Interface text, buttons, labels, messages. Key-based (e.g., common.save).</p>
                                    <p style={{ marginBottom: '6px' }}><strong>Schema:</strong> Database table/column names for admin displays and dynamic forms.</p>
                                    <p style={{ marginBottom: '6px' }}><strong>Enums:</strong> Enum values like status types, roles, categories.</p>
                                    <p style={{ marginBottom: '6px' }}><strong>Content:</strong> User-generated content from specific records (articles, products).</p>
                                    <p><strong>Master Data:</strong> Dropdown options, categories, and configurable lists.</p>
                                </div>
                            }
                            position="right"
                        >
                            <Info size={18} style={{ marginLeft: '8px', color: 'var(--color-feedback-info)', cursor: 'help', verticalAlign: 'middle' }} />
                        </Tooltip>
                    </h1>
                    <p className="admin-header__subtitle">Manage localized content across the platform</p>
                </div>
                <div className="admin-header__actions">
                    <Button variant="secondary" onClick={handleRegenerate} leftIcon={<Layers size={16} />} loading={generateBundles.isPending}>Regenerate Bundles</Button>
                    <Button variant="secondary" onClick={handleExport} leftIcon={<Download size={16} />}>Export</Button>
                    <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus size={16} />}>Add Translation</Button>
                </div>
            </div>

            {/* Source Filters */}
            <div className="admin-filters-row mb-4">
                <div className="admin-filters-row__toggle flex gap-2 overflow-x-auto pb-2">
                    {sourceTypes.map(t => {
                        const Icon = t.icon;
                        const isActive = sourceType === t.value;
                        return (
                            <Button
                                key={t.value}
                                variant={isActive ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => { setSourceType(t.value); setPage(1); }}
                                leftIcon={<Icon size={14} />}
                                className={isActive ? '' : 'bg-white border-neutral-200'}
                            >
                                {t.label}
                            </Button>
                        );
                    })}
                </div>
            </div>

            <Card variant="elevated">
                <div className="data-table__header translation-table-header p-4 border-b border-neutral-100 flex justify-between items-center flex-wrap gap-4">
                    <h2 className="data-table__title text-lg font-semibold">{totalCount} Item{totalCount !== 1 ? 's' : ''}</h2>

                    <div className="data-table__filters flex gap-3 flex-wrap">
                        {/* Search */}
                        <div className="w-64">
                            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search keys or text..." size="sm" />
                        </div>

                        {/* Locale Filter */}
                        <div className="w-40">
                            <LocaleSelect
                                value={localeFilter}
                                onChange={setLocaleFilter}
                                options={localeOptions}
                                placeholder="Locale..."
                                disabled={localesLoading}
                            />
                        </div>

                        {/* Category Filter (UI Only) */}
                        {(sourceType === '' || sourceType === 'ui') && (
                            <div className="w-48">
                                <Select
                                    value={categoryFilter}
                                    onChange={setCategoryFilter}
                                    options={categoryOptions}
                                    placeholder="Category..."
                                    searchable
                                    grouped
                                />
                            </div>
                        )}

                        {/* Table Filter (Schema/Content) */}
                        {(sourceType === 'database' || sourceType === 'content') && (
                            <div className="w-48">
                                <Select value={tableFilter} onChange={setTableFilter} options={tableOptions} placeholder="Filter by Table..." />
                            </div>
                        )}

                        {/* Enum Filter */}
                        {sourceType === 'enum' && (
                            <div className="w-48">
                                <Select value={enumFilter} onChange={setEnumFilter} options={enumOptions} placeholder="Filter by Enum..." />
                            </div>
                        )}

                        {/* Page Size Selector */}
                        <div className="w-36">
                            <Select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                options={pageSizeOptions}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>

                {data?.data?.length > 0 ? (
                    <AllTranslationsList
                        translations={data.data}
                        locales={locales}
                        onEdit={openEditModal}
                        onDelete={(item) => setDeleteModal({ isOpen: true, translation: item })}
                    />
                ) : (
                    <EmptyState icon={<Languages />} title="No translations found" description="Try adjusting your filters" size="s" />
                )}

                {totalPages > 1 && (
                    <div className="data-table__pagination p-4 border-t border-neutral-100">
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} showInfo totalItems={totalCount} itemsPerPage={pageSize} />
                    </div>
                )}
            </Card>

            {/* EDIT MODAL - Now using Encapsulated Component */}
            <TranslationFormModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, data: null })}
                editData={editModal.data}
                onSuccess={refetch}
                locales={locales}
                categories={categories}
                tableOptions={tableOptions}
                enumOptions={enumOptions}
                enumValueOptions={enumValueOptions}
                configuredColumns={configuredColumns}
                userContext="admin"
                userTableOptions={userConfiguredTables}
                userConfiguredColumns={userConfiguredColumns}
            />

        </div>
    );
};

export default TranslationsEditor;
