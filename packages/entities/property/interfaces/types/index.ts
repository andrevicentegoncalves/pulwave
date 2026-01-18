export interface Building {
    id: string;
    owner_id: string;
    name: string;
    address: string;
    created_at?: string;
    updated_at?: string;
    image_url?: string;
}

export interface Unit {
    id: string;
    building_id: string;
    status: 'Active' | 'Maintenance' | 'Vacant' | 'Occupied';
    unit_number: string;
    floor_plan?: string;
    created_at?: string;
    updated_at?: string;
}


