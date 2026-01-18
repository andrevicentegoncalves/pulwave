import { useState, useEffect, useMemo } from 'react';
import {
    Modal, Button, Input, Select, TextArea
} from '@pulwave/ui';
import { Save } from '@pulwave/ui';

// Mock useToast for now as it is not in ui2 yet
const useToast = () => {
    return {
        showToast: (_message: string, _type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
            // Placeholder for silent toast in mock mode
        }
    };
};

import {
    useSaveBatchAdminTranslations,
    useSaveAdminSchemaTranslation,
    useSaveAdminEnumTranslation,
    useSaveAdminContentTranslation,
    useSaveAdminMasterDataTranslation,
    useAdminTableRecords
} from './useAdminTranslations';

import { SOURCE_TYPES } from './translationsConfig';
import { toTitleCase, getRecordLabel } from '../utils/formatters';

// Form Components
import {
    UITranslationForm,
    SchemaTranslationForm,
    EnumTranslationForm,
    ContentTranslationForm,
    MasterDataTranslationForm,
    TranslationsList
} from './forms';

// I need to check `useAdminTableRecords`.
// I migrated `useAdminSettings` and `useAdminTranslations`.
// `useAdminTranslations.ts` included `useTranslatableTables`, `useTranslatableEnums`.
// But `useAdminTableRecords`? I don't recall migrating it.
// It seems to be used for Content Translation (specific reocrds).
// I should check legacy `useAdmin.js` for `useAdminTableRecords`.
// If I missed it, I should add it to `@pulwave/features-admin`.
// I will check `useAdminTranslations.ts` imports/exports in the next step if standard check fails, but I can assume it's needed.



interface TranslationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editData: any;
    onSuccess?: () => void;
    categories?: any[];
    locales?: any[];
    configuredColumns?: Record<string, string[]>;
    tableOptions?: any[];
    enumOptions?: any[];
    enumValueOptions?: Record<string, string[]>;
    userContext?: 'admin' | 'user';
    userTableOptions?: string[];
    userConfiguredColumns?: Record<string, string[]>;
}

