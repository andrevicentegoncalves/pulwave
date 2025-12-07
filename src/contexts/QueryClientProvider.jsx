/**
 * Query Client Provider
 * Sets up React Query client with default options
 */
import React from 'react';
import { QueryClient, QueryClientProvider as TanStackProvider } from '@tanstack/react-query';

// Create a client with sensible defaults
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Don't refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            // Keep data fresh for 5 minutes
            staleTime: 1000 * 60 * 5,
            // Cache for 30 minutes
            gcTime: 1000 * 60 * 30,
            // Retry failed requests 1 time
            retry: 1,
            // Retry delay
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            // Retry mutations once
            retry: 1,
        },
    },
});

export function QueryClientProvider({ children }) {
    return (
        <TanStackProvider client={queryClient}>
            {children}
        </TanStackProvider>
    );
}

export { queryClient };
