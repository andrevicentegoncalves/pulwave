import type { DbColumn, DbEnum, DbTable } from '@pulwave/entity-translation';

import { getSupabase } from '../../client';

export const SupabaseIntrospectionProvider = {
    async getDatabaseTables(): Promise<DbTable[]> {
        const { data, error } = await getSupabase().rpc('get_all_tables');
        if (error) throw error;
        return (data || []) as unknown as DbTable[];
    },

    async getTableColumns(tableName: string): Promise<DbColumn[]> {
        const { data, error } = await getSupabase().rpc('get_table_columns', { p_table_name: tableName });
        if (error) throw error;
        return (data || []) as unknown as DbColumn[];
    },

    async getDatabaseEnums(): Promise<DbEnum[]> {
        const { data, error } = await getSupabase().rpc('get_all_enums');
        if (error) throw error;
        return (data || []) as unknown as DbEnum[];
    },
};

