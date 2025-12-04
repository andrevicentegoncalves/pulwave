import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from '../ui';
import { MapPin, Search } from '../ui/iconLibrary';
import { searchCity, searchStreet, debounce } from '../../utils/nominatim';

/**
 * AddressAutocomplete Component
 * Autocomplete input for addresses using Nominatim API
 * Supports city, street, and postal code search with auto-fill
 */
const AddressAutocomplete = (props) => {
    const {
        value = '',
        onChange,
        onSelect,
        type = 'city', // 'city' or 'street'
        countryCode = '',
        city = '',
        label,
        placeholder,
        disabled = false,
        fullWidth = false,
        className = '',
        name,
        id
    } = props;
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Update input value when prop changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Fetch suggestions from API
    const fetchSuggestions = useCallback(async (query) => {
        if (!query || query.trim().length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);

        try {
            let results = [];

            if (props.fetchSuggestions) {
                // Use custom fetcher if provided
                results = await props.fetchSuggestions(query, { type, countryCode, city });
            } else if (type === 'city') {
                results = await searchCity(query, countryCode);
            } else if (type === 'street') {
                results = await searchStreet(query, city, countryCode);
            }

            setSuggestions(results);
            setIsOpen(results.length > 0);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    }, [type, countryCode, city, props.fetchSuggestions]);

    // Debounced search
    const debouncedFetch = useCallback(
        debounce((query) => fetchSuggestions(query), 300),
        [fetchSuggestions]
    );

    // Handle input change
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
        debouncedFetch(newValue);
        setSelectedIndex(-1);
    };

    // Handle suggestion selection
    const handleSelect = (suggestion) => {
        const address = suggestion.address || {};

        let displayValue = '';
        if (type === 'city') {
            displayValue = address.city || address.town || address.village ||
                address.municipality || address.county ||
                suggestion.display_name.split(',')[0].trim();
        } else if (type === 'street') {
            displayValue = address.road || suggestion.display_name.split(',')[0].trim();
        }

        setInputValue(displayValue);
        onChange(displayValue);
        setIsOpen(false);
        setSuggestions([]);

        if (onSelect) {
            onSelect({
                value: displayValue,
                fullAddress: suggestion.display_name,
                address: address,
                lat: suggestion.lat,
                lon: suggestion.lon,
                postalCode: address.postcode || '',
                place_id: suggestion.place_id  // Add place_id for deduplication
            });
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSelect(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSuggestions([]);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format suggestion display
    const defaultFormatOption = (suggestion) => {
        const address = suggestion.address || {};

        if (type === 'city') {
            const cityName = address.city || address.town || address.village ||
                address.municipality || address.county ||
                suggestion.display_name.split(',')[0].trim();
            const state = address.state || address.region || '';
            const country = address.country || '';

            return {
                primary: cityName,
                secondary: [state, country].filter(Boolean).join(', ')
            };
        } else if (type === 'street') {
            const road = address.road || '';
            const city = address.city || address.town || '';
            const postcode = address.postcode || '';

            return {
                primary: road,
                secondary: [city, postcode].filter(Boolean).join(', ')
            };
        }

        return {
            primary: suggestion.display_name.split(',')[0],
            secondary: suggestion.display_name.split(',').slice(1).join(',')
        };
    };

    const formatOption = props.formatOption || defaultFormatOption;

    return (
        <div
            ref={dropdownRef}
            className={`form-item address-autocomplete ${fullWidth ? 'form-item--full-width' : ''} ${className}`}
            style={{ position: 'relative' }}
        >
            {label && <label htmlFor={id} className="form-label">{label}</label>}

            <Input
                ref={inputRef}
                id={id}
                name={name}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                leftIcon={<Icon size="s">{type === 'city' ? <MapPin /> : <Search />}</Icon>}
                fullWidth
                autoComplete="off"
            />

            {isOpen && suggestions.length > 0 && (
                <div
                    className="address-autocomplete__dropdown"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: 'var(--bg-card, #ffffff)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-m)',
                        boxShadow: 'var(--shadow-xl)',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        zIndex: 9999,
                        isolation: 'isolate'
                    }}
                >
                    {loading && (
                        <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Loading...
                        </div>
                    )}

                    {!loading && suggestions.map((suggestion, index) => {
                        const formatted = formatOption(suggestion);
                        return (
                            <button
                                key={suggestion.place_id}
                                type="button"
                                onClick={() => handleSelect(suggestion)}
                                className={`address-autocomplete__item ${index === selectedIndex ? 'address-autocomplete__item--selected' : ''}`}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: 'none',
                                    background: index === selectedIndex ? 'var(--hover-color)' : 'transparent',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div style={{
                                    fontWeight: 500,
                                    color: 'var(--text-primary)'
                                }}>
                                    {formatted.primary}
                                </div>
                                {formatted.secondary && (
                                    <div style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {formatted.secondary}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

AddressAutocomplete.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    type: PropTypes.oneOf(['city', 'street']),
    countryCode: PropTypes.string,
    city: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    fetchSuggestions: PropTypes.func,
    formatOption: PropTypes.func,
};

export default AddressAutocomplete;
