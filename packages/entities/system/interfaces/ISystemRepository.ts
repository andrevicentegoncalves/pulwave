
export interface Country {
    id: string;
    name: string;
    iso_code_2: string;
    phone_code?: string;
}

export interface Division {
    id: string;
    name: string;
    country_id: string;
    code?: string;
}

export interface Locality {
    id: string;
    name: string;
    region_id: string;
}

import { SystemSetting, SystemFeatureFlag, RetentionPolicy, DashboardStats, ActivityLog } from './types/System';
import { MasterDataType, MasterDataValue } from './types/MasterData';

import type { IVersionedRepository } from '../../_infrastructure/interfaces';
export interface ISystemRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    // Countries
    getCountries(): Promise<Country[]>;
    getCountryById(id: string): Promise<Country | null>;
    getCountryByCode(code: string): Promise<Country | null>;
    getCountriesWithPhoneCodes(): Promise<Country[]>;

    // Divisions/Regions
    getAdministrativeDivisions(countryId: string, type?: string | null): Promise<Division[]>;

    // Localities
    getLocalities(regionId: string): Promise<Locality[]>;

    // Permissions
    getPermissions(): Promise<string[]>;
    getAllUserPermissions(userId: string): Promise<string[]>;
    getRolePermissions(role: string): Promise<string[]>;

    // System Settings & Config
    getSystemSettings(): Promise<SystemSetting[]>;
    updateSystemSetting(key: string, value: any): Promise<SystemSetting>;
    upsertSystemSetting(setting: Partial<SystemSetting>): Promise<SystemSetting>;

    // Feature Flags
    getFeatureFlags(): Promise<SystemFeatureFlag[]>;
    updateFeatureFlag(key: string, updates: Partial<SystemFeatureFlag>): Promise<SystemFeatureFlag>;
    createFeatureFlag(flag: Partial<SystemFeatureFlag>): Promise<SystemFeatureFlag>;
    deleteFeatureFlag(key: string): Promise<void>;

    // Retention Policies
    getRetentionPolicies(): Promise<RetentionPolicy[]>;
    updateRetentionPolicy(id: string, updates: Partial<RetentionPolicy>): Promise<RetentionPolicy>;

    // Timezones
    getTimezones(): Promise<{ value: string; label: string; utcOffset: string }[]>;

    // Master Data
    getMasterDataTypes(): Promise<MasterDataType[]>;
    upsertMasterDataType(type: Partial<MasterDataType>): Promise<MasterDataType>;
    deleteMasterDataType(id: string): Promise<void>;
    getMasterDataValues(typeId: string): Promise<MasterDataValue[]>;
    upsertMasterDataValue(value: Partial<MasterDataValue>): Promise<MasterDataValue>;
    deleteMasterDataValue(id: string): Promise<void>;

    // Translatable configuration
    getTranslatableTables(): Promise<string[]>;
    getTranslatableEnums(): Promise<string[]>;
    getCommonTranslatableColumns(): Promise<string[]>;

    // Generic Table Access (use sparingly)
    getTableData(table: string, params?: Record<string, any>): Promise<any[]>;
    saveTableRecord(table: string, record: Record<string, any>): Promise<any>;
    deleteTableRecord(table: string, id: string): Promise<void>;

    // Dashboard & Logs
    getDashboardStats(): Promise<DashboardStats>;
    getActivityLogs(params?: Record<string, any>): Promise<{ data: ActivityLog[]; count: number | null }>;
    getTranslationStats(): Promise<Record<string, any>>;
}


