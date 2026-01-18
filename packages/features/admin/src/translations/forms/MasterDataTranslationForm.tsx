import { Select } from '@pulwave/ui';
import { MasterDataTypeSelect } from '../../master-data/MasterDataTypeSelect/MasterDataTypeSelect';
import { MasterDataValueSelect } from '../../master-data/MasterDataValueSelect/MasterDataValueSelect';
import TranslationsList from './TranslationsList';

import { toTitleCase } from '../../utils/formatters';

// Type definitions
interface Locale {
    code: string;
    name?: string;
    language_code?: string;
}

interface MasterDataFormData {
    translation_target: 'type' | 'value';
    master_data_type_key: string;
    master_data_value_key: string;
    translations: Record<string, string>;
}

interface MasterDataTranslationFormProps {
    formData: MasterDataFormData;
    setFormData: (updater: (prev: MasterDataFormData) => MasterDataFormData) => void;
    editData: MasterDataFormData | null;
    locales: Locale[];
    filteredLocales: Locale[];
    localeFilter: string;
    setLocaleFilter: (filter: string) => void;
}

/**
 * Master Data Translation Form Section
 * Handles master data type and value translations
 */
export const MasterDataTranslationForm = ({
    formData,
    setFormData,
    editData,
    locales,
    filteredLocales,
    localeFilter,
    setLocaleFilter
}: MasterDataTranslationFormProps) => {
    return (
        <>
            {editData ? (
                <div className="bg-neutral-50 p-3 border-radius-l border border-neutral-200">
                    <div className="text-xs text-neutral-500 uppercase margin-bottom-1">Editing Master Data Translation</div>
                    <div className="font-weight-medium text-neutral-900">
                        {formData.translation_target === 'type' ? 'Type' : 'Value'}: {toTitleCase(formData.master_data_type_key || formData.master_data_value_key)}
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-sm text-neutral-500 margin-bottom-3">
                        Translate master data types or values. Select whether you're translating a type or a specific value.
                    </p>
                    <div className="grid grid-cols-2 gap-4 margin-bottom-4">
                        <Select
                            label="Translation Target"
                            value={formData.translation_target}
                            onChange={(val) => setFormData((prev) => ({
                                ...prev,
                                translation_target: val,
                                master_data_type_key: '',
                                master_data_value_key: ''
                            }))}
                            options={[
                                { value: 'type', label: 'Master Data Type' },
                                { value: 'value', label: 'Master Data Value' }
                            ]}
                        />
                    </div>
                    {formData.translation_target === 'type' && (
                        <MasterDataTypeSelect
                            value={formData.master_data_type_key}
                            onChange={(val) => setFormData((prev) => ({ ...prev, master_data_type_key: val }))}
                            useId={true}
                        />
                    )}
                    {formData.translation_target === 'value' && (
                        <div className="grid grid-cols-2 gap-4">
                            <MasterDataTypeSelect
                                value={formData.master_data_type_key}
                                onChange={(val) => setFormData((prev) => ({
                                    ...prev,
                                    master_data_type_key: val,
                                    master_data_value_key: ''
                                }))}
                                label="Select Type First"
                            />
                            <MasterDataValueSelect
                                typeKey={formData.master_data_type_key}
                                value={formData.master_data_value_key}
                                onChange={(val) => setFormData((prev) => ({ ...prev, master_data_value_key: val }))}
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
                        onChange={(loc, val) => setFormData((prev) => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
                    />
                )}
        </>
    );
};

export default MasterDataTranslationForm;
