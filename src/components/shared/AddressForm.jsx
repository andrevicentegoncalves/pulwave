import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Tooltip, ChevronDown } from '../ui';
import { CountriesSelect, AddressAutocomplete } from '../forms';

import { lookupService } from '../../services/lookupService';
import { addressService } from '../../services/addressService';

const AddressForm = ({
    value = {},
    onChange,
    title = "Address",
    disabled = false,
    showAddressType = false,
    required = false,
}) => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [hierarchyDisplay, setHierarchyDisplay] = useState([]);

    useEffect(() => {
        const fetchCountry = async () => {
            if (!value.country_id) {
                setSelectedCountry(null);
                return;
            }

            const data = await lookupService.getCountryById(value.country_id);
            setSelectedCountry(data);
        };

        fetchCountry();
    }, [value.country_id]);

    useEffect(() => {
        if (!value.nominatim_data?.address) {
            setHierarchyDisplay([]);
            return;
        }

        const addr = value.nominatim_data.address;
        const hierarchy = [];

        // District is in county field
        const districtName = addr.county;
        const regionName = addressService.getRegionFromDistrict(districtName);

        if (regionName) hierarchy.push({ name: regionName, type: 'Region', level: 1 });

        if (districtName) {
            const displayDistrict = districtName === 'Lisbon' ? 'Lisboa' : districtName;
            hierarchy.push({ name: displayDistrict, type: 'District', level: 2 });
        }

        // Municipality from municipality field
        if (addr.municipality) {
            hierarchy.push({ name: addr.municipality, type: 'Municipality', level: 3 });
        }

        // City/Town
        const city = addr.city || addr.town || addr.village;
        if (city && city !== addr.municipality) {
            hierarchy.push({ name: city, type: 'City', level: 4 });
        }

        // Parish from suburb
        const parish = addr.suburb || addr.neighbourhood || addr.city_district;
        if (parish && parish !== city) {
            hierarchy.push({ name: parish, type: 'Parish', level: 5 });
        }

        setHierarchyDisplay(hierarchy);
    }, [value.nominatim_data]);

    const handleChange = (e) => {
        const { name, value: fieldValue } = e.target;

        // Clear nominatim_data when street_name is manually edited
        if (name === 'street_name') {
            onChange({ ...value, [name]: fieldValue, nominatim_data: null });
        } else {
            onChange({ ...value, [name]: fieldValue });
        }
    };

    const handleSelectChange = (name, fieldValue) => {
        onChange({ ...value, [name]: fieldValue });
    };

    const handleStreetSelect = (info) => {
        const addr = info.address || {};
        onChange({
            ...value,
            street_name: info.value,
            city_name: addr.city || addr.town || addr.village || value.city_name,
            postal_code: addr.postcode || info.postalCode || value.postal_code,
            nominatim_data: {
                address: info.address,
                lat: info.lat,
                lon: info.lon,
                place_id: info.place_id
            }
        });
    };

    return (
        <Card header={<h3>{title}</h3>}>
            <div className="profile-form-grid">
                {/* Hierarchy Breadcrumb - Shows only after street is selected from autocomplete */}
                {(hierarchyDisplay.length > 0 || value.nominatim_data) && (selectedCountry || hierarchyDisplay.length > 0) && (
                    <div className="address-form__breadcrumb">
                        {/* Country */}
                        {selectedCountry && (
                            <div className="address-form__breadcrumb-item">
                                <Tooltip content="Country" direction="top">
                                    <span className="address-form__breadcrumb-icon">🌍</span>
                                </Tooltip>
                                <span className="address-form__breadcrumb-text address-form__breadcrumb-text--country">
                                    {selectedCountry.name}
                                </span>
                                {hierarchyDisplay.length > 0 && <span className="address-form__breadcrumb-separator">›</span>}
                            </div>
                        )}

                        {/* Rest of hierarchy */}
                        {hierarchyDisplay.map((item, index) => {
                            const getIcon = (type) => {
                                switch (type) {
                                    case 'Region': return '🗺️';
                                    case 'District': return '📍';
                                    case 'Municipality': return '🏛️';
                                    case 'City': return '🏙️';
                                    case 'Parish': return '🚩';
                                    default: return '📍';
                                }
                            };

                            return (
                                <React.Fragment key={index}>
                                    {index > 0 && <span className="address-form__breadcrumb-separator">›</span>}
                                    <div className="address-form__breadcrumb-item">
                                        <Tooltip content={item.type} direction="top">
                                            <span className="address-form__breadcrumb-icon">{getIcon(item.type)}</span>
                                        </Tooltip>
                                        <span className="address-form__breadcrumb-text">
                                            {item.name}
                                        </span>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}


                {/* Country Row */}
                <div className="form-row-two">
                    <CountriesSelect
                        label="Country"
                        value={value.country_id || ''}
                        onChange={(val) => handleSelectChange('country_id', val)}
                        required={required}
                        disabled={disabled}
                        fullWidth
                    />
                </div>

                <div className="form-item--full">
                    <AddressAutocomplete
                        label="Street Address"
                        type="street"
                        value={value.street_name || ''}
                        onChange={(val) => handleChange({ target: { name: 'street_name', value: val } })}
                        onClear={() => onChange({ ...value, street_name: '', nominatim_data: null })}
                        onSelect={handleStreetSelect}
                        city={value.district_name || ''}
                        countryCode={selectedCountry?.iso_code_2 || ''}
                        placeholder={value.district_name ? `Search streets in ${value.district_name}...` : "Search for your street address..."}
                        disabled={!value.country_id || disabled}
                        required={required}
                        fullWidth
                    />
                </div>

                <div className="form-row-three">
                    <Input label="Number" name="number" value={value.number || ''} onChange={handleChange} placeholder="123" disabled={disabled} fullWidth />
                    <Input label="Floor/Unit" name="floor" value={value.floor || ''} onChange={handleChange} placeholder="2A" disabled={disabled} fullWidth />
                    <Input label="Postal Code" name="postal_code" value={value.postal_code || ''} onChange={handleChange} placeholder="Auto-filled" disabled={disabled} fullWidth />
                </div>

                {showAddressType && (
                    <div className="form-item--full">
                        <Input
                            label="Address Type"
                            name="type"
                            value={value.type || 'home'}
                            onChange={handleChange}
                            as="select"
                            disabled={disabled}
                            fullWidth
                            rightIcon={<ChevronDown size={20} />}
                            className="form-input--select-custom"
                        >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                        </Input>
                    </div>
                )}
            </div >
        </Card >
    );
};

AddressForm.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    showAddressType: PropTypes.bool,
    required: PropTypes.bool,
};

export default AddressForm;
