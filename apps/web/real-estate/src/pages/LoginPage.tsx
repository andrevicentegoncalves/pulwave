/**
 * LoginPage - Real Estate App (Thin Wrapper)
 * Imports from the auth package using Vite alias
 */
import { AuthPage } from '@pulwave/pages-auth';

export const LoginPage = () => {
    return <AuthPage />;
};

export default LoginPage;
