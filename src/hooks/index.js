// src/hooks/index.js
/**
 * Hooks Index
 * Re-exports all custom hooks for convenient imports
 */

// Profile hooks
export { default as useProfileData } from './useProfileData';
export {
    useProfile,
    useProfessionalProfile,
    useSocialProfiles,
    usePreferences,
    useUpdateProfile,
    useUpdateProfessionalProfile,
    useUpdatePreferences
} from './useProfileQueries';
export { useProfileSubmit } from './useProfileSubmit';

// Payment hooks
export {
    usePaymentMethods,
    usePaymentMethodIcons,
    usePaymentMutations,
    paymentKeys
} from './usePaymentMethods';

// Form hooks
export { useFormState } from './useFormState';
export { useCardValidation } from './useCardValidation';

// Address hooks
export { useAddress } from './useAddress';

// Avatar hooks
export { useAvatarUpload } from './useAvatarUpload';

// Building hooks
export {
    useBuildings,
    useBuilding,
    useBuildingUnits,
    useCreateBuilding,
    useUpdateBuilding,
    useDeleteBuilding
} from './useBuildingQueries';

// Lookup hooks
export { useTimezones } from './useTimezones';

// Translation hooks
export { useTranslation, useSchemaTranslation, useEnumTranslation } from './useTranslation';

// Query keys
export { queryKeys } from './queryKeys';
