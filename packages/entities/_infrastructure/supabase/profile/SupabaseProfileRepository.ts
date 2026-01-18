/**
 * Supabase Profile Repository
 * Implementation of IProfileRepository using Supabase.
 * Composed from atomic provider modules.
 */
import type { IProfileRepository } from '@pulwave/entity-profile';
import { SupabaseCoreProfileProvider } from './core';
import { SupabaseProfessionalProvider } from './professional';
import { SupabaseSocialProvider } from './social';
import { SupabasePreferencesProvider } from './preferences';
import { SupabaseAddressRefProvider } from './address';
import { SupabaseOrganizationProvider } from './organization';
import { SupabaseContactProvider } from './contact';
import { SupabaseAuthStateProvider } from './state';
import { SupabaseOnboardingProvider } from './onboarding';
import { SupabaseExportProvider } from './export';

export const SupabaseProfileRepository: IProfileRepository = {
    version: '1.0.0',
    // Core
    findById: SupabaseCoreProfileProvider.findById,
    findByAuthUserId: SupabaseCoreProfileProvider.findByAuthUserId,
    create: SupabaseCoreProfileProvider.create,
    update: SupabaseCoreProfileProvider.update,

    // Professional
    findProfessionalProfile: SupabaseProfessionalProvider.findProfessionalProfile,
    upsertProfessionalProfile: SupabaseProfessionalProvider.upsertProfessionalProfile,

    // Social
    findSocialProfiles: SupabaseSocialProvider.findSocialProfiles,
    upsertSocialProfile: SupabaseSocialProvider.upsertSocialProfile,
    deleteSocialProfile: SupabaseSocialProvider.deleteSocialProfile,

    // Preferences
    findPreferences: SupabasePreferencesProvider.findPreferences,
    upsertPreferences: SupabasePreferencesProvider.upsertPreferences,

    // Address
    findAddress: SupabaseAddressRefProvider.findAddress,

    // Organization
    findPrimaryOrganization: SupabaseOrganizationProvider.findPrimaryOrganization,

    // Contacts
    findContacts: SupabaseContactProvider.findContacts,
    upsertContact: SupabaseContactProvider.upsertContact,
    deleteContact: SupabaseContactProvider.deleteContact,

    // Auth State
    findAuthState: SupabaseAuthStateProvider.findAuthState,
    upsertAuthState: SupabaseAuthStateProvider.upsertAuthState,

    // Onboarding
    findOnboardingStatus: SupabaseOnboardingProvider.findOnboardingStatus,

    // Export
    exportUserData: SupabaseExportProvider.exportUserData,
};



