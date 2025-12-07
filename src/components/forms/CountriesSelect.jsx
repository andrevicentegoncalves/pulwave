import React, { useState, useEffect } from 'react';
import { lookupService } from '../../services/lookupService';
import { Input } from '../ui';
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
            <FlagComponent />
        </div>
    );
};

/**
 * CountriesSelect Component
 * Specialized dropdown for country selection with:
 * - Flag display
 * - Search functionality
 * - Auto-location detection
 */
const CountriesSelect = ({
    label = "Country",
    value,
    onChange,
    placeholder = "Select your country...",
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id
}) => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch countries from Supabase
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true);
                const data = await lookupService.fetchCountries();

                setCountries(data || []);
            } catch (err) {
                console.error('Error fetching countries:', err);
                setError('Failed to load countries');
            } finally {
                setLoading(false);
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
                onChange(country.id);
            } else {
                console.warn('Country not found in database:', countryCode);
            }
        }
    };

    if (loading) {
        return (
            <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
                {label && <label className="form-label">{label}</label>}
                <Input
                    value="Loading countries..."
                    disabled
                    fullWidth
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
                {label && <label className="form-label">{label}</label>}
                <Input
                    value={error}
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
            getOptionIcon={(country) => renderFlagIcon(country.iso_code_2)}
            getOptionLabel={(country) => country.name}
            getOptionValue={(country) => country.id}
            getSelectedIcon={(country) => renderFlagIcon(country.iso_code_2)}
            placeholder={placeholder}
            searchPlaceholder="Find your country..."
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

CountriesSelect.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string
};

export default CountriesSelect;
