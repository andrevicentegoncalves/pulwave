import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select, AddressAutocomplete, Checkbox } from '../../components/ui';
import CountriesSelect from '../../components/forms/CountriesSelect';
import RegionsSelect from '../../components/forms/RegionsSelect';
import Icon from '../../components/ui/Icon';
import { MapPin } from '../../components/ui/iconLibrary';
import { supabase } from '../../lib/supabaseClient';

const AddressSection = ({
    addressData,
    billingAddressData,
    onChange,
    onSelectChange,

    regions,
    billingRegions,
}) => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [billingCountry, setBillingCountry] = useState(null);
    const [sameAsPrimary, setSameAsPrimary] = useState(true);
    const [citySelected, setCitySelected] = useState(!!addressData.city_name);
    const [billingCitySelected, setBillingCitySelected] = useState(!!billingAddressData.city_name);

    // Fetch selected country details for ISO code
    useEffect(() => {
        const fetchCountry = async () => {
            if (addressData.country_id) {
                const { data } = await supabase
                    .from('countries')
                    .select('iso_code_2')
                    .eq('id', addressData.country_id)
                    .single();
                setSelectedCountry(data);
            }
        };
        fetchCountry();
    }, [addressData.country_id]);

    useEffect(() => {
        const fetchCountry = async () => {
            if (billingAddressData.country_id) {
                const { data } = await supabase
                    .from('countries')
                    .select('iso_code_2')
                    .eq('id', billingAddressData.country_id)
                    .single();
                setBillingCountry(data);
            }
        };
        fetchCountry();
    }, [billingAddressData.country_id]);

    // Copy primary address to billing when toggle is enabled
    useEffect(() => {
        if (sameAsPrimary) {
            // Copy all address fields from primary to billing
            Object.keys(addressData).forEach(key => {
                onChange('billing', { target: { name: key, value: addressData[key] } });
            });
            setBillingCitySelected(citySelected);
        }
    }, [sameAsPrimary, addressData, citySelected]);

    // Handle city autocomplete selection - only save when selected from dropdown
    const handleCitySelect = (type, addressInfo) => {
        onChange(type, { target: { name: 'city_name', value: addressInfo.value } });
        if (type === 'address') {
            setCitySelected(true);
        } else {
            setBillingCitySelected(true);
        }

        if (addressInfo.postalCode) {
            onChange(type, { target: { name: 'postal_code', value: addressInfo.postalCode } });
        }
    };

    // Handle city input change - mark as not selected if user types
    const handleCityChange = (type, value) => {
        onChange(type, { target: { name: 'city_name', value } });
        if (type === 'address') {
            setCitySelected(false);
        } else {
            setBillingCitySelected(false);
        }
    };

    // Handle street autocomplete selection
    const handleStreetSelect = (type, addressInfo) => {
        onChange(type, { target: { name: 'street_name', value: addressInfo.value } });

        if (addressInfo.postalCode) {
            onChange(type, { target: { name: 'postal_code', value: addressInfo.postalCode } });
        }
    };

    const handleToggleSameAsPrimary = (e) => {
        setSameAsPrimary(e.target.checked);
    };

    return (
        <div className="profile-section">
            <h2 className="profile-section__title">
                <Icon size="l">
                    <MapPin />
                </Icon>
                Address
            </h2>
            <div className="profile-section__cards">
                {/* Primary Address */}
                <Card header={<h3>Primary Address</h3>}>
                    <div className="profile-form-grid">
                        {/* Country Dropdown */}
                        <CountriesSelect
                            name="country_id"
                            label="Country"
                            value={addressData.country_id || ''}
                            onChange={(val) => onSelectChange('address', 'country_id', val)}
                            required
                        />

                        {/* Region Dropdown */}
                        <RegionsSelect
                            name="region_id"
                            label="Region/State"
                            countryId={addressData.country_id}
                            value={addressData.region_id || ''}
                            onChange={(val) => onSelectChange('address', 'region_id', val)}
                        />

                        {/* City Autocomplete */}
                        <AddressAutocomplete
                            label="City"
                            type="city"
                            value={addressData.city_name || ''}
                            onChange={(val) => handleCityChange('address', val)}
                            onSelect={(info) => handleCitySelect('address', info)}
                            countryCode={selectedCountry?.iso_code_2 || ''}
                            placeholder="Search for your city..."
                            disabled={!addressData.country_id}
                            fullWidth
                        />
                        {!citySelected && addressData.city_name && (
                            <div style={{ gridColumn: '1 / -1', color: 'var(--color-warning)', fontSize: '0.875rem', marginTop: '-12px' }}>
                                Please select a city from the dropdown suggestions
                            </div>
                        )}

                        <Input
                            label="Postal Code"
                            name="postal_code"
                            value={addressData.postal_code || ''}
                            onChange={(e) => onChange('address', e)}
                            placeholder="Postal Code"
                            fullWidth
                        />

                        <div className="form-item--full">
                            <AddressAutocomplete
                                label="Street Address"
                                type="street"
                                name="street_name"
                                value={addressData.street_name || ''}
                                onChange={(val) => onChange('address', { target: { name: 'street_name', value: val } })}
                                onSelect={(info) => handleStreetSelect('address', info)}
                                countryCode={selectedCountry?.iso_code_2 || ''}
                                city={addressData.city_name || ''}
                                placeholder="Search for your street..."
                                disabled={!addressData.city_name || !citySelected}
                                fullWidth
                            />
                        </div>

                        <div className="form-row-three">
                            <Input
                                label="Number"
                                name="number"
                                value={addressData.number || ''}
                                onChange={(e) => onChange('address', e)}
                                placeholder="No."
                                fullWidth
                            />
                            <Input
                                label="Floor/Unit"
                                name="floor"
                                value={addressData.floor || ''}
                                onChange={(e) => onChange('address', e)}
                                placeholder="Floor"
                                fullWidth
                            />
                            <Select
                                label="Type"
                                value={addressData.type || 'home'}
                                onChange={(val) => onSelectChange('address', 'type', val)}
                                options={[
                                    { value: 'home', label: 'Home' },
                                    { value: 'work', label: 'Work' },
                                    { value: 'billing', label: 'Billing' },
                                ]}
                                fullWidth
                            />
                        </div>
                    </div>
                </Card>

                {/* Billing Address */}
                <Card
                    header={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Billing Address</h3>
                            <Checkbox
                                label="Same as Primary Address"
                                checked={sameAsPrimary}
                                onChange={handleToggleSameAsPrimary}
                            />
                        </div>
                    }
                >
                    <div className="profile-form-grid" style={{ opacity: sameAsPrimary ? 0.6 : 1, pointerEvents: sameAsPrimary ? 'none' : 'auto' }}>
                        {/* Country Dropdown */}
                        <CountriesSelect
                            name="country_id"
                            label="Country"
                            value={billingAddressData.country_id || ''}
                            onChange={(val) => onSelectChange('billing', 'country_id', val)}
                            disabled={sameAsPrimary}
                        />

                        {/* Region Dropdown */}
                        <RegionsSelect
                            name="region_id"
                            label="Region/State"
                            countryId={billingAddressData.country_id}
                            value={billingAddressData.region_id || ''}
                            onChange={(val) => onSelectChange('billing', 'region_id', val)}
                            disabled={!billingAddressData.country_id || sameAsPrimary}
                        />

                        {/* City Autocomplete */}
                        <AddressAutocomplete
                            label="City"
                            type="city"
                            value={billingAddressData.city_name || ''}
                            onChange={(val) => handleCityChange('billing', val)}
                            onSelect={(info) => handleCitySelect('billing', info)}
                            countryCode={billingCountry?.iso_code_2 || ''}
                            placeholder="Search for your city..."
                            disabled={!billingAddressData.country_id || sameAsPrimary}
                            fullWidth
                        />
                        {!billingCitySelected && billingAddressData.city_name && !sameAsPrimary && (
                            <div style={{ gridColumn: '1 / -1', color: 'var(--color-warning)', fontSize: '0.875rem', marginTop: '-12px' }}>
                                Please select a city from the dropdown suggestions
                            </div>
                        )}

                        <Input
                            label="Postal Code"
                            name="postal_code"
                            value={billingAddressData.postal_code || ''}
                            onChange={(e) => onChange('billing', e)}
                            placeholder="Postal Code"
                            fullWidth
                            disabled={sameAsPrimary}
                        />

                        <div className="form-item--full">
                            <AddressAutocomplete
                                label="Street Address"
                                type="street"
                                name="street_name"
                                value={billingAddressData.street_name || ''}
                                onChange={(val) => onChange('billing', { target: { name: 'street_name', value: val } })}
                                onSelect={(info) => handleStreetSelect('billing', info)}
                                countryCode={billingCountry?.iso_code_2 || ''}
                                city={billingAddressData.city_name || ''}
                                placeholder="Search for your street..."
                                disabled={!billingAddressData.city_name || !billingCitySelected || sameAsPrimary}
                                fullWidth
                            />
                        </div>

                        <div className="form-row-three">
                            <Input
                                label="Number"
                                name="number"
                                value={billingAddressData.number || ''}
                                onChange={(e) => onChange('billing', e)}
                                placeholder="No."
                                fullWidth
                                disabled={sameAsPrimary}
                            />
                            <Input
                                label="Floor/Unit"
                                name="floor"
                                value={billingAddressData.floor || ''}
                                onChange={(e) => onChange('billing', e)}
                                placeholder="Floor"
                                fullWidth
                                disabled={sameAsPrimary}
                            />
                            <Select
                                label="Type"
                                value={billingAddressData.type || 'billing'}
                                onChange={(val) => onSelectChange('billing', 'type', val)}
                                options={[
                                    { value: 'home', label: 'Home' },
                                    { value: 'work', label: 'Work' },
                                    { value: 'billing', label: 'Billing' },
                                ]}
                                fullWidth
                                disabled={sameAsPrimary}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

AddressSection.propTypes = {
    addressData: PropTypes.object.isRequired,
    billingAddressData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,

    regions: PropTypes.array.isRequired,
    billingRegions: PropTypes.array.isRequired,
};

export default AddressSection;
