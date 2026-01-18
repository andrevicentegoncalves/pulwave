import { Select } from '@pulwave/ui';
import TranslationsList from './TranslationsList';
import { toTitleCase } from '../../utils/formatters';

// Type definitions for translation forms
interface SelectOption {
    value: string;
    label: string;
}

interface Locale {
    code: string;
    name?: string;
    language_code?: string;
}

interface SchemaFormData {
    table_name: string;
    column_name: string;
    translations: Record<string, string>;
}

interface SchemaTranslationFormProps {
    formData: SchemaFormData;
    setFormData: (updater: (prev: SchemaFormData) => SchemaFormData) => void;
    editData: SchemaFormData | null;
    tableOptions: SelectOption[];
    configuredColumns: Record<string, string[]>;
    locales: Locale[];
    filteredLocales: Locale[];
    localeFilter: string;
    setLocaleFilter: (filter: string) => void;
}

/**
 * Schema Translation Form Section
 * Handles database table/column translations
 */
export const SchemaTranslationForm = ({
    formData,
    setFormData,
    editData,
    tableOptions,
    configuredColumns,
    locales,
    filteredLocales,
    localeFilter,
    setLocaleFilter
}: SchemaTranslationFormProps) => {
    return (
        <>
            {/* In Edit mode, show read-only header instead of dropdowns */}
            {editData ? (
                <div className="bg-neutral-50 p-3 border-radius-l border border-neutral-200">
                    <div className="text-xs text-neutral-500 uppercase margin-bottom-1">Editing Schema Translation</div>
                    <div className="font-weight-medium text-neutral-900">
                        {toTitleCase(formData.table_name)} → {toTitleCase(formData.column_name)}
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Table"
                            value={formData.table_name}
                            onChange={(val) => setFormData((prev) => ({ ...prev, table_name: val, column_name: '' }))}
                            options={tableOptions}
                        />
                        <Select
                            label="Column"
                            value={formData.column_name || ''}
                            onChange={(val) => setFormData((prev) => ({ ...prev, column_name: val }))}
                            options={[
                                { value: '', label: 'Select Column…' },
                                ...(configuredColumns[formData.table_name] || []).map(c => ({ value: c, label: toTitleCase(c) }))
                            ]}
                            disabled={!formData.table_name}
                        />
                    </div>
                    {/* Warning when table selected but no columns configured */}
                    {formData.table_name && (!configuredColumns[formData.table_name] || configuredColumns[formData.table_name].length === 0) && (
                        <div className="margin-top-2 p-2 bg-amber-50 border border-amber-200 border-radius-s text-sm text-amber-700">
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
                    onChange={(loc, val) => setFormData((prev) => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
                />
            )}
        </>
    );
};

export default SchemaTranslationForm;
