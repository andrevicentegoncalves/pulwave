import type { Country, Division, Locality, MasterDataType, MasterDataValue } from '@pulwave/entity-system';

import { getSupabase } from '../../client';

export const SupabaseMasterDataProvider = {
    async getMasterDataTypes(): Promise<MasterDataType[]> {
        const { data, error } = await getSupabase()
            .from('master_data_types')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as MasterDataType[];
    },

    async upsertMasterDataType(type: Partial<MasterDataType>): Promise<MasterDataType> {
        const { data, error } = await getSupabase()
            .from('master_data_types')
            .upsert(type)
            .select()
            .single();

        if (error) throw error;
        return data as unknown as MasterDataType;
    },

    async deleteMasterDataType(id: string): Promise<void> {
        const { error } = await getSupabase()
            .from('master_data_types')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getMasterDataValues(typeId: string): Promise<MasterDataValue[]> {
        // Updated to use typeId for clarity/consistency with interface
        const { data, error } = await getSupabase()
            .from('master_data_values')
            .select('*, master_data_types!inner(id, key)')
            .eq('type_id', typeId)
            .order('sort_order', { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as MasterDataValue[];
    },

    async upsertMasterDataValue(value: Partial<MasterDataValue>): Promise<MasterDataValue> {
        const { data, error } = await getSupabase()
            .from('master_data_values')
            .upsert(value)
            .select()
            .single();

        if (error) throw error;
        return data as unknown as MasterDataValue;
    },

    async deleteMasterDataValue(id: string): Promise<void> {
        const { error } = await getSupabase()
            .from('master_data_values')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getTranslatableTables(): Promise<string[]> {
        const { data, error } = await getSupabase().rpc('get_translatable_tables');
        if (error) throw error;
        return data || [];
    },

    async getTranslatableEnums(): Promise<string[]> {
        const { data, error } = await getSupabase().rpc('get_translatable_enums');
        if (error) throw error;
        return data || [];
    },

    async getTableData(tableName: string, params: Record<string, any> = {}): Promise<any[]> {
        let query = getSupabase().from(tableName).select('*');

        if (params.limit) query = query.limit(params.limit);
        if (params.offset) query = query.range(params.offset, params.offset + (params.limit || 100) - 1);

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    async saveTableRecord(tableName: string, record: Record<string, any>): Promise<any> {
        const { data, error } = await getSupabase()
            .from(tableName)
            .upsert(record)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteTableRecord(tableName: string, id: string): Promise<void> {
        const { error } = await getSupabase().from(tableName).delete().eq('id', id);
        if (error) throw error;
    },

    async getCountries(): Promise<Country[]> {
        const { data, error } = await getSupabase()
            .from('countries')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as Country[];
    },

    async getTimezones(): Promise<{ value: string; label: string; utcOffset: string }[]> {
        const { data, error } = await getSupabase().from('view_timezones').select('*');
        if (error) throw error;
        return (data || []) as { value: string; label: string; utcOffset: string }[];
    },

    async getCommonTranslatableColumns(): Promise<string[]> {
        return ['name', 'description', 'title', 'label'];
    },

    async getCountriesWithPhoneCodes(): Promise<Country[]> {
        const { data, error } = await getSupabase()
            .from('countries')
            .select('*')
            .not('phone_code', 'is', null)
            .order('name', { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as Country[];
    },

    async getCountryById(id: string): Promise<Country | null> {
        const { data, error } = await getSupabase()
            .from('countries')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data as unknown as Country;
    },

    async getCountryByCode(code: string): Promise<Country | null> {
        const { data, error } = await getSupabase()
            .from('countries')
            .select('*')
            .eq('iso_code_2', code)
            .maybeSingle();

        if (error) throw error;
        return data as unknown as Country;
    },

    async getAdministrativeDivisions(countryId: string, type?: string | null): Promise<Division[]> {
        let query = getSupabase().from('administrative_divisions').select('*').eq('country_id', countryId);
        if (type) {
            query = query.eq('division_type', type);
        }
        const { data, error } = await query.order('name', { ascending: true });
        if (error) throw error;
        return (data || []) as unknown as Division[];
    },

    async getLocalities(regionId: string): Promise<Locality[]> {
        const { data, error } = await getSupabase()
            .from('localities')
            .select('*')
            .eq('region_id', regionId)
            .order('name', { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as Locality[];
    },
};