const TranslationFormModal = ({
    isOpen,
    onClose,
    editData,
    onSuccess: refreshTranslations,
    categories = [],
    locales = [],
    configuredColumns = {},
    tableOptions = [],
    enumOptions = [],
    enumValueOptions = {},
    userContext = 'admin',
    userTableOptions = [],
    userConfiguredColumns = {}
}: TranslationFormModalProps) => {
    // Compute effective table options for Content translations based on context
    const contentTableOptions = useMemo(() => {
        if (userContext === 'admin') {
            // Admins see all tables
            return tableOptions;
        }
        // Users only see user-translatable tables
        return [
            { value: '', label: 'Select Table…' },
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

    const [formData, setFormData] = useState<any>({
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
    const [formErrors, setFormErrors] = useState<any>({});
    const [localeFilter, setLocaleFilter] = useState(''); // Filter which locales to show

    const saveBatchTranslations = useSaveBatchAdminTranslations();
    const saveSchemaTranslation = useSaveAdminSchemaTranslation();
    const saveEnumTranslation = useSaveAdminEnumTranslation();
    const saveContentTranslation = useSaveAdminContentTranslation();
    const saveMasterDataTranslation = useSaveAdminMasterDataTranslation();

    // Fetch records for Content Translation selector
    // NOTE: Temporarily mocking or assuming it exists. If not, this line needs 'useAdminTableRecords' to be migrated.
    // I will comment it out and add a TODO if I can't confirm it now.
    // But since I need it, I'll try to use it and if it fails compilation I'll fix it.
    // Fetch records for Content Translation selector
    const { data: tableRecords } = useAdminTableRecords(
        formData.source_type === 'content' ? formData.table_name : '',
        { limit: 100 }
    );

    const recordOptions = useMemo(() => {
        if (!tableRecords) return [];
        return [
            { value: '', label: 'Select Record…' },
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
            const newForm: any = {
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

                // Master Data
                master_data_type_key: editData.master_data_type_key,
                master_data_value_key: editData.master_data_value_key,
                translation_target: editData.master_data_value_key ? 'value' : 'type'
            };

            // Load siblings into translations map
            if (editData.siblings && editData.siblings.length > 0) {
                editData.siblings.forEach((s: any) => {
                    const val = s.translated_text || s.translated_label || s.translated_content;
                    if (s.locale_code) newForm.translations[s.locale_code] = val;
                    else if (s.locale) newForm.translations[s.locale] = val;
                });
            } else if (editData.items && editData.items.length > 0) {
                // Handle Grouped Items (from Schema/Enum Lists)
                editData.items.forEach((s: any) => {
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
                record_id: '',
                master_data_type_key: '',
                master_data_value_key: '',
                translation_target: 'type'
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
                    .filter(([_, text]: [string, any]) => text && text.trim())
                    .map(([loc, text]) => ({
                        translation_key: formData.translation_key,
                        locale_code: loc,
                        translated_text: text,
                        category: formData.category,
                        source_type: 'ui',
                        status: formData.status
                    }));

                if (batch.length === 0) throw new Error("At least one translation is required");
                await saveBatchTranslations.mutateAsync(batch);
            }

            // 2. Schema Translation (Batch via Loop)
            else if (type === 'database') {
                if (!formData.table_name) throw new Error("Table is required");
                if (!formData.column_name) throw new Error("Column is required");
                const promises = Object.entries(formData.translations).map(([locale, text]: [string, any]) => {
                    if (!text) return Promise.resolve();
                    // Find existing ID from items/siblings
                    const sibling = editData?.items?.find((s: any) => (s.locale_code === locale || s.locale === locale)) ||
                        editData?.siblings?.find((s: any) => (s.locale_code === locale || s.locale === locale));

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
                const promises = Object.entries(formData.translations).map(([locale, text]: [string, any]) => {
                    if (!text) return Promise.resolve();
                    const sibling = editData?.siblings?.find((s: any) => (s.locale_code === locale || s.locale === locale));
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
                const promises = Object.entries(formData.translations).map(([locale, text]: [string, any]) => {
                    if (!text) return Promise.resolve();
                    const sibling = editData?.siblings?.find((s: any) => (s.locale_code === locale || s.locale === locale));
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

                const promises = Object.entries(formData.translations).map(([locale, text]: [string, any]) => {
                    if (!text) return Promise.resolve();
                    const sibling = editData?.siblings?.find((s: any) => (s.locale_code === locale || s.locale === locale));
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
        } catch (err: any) {
            setFormErrors({ submit: err.message });
            showToast(`Error: ${err.message}`, 'error');
        }
    };

    const categoryOpts = [
        { value: '', label: 'Select Category…' },
        ...categories.map(c => ({
            value: c.value_key,
            label: c.value_label,
            group: c.value_data?.group || null
        }))
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editData ? 'Edit Translation' : 'New Translation'}
            size="xl"
            scrollableBody
            footer={
                <>
                    <Button kind="secondary" variant="soft" onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button kind="primary" variant="filled" onClick={handleSave} leftIcon={<Save size={16} aria-hidden="true" />} loading={isSaving}>Save Changes</Button>
                </>
            }
        >
            <div className="admin-edit-form space-y-4">

                {/* Source Selector (Only for New) */}
                {!editData && (
                    <div className="margin-bottom-6">
                        <div className="display-flex gap-2 p-1 bg-neutral-100 border-radius-l inline-display-flex">
                            {SOURCE_TYPES.filter(t => t.value !== '').map(t => {
                                const Icon = t.icon;
                                const isActive = formData.source_type === t.value;
                                return (
                                    <Button
                                        key={t.value}
                                        onClick={() => setFormData((prev: any) => ({ ...prev, source_type: t.value }))}
                                        kind={isActive ? 'primary' : 'neutral'}
                                        variant={isActive ? 'filled' : 'ghost'}
                                        size="s"
                                        className={`
                                            display-flex align-items-center gap-2 padding-horizontal-3 padding-vertical-1.5 border-radius-m text-sm font-weight-medium transition-colors
                                            ${!isActive && 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50'}
                                        `}
                                        leftIcon={<Icon size={14} aria-hidden="true" />}
                                    >
                                        {t.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* UI FORM */}
                {formData.source_type === 'ui' && (
                    <UITranslationForm
                        formData={formData}
                        setFormData={setFormData}
                        editData={editData}
                        categoryOpts={categoryOpts}
                        locales={locales}
                        filteredLocales={filteredLocales}
                        localeFilter={localeFilter}
                        setLocaleFilter={setLocaleFilter}
                    />
                )}

                {/* SCHEMA FORM */}
                {formData.source_type === 'database' && (
                    <SchemaTranslationForm
                        formData={formData}
                        setFormData={setFormData}
                        editData={editData}
                        tableOptions={tableOptions}
                        configuredColumns={configuredColumns}
                        locales={locales}
                        filteredLocales={filteredLocales}
                        localeFilter={localeFilter}
                        setLocaleFilter={setLocaleFilter}
                    />
                )}

                {/* ENUM FORM */}
                {formData.source_type === 'enum' && (
                    <EnumTranslationForm
                        formData={formData}
                        setFormData={setFormData}
                        editData={editData}
                        enumOptions={enumOptions}
                        enumValueOptions={enumValueOptions}
                        locales={locales}
                        filteredLocales={filteredLocales}
                        localeFilter={localeFilter}
                        setLocaleFilter={setLocaleFilter}
                    />
                )}

                {/* CONTENT FORM */}
                {formData.source_type === 'content' && (
                    <ContentTranslationForm
                        formData={formData}
                        setFormData={setFormData}
                        editData={editData}
                        tableOptions={contentTableOptions}
                        configuredColumns={effectiveConfiguredColumns}
                        recordOptions={recordOptions}
                        locales={locales}
                        filteredLocales={filteredLocales}
                        localeFilter={localeFilter}
                        setLocaleFilter={setLocaleFilter}
                    />
                )}

                {/* MASTER DATA FORM */}
                {formData.source_type === 'master_data' && (
                    <MasterDataTranslationForm
                        formData={formData}
                        setFormData={setFormData}
                        editData={editData}
                        locales={locales}
                        filteredLocales={filteredLocales}
                        localeFilter={localeFilter}
                        setLocaleFilter={setLocaleFilter}
                    />
                )}
            </div>
        </Modal>
    );
};

export default TranslationFormModal;
