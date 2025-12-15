import React, { useState, useEffect, useMemo } from 'react';
import {
    Modal, Button, Input, Select, TextArea, Badge,
    Save, CircleFlag
} from '../../../components/ui';
import LocaleSelect from '../../../components/forms/LocaleSelect';
import { MasterDataTypeSelect, MasterDataValueSelect } from '../../../components/forms';
import {
    useSaveBatchAdminTranslations,
    useSaveAdminSchemaTranslation,
    useSaveAdminEnumTranslation,
    useSaveAdminContentTranslation,
    useSaveAdminMasterDataTranslation,
    useAdminTableRecords,
    useAdminMasterDataTypes,
    useAdminMasterDataValues
} from '../../../hooks/admin';
import { useToast } from '../../../contexts/ToastProvider';
import { SOURCE_TYPES } from './translationsConfig';
import { toTitleCase, getRecordLabel } from '../../../utils';

// Helper for rendering list of inputs per locale with optional filter
const TranslationsList = ({
    locales,
    allLocales, // All locales for the filter dropdown
    translations,
    onChange,
    isTextArea = false,
    localeFilter = '',
    setLocaleFilter = () => { }
}) => {
    // Convert locales to LocaleSelect options format
    const localeOptions = React.useMemo(() => {
        return [
            { value: '', label: `All Languages (${allLocales?.length || 0})`, countryCode: null },
            ...(allLocales || []).map(l => ({
                value: l.code,
                label: l.name,
                countryCode: l.code.includes('-') ? l.code.split('-')[1] : null
            }))
        ];
    }, [allLocales]);

    // Count filled translations
    const filledCount = Object.values(translations).filter(t => t && t.trim()).length;

    return (
        <div className="flex flex-col gap-4 mt-8 pt-6 border-t">
            <div className="flex items-center gap-4 mb-4">
                <h4
                    className="font-semibold flex items-center gap-2 flex-1"
                    style={{
                        fontSize: 'var(--font-size-title-s)',
                        lineHeight: 'var(--line-height-title-s)',
                        letterSpacing: 'var(--letter-spacing-title-s)'
                    }}
                >
                    Translations
                    <Badge type="neutral" size="s" variant="light">{filledCount}/{locales.length}</Badge>
                </h4>
                <div className="flex-shrink-0 ml-auto">
                    <LocaleSelect
                        value={localeFilter}
                        onChange={setLocaleFilter}
                        options={localeOptions}
                        placeholder="All Languages"
                    />
                </div>
            </div>
            {locales.map(l => (
                <div key={l.code} className="flex gap-4 items-center">
                    <div className="w-36 flex items-center gap-2 flex-shrink-0">
                        <CircleFlag countryCode={l.code.includes('-') ? l.code.split('-')[1] : null} size="s" />
                        <span className="text-sm">{l.name}</span>
                    </div>
                    <TextArea
                        value={translations[l.code] || ''}
                        onChange={e => onChange(l.code, e.target.value)}
                        rows={isTextArea ? 3 : 1}
                        className="flex-1 textarea--compact textarea--no-padding"
                        placeholder="..."
                    />
                </div>
            ))}
            {locales.length === 0 && (
                <p className="text-sm text-neutral-500 italic">No locales match the filter.</p>
            )}
        </div>
    );
};


