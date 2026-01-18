import { userRepository } from '../../repositories/userRepository';
import type { AuthResult } from '../../interfaces';

export const passwordService = {
    async resetPasswordForEmail(email: string, options: Record<string, any> = {}): Promise<AuthResult<void>> {
        return userRepository.resetPasswordForEmail(email, options);
    },
};


