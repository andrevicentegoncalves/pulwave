/**
 * Profile Service
 * Composed facade from atomic service modules.
 * 
 * @package @features/data/services/profile
 */
import { coreProfileService } from './core';
import { fullProfileService } from './fullProfile';
import { professionalService } from './professional';
import { socialService } from './social';
import { preferencesService } from './preferences';
import { exportService } from './export';
import { profileAddressService } from './address';
import { profileAuthStateService } from './state/profileAuthStateService';

// Re-export contact service (already atomic)
export { contactService } from './contactService';

/**
 * Unified profile service facade
 * Maintains backward compatibility while using atomic modules internally.
 */
export const profileService = {
    // Core operations
    getById: coreProfileService.getById.bind(coreProfileService),
    getByAuthId: coreProfileService.getByAuthId.bind(coreProfileService),
    update: coreProfileService.update.bind(coreProfileService),
    updateProfile: coreProfileService.updateProfile.bind(coreProfileService),
    getOnboardingStatus: coreProfileService.getOnboardingStatus.bind(coreProfileService),
    getOrganizationId: coreProfileService.getOrganizationId.bind(coreProfileService),

    // Full profile aggregation
    getFullProfile: fullProfileService.getFullProfile.bind(fullProfileService),

    // Professional profile
    getProfessionalProfile: professionalService.getProfessionalProfile.bind(professionalService),
    upsertProfessionalProfile: professionalService.upsertProfessionalProfile.bind(professionalService),

    // Social profiles
    getSocialProfiles: socialService.getSocialProfiles.bind(socialService),
    upsertSocialProfile: socialService.upsertSocialProfile.bind(socialService),
    upsertSocialProfiles: socialService.upsertSocialProfiles.bind(socialService),

    // Preferences
    getPreferences: preferencesService.getPreferences.bind(preferencesService),
    upsertPreferences: preferencesService.upsertPreferences.bind(preferencesService),

    // Address
    updateAddress: profileAddressService.updateAddress.bind(profileAddressService),

    // Auth State
    getAuthState: profileAuthStateService.getAuthState.bind(profileAuthStateService),
    upsertAuthState: profileAuthStateService.upsertAuthState.bind(profileAuthStateService),

    // Export
    exportUserData: exportService.exportUserData.bind(exportService),
    exportAsJson: exportService.exportAsJson.bind(exportService),
    exportAsCsv: exportService.exportAsCsv.bind(exportService),
};

// Re-export atomic services for direct access
export { coreProfileService } from './core';
export { fullProfileService } from './fullProfile';
export { professionalService } from './professional';
export { socialService } from './social';
export { preferencesService } from './preferences';
export { exportService } from './export';
export { profileAddressService } from './address';
export { profileAuthStateService } from './state/profileAuthStateService';

export default profileService;

