/**
 * Auth Domain Query Keys
 * Used for React Query cache management.
 */

export const authKeys = {
    all: ['auth'] as const,
    session: () => [...authKeys.all, 'session'] as const,
    user: (userId: string) => [...authKeys.all, 'user', userId] as const,
    permissions: (userId: string) => [...authKeys.all, 'permissions', userId] as const,
};
