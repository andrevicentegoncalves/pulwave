/**
 * AddressForm Types
 */

export interface NominatimData {
    address: {
        road?: string;
        house_number?: string;
        postcode?: string;
        city?: string;
        town?: string;
        village?: string;
        suburb?: string;
        county?: string;
        state?: string;
        country?: string;
        country_code?: string;
    };
    display_name: string;
    lat: string;
    lon: string;
}

export interface AddressValue {
    country_id: string;
    region_division_id: string;
    city_name: string;
    street_name: string;
    number: string;
    floor: string;
    postal_code: string;
    type: 'home' | 'work' | 'other' | 'billing' | string;
}
