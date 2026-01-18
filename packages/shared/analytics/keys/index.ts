/**
 * Analytics Query Keys
 * React Query keys for analytics operations.
 */
export const analyticsKeys = {
    all: ['analytics'] as const,
    events: () => [...analyticsKeys.all, 'events'] as const,
    eventsByUser: (userId: string) => [...analyticsKeys.all, 'events', userId] as const,
    metrics: () => [...analyticsKeys.all, 'metrics'] as const,
};
