import { createContext, useContext, useMemo, type ReactNode } from 'react';

// Define the shape of the User object as used in admin
interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    app_role?: string;
    profile_id?: string;
}

// Define the shape of Permission and Grant objects
export interface Permission {
    id: string;
    permission_name: string;
    permission_category?: string;
    description?: string;
    is_active: boolean;
}

export interface PermissionGrant {
    id: string;
    permission_id: string;
    is_granted: boolean;
    granted_at?: string;
    granted_by?: string;
    reason?: string;
}

// Define the Service Interface required by the features
export interface AdminService {
    getAllPermissions: () => Promise<Permission[]>;
    getUserPermissionGrants: (userId: string) => Promise<PermissionGrant[]>;
    grantUserPermission: (userId: string, permissionId: string, grantedBy: string, reason: string) => Promise<any>;
    revokeUserPermission: (userId: string, permissionId: string) => Promise<any>;
    getRolePermissions: (roleId?: string) => Promise<any[]>;
    getAllUserPermissions: () => Promise<any[]>;

    // Translations
    getUITranslations: (params: any) => Promise<any>;
    getSchemaTranslations: (params: any) => Promise<any>;
    getEnumTranslations: (params: any) => Promise<any>;
    getContentTranslations: (params: any) => Promise<any>;
    getMasterDataTranslations: (params: any) => Promise<any>;
    getSupportedLocales: () => Promise<any[]>;
    saveUITranslation: (translation: any) => Promise<any>;
    upsertBatchUITranslations: (translations: any[]) => Promise<any>;
    saveSchemaTranslation: (translation: any) => Promise<any>;
    saveEnumTranslation: (translation: any) => Promise<any>;
    saveContentTranslation: (translation: any) => Promise<any>;
    saveMasterDataTranslation: (translation: any) => Promise<any>;
    deleteUITranslation: (id: string) => Promise<any>;
    generateTranslationBundles: (locale: string | null) => Promise<any>;
    getMasterDataTypes: () => Promise<any[]>;
    getMasterDataValues: (typeId: string) => Promise<any[]>;
    getTranslatableTables: () => Promise<any[]>;
    getTranslatableEnums: () => Promise<any[]>;

    // Users
    getUsers: (options?: any) => Promise<any>;
    getUserById: (id: string) => Promise<any>;
    createUser: (userData: any) => Promise<any>;
    updateUser: (id: string, updates: any) => Promise<any>;
    deleteUser: (id: string) => Promise<any>;
    suspendUser: (id: string, reason: string) => Promise<any>;
    activateUser: (id: string) => Promise<any>;
    getUserPermissions: (userId: string) => Promise<any[]>;
    checkUserHasPermission: (userId: string, permissionName: string) => Promise<boolean>;

    // Dashboard
    getDashboardData: () => Promise<any>;

    // Generic
    getTableRecords: (table: string, options?: any) => Promise<any[]>;
    getActivityLogs: (params: any) => Promise<any[]>;
    getRetentionPolicies: () => Promise<any[]>;
    updateRetentionPolicy: (id: string, updates: any) => Promise<any>;

    // System Settings
    getSystemSettings: () => Promise<any[]>;
    upsertSystemSetting: (setting: any) => Promise<any>;

    // Schema Introspection
    getAllDatabaseTables: () => Promise<any[]>;
    getAllTableColumns: (tableName: string) => Promise<any[]>;
    getDatabaseEnums: () => Promise<any[]>;
    getCommonTranslatableColumns: () => Promise<any[]>;

    // Generic Data CRUD
    saveMasterDataValue: (value: any) => Promise<any>;
    saveMasterDataType: (type: any) => Promise<any>;
    saveTableRecord: (tableName: string, data: any) => Promise<any>;
    deleteMasterDataValue: (id: string) => Promise<any>;
    deleteMasterDataType: (id: string) => Promise<any>;
    deleteTableRecord: (tableName: string, id: string) => Promise<any>;
}

// Context
interface AdminContextType {
    service: AdminService;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ service, children }: { service: AdminService; children: ReactNode }) => {
    return (
        <AdminContext.Provider value={useMemo(() => ({ service }), [service])}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminService = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminService must be used within an AdminProvider');
    }
    return context.service;
};

export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminContext must be used within an AdminProvider');
    }
    return context;
};

