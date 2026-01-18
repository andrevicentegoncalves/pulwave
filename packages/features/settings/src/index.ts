/**
 * @pulwave/experience-settings
 * 
 * Settings feature package containing profile, security, 
 * preferences, and payment settings management.
 * 
 * Team: Settings Feature Team
 */

// ═══════════════════════════════════════════════════════════════════════════
// WRAPPERS (main integration points)
// ═══════════════════════════════════════════════════════════════════════════
export { ProfileSection } from './wrappers/ProfileSection';
export { SecuritySection as SecurityWrapper } from './wrappers/SecuritySection';
export { PreferencesSection as PreferencesWrapper } from './wrappers/PreferencesSection';
export { PaymentSection } from './wrappers/PaymentSection';
export { SettingsPage } from './wrappers/SettingsPage';
export type { SettingsPageProps } from './wrappers/SettingsPage';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS (UI elements)
// ═══════════════════════════════════════════════════════════════════════════
export {
    PersonalInfoSection,
    SecuritySection,
    PreferencesSection,
    BillingSection,
    ProfileForm,
    AvatarUpload,
    AddressForm,
    SocialLinksCard,
} from './components';

export type {
    PersonalInfoSectionProps,
    PersonalInfoFormData,
    SecuritySectionProps,
    SecurityFormData,
    PreferencesSectionProps,
    PreferencesFormData,
    BillingSectionProps,
    SubscriptionPlan,
} from './components';

// Constants
export { THEME_PREFERENCE, THEME_PREFERENCE_OPTIONS } from './components';

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS (for custom integrations)
// ═══════════════════════════════════════════════════════════════════════════
export { useProfile } from './hooks/useProfile';
export { useSecuritySettings } from './hooks/useSecuritySettings';
export { usePreferences } from './hooks/usePreferences';
export { usePaymentMethods } from './hooks/usePaymentMethods';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════
export type {
    ProfileData,
    SecuritySettings,
    Preferences,
    PaymentMethod,
} from './internal/types';
