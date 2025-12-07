// src/hooks/index.js
/**
 * Hooks Index
 * Re-exports all custom hooks for convenient imports
 */

// Profile hooks
export { default as useProfileData } from './useProfileData';
export { useProfileQueries } from './useProfileQueries';
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
export { useAddressSearch, useAddressLookup } from './useAddress';

// Avatar hooks
export { useAvatarUpload } from './useAvatarUpload';

// Building hooks
export { useBuildingQueries } from './useBuildingQueries';

// Lookup hooks
export { useTimezones } from './useTimezones';

// Query keys
export { queryKeys } from './queryKeys';
