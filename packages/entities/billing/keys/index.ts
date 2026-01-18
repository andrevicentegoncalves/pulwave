export const billingKeys = {
    all: ['billing'] as const,
    history: (userId: string) => [...billingKeys.all, 'history', userId] as const,
    invoice: (id: string) => [...billingKeys.all, 'invoice', id] as const,
};
