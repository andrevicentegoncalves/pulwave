import { useMemo, forwardRef, Fragment } from 'react';
import { Dropdown, DropdownItem, DropdownLabel, DropdownDivider } from '../Dropdown';
import { CircleFlag } from '../CircleFlag';
import { ChevronDown, Check } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { localeSelectorTriggerVariants, type LocaleSelectorProps, type LocaleInfo } from './types';
import './styles/_index.scss';

function getCountryCode(locale: string): string {
    if (!locale) return '';
    const parts = locale.split('-');
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
}

/**
 * LocaleSelector Trigger Button
 */
const LocaleSelectorTrigger = forwardRef<HTMLButtonElement, any>(({
    locale,
    localeInfo,
    variant = 'default',
    showLabel = true,
    size = 'm',
    className = '',
    ...props
}, ref) => {
    const countryCode = getCountryCode(locale);

    return (
        <button
            ref={ref}
            type="button"
            className={cn(localeSelectorTriggerVariants({ variant }), className)}
            {...props}
        >
            <CircleFlag countryCode={countryCode} size={size} />
            {showLabel && variant !== 'icon' && (
                <span className="locale-selector__label">
                    {localeInfo?.native_name || locale}
                </span>
            )}
            {variant !== 'icon' && (
                <ChevronDown size={14} aria-hidden="true" />
            )}
        </button>
    );
});

LocaleSelectorTrigger.displayName = 'LocaleSelectorTrigger';

/**
 * Locale Option Item
 */
 
const LocaleOption = ({ locale, isSelected, onClick }: { locale: LocaleInfo, isSelected: boolean, onClick: (code: string) => void }) => {
    const countryCode = getCountryCode(locale.code);
    const displayName = locale.native_name || locale.name || locale.code;

    return (
        <DropdownItem
            onClick={() => onClick(locale.code)}
            className={cn('justify-between', isSelected && 'bg-primary-subtle text-primary')}
        >
            <div className="locale-selector__option-content">
                <CircleFlag countryCode={countryCode} size="s" />
                <span>{displayName}</span>
            </div>
            {isSelected && <Check size={14} aria-hidden="true" />}
        </DropdownItem>
    );
};

/**
 * LocaleSelector - Pure UI Component for Language Selection
 * Decoupled from i18n logic.
 */
export const LocaleSelector = ({
    locale,
    availableLocales,
    onLocaleChange,
    variant = 'default',
    showLabel = true,
    size = 'm',
    align = 'right',
    className = '',
    groupByLanguage = false,
    disabled = false,
    labelText = 'Language'
}: LocaleSelectorProps) => {
    // Find current locale info
    const currentLocaleInfo = useMemo(() => {
        return availableLocales.find(l => l.code === locale) || { code: locale };
    }, [availableLocales, locale]);

    // Group locales
    const groupedLocales = useMemo(() => {
        if (!groupByLanguage) return { all: availableLocales };

        return availableLocales.reduce((groups, loc) => {
            const langCode = loc.language_code || loc.code.split('-')[0];
            if (!groups[langCode]) groups[langCode] = [];
            groups[langCode].push(loc);
            return groups;
        }, {} as Record<string, LocaleInfo[]>);
    }, [availableLocales, groupByLanguage]);

    if (!availableLocales.length) return null;

    return (
        <div className={cn('locale-selector', className)}>
            <Dropdown
                trigger={
                    <LocaleSelectorTrigger
                        locale={locale}
                        localeInfo={currentLocaleInfo}
                        variant={variant}
                        showLabel={showLabel}
                        size={size}
                    />
                }
                align={align}
                disabled={disabled}
            >
                <DropdownLabel>{labelText}</DropdownLabel>
                <DropdownDivider />

                {groupByLanguage ? (
                    Object.entries(groupedLocales).map(([langCode, locales], idx) => (
                        <Fragment key={langCode}>
                            {idx > 0 && <DropdownDivider />}
                            {locales.map(loc => (
                                <LocaleOption
                                    key={loc.code}
                                    locale={loc}
                                    isSelected={loc.code === locale}
                                    onClick={onLocaleChange}
                                />
                            ))}
                        </Fragment>
                    ))
                ) : (
                    availableLocales.map(loc => (
                        <LocaleOption
                            key={loc.code}
                            locale={loc}
                            isSelected={loc.code === locale}
                            onClick={onLocaleChange}
                        />
                    ))
                )}
            </Dropdown>
        </div>
    );
};
