/**
 * Master Data Types
 */
export interface MasterDataType {
    id: string;
    key: string;
    name: string;
    description?: string;
    is_system?: boolean;
}

export interface MasterDataValue {
    id: string;
    type_id: string;
    value: string;
    label: string;
    is_active: boolean;
    sort_order?: number;
    metadata?: Record<string, unknown>;
}


