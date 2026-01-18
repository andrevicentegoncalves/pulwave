import { useMemo, useState, useCallback } from 'react';
import { Select, CircleFlag, Icon, MapPin } from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';
import { getUserCountry } from '../../utils/geolocation';

export interface LocaleOption {
    value: string;
    label: string;
    countryCode?: string | null;
}

export interface LocaleSelectProps {
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    options: LocaleOption[];
    placeholder?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    name?: string;
    id?: string;
    size?: 'xs' | 's' | 'm' | 'l';
    /** Show auto-locate button */
    showAutoLocate?: boolean;
}

/**
 * Helper to render flag icon
 */
const renderFlagIcon = (countryCode?: string | null) => {
    return countryCode ? <CircleFlag countryCode={countryCode} size="ms" /> : null;
};

/**
 * LocaleSelect Component
 * Specialized dropdown for locale/language selection with flag display
 * Now using Select with custom renderValue/renderOption
 */
export const LocaleSelect = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select…",
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id,
    size = 'm',
    showAutoLocate = true
}: LocaleSelectProps) => {
    const [locating, setLocating] = useState(false);

    // Create a map for quick country code lookup
    const countryCodeMap = useMemo(() => {
        return options.reduce((acc, option) => {
            acc[option.value] = option.countryCode;
            return acc;
        }, {} as Record<string, string | null | undefined>);
    }, [options]);

    // Convert LocaleOption[] to SelectOption[] format
    const selectOptions: SelectOption<string>[] = useMemo(() => {
        return options.map(option => ({
            value: option.value,
            label: option.label,
            icon: renderFlagIcon(option.countryCode),
            searchTerms: option.countryCode ? [option.countryCode] : undefined
        }));
    }, [options]);

    // Auto-locate user's locale based on country
    const handleAutoLocate = useCallback(async () => {
        try {
            setLocating(true);
            const countryCode = await getUserCountry();

            if (countryCode) {
                // Find locale matching the country code
                const matchingOption = options.find(o => o.countryCode === countryCode);

                if (matchingOption) {
                    onChange(matchingOption.value);
                }
                // Silent handling if no locale found for country
            }
        } catch {
            // Silent error handling for auto-locate failure
        } finally {
            setLocating(false);
        }
    }, [options, onChange]);

    // Custom render for trigger value
    const renderValue = (selected: SelectOption<string> | SelectOption<string>[] | null) => {
        if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            return <span className="select__placeholder">{placeholder}</span>;
        }
        const option = Array.isArray(selected) ? selected[0] : selected;
        const countryCode = countryCodeMap[option.value];
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                {renderFlagIcon(countryCode)}
                <span>{option.label}</span>
            </span>
        );
    };

    // Custom render for options
    const renderOption = (option: SelectOption<string>, isSelected: boolean) => (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                {option.icon}
                <span>{option.label}</span>
            </span>
            {isSelected && <span className="icon--primary">✓</span>}
        </span>
    );

    return (
        <Select<string>
            label={label}
            value={value}
            onChange={onChange}
            options={selectOptions}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth={fullWidth}
            name={name}
            id={id}
            size={size}
            className={className}
            searchable
            searchPlaceholder="Search…"
            renderValue={renderValue}
            renderOption={renderOption}
            onAutoLocate={showAutoLocate ? handleAutoLocate : undefined}
            autoLocating={locating}
            autoLocateLabel="Get Current Location"
            triggerIcon={<Icon size="s"><MapPin /></Icon>}
        />
    );
};

export default LocaleSelect;
