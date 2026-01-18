export const profileKeys = {
    all: ['profile'] as const,
    full: (userId?: string) => userId ? ['profile', 'full', userId] as const : ['profile', 'full'] as const,
    onboarding: (profileId: string) => ['profile', 'onboarding', profileId] as const,
    details: {
        personal: (profileId: string) => ['profile', 'personal', profileId] as const,
        professional: (profileId: string) => ['profile', 'professional', profileId] as const,
        address: (profileId: string) => ['profile', 'address', profileId] as const,
    }
};
