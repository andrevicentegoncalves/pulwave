/**
 * Contact Type
 */
export interface Contact {
    id: string;
    profile_id: string;
    organization_id?: string;
    contact_type: string;
    contact_value: string;
    country_code?: string;
    name?: string;
    relationship?: string;
    is_primary: boolean;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

