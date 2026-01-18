/**
 * Profile Repository Interface
 */
import { Profile, ProfileAuthState, OnboardingStatus, UserExportData } from './types/Profile';
import { ProfessionalProfile } from './types/Professional';
import { SocialProfile } from './types/Social';
import { UserPreferences } from './types/Preferences';
import { Contact } from './types/Contact';
import { Address } from '../../address/interfaces/types/Address';
import type { IVersionedRepository } from '../../_infrastructure/interfaces';

export interface IProfileRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    findById(id: string): Promise<Profile | null>;
    findByAuthUserId(authUserId: string): Promise<Profile | null>;
    create(profileData: Partial<Profile>): Promise<Profile>;
    update(id: string, updates: Partial<Profile>): Promise<Profile>;
    findProfessionalProfile(profileId: string): Promise<ProfessionalProfile | null>;
    upsertProfessionalProfile(data: ProfessionalProfile): Promise<ProfessionalProfile>;
    findSocialProfiles(profileId: string): Promise<SocialProfile[]>;
    upsertSocialProfile(data: SocialProfile): Promise<SocialProfile>;
    deleteSocialProfile(profileId: string, platform: string): Promise<void>;
    findPreferences(profileId: string): Promise<UserPreferences | null>;
    upsertPreferences(data: Partial<UserPreferences>): Promise<UserPreferences>;
    findAddress(id: string | null): Promise<Address | null>;
    findPrimaryOrganization(profileId: string): Promise<string | null>;
    findContacts(profileId: string): Promise<Contact[]>;
    upsertContact(data: Partial<Contact>): Promise<Contact>;
    deleteContact(id: string): Promise<void>;
    findAuthState(profileId: string): Promise<ProfileAuthState | null>;
    upsertAuthState(profileId: string, data: Partial<ProfileAuthState>): Promise<ProfileAuthState>;
    findOnboardingStatus(profileId: string): Promise<OnboardingStatus | null>;
    exportUserData(profileId: string): Promise<UserExportData>;
}

