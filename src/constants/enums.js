/**
 * Enum Constants
 * 
 * These values are synchronized with the PostgreSQL enum types defined in the database schema.
 * Keep these in sync with src/schema.md
 */

// =============================================================================
// USER TYPE ENUM
// Database enum: user_type
// Values after migration: homeowner, tenant, landlord, property-manager, condominium-admin, 
//                        real-estate-agent, vendor, admin, contractor, broker, investor, 
//                        developer, manager, designer
// =============================================================================

export const USER_TYPE = {
    HOMEOWNER: 'homeowner',
    TENANT: 'tenant',
    LANDLORD: 'landlord',
    PROPERTY_MANAGER: 'property-manager',
    CONDOMINIUM_ADMIN: 'condominium-admin',
    REAL_ESTATE_AGENT: 'real-estate-agent',
    VENDOR: 'vendor',
    ADMIN: 'admin',
    // Added via migration 20241205_add_missing_enum_values.sql
    CONTRACTOR: 'contractor',
    BROKER: 'broker',
    INVESTOR: 'investor',
    DEVELOPER: 'developer',
    MANAGER: 'manager',
    DESIGNER: 'designer',
};

/**
 * User type options for Select components
 * Provides human-readable labels for each user type
 */
export const USER_TYPE_OPTIONS = [
    { value: USER_TYPE.HOMEOWNER, label: 'Homeowner' },
    { value: USER_TYPE.TENANT, label: 'Tenant' },
    { value: USER_TYPE.LANDLORD, label: 'Landlord' },
    { value: USER_TYPE.PROPERTY_MANAGER, label: 'Property Manager' },
    { value: USER_TYPE.CONDOMINIUM_ADMIN, label: 'Condominium Admin' },
    { value: USER_TYPE.REAL_ESTATE_AGENT, label: 'Real Estate Agent' },
    { value: USER_TYPE.VENDOR, label: 'Vendor' },
    { value: USER_TYPE.CONTRACTOR, label: 'Contractor' },
    { value: USER_TYPE.BROKER, label: 'Broker' },
    { value: USER_TYPE.INVESTOR, label: 'Investor' },
    { value: USER_TYPE.DEVELOPER, label: 'Developer' },
    { value: USER_TYPE.MANAGER, label: 'Manager' },
    { value: USER_TYPE.DESIGNER, label: 'Designer' },
    { value: USER_TYPE.ADMIN, label: 'Admin' },
];

// =============================================================================
// THEME PREFERENCE ENUM
// Database enum: theme_preference
// Values: light, dark, auto, system
// =============================================================================

export const THEME_PREFERENCE = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
    SYSTEM: 'system',
};

/**
 * Theme preference options for Select components
 * Note: 'auto' and 'system' both mean following system preference
 */
export const THEME_PREFERENCE_OPTIONS = [
    { value: THEME_PREFERENCE.LIGHT, label: 'Light' },
    { value: THEME_PREFERENCE.DARK, label: 'Dark' },
    { value: THEME_PREFERENCE.SYSTEM, label: 'Auto (System)' },
];

// =============================================================================
// GENDER TYPE ENUM
// Database enum: gender_type
// Values: male, female, non-binary, prefer-not-to-say, other
// =============================================================================

export const GENDER_TYPE = {
    MALE: 'male',
    FEMALE: 'female',
    NON_BINARY: 'non-binary',
    PREFER_NOT_TO_SAY: 'prefer-not-to-say',
    OTHER: 'other',
};

export const GENDER_OPTIONS = [
    { value: GENDER_TYPE.MALE, label: 'Male' },
    { value: GENDER_TYPE.FEMALE, label: 'Female' },
    { value: GENDER_TYPE.NON_BINARY, label: 'Non-Binary' },
    { value: GENDER_TYPE.PREFER_NOT_TO_SAY, label: 'Prefer not to say' },
    { value: GENDER_TYPE.OTHER, label: 'Other' },
];

// =============================================================================
// PROFILE VISIBILITY ENUM
// Database enum: profile_visibility
// Values: public, organization, private
// =============================================================================

export const PROFILE_VISIBILITY = {
    PUBLIC: 'public',
    ORGANIZATION: 'organization',
    PRIVATE: 'private',
};

