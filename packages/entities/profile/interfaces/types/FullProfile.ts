/**
 * Full Profile Types
 */
import { Profile, ProfileAuthState, OnboardingStatus } from './Profile';
import { ProfessionalProfile } from './Professional';
import { SocialProfile } from './Social';
import { UserPreferences } from './Preferences';
import type { Address } from '@pulwave/entity-address';
import { Contact } from './Contact';

export interface FullProfile extends Profile {
    professional_profiles: ProfessionalProfile[];
    social_profiles: SocialProfile[];
    user_preferences: UserPreferences[];
    primary_address: Address | null;
    billing_address: Address | null;
    organization_id: string | null;
    contacts: Contact[];
    auth_state: ProfileAuthState | null;
    onboarding_status: OnboardingStatus | null;
}

