import React, { useState, useEffect, useId, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Dropdown, DropdownItem, useDropdown } from './Dropdown';
import Input from './Input';
import Icon from './Icon';
import { Button } from './index';
import { ChevronDown, Search, MapPin, Check } from './iconLibrary';
import { getUserCountry } from '../../utils/geolocation';
import PropTypes from 'prop-types';

/**
 * Internal component to access DropdownContext
 */
const CountrySelectContent = ({
    countries,
    value,
    onChange,
    searchQuery,
    onSearchChange,
    onAutoLocate,
    locating
}) => {
    const { onClose } = useDropdown();

    const handleAutoLocateClick = async () => {
        await onAutoLocate();
        onClose();
    };

    const handleCountryClick = (countryId) => {
        onChange(countryId);
        onSearchChange({ target: { value: '' } });
        onClose();
    };

    // Filter countries based on search query
    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) {
            return countries;
        }

        const query = searchQuery.toLowerCase();
        return countries.filter(country =>
            country.name.toLowerCase().includes(query) ||
            country.iso_code_2.toLowerCase().includes(query)
        );
    }, [countries, searchQuery]);

    return (
        <div style={{ minWidth: '300px' }}>
            {/* Search Input */}
            <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <Input
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Find your country..."
                    leftIcon={<Icon size="s"><Search /></Icon>}
                    fullWidth
                    autoFocus
                />
            </div>

            {/* Auto-locate Button */}
            <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <Button
                    variant="ghost"
                    size="s"
                    onClick={handleAutoLocateClick}
                    disabled={locating}
                    fullWidth
                    style={{ justifyContent: 'flex-start' }}
                >
                    <Icon size="s"><MapPin /></Icon>
                    {locating ? 'Locating...' : 'Locate automatically'}
                </Button>
            </div>

            {/* Countries List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                        <DropdownItem
                            key={country.id}
                            onClick={() => handleCountryClick(country.id)}
                            icon={
                                country.flag_url ? (
                                    <img
                                        src={country.flag_url}
                                        alt={`${country.name} flag`}
                                        style={{
                                            width: '24px',
                                            height: '16px',
                                            objectFit: 'cover',
                                            borderRadius: '2px'
                                        }}
                                    />
                                ) : null
                            }
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}>
                                <span>{country.name}</span>
                                {value === country.id && (
                                    <Icon size="s" style={{ color: 'var(--primary-color)' }}>
                                        <Check />
                                    </Icon>
                                )}
                            </div>
                        </DropdownItem>
                    ))
                ) : (
                    <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No countries found
                    </div>
                )}
            </div>
        </div>
    );
};

CountrySelectContent.propTypes = {
    countries: PropTypes.array.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onAutoLocate: PropTypes.func.isRequired,
    locating: PropTypes.bool.isRequired
};

/**
 * CountrySelect Component
 * Specialized dropdown for country selection with:
 * - Flag display
 * - Search functionality
 * - Auto-location detection
 * - Visual checkmark for selected country
 */
const CountrySelect = ({
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
    const generatedId = useId();
    const selectId = id || generatedId;

    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [locating, setLocating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    // Fetch countries from Supabase
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('countries')
                    .select('id, name, iso_code_2, flag_url')
                    .order('name');

                if (error) throw error;

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

    // Get selected country details
    const selectedCountry = countries.find(c => c.id === value);
    const displayValue = selectedCountry ? selectedCountry.name : placeholder;

    // Auto-locate user's country
    const handleAutoLocate = async () => {
        try {
            setLocating(true);
            const countryCode = await getUserCountry();

            if (countryCode) {
                const country = countries.find(c => c.iso_code_2 === countryCode);
                if (country) {
                    onChange(country.id);
                } else {
                    console.warn('Country not found in database:', countryCode);
                }
            }
        } catch (err) {
            console.error('Error auto-locating country:', err);
        } finally {
            setLocating(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
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
        <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
            {label && <label htmlFor={selectId} className="form-label">{label}</label>}
            <Dropdown
                trigger={
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Input
                            id={selectId}
                            name={name}
                            value={displayValue}
                            placeholder={placeholder}
                            disabled={disabled}
                            readOnly
                            leftIcon={selectedCountry && selectedCountry.flag_url ? (
                                <img
                                    src={selectedCountry.flag_url}
                                    alt={`${selectedCountry.name} flag`}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        objectFit: 'cover',
                                        borderRadius: '50%'
                                    }}
                                />
                            ) : null}
                            rightIcon={<Icon size="s"><ChevronDown /></Icon>}
                            className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
                            fullWidth
                        />
                    </div>
                }
                align="left"
            >
                <CountrySelectContent
                    countries={countries}
                    value={value}
                    onChange={onChange}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    onAutoLocate={handleAutoLocate}
                    locating={locating}
                />
            </Dropdown>
        </div>
    );
};

CountrySelect.propTypes = {
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

export default CountrySelect;
