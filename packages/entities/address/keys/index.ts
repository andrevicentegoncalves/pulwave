/**
 * Address Query Keys
 */
export const addressKeys = {
    all: ['address'] as const,
    byProfile: (profileId: string) => [...addressKeys.all, 'profile', profileId] as const,
    byType: (profileId: string, type: string) => [...addressKeys.byProfile(profileId), type] as const,
    detail: (id: string) => [...addressKeys.all, 'detail', id] as const,
};
