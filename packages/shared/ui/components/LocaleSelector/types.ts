import { cva, type VariantProps } from 'class-variance-authority';

// Helper for trigger variants
export const localeSelectorTriggerVariants = cva('locale-selector__trigger', {
    variants: {
        variant: {
            default: 'locale-selector__trigger--default',
            minimal: 'locale-selector__trigger--minimal',
            button: 'locale-selector__trigger--button',
            icon: 'locale-selector__trigger--icon',
        }
    },
    defaultVariants: {
        variant: 'default',
    },
});

export type LocaleSelectorTriggerVariants = VariantProps<typeof localeSelectorTriggerVariants>;

export interface LocaleInfo {
    code: string;
    name?: string;
    native_name?: string;
    language_code?: string;
}

export interface LocaleSelectorProps {
    /** Current locale code */
    locale: string;
    /** List of available locales */
    availableLocales: LocaleInfo[];
    /** Callback when locale changes */
    onLocaleChange: (locale: string) => void;
    /** Visual variant */
    variant?: LocaleSelectorTriggerVariants['variant'];
    /** Whether to show label */
    showLabel?: boolean;
    /** Size */
    size?: 's' | 'm' | 'l';
    /** Alignment */
    align?: 'left' | 'right';
    /** Class name */
    className?: string;
    /** Group by language */
    groupByLanguage?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Label text for the dropdown header */
    labelText?: string;
}
