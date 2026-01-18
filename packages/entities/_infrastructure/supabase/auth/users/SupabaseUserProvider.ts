import type { AuthResult, Session, User } from '@pulwave/entity-auth';

import { getSupabase } from '../../client';
import { mapSupabaseError } from '../../../errors/mappers';

export const SupabaseUserProvider = {
    // Auth Methods
    async getSession(): Promise<AuthResult<{ session: Session | null; user: User | null }>> {
        try {
            const { data: { session }, error } = await getSupabase().auth.getSession();
            if (error) return { success: false, error: mapSupabaseError(error) };
            return {
                success: true,
                data: {
                    session: session as unknown as Session,
                    user: session?.user as unknown as User
                }
            };
        } catch (e) {
            return { success: false, error: mapSupabaseError(e) };
        }
    },

    async getCurrentUser(): Promise<AuthResult<{ user: User | null }>> {
        try {
            const { data: { user }, error } = await getSupabase().auth.getUser();
            if (error) return { success: false, error: mapSupabaseError(error) };
            return { success: true, data: { user: user as unknown as User } };
        } catch (e) {
            return { success: false, error: mapSupabaseError(e) };
        }
    },

    async signOut(): Promise<AuthResult<void>> {
        try {
            const { error } = await getSupabase().auth.signOut();
            if (error) return { success: false, error: mapSupabaseError(error) };
            return { success: true };
        } catch (e) {
            return { success: false, error: mapSupabaseError(e) };
        }
    },

    async resetPasswordForEmail(email: string, options = {}): Promise<AuthResult<void>> {
        try {
            const { error } = await getSupabase().auth.resetPasswordForEmail(email, options);
            if (error) return { success: false, error: mapSupabaseError(error) };
            return { success: true };
        } catch (e) {
            return { success: false, error: mapSupabaseError(e) };
        }
    },

    async signInWithOtp(params: { email: string; options?: any }): Promise<AuthResult<void>> {
        try {
            const { error } = await getSupabase().auth.signInWithOtp(params);
            if (error) return { success: false, error: mapSupabaseError(error) };
            return { success: true };
        } catch (e) {
            return { success: false, error: mapSupabaseError(e) };
        }
    },

    async verifyOtp(params: { email: string; token: string; type: any }): Promise<AuthResult<{ session: Session; user: User }>> {
        try {
            const { data: { session, user }, error } = await getSupabase().auth.verifyOtp(params);
            if (error) return { success: false, error: mapSupabaseError(error) };
            if (!session || !user) return { success: false, error: { message: 'Verification failed: No session' } };
            return {
                success: true,
                data: {
                    session: session as unknown as Session,
                    user: user as unknown as User
                }
            };
        } catch (e) {
            return { success: false, error: mapSupabaseError(e) };
        }
    },

    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event, session) => {
            callback(event, session as unknown as Session);
        });
        return subscription;
    },

    // Users

    async getUsers({ page = 1, limit = 20, search = '', role = '', status = '' }: any) {
        let query = getSupabase()
            .from('profiles')
            .select('*', { count: 'exact' })
            .range((page - 1) * limit, page * limit - 1);

        if (search) query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
        if (role) query = query.eq('app_role', role);

        // Map status to database boolean or logic
        if (status === 'active') query = query.eq('is_active', true).eq('is_suspended', false);
        if (status === 'suspended') query = query.eq('is_suspended', true);
        if (status === 'inactive') query = query.eq('is_active', false);

        // Sort by created_at
        query = query.order('created_at', { ascending: false });

        const { data, error, count } = await query;
        if (error) throw error;
        return { data: data || [], count };
    },

    async getUserById(id: string) {
        const { data, error } = await getSupabase().from('profiles').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async createUser(userData: any) {
        const { data, error } = await getSupabase().from('profiles').insert({ ...userData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        return data;
    },

    async updateUser(id: string, updates: any) {
        const { data, error } = await getSupabase().from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
};

