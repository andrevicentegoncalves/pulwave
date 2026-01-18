/**
 * Query Client Provider
 * Sets up React Query client with default options
 *
 * @package @foundation
 */
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider as TanStackProvider } from '@tanstack/react-query';

// Create a client with sensible defaults
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Don't refetch on window focus in development
            refetchOnWindowFocus: false, // Default to false to be safe across environments
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

export interface QueryClientProviderProps {
    children: ReactNode;
}

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
    return (
        <TanStackProvider client={queryClient}>
            {children}
        </TanStackProvider>
    );
};
