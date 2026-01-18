import { Input, Select, Button } from '@pulwave/ui';
import TranslationsList from './TranslationsList';

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

interface UIFormData {
    translation_key: string;
    category: string;
    translations: Record<string, string>;
}

interface UITranslationFormProps {
    formData: UIFormData;
    setFormData: (updater: (prev: UIFormData) => UIFormData) => void;
    editData: UIFormData | null;
    categoryOpts: SelectOption[];
    locales: Locale[];
    filteredLocales: Locale[];
    localeFilter: string;
    setLocaleFilter: (filter: string) => void;
}

/**
 * UI Translation Form Section
 * Handles key-based UI string translations
 */
export const UITranslationForm = ({
    formData,
    setFormData,
    editData,
    categoryOpts,
    locales,
    filteredLocales,
    localeFilter,
    setLocaleFilter
}: UITranslationFormProps) => {
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Key"
                    value={formData.translation_key}
                    onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => {
                            const updated = { ...prev, translation_key: val };

                            // Extract category from key if it has dot notation
                            if (val.includes('.')) {
                                const category = val.split('.')[0];
                                if (categoryOpts.some(c => c.value === category)) {
                                    return { ...updated, category, translation_key: val };
                                }
                            }

                            return updated;
                        });
                    }}
                    disabled={!!editData}
                    placeholder="e.g. common.submit"
                />
                <Select
                    label="Category"
                    value={formData.category}
                    onChange={(val) => {
                        setFormData((prev) => {
                            // Update category and modify translation_key to match
                            const currentKey = prev.translation_key;
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

                            return { ...prev, category: val, translation_key: newKey };
                        });
                    }}
                    options={categoryOpts.filter(c => c.value)}
                    searchable
                    grouped
                />
            </div>
            <div className="display-flex gap-2 margin-bottom-2">
                <Button
                    variant="ghost"
                    size="s"
                    onClick={() => {
                        const englishLocales = locales.filter(l => l.language_code === 'en' || l.code?.startsWith('en-'));
                        const newTranslations = { ...formData.translations };
                        // Get last part of key for readable default (e.g., "common.submit" → "submit")
                        const keyParts = formData.translation_key?.split('.') || [];
                        const defaultText = keyParts.length > 1 ? keyParts[keyParts.length - 1].replace(/_/g, ' ') : formData.translation_key || '';
                        englishLocales.forEach((locale: Locale) => {
                            newTranslations[locale.code] = defaultText;
                        });
                        setFormData((prev) => ({ ...prev, translations: newTranslations }));
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
                onChange={(loc, val) => setFormData((prev) => ({ ...prev, translations: { ...prev.translations, [loc]: val } }))}
            />
        </>
    );
};

export default UITranslationForm;
