import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../services';
import {
    useAdminLocales,
    useAdminTranslations,
    useSaveBatchAdminTranslations,
    useDeleteAdminTranslation,
    useAdminTranslationsByKey,
    useAdminSettings
} from '../../../hooks/admin';
import {
    Button, Input, Select, TextArea, Badge, Spinner, EmptyState, Modal, ConfirmationModal, DataTable,
    SearchInput, Pagination, Card, CircleFlag,
    Languages, Type, Database, Edit2, Trash2, Download, Plus, Save, AlertCircle, FileJson
} from '../../../components/ui';
import LocaleSelect from '../../../components/forms/LocaleSelect';
import GroupedTranslationList from './GroupedTranslationList';

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'needs_review', label: 'Needs Review' },
];

/**
 * Admin Translations Editor - Batch Edit Support
 */
const TranslationsEditor = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [localeFilter, setLocaleFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sourceType, setSourceType] = useState('');
    const limit = 50;

    // Modal state
    const [editModal, setEditModal] = useState({ isOpen: false, data: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, translation: null });

    // Batch Form State
    const [formData, setFormData] = useState({
        translation_key: '',
        category: 'common',
        source_type: 'ui',
        source_table: '',
        source_column: '',
        translations: {}, // { 'en-US': 'Hello', 'pt-PT': 'Olá' }
        status: 'published'
    });
    const [formErrors, setFormErrors] = useState({});

    // Hooks
    const { data: localesData } = useAdminLocales();
    const { data, isLoading, refetch } = useAdminTranslations({ page, limit, search, locale: localeFilter, category: categoryFilter, source_type: sourceType });
    const saveBatchTranslations = useSaveBatchAdminTranslations();
    const deleteTranslation = useDeleteAdminTranslation();

    // Derived Key for pre-fetching
    const potentialKey = useMemo(() => {
        if (!editModal.isOpen) return '';
        if (editModal.data) return ''; // Already editing specific record

        if (formData.source_type === 'database') {
            if (formData.source_table && formData.source_column) {
                return `db.${formData.source_table}.${formData.source_column}`;
            }
        } else {
            return formData.translation_key;
        }
        return '';
    }, [formData.source_type, formData.translation_key, formData.source_table, formData.source_column, editModal.isOpen, editModal.data]);

    // Fetch existing by key
    const { data: existingTranslationsByKey } = useAdminTranslationsByKey(potentialKey);

    // Effect to pre-fill
    useEffect(() => {
        if (existingTranslationsByKey?.data && existingTranslationsByKey.data.length > 0) {
            setFormData(prev => {
                const newTranslations = { ...prev.translations };
                let hasChanges = false;
                existingTranslationsByKey.data.forEach(t => {
                    if (!newTranslations[t.locale_code]) {
                        newTranslations[t.locale_code] = t.translated_text;
                        hasChanges = true;
                    }
                });

                if (hasChanges) {
                    return { ...prev, translations: newTranslations };
                }
                return prev;
            });
        }
    }, [existingTranslationsByKey]);

    // Fetch translation categories
    const { data: categoriesData } = useQuery({
        queryKey: ['admin', 'master-data-values', 'translation_categories'],
        queryFn: () => adminService.getMasterDataValues('translation_categories'),
    });

    // Fetch system_settings
    const { data: settingsData } = useAdminSettings();

    // Get translatable tables and columns from settings
    const getSettingValue = (key) => {
        const setting = settingsData?.find(s => s.setting_key === key);
        if (!setting) return null;
        let value = setting.setting_value;
        if (typeof value === 'string') {
            try { value = JSON.parse(value); } catch { return null; }
        }
        return value;
    };

    const translatableTables = getSettingValue('TRANSLATABLE_TABLES') || [];
    const translatableColumns = getSettingValue('TRANSLATABLE_COLUMNS') || {};

    // Fetch columns for selected table
    const columnsForTable = useMemo(() => {
        if (!formData.source_table) return [];
        if (translatableColumns[formData.source_table]) {
            return translatableColumns[formData.source_table];
        }
        return [];
    }, [formData.source_table, translatableColumns]);

    const translations = data?.data || [];
    const totalCount = data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const locales = localesData || [];

    // Category Options
    const categories = categoriesData || [];
    const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...categories.map(c => ({ value: c.value_key, label: c.value_label }))
    ];

    // Locale Options
    const localeOptions = [
        { value: '', label: 'All Locales' },
        ...locales.map((l) => ({
            value: l.locale,
            label: l.name,
            countryCode: l.locale.includes('-') ? l.locale.split('-')[1] : null
        })),
    ];

    // Table Options
    const tableOptions = [
        { value: '', label: 'Select table...' },
        ...translatableTables.map((t) => ({ value: t, label: t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))
    ];

    // Column Options
    const columnOptions = [
        { value: '', label: 'Select column...' },
        ...columnsForTable.map((c) => ({ value: c, label: c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))
    ];



    const getStatusBadgeType = (status) => {
        switch (status) {
            case 'published': return 'success';
            case 'draft': return 'warning';
            case 'needs_review': return 'error';
            default: return 'neutral';
        }
    };

    // Construct full key
    const getFullKey = (data) => {
        if (data.source_type === 'database') {
            return `db.${data.source_table}.${data.source_column}`;
        }
        return data.translation_key;
    };

    // Validation
    const validateForm = () => {
        const errors = {};
        const key = getFullKey(formData);

        if (!key || key.includes('undefined') || key.endsWith('.')) {
            if (formData.source_type === 'ui' || formData.source_type === 'json_config') errors.translation_key = 'Valid key is required';
            else errors.source_table = 'Table and Column are required';
        }

        // Check if at least one translation is provided
        const hasTranslation = Object.values(formData.translations).some(v => v && v.trim());
        if (!hasTranslation) {
            errors.general = 'Please add at least one translation';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Open create modal
    const openCreateModal = () => {
        setFormData({
            translation_key: '',
            category: 'common',
            source_type: sourceType,
            source_table: '',
            source_column: '',
            translations: {},
            status: 'published'
        });
        setFormErrors({});
        setEditModal({ isOpen: true, data: null });
    };

    // Open edit modal
    const openEditModal = (translation) => {
        // Find sibling translations (same key)
        const siblingTranslations = translations.filter(t => t.translation_key === translation.translation_key);

        // Build translations map
        const translationsMap = {};
        siblingTranslations.forEach(t => {
            translationsMap[t.locale_code] = t.translated_text;
        });

        // Deconstruct key if database type
        let source_table = '';
        let source_column = '';
        if (translation.source_type === 'database') {
            const parts = translation.translation_key.split('.');
            if (parts.length >= 3) {
                source_table = parts[1];
                source_column = parts[2];
            }
        }

        setFormData({
            translation_key: translation.translation_key,
            category: translation.category || 'common',
            source_type: translation.source_type || 'ui',
            source_table: translation.source_table || source_table,
            source_column: translation.source_column || source_column,
            translations: translationsMap,
            status: translation.status || 'draft'
        });
        setFormErrors({});
        setEditModal({ isOpen: true, data: translation });
    };

    // Save Batch
    const handleSave = async () => {
        setFormErrors({});
        if (!validateForm()) {
            // Ensure internal validation errors are visible
            return;
        }

        try {
            const finalKey = getFullKey(formData);

            // Prepare batch array
            const batchToSave = Object.entries(formData.translations)
                .filter(([_, text]) => text && text.trim()) // Only save non-empty
                .map(([locale, text]) => ({
                    translation_key: finalKey,
                    locale_code: locale,
                    translated_text: text,
                    status: formData.status,
                    category: formData.source_type === 'database' ? '' : formData.category, // Clear category for database? Or keep 'common'?
                    source_type: formData.source_type,
                    source_table: formData.source_type === 'database' ? formData.source_table : null,
                    source_column: formData.source_type === 'database' ? formData.source_column : null,
                }));

            if (batchToSave.length === 0) {
                setFormErrors({ general: 'No translations content to save.' });
                return;
            }

            await saveBatchTranslations.mutateAsync(batchToSave);

            setEditModal({ isOpen: false, data: null });
            refetch();
        } catch (err) {
            console.error('Save error:', err);
            setFormErrors({ submit: err.message || 'Failed to save translations. Please check your network or inputs.' });
        }
    };

    // Delete
    const handleDelete = async () => {
        if (!deleteModal.translation) return;
        try {
            await deleteTranslation.mutateAsync(deleteModal.translation.id);
            setDeleteModal({ isOpen: false, translation: null });
            refetch();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    // Export
    const handleExport = () => {
        const exportData = translations.reduce((acc, t) => {
            if (!acc[t.locale_code]) acc[t.locale_code] = {};
            acc[t.locale_code][t.translation_key] = t.translated_text;
            return acc;
        }, {});

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `translations_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const tableColumns = [
        {
            id: 'translation_key',
            title: 'Key',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-2">
                    {row.source_type === 'json_config' && <FileJson size={14} className="text-neutral-500" />}
                    {row.source_type === 'ui' && <Type size={14} className="text-neutral-500" />}
                    {row.source_type === 'database' && <Database size={14} className="text-neutral-500" />}
                    <code>{value}</code>
                </div>
            )
        },
        {
            id: 'locale_code',
            title: 'Locale',
            sortable: true,
            render: (value) => {
                const countryCode = value && value.includes('-') ? value.split('-')[1] : null;
                return (
                    <div className="flex items-center gap-2">
                        <CircleFlag countryCode={countryCode} size="s" />
                        <span>{value}</span>
                    </div>
                );
            }
        },
        { id: 'translated_text', title: 'Value', sortable: false, render: (value) => <span className="data-table__truncate">{value}</span> },
        { id: 'category', title: 'Category', sortable: true, render: (value) => value || '-' },
        { id: 'status', title: 'Status', sortable: true, render: (value) => <Badge type={getStatusBadgeType(value)} variant="light" size="s">{value}</Badge> },
        {
            id: 'actions', title: 'Actions', sortable: false,
            render: (_, row) => (
                <div className="data-table__actions">
                    <Button variant="icon-circle" size="s" onClick={() => openEditModal(row)} title="Edit"><Edit2 size={14} /></Button>
                    <Button variant="icon-circle" size="s" onClick={() => setDeleteModal({ isOpen: true, translation: row })} title="Delete"><Trash2 size={14} /></Button>
                </div>
            )
        }
    ];

    if (isLoading) return <div className="admin-loading"><Spinner size="lg" /></div>;

    return (
        <div className="admin-translations">
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Translations</h1>
                    <p className="admin-header__subtitle">Manage UI and database translations</p>
                </div>
                <div className="admin-header__actions">
                    <Button variant="secondary" onClick={handleExport} leftIcon={<Download size={16} />}>Export</Button>
                    <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus size={16} />}>Add Translation</Button>
                </div>
            </div>

            <div className="admin-filters-row">
                <div className="admin-filters-row__toggle">
                    <Button variant={sourceType === '' ? 'primary' : 'secondary'} size="sm" onClick={() => { setSourceType(''); setPage(1); }} leftIcon={<Languages size={14} />}>All</Button>
                    <Button variant={sourceType === 'ui' ? 'primary' : 'secondary'} size="sm" onClick={() => { setSourceType('ui'); setPage(1); }} leftIcon={<Type size={14} />}>UI Strings</Button>
                    <Button variant={sourceType === 'database' ? 'primary' : 'secondary'} size="sm" onClick={() => { setSourceType('database'); setPage(1); }} leftIcon={<Database size={14} />}>Database</Button>
                </div>
            </div>

            <Card variant="elevated">
                <div className="data-table__header translation-table-header">
                    <h2 className="data-table__title">{totalCount} Translations</h2>
                    <div className="data-table__filters translation-table-filters">
                        <div className="filter-w-180">
                            <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} onClear={() => { setSearch(''); setPage(1); }} placeholder="Search..." size="sm" />
                        </div>
                        <div className="filter-w-200">
                            <LocaleSelect value={localeFilter} onChange={(value) => { setLocaleFilter(value); setPage(1); }} options={localeOptions} placeholder="Locale..." />
                        </div>
                        <div className="filter-w-200">
                            <Select value={categoryFilter} onChange={(value) => { setCategoryFilter(value); setPage(1); }} options={categoryOptions} placeholder="Category..." />
                        </div>
                    </div>
                </div>

                {translations.length > 0 ? (
                    <>
                        {sourceType === 'database' || sourceType === '' ? (
                            <GroupedTranslationList
                                translations={translations}
                                locales={locales}
                                onEdit={openEditModal}
                                onDelete={(item) => setDeleteModal({ isOpen: true, translation: item })}
                            />
                        ) : (
                            <DataTable columns={tableColumns} data={translations} pagination={false} />
                        )}
                        {totalPages > 1 && (
                            <div className="data-table__pagination">
                                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} showInfo totalItems={totalCount} itemsPerPage={limit} />
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState icon={<Languages />} title="No translations found" description="Add a new translation to get started" size="s" />
                )}
            </Card>

            {/* Batch Edit Modal */}
            <Modal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, data: null })} title={editModal.data ? 'Edit Translation' : 'Add Translation'} size="lg">
                <div className="admin-edit-form">
                    {/* Header Errors */}
                    {formErrors.submit && <div className="admin-field-error margin-bottom-4">{formErrors.submit}</div>}
                    {formErrors.general && <div className="admin-field-error margin-bottom-4"><AlertCircle size={14} className="margin-right-1 display-inline" />{formErrors.general}</div>}

                    {/* Meta Section */}
                    <div className="admin-meta-section">
                        <div className="admin-form-field margin-bottom-4">
                            <div className="admin-form-field__row">
                                <Button variant={formData.source_type === 'ui' ? 'primary' : 'secondary'} size="sm" onClick={() => setFormData({ ...formData, source_type: 'ui', source_table: '', source_column: '' })} disabled={!!editModal.data} leftIcon={<Type size={14} />}>UI String</Button>
                                <Button variant={formData.source_type === 'database' ? 'primary' : 'secondary'} size="sm" onClick={() => setFormData({ ...formData, source_type: 'database', translation_key: '' })} disabled={!!editModal.data} leftIcon={<Database size={14} />}>Database Field</Button>
                            </div>
                        </div>

                        {formData.source_type === 'ui' || formData.source_type === 'json_config' ? (
                            <div className="admin-form-grid-3">
                                <div className="admin-form-field margin-bottom-0">
                                    <Input
                                        label={formData.source_type === 'json_config' ? 'JSON Key' : 'Translation Key'}
                                        value={formData.translation_key}
                                        onChange={(e) => setFormData({ ...formData, translation_key: e.target.value })}
                                        placeholder={formData.source_type === 'json_config' ? 'config.key' : 'common.save'}
                                        disabled={!!editModal.data}
                                        fullWidth
                                        error={!!formErrors.translation_key}
                                    />
                                </div>
                                <div className="admin-form-field margin-bottom-0">
                                    <Select label="Category" value={formData.category} onChange={(value) => setFormData({ ...formData, category: value })} options={categoryOptions.filter(c => c.value !== '')} fullWidth />
                                </div>
                                <div className="admin-form-field margin-bottom-0">
                                    <Select label="Status" value={formData.status} onChange={(value) => setFormData({ ...formData, status: value })} options={statusOptions} fullWidth />
                                </div>
                            </div>
                        ) : (
                            <div className="admin-form-grid-3">
                                <div className="admin-form-field margin-bottom-0">
                                    <Select label="Table" value={formData.source_table} onChange={(value) => setFormData({ ...formData, source_table: value, source_column: '' })} options={tableOptions} fullWidth />
                                </div>
                                <div className="admin-form-field margin-bottom-0">
                                    <Select label="Column" value={formData.source_column} onChange={(value) => setFormData({ ...formData, source_column: value })} options={columnOptions} fullWidth disabled={!formData.source_table} />
                                </div>
                                <div className="admin-form-field margin-bottom-0">
                                    <Select label="Status" value={formData.status} onChange={(value) => setFormData({ ...formData, status: value })} options={statusOptions} fullWidth />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Translations List */}
                    <div className="admin-form-field">
                        <div className="translation-list-header">
                            <span className="form-label">Translations</span>
                            <span className="translation-list-hint">Fill at least one</span>
                        </div>
                        <div className="translation-list-body">
                            {locales.map(locale => {
                                const countryCode = locale.locale?.split('-')[1];

                                return (
                                    <div key={locale.locale} className="translation-row">
                                        <div className="translation-locale-info">
                                            <CircleFlag countryCode={countryCode} />
                                            <div className="translation-locale-text">
                                                <span className="translation-locale-name">{locale.name}</span>
                                                <span className="translation-locale-code">{locale.locale}</span>
                                            </div>
                                        </div>
                                        <div className="translation-input-wrapper">
                                            <TextArea
                                                value={formData.translations[locale.locale] || ''}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    translations: { ...prev.translations, [locale.locale]: e.target.value }
                                                }))}
                                                placeholder={`Translation for ${locale.name}...`}
                                                fullWidth
                                                rows={1}
                                                className="translation-textarea"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="admin-edit-form__actions">
                    <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, data: null })}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} loading={saveBatchTranslations.isPending} leftIcon={<Save size={16} />}>Save All Changes</Button>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, translation: null })}
                onConfirm={handleDelete}
                title="Delete Translation"
                message={deleteModal.translation ? `Delete logic for "${deleteModal.translation.translation_key}" (${deleteModal.translation.locale_code})?` : ''}
                confirmText="Delete"
                variant="danger"
                loading={deleteTranslation.isPending}
            />
        </div>
    );
};

export default TranslationsEditor;
