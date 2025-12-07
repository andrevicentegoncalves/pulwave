// src/constants/app.js
/**
 * Application Constants
 * Centralized configuration values to avoid magic numbers
 */

// ============================================================================
// Payment & Card Settings
// ============================================================================

/** Number of days before card expiry to show warning */
export const CARD_EXPIRY_WARNING_DAYS = 60;

/** Maximum number of payment methods per organization */
export const MAX_PAYMENT_METHODS = 10;

/** Payment method types */
export const PAYMENT_METHOD_TYPES = {
    CARD: 'card',
    BANK_ACCOUNT: 'bank_account',
    PAYPAL: 'paypal',
    DIGITAL_WALLET: 'digital_wallet',
    CRYPTO: 'crypto',
    REGIONAL: 'regional',
};

/** Verification statuses */
export const VERIFICATION_STATUS = {
    VERIFIED: 'verified',
    PENDING: 'pending',
    FAILED: 'failed',
    REQUIRES_ACTION: 'requires_action',
    UNVERIFIED: 'unverified',
};

// ============================================================================
// Form Limits
// ============================================================================

/** Maximum length for bio/description fields */
export const BIO_MAX_LENGTH = 500;

/** Maximum length for names */
export const NAME_MAX_LENGTH = 100;

/** Maximum length for street address */
export const ADDRESS_MAX_LENGTH = 200;

// ============================================================================
// Breakpoints (matches SCSS variables)
// ============================================================================

export const BREAKPOINTS = {
    XS: 0,
    S: 576,
    M: 768,
    L: 992,
    XL: 1200,
    XXL: 1400,
};

// ============================================================================
// API & Caching
// ============================================================================

/** Default stale time for React Query (5 minutes) */
export const DEFAULT_STALE_TIME = 1000 * 60 * 5;

/** Long cache time for rarely changing data (30 minutes) */
export const LONG_CACHE_TIME = 1000 * 60 * 30;

/** Short cache time for frequently changing data (1 minute) */
export const SHORT_CACHE_TIME = 1000 * 60;

// ============================================================================
// UI Settings
// ============================================================================

/** Default debounce delay for search inputs (ms) */
export const SEARCH_DEBOUNCE_MS = 300;

/** Default toast display duration (ms) */
export const TOAST_DURATION_MS = 5000;

/** Maximum dropdown items before scrolling */
export const MAX_DROPDOWN_ITEMS = 10;

/** Default pagination page size */
export const DEFAULT_PAGE_SIZE = 20;

// ============================================================================
// Date Formats
// ============================================================================

export const DATE_FORMATS = {
    DISPLAY: 'MMM d, yyyy',
    DISPLAY_WITH_TIME: 'MMM d, yyyy h:mm a',
    ISO: 'yyyy-MM-dd',
    EXPIRY: 'MM/yy',
};

export default {
    CARD_EXPIRY_WARNING_DAYS,
    MAX_PAYMENT_METHODS,
    PAYMENT_METHOD_TYPES,
    VERIFICATION_STATUS,
    BIO_MAX_LENGTH,
    NAME_MAX_LENGTH,
    ADDRESS_MAX_LENGTH,
    BREAKPOINTS,
    DEFAULT_STALE_TIME,
    LONG_CACHE_TIME,
    SHORT_CACHE_TIME,
    SEARCH_DEBOUNCE_MS,
    TOAST_DURATION_MS,
    MAX_DROPDOWN_ITEMS,
    DEFAULT_PAGE_SIZE,
    DATE_FORMATS,
};
