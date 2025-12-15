/**
 * LocaleSelector Component
 * Dropdown component for selecting the application locale/language
 * Displays country flags and native language names
 */
import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownLabel, DropdownDivider } from './Dropdown';
import CircleFlag from './CircleFlag';
import { useTranslation } from '../../hooks/useTranslation';
import { formatLocaleDisplayName } from '../../utils/translationUtils';

/**
 * Get country code from locale code
 * Extracts country portion from locale (e.g., 'en-US' -> 'US')
 *
 * @param {string} locale - Locale code
 * @returns {string} - Country code or empty string
 */
function getCountryCode(locale) {
    if (!locale || typeof locale !== 'string') {
        return '';
    }
    const parts = locale.split('-');
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
}

/**
 * LocaleSelector Trigger Button
 * Can be customized via variant prop
 */
const LocaleSelectorTrigger = React.forwardRef(({
    locale,
    localeInfo,
    variant = 'default',
    showLabel = true,
    size = 'm',
    className = '',
    ...props
}, ref) => {
    const countryCode = getCountryCode(locale);

    // Variant-specific styling
    const variantClasses = {
        default: 'locale-selector__trigger--default',
        minimal: 'locale-selector__trigger--minimal',
        button: 'locale-selector__trigger--button',
        icon: 'locale-selector__trigger--icon'
    };

    return (
        <button
            ref={ref}
            type="button"
            className={`locale-selector__trigger ${variantClasses[variant] || variantClasses.default} ${className}`}
            {...props}
        >
            <CircleFlag countryCode={countryCode} size={size} />
            {showLabel && variant !== 'icon' && (
                <span className="locale-selector__label">
                    {localeInfo?.native_name || locale}
                </span>
            )}
            {variant !== 'icon' && (
                <svg
                    className="locale-selector__chevron"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </button>
    );
});

LocaleSelectorTrigger.displayName = 'LocaleSelectorTrigger';

LocaleSelectorTrigger.propTypes = {
    locale: PropTypes.string.isRequired,
    localeInfo: PropTypes.shape({
        native_name: PropTypes.string,
        name: PropTypes.string
    }),
    variant: PropTypes.oneOf(['default', 'minimal', 'button', 'icon']),
    showLabel: PropTypes.bool,
    size: PropTypes.oneOf(['s', 'm', 'l']),
    className: PropTypes.string
};

/**
 * Locale Option Item
 * Displays a single locale option with flag and name
 */
const LocaleOption = ({ locale, isSelected, onClick, onClose }) => {
    const countryCode = getCountryCode(locale.code);

    const handleClick = useCallback(() => {
        onClick(locale.code);
        if (onClose) onClose();
    }, [locale.code, onClick, onClose]);

    return (
        <button
            type="button"
            className={`locale-selector__option ${isSelected ? 'locale-selector__option--selected' : ''}`}
            onClick={handleClick}
            role="menuitemradio"
            aria-checked={isSelected}
        >
            <CircleFlag countryCode={countryCode} size="s" />
            <span className="locale-selector__option-name">
                {formatLocaleDisplayName(locale)}
            </span>
            {isSelected && (
                <svg
                    className="locale-selector__check"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </button>
    );
};

LocaleOption.propTypes = {
    locale: PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string,
        native_name: PropTypes.string
    }).isRequired,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    onClose: PropTypes.func
};

/**
 * LocaleSelector Component
 * Full dropdown for locale/language selection
 */
const LocaleSelector = ({
    variant = 'default',
    showLabel = true,
    size = 'm',
    align = 'right',
    className = '',
    groupByLanguage = false,
    disabled = false
}) => {
    const {
        locale: currentLocale,
        availableLocales,
        setLocale,
        isLoading,
        t
    } = useTranslation();

    // Find current locale info
    const currentLocaleInfo = useMemo(() => {
        return availableLocales.find(l => l.code === currentLocale) || null;
    }, [availableLocales, currentLocale]);

    // Group locales by language if requested
    const groupedLocales = useMemo(() => {
        if (!groupByLanguage) {
            return { all: availableLocales };
        }

        return availableLocales.reduce((groups, locale) => {
            const languageCode = locale.language_code || locale.code.split('-')[0];
            if (!groups[languageCode]) {
                groups[languageCode] = [];
            }
            groups[languageCode].push(locale);
            return groups;
        }, {});
    }, [availableLocales, groupByLanguage]);

    // Handle locale change
    const handleLocaleChange = useCallback(async (newLocale) => {
        if (newLocale !== currentLocale) {
            await setLocale(newLocale);
        }
    }, [currentLocale, setLocale]);

    // Don't render if no locales available
    if (!availableLocales.length) {
        return null;
    }

    const trigger = (
        <LocaleSelectorTrigger
            locale={currentLocale}
            localeInfo={currentLocaleInfo}
            variant={variant}
            showLabel={showLabel}
            size={size}
        />
    );

    return (
        <div className={`locale-selector locale-selector--${variant} ${className}`}>
            <Dropdown
                trigger={trigger}
                align={align}
                disabled={disabled || isLoading}
            >
                <DropdownLabel>
                    {t('settings.language', {}, 'Language')}
                </DropdownLabel>
                <DropdownDivider />

                {groupByLanguage ? (
                    // Grouped view
                    Object.entries(groupedLocales).map(([languageCode, locales], index) => (
                        <React.Fragment key={languageCode}>
                            {index > 0 && <DropdownDivider variant="light" />}
                            {locales.map(locale => (
                                <LocaleOption
                                    key={locale.code}
                                    locale={locale}
                                    isSelected={locale.code === currentLocale}
                                    onClick={handleLocaleChange}
                                />
                            ))}
                        </React.Fragment>
                    ))
                ) : (
                    // Flat view
                    availableLocales.map(locale => (
                        <LocaleOption
                            key={locale.code}
                            locale={locale}
                            isSelected={locale.code === currentLocale}
                            onClick={handleLocaleChange}
                        />
                    ))
                )}
            </Dropdown>
        </div>
    );
};

LocaleSelector.propTypes = {
    /** Visual variant of the trigger button */
    variant: PropTypes.oneOf(['default', 'minimal', 'button', 'icon']),
    /** Whether to show the locale label text */
    showLabel: PropTypes.bool,
    /** Size of the flag icon */
    size: PropTypes.oneOf(['s', 'm', 'l']),
    /** Dropdown alignment */
    align: PropTypes.oneOf(['left', 'right']),
    /** Additional CSS class */
    className: PropTypes.string,
    /** Group locales by language (e.g., all English variants together) */
    groupByLanguage: PropTypes.bool,
    /** Disable the selector */
    disabled: PropTypes.bool
};

export default LocaleSelector;

/**
 * Compact LocaleSelector for use in headers/toolbars
 */
export const CompactLocaleSelector = (props) => (
    <LocaleSelector variant="minimal" showLabel={false} size="s" {...props} />
);

CompactLocaleSelector.propTypes = LocaleSelector.propTypes;
