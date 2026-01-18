/**
 * Address Types
 */
export interface Address {
    id: string;
    profile_id: string;
    address_type: string;
    country_id?: string;
    region_id?: string;
    region_division_id?: string;
    city_name?: string;
    street_name?: string;
    number?: string;
    floor?: string;
    postal_code?: string;
    created_at?: string;
    updated_at?: string;
}

export type AddressInsertDto = Omit<Address, 'id' | 'created_at' | 'updated_at'>;
export type AddressUpdateDto = Partial<AddressInsertDto>;