export const PROFILE_VISIBILITY_OPTIONS = [
    { value: PROFILE_VISIBILITY.PUBLIC, label: 'Public' },
    { value: PROFILE_VISIBILITY.ORGANIZATION, label: 'Organization Only' },
    { value: PROFILE_VISIBILITY.PRIVATE, label: 'Private' },
];

// =============================================================================
// CONTACT METHOD ENUM
// Database enum: contact_method
// Values: email, phone, sms, whatsapp
// =============================================================================

export const CONTACT_METHOD = {
    EMAIL: 'email',
    PHONE: 'phone',
    SMS: 'sms',
    WHATSAPP: 'whatsapp',
};

export const CONTACT_METHOD_OPTIONS = [
    { value: CONTACT_METHOD.EMAIL, label: 'Email' },
    { value: CONTACT_METHOD.PHONE, label: 'Phone Call' },
    { value: CONTACT_METHOD.SMS, label: 'SMS' },
    { value: CONTACT_METHOD.WHATSAPP, label: 'WhatsApp' },
];

// =============================================================================
// PAYMENT METHOD TYPE ENUM
// Database enum: payment_method_type
// Values after migration: card, bank_account, paypal, stripe, other, apple_pay, 
//                        google_pay, crypto, mbway, multibanco
// =============================================================================

export const PAYMENT_METHOD_TYPE = {
    CARD: 'card',
    BANK_ACCOUNT: 'bank_account',
    PAYPAL: 'paypal',
    STRIPE: 'stripe',
    APPLE_PAY: 'apple_pay',
    GOOGLE_PAY: 'google_pay',
    CRYPTO: 'crypto',
    MBWAY: 'mbway',
    MULTIBANCO: 'multibanco',
    OTHER: 'other',
};

export const PAYMENT_METHOD_TYPE_OPTIONS = [
    { value: PAYMENT_METHOD_TYPE.CARD, label: 'Credit/Debit Card' },
    { value: PAYMENT_METHOD_TYPE.BANK_ACCOUNT, label: 'Bank Account' },
    { value: PAYMENT_METHOD_TYPE.PAYPAL, label: 'PayPal' },
    { value: PAYMENT_METHOD_TYPE.APPLE_PAY, label: 'Apple Pay' },
    { value: PAYMENT_METHOD_TYPE.GOOGLE_PAY, label: 'Google Pay' },
    { value: PAYMENT_METHOD_TYPE.CRYPTO, label: 'Cryptocurrency' },
    { value: PAYMENT_METHOD_TYPE.MBWAY, label: 'MB Way' },
    { value: PAYMENT_METHOD_TYPE.MULTIBANCO, label: 'Multibanco' },
    { value: PAYMENT_METHOD_TYPE.OTHER, label: 'Other' },
];

// =============================================================================
// PAYMENT VERIFICATION STATUS ENUM
// Database enum: payment_verification_status
// Values: pending, verified, failed, expired, requires_action
// =============================================================================

export const PAYMENT_VERIFICATION_STATUS = {
    PENDING: 'pending',
    VERIFIED: 'verified',
    FAILED: 'failed',
    EXPIRED: 'expired',
    REQUIRES_ACTION: 'requires_action',
};

export const PAYMENT_VERIFICATION_STATUS_OPTIONS = [
    { value: PAYMENT_VERIFICATION_STATUS.PENDING, label: 'Pending' },
    { value: PAYMENT_VERIFICATION_STATUS.VERIFIED, label: 'Verified' },
    { value: PAYMENT_VERIFICATION_STATUS.FAILED, label: 'Failed' },
    { value: PAYMENT_VERIFICATION_STATUS.EXPIRED, label: 'Expired' },
    { value: PAYMENT_VERIFICATION_STATUS.REQUIRES_ACTION, label: 'Requires Action' },
];

// =============================================================================
// SUBSCRIPTION TIER ENUM
// Database enum: subscription_tier
// Values: free, starter, professional, enterprise, custom
// =============================================================================

export const SUBSCRIPTION_TIER = {
    FREE: 'free',
    STARTER: 'starter',
    PROFESSIONAL: 'professional',
    ENTERPRISE: 'enterprise',
    CUSTOM: 'custom',
};

