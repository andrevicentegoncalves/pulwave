import React from 'react';
/**
 * App Providers
 * 
 * Composes all application-level providers.
 * These are app-specific and not part of any package.
 */

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create query client instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

interface AppProvidersProps {
    children: ReactNode;
}

/**
 * Root provider composition
 * Add new providers here as needed (Auth, Theme, i18n, etc.)
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            {/* Add more providers here */}
            {/* <AuthProvider> */}
            {/* <ThemeProvider> */}
            {/* <TranslationProvider> */}
            {children}
            {/* </TranslationProvider> */}
            {/* </ThemeProvider> */}
            {/* </AuthProvider> */}
        </QueryClientProvider>
    );
};
