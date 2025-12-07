import { supabase } from '../lib/supabaseClient';

/**
 * User Repository
 * Data access layer for user management.
 */
export const userRepository = {
    async getUsers({ page = 1, limit = 20, search = '', role = '' }) {
        let query = supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

        if (search) {
            query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
        }
        if (role) {
            query = query.eq('app_role', role);
        }

        const { data, error, count } = await query;
        if (error) throw error;
        return { data, count };
    },

    async getUserById(id) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async createUser(userData) {
        const { data, error } = await supabase
            .from('profiles')
            .insert({
                ...userData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateUser(id, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};

export default userRepository;
