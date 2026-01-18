/**
 * AddressAutocomplete
 * 
 * Autocomplete input for addresses using Nominatim API.
 * Supports city and street search.
 * 
 * @package @pulwave/features-forms
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Input, Icon, MapPin, Search } from '@pulwave/ui';
import { searchCity, searchStreet, debounce, NominatimResult, NominatimAddress } from '../../utils/nominatim';

export interface AddressAutocompleteSelectEvent {
    value: string;
    fullAddress: string;
    address: NominatimAddress;
    lat: string;
    lon: string;
    postalCode: string;
    place_id: string;
}

export interface AddressAutocompleteProps {
    value?: string;
    onChange: (value: string) => void;
    onSelect?: (event: AddressAutocompleteSelectEvent) => void;
    type?: 'city' | 'street';
    countryCode?: string;
    city?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    name?: string;
    id?: string;
    required?: boolean;
    onClear?: () => void;
}

export const AddressAutocomplete = ({
    value = '',
    onChange,
    onSelect,
    type = 'city',
    countryCode = '',
    city = '',
    label,
    placeholder,
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id,
    required = false,
    onClear
}: AddressAutocompleteProps) => {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const fetchSuggestions = useCallback(async (query: string) => {
        if (!query || query.trim().length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);

        try {
            let results: NominatimResult[] = [];

            if (type === 'city') {
                results = await searchCity(query, countryCode);
            } else if (type === 'street') {
                results = await searchStreet(query, city, countryCode);
            }

            setSuggestions(results);
            setIsOpen(results.length > 0);
        } catch {
            // Silent error handling - clear suggestions on failure
            setSuggestions([]);
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    }, [type, countryCode, city]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFetch = useCallback(
        debounce((query: string) => fetchSuggestions(query), 300),
        [fetchSuggestions]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
        debouncedFetch(newValue);
        setSelectedIndex(-1);
        if (newValue === '' && onClear) {
            onClear();
        }
    };

    const handleSelect = (suggestion: NominatimResult) => {
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
                place_id: suggestion.place_id
            });
        }
    };

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatOption = (suggestion: NominatimResult) => {
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

    return (
        <div
            ref={dropdownRef}
            className={`form-item address-autocomplete ${fullWidth ? 'form-item--full-width' : ''} ${className}`}
        >
            {label && <label htmlFor={id} className="form-label">{label}</label>}

            <div className="input-wrapper">
                <Input
                    ref={inputRef}
                    id={id}
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    leftIcon={<Icon size="s">{type === 'city' ? <MapPin /> : <Search />}</Icon>}
                    fullWidth
                    autoComplete="off"
                    required={required}
                />
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="address-autocomplete__dropdown">
                    {loading && (
                        <div className="address-autocomplete__loading">
                            Loading…
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
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="address-autocomplete__item-primary">
                                    {formatted.primary}
                                </div>
                                {formatted.secondary && (
                                    <div className="address-autocomplete__item-secondary">
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

AddressAutocomplete.displayName = 'AddressAutocomplete';
export default AddressAutocomplete;
