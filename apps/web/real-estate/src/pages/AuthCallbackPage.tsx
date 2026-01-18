/**
 * AuthCallbackPage - Real Estate App (Thin Wrapper)
 * Imports from the auth package using Vite alias
 */
import { AuthCallbackPage as AuthCallback } from '@pulwave/pages-auth';

export const AuthCallbackPage = () => {
    return <AuthCallback />;
};

export default AuthCallbackPage;
