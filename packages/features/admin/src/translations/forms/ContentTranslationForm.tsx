import { Select } from '@pulwave/ui';
import TranslationsList from './TranslationsList';
import { toTitleCase } from '../../utils/formatters';

// Type definitions
interface SelectOption {
    value: string;
    label: string;
}

interface Locale {
    code: string;
    name?: string;
    language_code?: string;
}

interface ContentFormData {
    table_name: string;
    column_name: string;
    record_id: string;
    translations: Record<string, string>;
}

interface ContentTranslationFormProps {
    formData: ContentFormData;
    setFormData: (updater: (prev: ContentFormData) => ContentFormData) => void;
    editData: ContentFormData | null;
    tableOptions: SelectOption[];
    configuredColumns: Record<string, string[]>;
    recordOptions: SelectOption[];
    locales: Locale[];
    filteredLocales: Locale[];
    localeFilter: string;
    setLocaleFilter: (filter: string) => void;
}

/**
 * Content Translation Form Section
 * Handles dynamic CMS content translations (specific record values)
 */
export const ContentTranslationForm = ({
    formData,
    setFormData,
    editData,
    tableOptions,
    configuredColumns,
    recordOptions,
    locales,
    filteredLocales,
    localeFilter,
    setLocaleFilter
}: ContentTranslationFormProps) => {
    return (
        <>
            {/* In Edit mode, show read-only header */}
            {editData ? (
                <div className="bg-neutral-50 p-3 border-radius-l border border-neutral-200">
                    <div className="text-xs text-neutral-500 uppercase margin-bottom-1">Editing Content Translation</div>
                    <div className="font-weight-medium text-neutral-900">
                        {toTitleCase(formData.table_name)} → {toTitleCase(formData.column_name)}
                    </div>
                    {formData.record_id && (
                        <div className="text-sm text-neutral-500 margin-top-1">Record ID: {formData.record_id}</div>
                    )}
                </div>
            ) : (
                <>
                    <p className="text-sm text-neutral-500 margin-bottom-3">
                        Translate specific database content. Select a table, column, then choose which record to translate.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Table"
                            value={formData.table_name}
                            onChange={(val) => setFormData((prev) => ({ ...prev, table_name: val, column_name: '', record_id: '' }))}
                            options={tableOptions}
                        />
                        <Select
                            label="Column"
                            value={formData.column_name || ''}
                            onChange={(val) => setFormData((prev) => ({ ...prev, column_name: val, record_id: '' }))}
                            options={[
                                { value: '', label: 'Select Column…' },
                                ...(configuredColumns[formData.table_name] || []).map(c => ({ value: c, label: toTitleCase(c) }))
                            ]}
                            disabled={!formData.table_name}
                        />
                    </div>
                    <div className="margin-top-4">
                        <Select
                            label="Record to Translate"
                            value={formData.record_id}
                            onChange={(val) => setFormData((prev) => ({ ...prev, record_id: val }))}
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
                    onChange={(loc, val) => setFormData((prev) => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
                    isTextArea
                />
            )}
        </>
    );
};

export default ContentTranslationForm;
