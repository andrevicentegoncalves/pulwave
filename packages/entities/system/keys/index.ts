export const systemKeys = {
    all: ['system'] as const,
    admin: {
        all: ['admin'] as const,
        users: (filters?: Record<string, any>) => ['admin', 'users', filters] as const,
        usersBase: ['admin', 'users'] as const,
        user: (id: string) => ['admin', 'user', id] as const,
        dashboard: ['admin', 'dashboard'] as const,
        masterData: {
            all: ['admin', 'master-data'] as const,
            types: ['admin', 'master-data-types'] as const,
            values: (typeKey?: string) => typeKey ? ['admin', 'master-data-values', typeKey] as const : ['admin', 'master-data-values'] as const,
        },
        tables: {
            record: (table: string, id: string) => ['admin', 'table-records', table, id] as const,
            records: (table: string) => ['admin', 'table-records', table] as const,
            generic: (table: string) => ['admin', table] as const,
        },
        locales: ['admin', 'locales'] as const,
        permissions: {
            all: ['admin', 'all-permissions'] as const,
            list: ['admin', 'permissions'] as const,
            role: (roleId?: string) => ['admin', 'role-permissions', roleId] as const,
            user: (userId?: string) => ['admin', 'all-user-permissions', userId] as const,
            userGrants: (userId: string) => ['admin', 'user-permission-grants', userId] as const,
            userCheck: ['admin', 'user-permission-check'] as const,
            userSpecific: (userId: string) => ['admin', 'user-permissions', userId] as const,
        },
        translations: (filters?: Record<string, any>) => ['admin', 'translations', filters] as const,
    }
};
