export const subscriptionKeys = {
    all: ['subscription'] as const,
    plans: ['subscription', 'plans'] as const,
    current: (userId: string) => ['subscription', 'current', userId] as const,
};
