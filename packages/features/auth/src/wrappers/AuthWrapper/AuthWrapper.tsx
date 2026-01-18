/**
 * AuthWrapper
 *
 * Wrapper component that provides auth layout with consistent styling,
 * branding, and renders the AuthPage from the package.
 *
 * @package @pulwave/experience/auth
 */
import { type ReactNode, type ComponentType } from 'react';

export interface AuthWrapperProps {
    /** Optional logo component */
    Logo?: ComponentType;

    /** Optional background image URL */
    backgroundImage?: string;

    /** Show app branding */
    showBranding?: boolean;

    /** App name for branding */
    appName?: string;

    /** Footer content */
    footer?: ReactNode;

    /** Custom class name */
    className?: string;

    /** Success redirect path */
    successPath?: string;

    /** Show dev bypass */
    showDevBypass?: boolean;

    /** Children to render in the form container */
    children?: ReactNode;
}

/**
 * AuthWrapper provides a centered, branded layout for authentication pages.
 * Renders the AuthPage component from this package.
 */
export const AuthWrapper = ({
    Logo,
    backgroundImage,
    showBranding = true,
    appName = 'Pulwave',
    footer,
    className = '',
    successPath = '/',
    showDevBypass = true,
    children,
}: AuthWrapperProps) => {
    return (
        <div
            className={`auth-wrapper ${className}`}
            style={backgroundImage ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            } : undefined}
        >
            <div className="auth-wrapper__backdrop" />

            <div className="auth-wrapper__content">
                {showBranding && (
                    <div className="auth-wrapper__branding">
                        {Logo && <Logo />}
                        <h1 className="auth-wrapper__app-name">{appName}</h1>
                    </div>
                )}

                <div className="auth-wrapper__form-container">
                    {children}
                </div>

                {footer && (
                    <footer className="auth-wrapper__footer">
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    );
};

export default AuthWrapper;
