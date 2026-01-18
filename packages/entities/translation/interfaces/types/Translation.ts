/**
 * Translation Types
 */

export interface Locale {
    code: string;
    name: string;
    native_name?: string;
    is_rtl?: boolean;
    is_default: boolean;
    is_enabled: boolean;
    flag_icon?: string;
}

export interface UITranslation {
    id: string;
    locale: string;
    namespace: string;
    key: string;
    value: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface SchemaTranslation {
    id: string;
    table_name: string;
    column_name: string;
    locale: string;
    translation: string;
    is_active: boolean;
    created_at?: string;
}

export interface ContentTranslation {
    id: string;
    entity_type: string;
    entity_id: string;
    field_name: string;
    locale: string;
    translated_content: string;
    is_active: boolean;
    created_at?: string;
}

export interface EnumTranslation {
    id: string;
    enum_name: string;
    enum_value: string;
    locale: string;
    translation: string;
    is_active: boolean;
    created_at?: string;
}

export interface MasterDataTranslation {
    id: string;
    value_id: string;
    locale: string;
    translation: string;
    is_active: boolean;
    created_at?: string;
}

export interface TranslationBundle {
    id: string;
    locale: string;
    namespace: string;
    content: Record<string, string>;
    hash: string;
    created_at?: string;
}

export interface UserPreference {
    id: string;
    profile_id: string;
    locale: string;
    updated_at?: string;
}

export interface TranslationParams {
    locale?: string;
    namespace?: string;
    limit?: number;
    offset?: number;
    [key: string]: string | number | boolean | undefined;
}

export interface DbTable {
    name: string;
    schema: string;
    description?: string;
}

export interface DbColumn {
    name: string;
    type: string;
    is_nullable: boolean;
    default_value?: string;
    comment?: string;
}

export interface DbEnum {
    name: string;
    schema: string;
    values: string[];
}

