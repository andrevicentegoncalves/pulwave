/**
 * Payment Query Keys
 */
export const paymentKeys = {
    all: ['payment-methods'] as const,
    lists: () => [...paymentKeys.all, 'list'] as const,
    list: (orgId: string) => [...paymentKeys.lists(), orgId] as const,
    details: () => [...paymentKeys.all, 'detail'] as const,
    detail: (id: string) => [...paymentKeys.details(), id] as const,
    icons: () => [...paymentKeys.all, 'icons'] as const,
};