export const SUBSCRIPTION_TIER_OPTIONS = [
    { value: SUBSCRIPTION_TIER.FREE, label: 'Free' },
    { value: SUBSCRIPTION_TIER.STARTER, label: 'Starter' },
    { value: SUBSCRIPTION_TIER.PROFESSIONAL, label: 'Professional' },
    { value: SUBSCRIPTION_TIER.ENTERPRISE, label: 'Enterprise' },
    { value: SUBSCRIPTION_TIER.CUSTOM, label: 'Custom' },
];

// =============================================================================
// USER LOCALE ENUM
// Database enum: user_locale
// Common locale options for language/region selection
// =============================================================================

export const USER_LOCALE = {
    EN_US: 'en-US',
    EN_GB: 'en-GB',
    EN_CA: 'en-CA',
    EN_AU: 'en-AU',
    ES_ES: 'es-ES',
    ES_MX: 'es-MX',
    ES_AR: 'es-AR',
    FR_FR: 'fr-FR',
    FR_CA: 'fr-CA',
    DE_DE: 'de-DE',
    IT_IT: 'it-IT',
    PT_BR: 'pt-BR',
    PT_PT: 'pt-PT',
    ZH_CN: 'zh-CN',
    ZH_TW: 'zh-TW',
    JA_JP: 'ja-JP',
    KO_KR: 'ko-KR',
    AR_SA: 'ar-SA',
    HI_IN: 'hi-IN',
    RU_RU: 'ru-RU',
};

export const USER_LOCALE_OPTIONS = [
    { value: USER_LOCALE.EN_US, label: 'English (US)' },
    { value: USER_LOCALE.EN_GB, label: 'English (UK)' },
    { value: USER_LOCALE.EN_CA, label: 'English (Canada)' },
    { value: USER_LOCALE.EN_AU, label: 'English (Australia)' },
    { value: USER_LOCALE.ES_ES, label: 'Español (España)' },
    { value: USER_LOCALE.ES_MX, label: 'Español (México)' },
    { value: USER_LOCALE.ES_AR, label: 'Español (Argentina)' },
    { value: USER_LOCALE.FR_FR, label: 'Français (France)' },
    { value: USER_LOCALE.FR_CA, label: 'Français (Canada)' },
    { value: USER_LOCALE.DE_DE, label: 'Deutsch' },
    { value: USER_LOCALE.IT_IT, label: 'Italiano' },
    { value: USER_LOCALE.PT_BR, label: 'Português (Brasil)' },
    { value: USER_LOCALE.PT_PT, label: 'Português (Portugal)' },
    { value: USER_LOCALE.ZH_CN, label: '中文 (简体)' },
    { value: USER_LOCALE.ZH_TW, label: '中文 (繁體)' },
    { value: USER_LOCALE.JA_JP, label: '日本語' },
    { value: USER_LOCALE.KO_KR, label: '한국어' },
    { value: USER_LOCALE.AR_SA, label: 'العربية' },
    { value: USER_LOCALE.HI_IN, label: 'हिन्दी' },
    { value: USER_LOCALE.RU_RU, label: 'Русский' },
];

// =============================================================================
// NOTIFICATION TYPE ENUM
// Database enum: notification_type
// Values: rent-reminder, payment-received, maintenance-update, lease-expiring, document-uploaded, announcement, system
// =============================================================================

export const NOTIFICATION_TYPE = {
    RENT_REMINDER: 'rent-reminder',
    PAYMENT_RECEIVED: 'payment-received',
    MAINTENANCE_UPDATE: 'maintenance-update',
    LEASE_EXPIRING: 'lease-expiring',
    DOCUMENT_UPLOADED: 'document-uploaded',
    ANNOUNCEMENT: 'announcement',
    SYSTEM: 'system',
};

export const NOTIFICATION_TYPE_OPTIONS = [
    { value: NOTIFICATION_TYPE.RENT_REMINDER, label: 'Rent Reminders' },
    { value: NOTIFICATION_TYPE.PAYMENT_RECEIVED, label: 'Payment Received' },
    { value: NOTIFICATION_TYPE.MAINTENANCE_UPDATE, label: 'Maintenance Updates' },
    { value: NOTIFICATION_TYPE.LEASE_EXPIRING, label: 'Lease Expiring' },
    { value: NOTIFICATION_TYPE.DOCUMENT_UPLOADED, label: 'Document Uploaded' },
    { value: NOTIFICATION_TYPE.ANNOUNCEMENT, label: 'Announcements' },
    { value: NOTIFICATION_TYPE.SYSTEM, label: 'System Notifications' },
];
