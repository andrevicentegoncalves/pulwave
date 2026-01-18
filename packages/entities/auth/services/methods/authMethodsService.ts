/**
 * Auth Methods Service
 * Discovery of enabled authentication methods.
 */
import { profileRepository } from '@pulwave/entity-profile';

export const authMethodsService = {
    async getEnabledAuthMethods(profileId: string): Promise<string[]> {
        const authState = await profileRepository.findAuthState(profileId);
        if (!authState) return ['email'];

        const methods: string[] = [];
        if (authState.auth_methods?.includes('email')) methods.push('email');
        if (authState.webauthn_enabled) methods.push('passkey');
        if (authState.wallet_address) methods.push('wallet');

        return methods.length > 0 ? methods : ['email'];
    }
};


