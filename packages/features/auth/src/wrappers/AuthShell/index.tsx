/**
 * AuthShell - Auth Layout Wrapper
 * Provides consistent layout for auth pages
 * @package @pulwave/experience/auth
 */
import { type ReactNode } from 'react';

export interface AuthShellProps {
    children: ReactNode;
    appName?: string;
    logoUrl?: string;
    backgroundImage?: string;
    showFooter?: boolean;
    footerLinks?: Array<{ label: string; href: string }>;
}

export const AuthShell = ({
    children,
    appName = 'Pulwave',
    logoUrl,
    backgroundImage,
    showFooter = true,
    footerLinks = [],
}: AuthShellProps) => {
    return (
        <div
            className="auth-shell"
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
            <div className="auth-shell__container">
                <header className="auth-shell__header">
                    {logoUrl ? (
                        <img src={logoUrl} alt={appName} className="auth-shell__logo" width={40} height={40} />
                    ) : (
                        <h1 className="auth-shell__title">{appName}</h1>
                    )}
                </header>

                <main className="auth-shell__content">
                    {children}
                </main>

                {showFooter && (
                    <footer className="auth-shell__footer">
                        {footerLinks.map((link, i) => (
                            <a key={i} href={link.href}>{link.label}</a>
                        ))}
                        <span>© {new Date().getFullYear()} {appName}</span>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default AuthShell;
