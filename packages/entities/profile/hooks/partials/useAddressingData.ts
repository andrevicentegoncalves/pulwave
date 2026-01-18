/**
 * useAddressingData Partial Hook
 * Manages physical and billing addresses.
 */
import React, { useState } from 'react';
import { FullProfile } from '../../interfaces/types/FullProfile';

export interface AddressFormData {
    country_id: string;
    region_division_id: string;
    city_name: string;
    street_name: string;
    number: string;
    floor: string;
    postal_code: string;
    type: 'home' | 'work' | 'other' | 'billing' | string;
    nominatim_data?: any;
}

export interface UseAddressingDataReturn {
    addressData: AddressFormData;
    setAddressData: React.Dispatch<React.SetStateAction<AddressFormData>>;
    billingAddressData: AddressFormData;
    setBillingAddressData: React.Dispatch<React.SetStateAction<AddressFormData>>;
    mapProfileToAddressingData: (profile: FullProfile | null) => void;
}

export const useAddressingData = (): UseAddressingDataReturn => {
    const [addressData, setAddressData] = useState<AddressFormData>({
        country_id: '',
        region_division_id: '',
        city_name: '',
        street_name: '',
        number: '',
        floor: '',
        postal_code: '',
        type: 'home',
    });

    const [billingAddressData, setBillingAddressData] = useState<AddressFormData>({
        country_id: '',
        region_division_id: '',
        city_name: '',
        street_name: '',
        number: '',
        floor: '',
        postal_code: '',
        type: 'billing',
    });

    const mapAddressToFormData = (address: any, type = 'home'): AddressFormData | null => {
        if (!address) return null;

        return {
            country_id: address.country_id || '',
            region_division_id: address.region_division_id || address.region_id || '',
            city_name: address.city_name || '',
            street_name: address.street_name || '',
            number: address.number || '',
            floor: address.floor || '',
            postal_code: address.postal_code || '',
            type: address.address_type || type,
        };
    };

    const mapProfileToAddressingData = (profile: FullProfile | null) => {
        if (!profile) return;

        const primaryAddress = profile.primary_address || null;
        const billingAddress = profile.billing_address || null;

        const mappedPrimary = mapAddressToFormData(primaryAddress, 'home');
        if (mappedPrimary) setAddressData(mappedPrimary);

        const mappedBilling = mapAddressToFormData(billingAddress, 'billing');
        if (mappedBilling) setBillingAddressData(mappedBilling);
    };

    return {
        addressData,
        setAddressData,
        billingAddressData,
        setBillingAddressData,
        mapProfileToAddressingData,
    };
};
