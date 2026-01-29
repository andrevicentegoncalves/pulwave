import { useMemo } from 'react';
import { Badge, TextArea } from '@pulwave/ui';
import { CircleFlag } from '../components/CircleFlag';
import { LocaleSelect } from '@pulwave/features-shared';

interface Locale {
    code: string;
    name: string;
}

interface TranslationsListProps {
    locales: Locale[];
    allLocales: Locale[];
    translations: Record<string, string>;
    onChange: (localeCode: string, value: string) => void;
    isTextArea?: boolean;
    localeFilter?: string;
    setLocaleFilter?: (filter: string) => void;
}

/**
 * TranslationsList Component
 * Renders a list of translation inputs per locale with optional filtering
 */
export const TranslationsList = ({
    locales,
    allLocales,
    translations,
    onChange,
    isTextArea = false,
    localeFilter = '',
    setLocaleFilter = () => { }
}: TranslationsListProps) => {
    // Convert locales to LocaleSelect options format
    const localeOptions = useMemo(() => {
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
        <div className="display-flex display-flex-direction-column gap-4 margin-top-8 padding-top-6 border-t">
            <div className="display-flex align-items-center gap-4 margin-bottom-4">
                <h4
                    className="font-weight-semibold display-flex align-items-center gap-2 display-flex-1"
                    style={{
                        fontSize: 'var(--font-size-title-s)',
                        lineHeight: 'var(--line-height-title-s)',
                        letterSpacing: 'var(--letter-spacing-title-s)'
                    }}
                >
                    Translations
                    <Badge status="neutral" size="s" variant="light">{filledCount}/{locales.length}</Badge>
                </h4>
                <div className="display-flex-shrink-1-0 margin-left-auto">
                    <LocaleSelect
                        value={localeFilter}
                        onChange={setLocaleFilter}
                        options={localeOptions}
                        placeholder="All Languages"
                    />
                </div>
            </div>
            {locales.map(l => (
                <div key={l.code} className="display-flex gap-4 align-items-center">
                    <div className="w-36 display-flex align-items-center gap-2 display-flex-shrink-1-0">
                        <CircleFlag countryCode={l.code.includes('-') ? l.code.split('-')[1] : null} size="s" />
                        <span className="text-sm">{l.name}</span>
                    </div>
                    <TextArea
                        value={translations[l.code] || ''}
                        onChange={(e) => onChange(l.code, e.target.value)}
                        rows={isTextArea ? 3 : 1}
                        className="display-flex-1 textarea--compact textarea--no-padding"
                        placeholder="…"
                    />
                </div>
            ))}
            {locales.length === 0 && (
                <p className="text-sm text-neutral-500 italic">No locales match the filter.</p>
            )}
        </div>
    );
};

export default TranslationsList;
