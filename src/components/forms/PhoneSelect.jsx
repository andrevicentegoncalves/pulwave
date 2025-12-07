import React, { useState, useEffect } from 'react';
import { lookupService } from '../../services/lookupService';
import { Input, Skeleton } from '../ui';
import { getUserCountry } from '../../utils/geolocation';
import PropTypes from 'prop-types';
import * as flags from 'country-flag-icons/react/3x2';
import IconSelect from './IconSelect';

/**
 * Helper function to get flag component by ISO code
 */
const getFlag = (isoCode) => {
    if (!isoCode) return null;
    const FlagComponent = flags[isoCode.toUpperCase()];
    return FlagComponent || null;
};

/**
 * Helper to render flag icon
 */
const renderFlagIcon = (isoCode) => {
    const FlagComponent = getFlag(isoCode);
    if (!FlagComponent) return null;

    return (
        <div className="country-flag-circle">
            <FlagComponent className="country-flag-img" />
        </div>
    );
};

/**
 * PhoneSelect Component
 * Specialized dropdown for selecting phone country codes
 * Displays: Flag + Phone Code (e.g., 🇵🇹 +351)
 */
const PhoneSelect = ({
    label = "Phone Code",
    value,
    onChange,
    placeholder = "Select code...",
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id,
    loading: externalLoading = false
}) => {
    const [countries, setCountries] = useState([]);
    const [internalLoading, setInternalLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch countries with phone codes from Supabase
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setInternalLoading(true);
                const data = await lookupService.getCountriesWithPhoneCodes();



                setCountries(data || []);
            } catch (err) {
                console.error('Error fetching phone codes:', err);
                setError('Failed to load phone codes');
            } finally {
                setInternalLoading(false);
            }
        };

        fetchCountries();
    }, []);

    // Auto-locate user's country
    const handleAutoLocate = async () => {
        const countryCode = await getUserCountry();

        if (countryCode) {
            const country = countries.find(c => c.iso_code_2 === countryCode);
            if (country) {
                // Return the phone code (e.g., "+351")
                onChange(country.phone_code);
            } else {
                console.warn('Country not found for phone code:', countryCode);
            }
        }
    };

    const isLoading = externalLoading || internalLoading;

    if (isLoading) {
        return (
            <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
                {label && <Skeleton variant="text" width="30%" height={20} style={{ marginBottom: '0.5rem' }} />}
                <Skeleton
                    variant="rectangular"
                    height={40}
                    width="100%"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
                {label && <label className="form-label">{label}</label>}
                <Input
                    value="Error loading codes"
                    disabled
                    fullWidth
                />
            </div>
        );
    }

    return (
        <IconSelect
            label={label}
            value={value}
            onChange={onChange}
            options={countries}
            // Use unique ID for keys to avoid duplicates
            getOptionKey={(country) => country.id}
            // Icon is the flag
            getOptionIcon={(country) => renderFlagIcon(country.iso_code_2)}
            // Label in dropdown: "Portugal (+351)"
            getOptionLabel={(country) => `${country.name} (${country.phone_code})`}
            // Value is the phone code: "+351"
            getOptionValue={(country) => country.phone_code}
            // Selected display: Flag + Code only (e.g., "🇵🇹 +351")
            getSelectedIcon={(country) => renderFlagIcon(country.iso_code_2)}
            getSelectedLabel={(country) => country.phone_code}
            placeholder={placeholder}
            searchPlaceholder="Search country or code..."
            showAutoLocate={true}
            onAutoLocate={handleAutoLocate}
            disabled={disabled}
            fullWidth={fullWidth}
            className={className}
            name={name}
            id={id}
        />
    );
};

PhoneSelect.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    loading: PropTypes.bool
};

export default PhoneSelect;
