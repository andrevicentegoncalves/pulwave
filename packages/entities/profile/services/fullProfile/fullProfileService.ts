/**
 * Full Profile Service
 * Aggregates profile data from multiple sources.
 */
import { profileRepository } from '../../repositories/profileRepository';
import { FullProfile } from '../../interfaces/types/FullProfile';

export const fullProfileService = {
    async getFullProfile(authUserId: string, userEmail?: string): Promise<FullProfile | null> {
        let profile = await profileRepository.findByAuthUserId(authUserId);

        if (!profile) {
            profile = await profileRepository.create({
                auth_user_id: authUserId,
                email: userEmail || '',
                first_name: '',
                last_name: ''
            });
        }

        if (!profile) return null;

        // Fetch only the features that exist in the database
        const results = await Promise.allSettled([
            profileRepository.findProfessionalProfile(profile.id),
            profileRepository.findSocialProfiles(profile.id),
            profileRepository.findPreferences(profile.id),
            profileRepository.findAddress(profile.primary_address_id || null),
            profileRepository.findAddress(profile.billing_address_id || null),
            // Disabled: get_user_primary_organization function doesn't exist
            // profileRepository.findPrimaryOrganization(profile.id),
            Promise.resolve(null),
            profileRepository.findContacts(profile.id),
            profileRepository.findAuthState(profile.id),
            // Disabled: onboarding_status table doesn't exist
            // profileRepository.findOnboardingStatus(profile.id)
            Promise.resolve(null)
        ]);

        // Extract values, using null for rejected promises (missing features)
        const [
            professional,
            social,
            preferences,
            primaryAddress,
            billingAddress,
            organizationId,
            contacts,
            authState,
            onboardingStatus
        ] = results.map(result => result.status === 'fulfilled' ? result.value : null);

        return {
            ...profile,
            professional_profiles: professional ? [professional] : [],
            social_profiles: social || [],
            user_preferences: preferences ? [preferences] : [],
            primary_address: primaryAddress,
            billing_address: billingAddress,
            organization_id: organizationId,
            contacts: contacts || [],
            auth_state: authState || null,
            onboarding_status: onboardingStatus || null
        } as FullProfile;
    },
};