const TranslationFormModal = ({
    isOpen,
    onClose,
    editData,
    refreshTranslations,
    categories = [],
    locales = [],
    configuredColumns = {},
    tableOptions = [],
    enumOptions = [],
    enumValueOptions = {},
    // Multi-tenancy support
    userContext = 'admin', // 'admin' | 'user'
    userTableOptions = [], // Tables users can translate (array of table names)
    userConfiguredColumns = {} // Columns per table that users can translate
}) => {
    // Compute effective table options for Content translations based on context
    const contentTableOptions = useMemo(() => {
        if (userContext === 'admin') {
            // Admins see all tables
            return tableOptions;
        }
        // Users only see user-translatable tables
        return [
            { value: '', label: 'Select Table...' },
            ...userTableOptions.map(t => ({
                value: t,
                label: t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            }))
        ];
    }, [userContext, tableOptions, userTableOptions]);

    // Compute effective columns based on context
    const effectiveConfiguredColumns = useMemo(() => {
        if (userContext === 'admin') {
            return configuredColumns;
        }
        return userConfiguredColumns;
    }, [userContext, configuredColumns, userConfiguredColumns]);
    const [formData, setFormData] = useState({
        translation_key: 'common.',
        category: 'common',
        source_type: 'ui',
        table_name: '',
        column_name: '',
        translated_description: '',
        enum_name: '',
        enum_value: '',
        translations: {},
        status: 'published',
        record_id: '',
        // Master Data fields
        master_data_type_key: '',
        master_data_value_key: '',
        translation_target: 'type' // 'type' or 'value'
    });
    const [formErrors, setFormErrors] = useState({});
    const [localeFilter, setLocaleFilter] = useState(''); // Filter which locales to show

    const saveBatchTranslations = useSaveBatchAdminTranslations();
    const saveSchemaTranslation = useSaveAdminSchemaTranslation();
    const saveEnumTranslation = useSaveAdminEnumTranslation();
    const saveContentTranslation = useSaveAdminContentTranslation();
    const saveMasterDataTranslation = useSaveAdminMasterDataTranslation();

    // Fetch records for Content Translation selector
    const { data: tableRecords } = useAdminTableRecords(
        formData.source_type === 'content' ? formData.table_name : null,
        { limit: 100 }
    );

    const recordOptions = useMemo(() => {
        if (!tableRecords) return [];
        return [
            { value: '', label: 'Select Record...' },
            ...tableRecords.map(r => ({
                value: r.id,
                label: getRecordLabel(r)
            }))
        ];
    }, [tableRecords]);

    // Filter locales if user selects a specific one
    const filteredLocales = useMemo(() => {
        if (!localeFilter) return locales; // Show all if no filter
        return locales.filter(l => l.code === localeFilter);
    }, [locales, localeFilter]);

    const isSaving = saveBatchTranslations.isPending || saveSchemaTranslation.isPending || saveEnumTranslation.isPending || saveContentTranslation.isPending || saveMasterDataTranslation.isPending;
    const { showToast } = useToast();

    const onSuccess = () => {
        if (refreshTranslations) refreshTranslations();
    };

    useEffect(() => {
        if (isOpen && editData) {
            const type = editData.source_type || (editData.table_name || editData.source_table ? 'database' : editData.enum_name ? 'enum' : 'ui');
            const newForm = {
                id: editData.id,
                source_type: type,
                status: editData.status || 'published',
                translations: {},

                // UI
                translation_key: editData.translation_key,
                category: editData.category,

                // Schema / Content
                table_name: editData.table_name || editData.source_table,
                column_name: editData.column_name || editData.source_column,
                translated_description: editData.translated_description,
                record_id: editData.record_id,

                // Enum
                enum_name: editData.enum_name,
                enum_value: editData.enum_value,
            };

            // Load siblings into translations map
            if (editData.siblings && editData.siblings.length > 0) {
                editData.siblings.forEach(s => {
                    const val = s.translated_text || s.translated_label || s.translated_content;
                    if (s.locale_code) newForm.translations[s.locale_code] = val;
                    else if (s.locale) newForm.translations[s.locale] = val;
                });
            } else if (editData.items && editData.items.length > 0) {
                // Handle Grouped Items (from Schema/Enum Lists)
                editData.items.forEach(s => {
                    const val = s.translated_text || s.translated_label || s.translated_content;
                    const loc = s.locale_code || s.locale;
                    if (loc) newForm.translations[loc] = val;
                });
            } else {
                // Fallback to single item
                const loc = editData.locale_code || editData.locale;
                const val = editData.translated_text || editData.translated_label || editData.translated_content;
                if (loc) newForm.translations[loc] = val;
            }

            setFormData(newForm);
        } else if (isOpen) {
            // Create Mode
            setFormData({
                translation_key: '',
                category: 'common',
                source_type: 'ui',
                table_name: '',
                column_name: '',
                translated_description: '',
                enum_name: '',
                enum_value: '',
                translations: {},
                status: 'published',
                record_id: ''
            });
        }
        setFormErrors({});
    }, [isOpen, editData]);


    const handleSave = async () => {
        setFormErrors({});
        try {
            const type = formData.source_type;

            // 1. UI Translations (Batch)
            if (type === 'ui') {
                if (!formData.translation_key) throw new Error("Key is required");

                const batch = Object.entries(formData.translations)
                    .filter(([_, text]) => text && text.trim())
                    .map(([loc, text]) => ({
                        translation_key: formData.translation_key,
                        locale_code: loc,
                        translated_text: text,
                        category: formData.category,
                        source_type: type,
                        status: formData.status
                    }));

                if (batch.length === 0) throw new Error("At least one translation is required");
                await saveBatchTranslations.mutateAsync(batch);
            }

            // 2. Schema Translation (Batch via Loop)
            else if (type === 'database') {
                if (!formData.table_name) throw new Error("Table is required");
                if (!formData.column_name) throw new Error("Column is required");
                const promises = Object.entries(formData.translations).map(([locale, text]) => {
                    if (!text) return Promise.resolve();
                    // Find existing ID from items/siblings
                    const sibling = editData?.items?.find(s => (s.locale_code === locale || s.locale === locale)) ||
                        editData?.siblings?.find(s => (s.locale_code === locale || s.locale === locale));

                    return saveSchemaTranslation.mutateAsync({
                        id: sibling?.id,
                        table_name: formData.table_name,
                        column_name: formData.column_name,
                        locale_code: locale,
                        translated_label: text,
                        translated_description: formData.translated_description,
                        status: formData.status
                    });
                });
                await Promise.all(promises);
            }

            // 3. Enum Translation (Batch via Loop)
            else if (type === 'enum') {
                if (!formData.enum_name || !formData.enum_value) throw new Error("Enum Name and Value are required");
                const promises = Object.entries(formData.translations).map(([locale, text]) => {
                    if (!text) return Promise.resolve();
                    const sibling = editData?.siblings?.find(s => (s.locale_code === locale || s.locale === locale));
                    return saveEnumTranslation.mutateAsync({
                        id: sibling?.id,
                        enum_name: formData.enum_name,
                        enum_value: formData.enum_value,
                        locale: locale,
                        translated_label: text
                    });
                });
                await Promise.all(promises);
            }

            // 4. Content Translation (Batch via Loop)
            else if (type === 'content') {
                if (!formData.table_name || !formData.column_name || !formData.record_id) throw new Error("Table, Column, and Record ID are required");
                const promises = Object.entries(formData.translations).map(([locale, text]) => {
                    if (!text) return Promise.resolve();
                    const sibling = editData?.siblings?.find(s => (s.locale_code === locale || s.locale === locale));
                    return saveContentTranslation.mutateAsync({
                        id: sibling?.id,
                        table_name: formData.table_name,
                        column_name: formData.column_name,
                        record_id: formData.record_id,
                        locale: locale,
                        translated_content: text
                    });
                });
                await Promise.all(promises);
            }

            // 5. Master Data Translation (Batch via Loop)
            else if (type === 'master_data') {
                const target = formData.translation_target;
                if (target === 'value' && !formData.master_data_value_key) throw new Error("Value is required");
                if (target === 'type' && !formData.master_data_type_key) throw new Error("Type is required");

                const promises = Object.entries(formData.translations).map(([locale, text]) => {
                    if (!text) return Promise.resolve();
                    const sibling = editData?.siblings?.find(s => (s.locale_code === locale || s.locale === locale));
                    return saveMasterDataTranslation.mutateAsync({
                        id: sibling?.id,
                        master_data_type_id: target === 'type' ? formData.master_data_type_key : null,
                        master_data_value_id: target === 'value' ? formData.master_data_value_key : null,
                        translation_target: target,
                        locale_code: locale,
                        translated_label: text,
                        translated_description: formData.translated_description,
                        status: formData.status
                    });
                });
                await Promise.all(promises);
            }

            onSuccess();
            showToast('Translation saved successfully!', 'success');
            onClose();
        } catch (err) {
            setFormErrors({ submit: err.message });
            showToast(`Error: ${err.message}`, 'error');
        }
    };

    const categoryOpts = [
        { value: '', label: 'Select Category...' },
        ...categories.map(c => ({
            value: c.value_key,
            label: c.value_label,
            group: c.value_data?.group || null
        }))
    ];

    const localeOpts = [
        { value: '', label: 'Select Locale' },
        ...locales.map((l) => ({ value: l.code, label: l.name, countryCode: l.code.includes('-') ? l.code.split('-')[1] : null })),
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editData ? 'Edit Translation' : 'New Translation'}
            size="md"
            scrollableBody
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} leftIcon={<Save size={16} />} loading={isSaving}>Save Changes</Button>
                </>
            }
        >
            <div className="admin-edit-form space-y-4">

                {/* Source Selector (Only for New) */}
                {!editData && (
                    <div className="mb-6">
                        <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg inline-flex">
                            {SOURCE_TYPES.filter(t => t.value !== '').map(t => {
                                const Icon = t.icon;
                                const isActive = formData.source_type === t.value;
                                return (
                                    <Button
                                        key={t.value}
                                        onClick={() => setFormData(prev => ({ ...prev, source_type: t.value }))}
                                        variant={isActive ? 'primary' : 'ghost'}
                                        size="sm"
                                        className={`
                                            flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                                            ${!isActive && 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50'}
                                        `}
                                        leftIcon={<Icon size={14} />}
                                    >
                                        {t.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* UI FORM */}
                {(formData.source_type === 'ui') && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Key"
                                value={formData.translation_key}
                                onChange={e => {
                                    const val = e.target.value;
                                    setFormData({ ...formData, translation_key: val });

                                    // Extract category from key if it has dot notation
                                    if (val.includes('.')) {
                                        const category = val.split('.')[0];
                                        if (categoryOpts.some(c => c.value === category)) {
                                            setFormData(prev => ({ ...prev, category, translation_key: val }));
                                        }
                                    }
                                }}
                                disabled={!!editData}
                                placeholder="e.g. common.submit"
                            />
                            <Select
                                label="Category"
                                value={formData.category}
                                onChange={val => {
                                    // Update category and modify translation_key to match
                                    const currentKey = formData.translation_key;
                                    let newKey = currentKey;

                                    if (currentKey.includes('.')) {
                                        // Replace old category with new one
                                        const parts = currentKey.split('.');
                                        parts[0] = val;
                                        newKey = parts.join('.');
                                    } else if (currentKey) {
                                        // Add category prefix if key exists but no category
                                        newKey = `${val}.${currentKey}`;
                                    } else {
                                        // Just set the category prefix
                                        newKey = `${val}.`;
                                    }

                                    setFormData({ ...formData, category: val, translation_key: newKey });
                                }}
                                options={categoryOpts.filter(c => c.value)}
                                searchable
                                grouped
                            />
                        </div>
                        <div className="flex gap-2 mb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const englishLocales = locales.filter(l => l.language_code === 'en' || l.code?.startsWith('en-'));
                                    const newTranslations = { ...formData.translations };
                                    // Get last part of key for readable default (e.g., "common.submit" → "submit")
                                    const keyParts = formData.translation_key?.split('.') || [];
                                    const defaultText = keyParts.length > 1 ? keyParts[keyParts.length - 1].replace(/_/g, ' ') : formData.translation_key || '';
                                    englishLocales.forEach(locale => {
                                        newTranslations[locale.code] = defaultText;
                                    });
                                    setFormData(prev => ({ ...prev, translations: newTranslations }));
                                }}
                                className="text-xs"
                            >
                                Auto-fill English Locales
                            </Button>
                        </div>
                        <TranslationsList
                            locales={filteredLocales}
                            allLocales={locales}
                            localeFilter={localeFilter}
                            setLocaleFilter={setLocaleFilter}
                            translations={formData.translations}
                            onChange={(loc, val) => setFormData(prev => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
                        />
                    </>
                )}

                {/* SCHEMA FORM */}
                {formData.source_type === 'database' && (
                    <>
                        {/* In Edit mode, show read-only header instead of dropdowns */}
                        {editData ? (
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                                <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Editing Schema Translation</div>
                                <div className="font-medium text-neutral-900">
                                    {toTitleCase(formData.table_name)} → {toTitleCase(formData.column_name)}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Table"
                                        value={formData.table_name}
                                        onChange={val => setFormData({ ...formData, table_name: val, column_name: '' })}
                                        options={tableOptions}
                                    />
                                    <Select
                                        label="Column"
                                        value={formData.column_name || ''}
                                        onChange={val => setFormData({ ...formData, column_name: val })}
                                        options={[
                                            { value: '', label: 'Select Column...' },
                                            ...(configuredColumns[formData.table_name] || []).map(c => ({ value: c, label: toTitleCase(c) }))
                                        ]}
                                        disabled={!formData.table_name}
                                    />
                                </div>
                                {/* Warning when table selected but no columns configured */}
                                {formData.table_name && (!configuredColumns[formData.table_name] || configuredColumns[formData.table_name].length === 0) && (
                                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                                        No columns configured for "{toTitleCase(formData.table_name)}".
                                        Add columns via Admin → Configuration → TRANSLATABLE_COLUMNS setting.
                                    </div>
                                )}
                            </>
                        )}
                        {/* Only show translations after both dropdowns are filled OR in edit mode */}
                        {(editData || (formData.table_name && formData.column_name)) && (
                            <TranslationsList
                                locales={filteredLocales}
                                allLocales={locales}
                                localeFilter={localeFilter}
                                setLocaleFilter={setLocaleFilter}
                                translations={formData.translations}
                                onChange={(loc, val) => setFormData(prev => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
                            />
                        )}
                    </>
                )}

                {/* ENUM FORM */}
                {formData.source_type === 'enum' && (
                    <>
                        {/* In Edit mode, show read-only header instead of dropdowns */}
                        {editData ? (
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                                <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Editing Enum Translation</div>
                                <div className="font-medium text-neutral-900">
                                    {formData.enum_name} → {toTitleCase(formData.enum_value)}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Enum Name"
                                    value={formData.enum_name}
                                    onChange={val => setFormData({ ...formData, enum_name: val, enum_value: '' })}
                                    options={enumOptions}
                                />
                                <Select
                                    label="Enum Value"
                                    value={formData.enum_value || ''}
                                    onChange={val => setFormData({ ...formData, enum_value: val })}
                                    options={[
                                        { value: '', label: 'Select Value...' },
                                        ...(enumValueOptions[formData.enum_name] || []).map(v => ({ value: v, label: toTitleCase(v) }))
                                    ]}
                                    disabled={!formData.enum_name}
                                />
                            </div>
                        )}
                        {/* Only show translations after both dropdowns are filled OR in edit mode */}
                        {(editData || (formData.enum_name && formData.enum_value)) && (
                            <TranslationsList
                                locales={filteredLocales}
                                allLocales={locales}
                                localeFilter={localeFilter}
                                setLocaleFilter={setLocaleFilter}
                                translations={formData.translations}
                                onChange={(loc, val) => setFormData(prev => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
                            />
                        )}
                    </>
                )}

                {/* CONTENT FORM */}
                {formData.source_type === 'content' && (
                    <>
                        {/* In Edit mode, show read-only header */}
                        {editData ? (
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                                <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Editing Content Translation</div>
                                <div className="font-medium text-neutral-900">
                                    {toTitleCase(formData.table_name)} → {toTitleCase(formData.column_name)}
                                </div>
                                {formData.record_id && (
                                    <div className="text-sm text-neutral-500 mt-1">Record ID: {formData.record_id}</div>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-neutral-500 mb-3">
                                    Translate specific database content. Select a table, column, then choose which record to translate.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Table"
                                        value={formData.table_name}
                                        onChange={val => setFormData({ ...formData, table_name: val, column_name: '', record_id: '' })}
                                        options={contentTableOptions}
                                    />
                                    <Select
                                        label="Column"
                                        value={formData.column_name || ''}
                                        onChange={val => setFormData({ ...formData, column_name: val, record_id: '' })}
                                        options={[
                                            { value: '', label: 'Select Column...' },
                                            ...(effectiveConfiguredColumns[formData.table_name] || []).map(c => ({ value: c, label: toTitleCase(c) }))
                                        ]}
                                        disabled={!formData.table_name}
                                    />
                                </div>
                                <div className="mt-4">
                                    <Select
                                        label="Record to Translate"
                                        value={formData.record_id}
                                        onChange={val => setFormData({ ...formData, record_id: val })}
                                        options={recordOptions}
                                        disabled={!formData.table_name || !formData.column_name}
                                        placeholder="Select which record's content to translate"
                                    />
                                </div>
                            </>
                        )}
                        {/* Only show translations after all selections are made OR in edit mode */}
                        {(editData || (formData.table_name && formData.column_name && formData.record_id)) && (
                            <TranslationsList
                                locales={filteredLocales}
                                allLocales={locales}
                                localeFilter={localeFilter}
                                setLocaleFilter={setLocaleFilter}
                                translations={formData.translations}
                                onChange={(loc, val) => setFormData(prev => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
                                isTextArea
                            />
                        )}
                    </>
                )}

                {/* MASTER DATA FORM */}
                {formData.source_type === 'master_data' && (
                    <>
                        {editData ? (
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                                <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Editing Master Data Translation</div>
                                <div className="font-medium text-neutral-900">
                                    {formData.translation_target === 'type' ? 'Type' : 'Value'}: {toTitleCase(formData.master_data_type_key || formData.master_data_value_key)}
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-neutral-500 mb-3">
                                    Translate master data types or values. Select whether you're translating a type or a specific value.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <Select
                                        label="Translation Target"
                                        value={formData.translation_target}
                                        onChange={val => setFormData({
                                            ...formData,
                                            translation_target: val,
                                            master_data_type_key: '',
                                            master_data_value_key: ''
                                        })}
                                        options={[
                                            { value: 'type', label: 'Master Data Type' },
                                            { value: 'value', label: 'Master Data Value' }
                                        ]}
                                    />
                                </div>
                                {formData.translation_target === 'type' && (
                                    <MasterDataTypeSelect
                                        value={formData.master_data_type_key}
                                        onChange={val => setFormData({ ...formData, master_data_type_key: val })}
                                        useId={true}
                                    />
                                )}
                                {formData.translation_target === 'value' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <MasterDataTypeSelect
                                            value={formData.master_data_type_key}
                                            onChange={val => setFormData({
                                                ...formData,
                                                master_data_type_key: val,
                                                master_data_value_key: ''
                                            })}
                                            label="Select Type First"
                                        />
                                        <MasterDataValueSelect
                                            typeKey={formData.master_data_type_key}
                                            value={formData.master_data_value_key}
                                            onChange={val => setFormData({ ...formData, master_data_value_key: val })}
                                            useId={true}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                        {/* Show translations after selection */}
                        {(editData || (formData.translation_target === 'type' && formData.master_data_type_key) ||
                            (formData.translation_target === 'value' && formData.master_data_value_key)) && (
                                <TranslationsList
                                    locales={filteredLocales}
                                    allLocales={locales}
                                    localeFilter={localeFilter}
                                    setLocaleFilter={setLocaleFilter}
                                    translations={formData.translations}
                                    onChange={(loc, val) => setFormData(prev => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
                                />
                            )}
                    </>
                )}

            </div>
        </Modal>
    );
};

export default TranslationFormModal;
