/**
 * Onboarding Service
 * @package @pulwave/experience/onboarding
 */

export interface OnboardingProgress {
    current_step: number;
    completed: boolean;
}

export interface OnboardingRepository {
    findByProfileId(profileId: string): Promise<OnboardingProgress | null>;
    upsert(profileId: string, data: Record<string, unknown>): Promise<void>;
}

export interface ProfileRepository {
    update(authUserId: string, data: Record<string, unknown>): Promise<void>;
    upsertProfessional(profileId: string, orgId: string, data: Record<string, unknown>): Promise<void>;
}

export interface OnboardingService {
    getProgress(profileId: string): Promise<OnboardingProgress | null>;
    updateProgress(profileId: string, currentStep: number, totalSteps: number): Promise<void>;
    completeOnboarding(profileId: string, totalSteps: number): Promise<void>;
    savePersonalInfo(authUserId: string, data: Record<string, unknown>): Promise<void>;
    saveProfessionalInfo(profile: { id: string; organization_id?: string }, data: Record<string, unknown>): Promise<void>;
}

export function createOnboardingService(
    onboardingRepo: OnboardingRepository,
    profileRepo: ProfileRepository
): OnboardingService {
    return {
        async getProgress(profileId) {
            return onboardingRepo.findByProfileId(profileId);
        },

        async updateProgress(profileId, currentStep, totalSteps) {
            await onboardingRepo.upsert(profileId, {
                current_step: currentStep,
                total_steps: totalSteps,
                updated_at: new Date().toISOString(),
            });
        },

        async completeOnboarding(profileId, totalSteps) {
            await onboardingRepo.upsert(profileId, {
                completed: true,
                completed_at: new Date().toISOString(),
                current_step: totalSteps,
                total_steps: totalSteps,
            });
        },

        async savePersonalInfo(authUserId, data) {
            await profileRepo.update(authUserId, {
                first_name: data.first_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                phone: data.phone,
                avatar_url: data.avatar_url,
                updated_at: new Date().toISOString(),
            });
        },

        async saveProfessionalInfo(profile, data) {
            if (!profile.organization_id) return;
            if (!data.company_name && !data.vat_id) return;
            await profileRepo.upsertProfessional(profile.id, profile.organization_id, {
                company_name: data.company_name,
                tax_id: data.vat_id,
            });
        },
    };
}
