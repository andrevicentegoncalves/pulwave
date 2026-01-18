// Form components
export { ProfileForm } from './ProfileForm';
export { AvatarUpload } from './AvatarUpload';
export { AddressForm } from './AddressForm';
export type { AddressFormProps, AddressValue, NominatimData } from './AddressForm';

export { SocialLinksCard } from '@pulwave/features-social';
export type { SocialLinksCardProps, SocialLinksFormData } from '@pulwave/features-social';


export { EmergencyContactForm } from './EmergencyContactForm';
export type { EmergencyContactFormProps, EmergencyContactFormData } from './EmergencyContactForm';

// Settings sections - TypeScript migrations
export { ProfilePersonal } from './ProfilePersonal';
export type { ProfilePersonalProps } from './ProfilePersonal';

export { ProfileProfessional } from './ProfileProfessional';
export type { ProfileProfessionalProps } from './ProfileProfessional';

export { ProfileAddress } from './ProfileAddress';
export type { ProfileAddressProps } from './ProfileAddress';

export { SettingsSecurity } from './SettingsSecurity';
export type { SettingsSecurityProps } from './SettingsSecurity';

export { SettingsPrivacy } from './SettingsPrivacy';
export type { SettingsPrivacyProps } from './SettingsPrivacy';

export { SettingsPreferences } from './SettingsPreferences';
export type { SettingsPreferencesProps } from './SettingsPreferences';

export { AccountBilling } from './AccountBilling';
export type { AccountBillingProps } from './AccountBilling';

// Legacy sections (aliases for compatibility)
export { PersonalInfoSection } from './PersonalInfoSection';
export type { PersonalInfoSectionProps, PersonalInfoFormData } from './PersonalInfoSection';

export { SecuritySection } from './SecuritySection';
export type { SecuritySectionProps, SecurityFormData, SecurityDataState } from './SecuritySection';

export { PreferencesSection } from './PreferencesSection';
export { THEME_PREFERENCE, THEME_PREFERENCE_OPTIONS } from './PreferencesSection';
export type { PreferencesSectionProps, PreferencesFormData } from './PreferencesSection';

export { BillingSection } from './BillingSection';
export type { BillingSectionProps, SubscriptionPlan } from './BillingSection';
