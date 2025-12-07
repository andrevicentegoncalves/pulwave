/**
 * Query Keys
 * Centralized query key definitions for React Query
 * Using factory pattern for type-safe, consistent keys
 */

export const queryKeys = {
    // Profile queries
    profile: {
        all: ['profile'],
        detail: (userId) => [...queryKeys.profile.all, userId],
        professional: (profileId) => [...queryKeys.profile.all, 'professional', profileId],
        social: (profileId) => [...queryKeys.profile.all, 'social', profileId],
        preferences: (profileId) => [...queryKeys.profile.all, 'preferences', profileId],
    },

    // Address queries
    addresses: {
        all: ['addresses'],
        byProfile: (profileId) => [...queryKeys.addresses.all, profileId],
        byType: (profileId, type) => [...queryKeys.addresses.all, profileId, type],
    },

    // Building queries
    buildings: {
        all: ['buildings'],
        detail: (id) => [...queryKeys.buildings.all, id],
        units: (buildingId) => [...queryKeys.buildings.all, buildingId, 'units'],
    },

    // Billing queries
    billing: {
        all: ['billing'],
        plans: () => [...queryKeys.billing.all, 'plans'],
        paymentMethods: (profileId) => [...queryKeys.billing.all, 'payment-methods', profileId],
        history: (profileId) => [...queryKeys.billing.all, 'history', profileId],
    },
};
