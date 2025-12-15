import { supabase } from '../lib/supabaseClient';
import { ALLOWED_LOOKUP_TABLES, LOOKUP_TABLE_CONFIG } from '../constants/schema';

/**
 * System Repository
 * Data access layer for system settings, flags, logs, and master data.
 */
export const systemRepository = {
    // ==================== SYSTEM SETTINGS ====================
    async getSystemSettings() {
        const { data, error } = await supabase
            .from('system_settings')
            .select('*')
            .eq('is_active', true)
            .order('setting_key');
        if (error) throw error;
        return data || [];
    },

    async updateSystemSetting(key, value) {
        const { data, error } = await supabase
            .from('system_settings')
            .update({ setting_value: value, updated_at: new Date().toISOString() })
            .eq('setting_key', key)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async upsertSystemSetting(setting) {
        const { id, setting_key, setting_value, category, value_type, description } = setting;

        const updates = {
            setting_value,
            category,
            value_type,
            description,
            updated_at: new Date().toISOString()
        };

        if (id) {
            const { data, error } = await supabase
                .from('system_settings')
                .update(updates)
                .eq('id', id)
                .select();
            if (error) throw error;
            return data?.[0] || null;
        }

        const { data: existing } = await supabase
            .from('system_settings')
            .select('id')
            .eq('setting_key', setting_key)
            .maybeSingle();

        if (existing?.id) {
            const { data, error } = await supabase
                .from('system_settings')
                .update(updates)
                .eq('id', existing.id)
                .select();
            if (error) throw error;
            return data?.[0] || null;
        }

        const { data, error } = await supabase
            .from('system_settings')
            .insert({
                setting_key,
                ...updates,
                created_at: new Date().toISOString()
            })
            .select();
        if (error) throw error;
        return data?.[0] || null;
    },

    // ==================== FEATURE FLAGS ====================
    async getFeatureFlags() {
        const { data, error } = await supabase
            .from('feature_flags')
            .select('*')
            .eq('is_active', true)
            .order('key');
        if (error) throw error;
        return data || [];
    },

    async updateFeatureFlag(id, updates) {
        const { data, error } = await supabase
            .from('feature_flags')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async createFeatureFlag(flag) {
        const { data, error } = await supabase
            .from('feature_flags')
            .insert(flag)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteFeatureFlag(id) {
        const { data, error } = await supabase
            .from('feature_flags')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // ==================== DATA RETENTION ====================
    async getRetentionPolicies() {
        const { data, error } = await supabase
            .from('data_retention_policies')
            .select('*')
            .eq('is_active', true)
            .order('data_category');
        if (error) throw error;
        return data || [];
    },

    async updateRetentionPolicy(id, updates) {
        const { data, error } = await supabase
            .from('data_retention_policies')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // ==================== ACTIVITY LOGS ====================
    async getActivityLogs({ page = 1, limit = 50, action = '', entityType = '' }) {
        let query = supabase
            .from('activity_log')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

        if (action) query = query.eq('action', action);
        if (entityType) query = query.eq('entity_type', entityType);

        const { data, error, count } = await query;
        if (error) throw error;
        return { data, count };
    },

    // ==================== PERMISSIONS ====================
    async getPermissions() {
        const { data, error } = await supabase
            .from('permissions')
            .select('*')
            .eq('is_active', true)
            .order('permission_category', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async getRolePermissions(roleId) {
        const { data, error } = await supabase
            .from('role_permissions')
            .select('*, permissions(*)')
            .eq('role_id', roleId)
            .eq('is_active', true);
        if (error) throw error;
        return data || [];
    },

    // ==================== MASTER DATA ====================
    async getMasterDataTypes() {
        const { data, error } = await supabase
            .from('master_data_types')
            .select('*')
            .eq('is_active', true)
            .order('display_order');
        if (error) throw error;
        return data || [];
    },

    async upsertMasterDataType(type) {
        const { data, error } = await supabase
            .from('master_data_types')
            .upsert(type, { onConflict: 'type_key' })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getMasterDataValues(typeKey) {
        const { data, error } = await supabase
            .from('master_data_values')
            .select('*')
            .eq('type_key', typeKey)
            .eq('is_active', true)
            .order('display_order');
        if (error) throw error;
        return data || [];
    },

    async upsertMasterDataValue(value) {
        const { data, error } = await supabase
            .from('master_data_values')
            .upsert(value, { onConflict: 'type_key,value_key' })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteMasterDataValue(id) {
        const { data, error } = await supabase
            .from('master_data_values')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },



    // ==================== GENERIC TABLE DATA ====================
    async getTableData(tableName) {
        const config = LOOKUP_TABLE_CONFIG[tableName];
        if (!config) {
            console.warn(`Table "${tableName}" is not in allowed list for getTableData`);
            return [];
        }

        let query = supabase
            .from(tableName)
            .select('*')
            .order(config.orderBy);

        if (config.selectActive) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    async saveTableRecord(tableName, record) {
        if (!ALLOWED_LOOKUP_TABLES.includes(tableName)) {
            throw new Error(`Table "${tableName}" is not allowed for saveTableRecord`);
        }

        const { id, ...data } = record;
        if (id) {
            const { data: updated, error } = await supabase
                .from(tableName)
                .update(data)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return updated;
        } else {
            const { data: inserted, error } = await supabase
                .from(tableName)
                .insert(data)
                .select()
                .single();
            if (error) throw error;
            return inserted;
        }
    },

    async deleteTableRecord(tableName, id) {
        if (!ALLOWED_LOOKUP_TABLES.includes(tableName)) {
            throw new Error(`Table "${tableName}" is not allowed for deleteTableRecord`);
        }

        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // ==================== DASHBOARD STATS ====================
    async getDashboardStats() {
        const [usersResult, orgsResult, activeResult] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('organizations').select('id', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('profiles').select('id', { count: 'exact', head: true })
                .eq('is_active', true)
                .gte('last_activity_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        ]);

        return {
            totalUsers: usersResult.count || 0,
            totalOrganizations: orgsResult.count || 0,
            activeUsersLast7Days: activeResult.count || 0,
        };
    },

    // ==================== COUNTRIES ====================
    async getCountries() {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .order('name');
        if (error) throw error;
        return data || [];
    },
};

export default systemRepository;
