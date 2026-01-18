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

interface EnumFormData {
    enum_name: string;
    enum_value: string;
    translations: Record<string, string>;
}

interface EnumTranslationFormProps {
    formData: EnumFormData;
    setFormData: (updater: (prev: EnumFormData) => EnumFormData) => void;
    editData: EnumFormData | null;
    enumOptions: SelectOption[];
    enumValueOptions: Record<string, string[]>;
    locales: Locale[];
    filteredLocales: Locale[];
    localeFilter: string;
    setLocaleFilter: (filter: string) => void;
}

/**
 * Enum Translation Form Section
 * Handles database enum translations
 */
export const EnumTranslationForm = ({
    formData,
    setFormData,
    editData,
    enumOptions,
    enumValueOptions,
    locales,
    filteredLocales,
    localeFilter,
    setLocaleFilter
}: EnumTranslationFormProps) => {
    return (
        <>
            {/* In Edit mode, show read-only header instead of dropdowns */}
            {editData ? (
                <div className="bg-neutral-50 p-3 border-radius-l border border-neutral-200">
                    <div className="text-xs text-neutral-500 uppercase margin-bottom-1">Editing Enum Translation</div>
                    <div className="font-weight-medium text-neutral-900">
                        {formData.enum_name} → {toTitleCase(formData.enum_value)}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Enum Name"
                        value={formData.enum_name}
                        onChange={(val) => setFormData((prev) => ({ ...prev, enum_name: val, enum_value: '' }))}
                        options={enumOptions}
                    />
                    <Select
                        label="Enum Value"
                        value={formData.enum_value || ''}
                        onChange={(val) => setFormData((prev) => ({ ...prev, enum_value: val }))}
                        options={[
                            { value: '', label: 'Select Value…' },
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
                    onChange={(loc, val) => setFormData((prev) => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
                />
            )}
        </>
    );
};

export default EnumTranslationForm;
