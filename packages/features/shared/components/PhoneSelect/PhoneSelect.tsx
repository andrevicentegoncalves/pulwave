/**
 * PhoneSelect
 * 
 * Specialized dropdown for selecting phone country codes.
 * Can use a lookupService for dynamic data, or falls back to a static list.
 * Now using Select with custom renderValue/renderOption.
 * 
 * @package @pulwave/features-forms
 */
import { useState, useEffect, useCallback, useMemo, type ComponentType } from 'react';
import { Select, Skeleton, Icon, MapPin, Input } from '@pulwave/ui';
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
    phone_code: string;
}

export interface LookupServiceInterface {
    getCountriesWithPhoneCodes: () => Promise<Country[]>;
}

export interface PhoneSelectProps {
    /** Label */
    label?: string;
    /** Selected phone code value */
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
    /** Optional lookup service instance - if not provided, uses static data */
    lookupService?: LookupServiceInterface;
    /** Size variant */
    size?: 'xs' | 's' | 'm' | 'l';
}

// Static fallback data for common countries
const STATIC_COUNTRIES: Country[] = [
    { id: '1', name: 'United States', iso_code_2: 'US', phone_code: '+1' },
    { id: '2', name: 'United Kingdom', iso_code_2: 'GB', phone_code: '+44' },
    { id: '3', name: 'Canada', iso_code_2: 'CA', phone_code: '+1' },
    { id: '4', name: 'Australia', iso_code_2: 'AU', phone_code: '+61' },
    { id: '5', name: 'Germany', iso_code_2: 'DE', phone_code: '+49' },
    { id: '6', name: 'France', iso_code_2: 'FR', phone_code: '+33' },
    { id: '7', name: 'Spain', iso_code_2: 'ES', phone_code: '+34' },
    { id: '8', name: 'Italy', iso_code_2: 'IT', phone_code: '+39' },
    { id: '9', name: 'Portugal', iso_code_2: 'PT', phone_code: '+351' },
    { id: '10', name: 'Brazil', iso_code_2: 'BR', phone_code: '+55' },
    { id: '11', name: 'Mexico', iso_code_2: 'MX', phone_code: '+52' },
    { id: '12', name: 'Japan', iso_code_2: 'JP', phone_code: '+81' },
    { id: '13', name: 'China', iso_code_2: 'CN', phone_code: '+86' },
    { id: '14', name: 'India', iso_code_2: 'IN', phone_code: '+91' },
    { id: '15', name: 'Netherlands', iso_code_2: 'NL', phone_code: '+31' },
    { id: '16', name: 'Belgium', iso_code_2: 'BE', phone_code: '+32' },
    { id: '17', name: 'Switzerland', iso_code_2: 'CH', phone_code: '+41' },
    { id: '18', name: 'Ireland', iso_code_2: 'IE', phone_code: '+353' },
    { id: '19', name: 'Poland', iso_code_2: 'PL', phone_code: '+48' },
    { id: '20', name: 'Sweden', iso_code_2: 'SE', phone_code: '+46' },
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
            <FlagComponent className="country-flag-img" />
        </div>
    );
};

/**
 * PhoneSelect - Phone country code selector using Select
 */
export const PhoneSelect = ({
    label = "Phone Code",
    value,
    onChange,
    placeholder = "Select code…",
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id,
    loading: externalLoading = false,
    lookupService,
    size = 'm'
}: PhoneSelectProps) => {
    const [countries, setCountries] = useState<Country[]>(STATIC_COUNTRIES);
    const [internalLoading, setInternalLoading] = useState(!!lookupService);
    const [error, setError] = useState<string | null>(null);
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
                const data = await lookupService.getCountriesWithPhoneCodes();
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

    // Create maps for quick lookup
    const isoToPhoneCodeMap = useMemo(() => {
        return countries.reduce((acc, country) => {
            acc[country.iso_code_2] = country.phone_code;
            return acc;
        }, {} as Record<string, string>);
    }, [countries]);

    // Convert countries to Select options format - use iso_code_2 as unique key
    const options: SelectOption<string>[] = useMemo(() => {
        return countries.map(country => ({
            value: country.iso_code_2, // Use iso_code_2 as unique key
            label: `${country.name} (${country.phone_code})`,
            icon: renderFlagIcon(country.iso_code_2),
            searchTerms: [country.name, country.iso_code_2, country.phone_code]
        }));
    }, [countries]);

    const handleAutoLocate = useCallback(async () => {
        try {
            setLocating(true);
            const response = await fetch('https://ipapi.co/country/');
            const countryCode = await response.text();
            if (countryCode) {
                const country = countries.find(c => c.iso_code_2 === countryCode);
                if (country) onChange(country.iso_code_2); // Return iso_code_2 since that's our value
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

    if (error) {
        return (
            <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
                {label && <label className="form-label">{label}</label>}
                <Input value="Error loading codes" disabled fullWidth />
            </div>
        );
    }

    // Custom render for trigger - show flag + phone code only
    const renderValue = (selected: SelectOption<string> | SelectOption<string>[] | null) => {
        if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            return <span className="select__placeholder">{placeholder}</span>;
        }
        const option = Array.isArray(selected) ? selected[0] : selected;
        const phoneCode = isoToPhoneCodeMap[option.value]; // value is iso_code_2
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                {renderFlagIcon(option.value)}
                <span>{phoneCode}</span>
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
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth={fullWidth}
            name={name}
            id={id}
            size={size}
            className={className}
            searchable
            searchPlaceholder="Search country or code…"
            renderValue={renderValue}
            renderOption={renderOption}
            onAutoLocate={handleAutoLocate}
            autoLocating={locating}
            autoLocateLabel="Get Current Location"
            triggerIcon={<Icon size="s"><MapPin /></Icon>}
        />
    );
};

PhoneSelect.displayName = 'PhoneSelect';
export default PhoneSelect;
