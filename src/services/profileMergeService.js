// src/services/profileMergeService.js
import { supabase } from '../lib/supabaseClient';

/**
 * Profile Merge Service
 * Handles profile merge requests with dual confirmation workflow
 */
const profileMergeService = {
    // =========================================================================
    // CONFLICT DETECTION
    // =========================================================================

    /**
     * Check if an email is already used by another profile
     * @param {string} email - Email to check
     * @param {string} currentProfileId - Current user's profile ID to exclude
     * @returns {Promise<{exists: boolean, profileId: string|null}>}
     */
    async checkEmailConflict(email, currentProfileId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, email, created_at')
            .eq('email', email.toLowerCase())
            .neq('id', currentProfileId)
            .eq('is_active', true)
            .maybeSingle();

        if (error) throw error;

        return {
            exists: !!data,
            profile: data ? {
                id: data.id,
                email: data.email,
                createdAt: data.created_at
            } : null
        };
    },

    /**
     * Check if a wallet is already linked to another profile
     * @param {string} walletAddress - Wallet address to check
     * @param {string} currentProfileId - Current user's profile ID to exclude
     * @returns {Promise<{exists: boolean, profileId: string|null}>}
     */
    async checkWalletConflict(walletAddress, currentProfileId) {
        const { data, error } = await supabase
            .rpc('check_wallet_exists', { p_wallet_address: walletAddress });

        if (error) throw error;

        const conflict = data?.find(p => p.profile_id !== currentProfileId);

        return {
            exists: !!conflict,
            profile: conflict ? {
                id: conflict.profile_id,
                email: conflict.profile_email
            } : null
        };
    },

    // =========================================================================
    // MERGE REQUEST MANAGEMENT
    // =========================================================================

    /**
     * Create a merge request from current user to target profile
     * @param {string} targetProfileId - Profile to merge into
     * @param {object} options - { requestType, conflictIdentifier, conflictType }
     * @returns {Promise<object>} - Created merge request
     */
    async createMergeRequest(targetProfileId, options = {}) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profile_merge_requests')
            .insert({
                source_profile_id: user.id,
                target_profile_id: targetProfileId,
                request_type: options.requestType || 'manual',
                conflict_identifier: options.conflictIdentifier,
                conflict_type: options.conflictType,
                status: 'source_confirmed', // Source auto-confirms by creating
                source_confirmed_at: new Date().toISOString(),
                created_by: user.id
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get pending merge requests for current user
     * @returns {Promise<object[]>} - Array of merge requests
     */
    async getMyMergeRequests() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profile_merge_requests')
            .select(`
                *,
                source_profile:source_profile_id(id, email, first_name, last_name, created_at),
                target_profile:target_profile_id(id, email, first_name, last_name, created_at)
            `)
            .or(`source_profile_id.eq.${user.id},target_profile_id.eq.${user.id}`)
            .in('status', ['pending', 'source_confirmed', 'target_confirmed'])
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get pending requests where I need to confirm (I'm the target)
     * @returns {Promise<object[]>}
     */
    async getPendingForMe() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profile_merge_requests')
            .select(`
                *,
                source_profile:source_profile_id(id, email, first_name, last_name, avatar_url, created_at)
            `)
            .eq('target_profile_id', user.id)
            .eq('status', 'source_confirmed')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Confirm a merge request (as target)
     * @param {string} requestId - Merge request ID
     * @returns {Promise<object>} - Updated merge request
     */
    async confirmMerge(requestId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Verify user is the target
        const { data: request } = await supabase
            .from('profile_merge_requests')
            .select('target_profile_id, status')
            .eq('id', requestId)
            .single();

        if (request?.target_profile_id !== user.id) {
            throw new Error('You are not authorized to confirm this request');
        }

        if (request?.status !== 'source_confirmed') {
            throw new Error('This request is not pending your confirmation');
        }

        // Update status to target_confirmed
        const { data, error } = await supabase
            .from('profile_merge_requests')
            .update({
                status: 'target_confirmed',
                target_confirmed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                updated_by: user.id
            })
            .eq('id', requestId)
            .select()
            .single();

        if (error) throw error;

        // Execute the merge
        const { data: mergeResult, error: mergeError } = await supabase
            .rpc('execute_profile_merge', { p_merge_request_id: requestId });

        if (mergeError) throw mergeError;

        return { request: data, result: mergeResult };
    },

    /**
     * Reject a merge request
     * @param {string} requestId - Merge request ID
     * @param {string} reason - Optional rejection reason
     * @returns {Promise<object>}
     */
    async rejectMerge(requestId, reason = null) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profile_merge_requests')
            .update({
                status: 'rejected',
                rejection_reason: reason,
                rejected_by: user.id,
                updated_at: new Date().toISOString(),
                updated_by: user.id
            })
            .eq('id', requestId)
            .or(`source_profile_id.eq.${user.id},target_profile_id.eq.${user.id}`)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Cancel a merge request (as source)
     * @param {string} requestId - Merge request ID
     * @returns {Promise<object>}
     */
    async cancelMerge(requestId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profile_merge_requests')
            .update({
                status: 'cancelled',
                updated_at: new Date().toISOString(),
                updated_by: user.id
            })
            .eq('id', requestId)
            .eq('source_profile_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // =========================================================================
    // WALLET MANAGEMENT
    // =========================================================================

    /**
     * Add a wallet to the current user's linked wallets
     * @param {string} walletAddress - Wallet address
     * @param {string} chain - Blockchain (ethereum, solana, etc.)
     * @param {string} provider - Wallet provider (metamask, etc.)
     * @param {boolean} isPrimary - Set as primary wallet
     * @returns {Promise<object>}
     */
    async addWallet(walletAddress, chain = 'ethereum', provider = 'metamask', isPrimary = false) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check for conflicts first
        const conflict = await this.checkWalletConflict(walletAddress, user.id);
        if (conflict.exists) {
            return {
                success: false,
                conflict: true,
                conflictProfile: conflict.profile
            };
        }

        const { data, error } = await supabase
            .rpc('add_linked_wallet', {
                p_profile_id: user.id,
                p_wallet_address: walletAddress,
                p_chain: chain,
                p_provider: provider,
                p_is_primary: isPrimary
            });

        if (error) throw error;
        return { success: true, wallet: data };
    },

    /**
     * Get linked wallets for current user
     * @returns {Promise<object[]>}
     */
    async getMyWallets() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profile_auth_state')
            .select('linked_wallets, wallet_address, wallet_provider, wallet_chain_id')
            .eq('profile_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        const wallets = data?.linked_wallets || [];

        // Include legacy single wallet if exists
        if (data?.wallet_address && !wallets.some(w => w.address === data.wallet_address)) {
            wallets.unshift({
                address: data.wallet_address,
                provider: data.wallet_provider,
                chain: data.wallet_chain_id ? `chain_${data.wallet_chain_id}` : 'ethereum',
                is_primary: true,
                is_legacy: true
            });
        }

        return wallets;
    },

    /**
     * Remove a wallet from linked wallets
     * @param {string} walletAddress - Wallet address to remove
     * @returns {Promise<boolean>}
     */
    async removeWallet(walletAddress) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: authState } = await supabase
            .from('profile_auth_state')
            .select('linked_wallets')
            .eq('profile_id', user.id)
            .single();

        if (!authState) throw new Error('Auth state not found');

        const updatedWallets = (authState.linked_wallets || [])
            .filter(w => w.address.toLowerCase() !== walletAddress.toLowerCase());

        const { error } = await supabase
            .from('profile_auth_state')
            .update({
                linked_wallets: updatedWallets,
                updated_at: new Date().toISOString()
            })
            .eq('profile_id', user.id);

        if (error) throw error;
        return true;
    }
};

export default profileMergeService;
