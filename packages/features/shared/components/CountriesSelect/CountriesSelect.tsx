/**
 * CountriesSelect
 * 
 * Specialized dropdown for country selection.
 * Can use a lookupService for dynamic data, or falls back to a static list.
 * 
 * @package @pulwave/features-forms
 */
import { useState, useEffect, useCallback, useMemo, type ComponentType } from 'react';
import { Select, Skeleton, Icon, MapPin } from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';
// Direct named imports instead of namespace import to avoid loading all 250+ flags
import {
    US, GB, CA, AU, DE, FR, ES, IT, PT, BR,
    MX, JP, CN, IN, NL, BE, CH, IE, PL, SE
} from 'country-flag-icons/react/3x2';

// Flag registry for static countries - only these flags are bundled
const FLAG_REGISTRY: Record<string, ComponentType<{ className?: string; title?: string }>> = {
    US, GB, CA, AU, DE, FR, ES, IT, PT, BR,
    MX, JP, CN, IN, NL, BE, CH, IE, PL, SE
};

interface Country {
    id: string;
    name: string;
    iso_code_2: string;
}

export interface LookupServiceInterface {
    fetchCountries: () => Promise<Country[]>;
}

export interface CountriesSelectProps {
    /** Label */
    label?: string;
    /** Selected country ID */
    value?: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Placeholder */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Full width */
    fullWidth?: boolean;
    /** Additional class */
    className?: string;
    /** Input name */
    name?: string;
    /** Input ID */
    id?: string;
    /** External loading state */
    loading?: boolean;
    /** Required */
    required?: boolean;
    /** Optional lookup service - if not provided, uses static data */
    lookupService?: LookupServiceInterface;
    /** Size variant */
    size?: 'xs' | 's' | 'm' | 'l';
}

// Static fallback data for common countries
const STATIC_COUNTRIES: Country[] = [
    { id: 'usa', name: 'United States', iso_code_2: 'US' },
    { id: 'gbr', name: 'United Kingdom', iso_code_2: 'GB' },
    { id: 'can', name: 'Canada', iso_code_2: 'CA' },
    { id: 'aus', name: 'Australia', iso_code_2: 'AU' },
    { id: 'deu', name: 'Germany', iso_code_2: 'DE' },
    { id: 'fra', name: 'France', iso_code_2: 'FR' },
    { id: 'esp', name: 'Spain', iso_code_2: 'ES' },
    { id: 'ita', name: 'Italy', iso_code_2: 'IT' },
    { id: 'prt', name: 'Portugal', iso_code_2: 'PT' },
    { id: 'bra', name: 'Brazil', iso_code_2: 'BR' },
    { id: 'mex', name: 'Mexico', iso_code_2: 'MX' },
    { id: 'jpn', name: 'Japan', iso_code_2: 'JP' },
    { id: 'chn', name: 'China', iso_code_2: 'CN' },
    { id: 'ind', name: 'India', iso_code_2: 'IN' },
    { id: 'nld', name: 'Netherlands', iso_code_2: 'NL' },
    { id: 'bel', name: 'Belgium', iso_code_2: 'BE' },
    { id: 'che', name: 'Switzerland', iso_code_2: 'CH' },
    { id: 'irl', name: 'Ireland', iso_code_2: 'IE' },
    { id: 'pol', name: 'Poland', iso_code_2: 'PL' },
    { id: 'swe', name: 'Sweden', iso_code_2: 'SE' },
];

const getFlag = (isoCode: string) => {
    if (!isoCode) return null;
    const FlagComponent = FLAG_REGISTRY[isoCode.toUpperCase()];
    return FlagComponent || null;
};

const renderFlagIcon = (isoCode: string) => {
    const FlagComponent = getFlag(isoCode);
    if (!FlagComponent) return null;
    return (
        <div className="country-flag-circle">
            <FlagComponent />
        </div>
    );
};

/**
 * CountriesSelect - Country selector with flags using Select
 */
export const CountriesSelect = ({
    label = "Country",
    value,
    onChange,
    placeholder = "Select your country…",
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id,
    loading: externalLoading = false,
    required = false,
    lookupService,
    size = 'm'
}: CountriesSelectProps) => {
    const [countries, setCountries] = useState<Country[]>(STATIC_COUNTRIES);
    const [internalLoading, setInternalLoading] = useState(!!lookupService);
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        // Only fetch if lookupService is provided
        if (!lookupService) {
            setInternalLoading(false);
            return;
        }

        const fetchCountries = async () => {
            try {
                setInternalLoading(true);
                const data = await lookupService.fetchCountries();
                if (data && data.length > 0) {
                    setCountries(data);
                }
            } catch {
                // Silent fallback to static data
            } finally {
                setInternalLoading(false);
            }
        };
        fetchCountries();
    }, [lookupService]);

    // Create a map for quick ISO code lookup
    const isoCodeMap = useMemo(() => {
        return countries.reduce((acc, country) => {
            acc[country.id] = country.iso_code_2;
            return acc;
        }, {} as Record<string, string>);
    }, [countries]);

    // Convert countries to Select options format
    const options: SelectOption<string>[] = useMemo(() => {
        return countries.map(country => ({
            value: country.id,
            label: country.name,
            icon: renderFlagIcon(country.iso_code_2),
            searchTerms: [country.iso_code_2]
        }));
    }, [countries]);

    const handleAutoLocate = useCallback(async () => {
        try {
            setLocating(true);
            const response = await fetch('https://ipapi.co/country/');
            const countryCode = await response.text();
            if (countryCode) {
                const country = countries.find(c => c.iso_code_2 === countryCode);
                if (country) onChange(country.id);
            }
        } catch {
            // Silent error handling for auto-locate failure
        } finally {
            setLocating(false);
        }
    }, [countries, onChange]);

    const isLoading = externalLoading || internalLoading;

    if (isLoading) {
        return (
            <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
                {label && <Skeleton variant="text" width="30%" height={20} />}
                <Skeleton variant="rectangular" height={40} width="100%" />
            </div>
        );
    }

    // Custom render for trigger to show flag
    const renderValue = (selected: SelectOption<string> | SelectOption<string>[] | null) => {
        if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            return <span className="select__placeholder">{placeholder}</span>;
        }
        const option = Array.isArray(selected) ? selected[0] : selected;
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                {renderFlagIcon(isoCodeMap[option.value])}
                <span>{option.label}</span>
            </span>
        );
    };

    // Custom render for options to show flag
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
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth={fullWidth}
            name={name}
            id={id}
            size={size}
            className={className}
            searchable
            searchPlaceholder="Find your country…"
            renderValue={renderValue}
            renderOption={renderOption}
            triggerIcon={<Icon size="s"><MapPin /></Icon>}
            onAutoLocate={handleAutoLocate}
            autoLocating={locating}
            autoLocateLabel="Get Current Location"
        />
    );
};

CountriesSelect.displayName = 'CountriesSelect';
export default CountriesSelect;
