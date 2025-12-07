// src/utils/dateHelpers.js

/**
 * Date Utilities
 * Shared helpers for date calculations and formatting
 */

/**
 * Default number of days before expiry to show warning
 */
export const DEFAULT_EXPIRY_WARNING_DAYS = 60;

/**
 * Get card expiry status
 * @param {string|number} expiryMonth - Month (1-12)
 * @param {string|number} expiryYear - Year (2-digit or 4-digit)
 * @param {number} warningDays - Days before expiry to consider "expiring soon"
 * @returns {Object|null} Expiry status object or null if invalid input
 */
export const getCardExpiryStatus = (expiryMonth, expiryYear, warningDays = DEFAULT_EXPIRY_WARNING_DAYS) => {
    if (!expiryMonth || !expiryYear) return null;

    const month = parseInt(expiryMonth, 10);
    let year = parseInt(expiryYear, 10);

    // Handle 2-digit year
    if (year < 100) {
        year = 2000 + year;
    }

    const now = new Date();
    // Card expires at the end of the expiry month
    const expiryDate = new Date(year, month, 0, 23, 59, 59);
    const daysUntilExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));

    return {
        isExpired: daysUntilExpiry < 0,
        isExpiringSoon: daysUntilExpiry >= 0 && daysUntilExpiry <= warningDays,
        daysRemaining: daysUntilExpiry,
        expiryDate
    };
};

/**
 * Check if a card is expired
 * @param {string|number} expiryMonth - Month (1-12)
 * @param {string|number} expiryYear - Year (2-digit or 4-digit)
 * @returns {boolean} True if expired
 */
export const isCardExpired = (expiryMonth, expiryYear) => {
    const status = getCardExpiryStatus(expiryMonth, expiryYear);
    return status?.isExpired ?? false;
};

/**
 * Check if a card is expiring soon
 * @param {string|number} expiryMonth - Month (1-12)
 * @param {string|number} expiryYear - Year (2-digit or 4-digit)
 * @param {number} warningDays - Days threshold for "expiring soon"
 * @returns {boolean} True if expiring soon
 */
export const isCardExpiringSoon = (expiryMonth, expiryYear, warningDays = DEFAULT_EXPIRY_WARNING_DAYS) => {
    const status = getCardExpiryStatus(expiryMonth, expiryYear, warningDays);
    return status?.isExpiringSoon ?? false;
};

/**
 * Format a date for display as "last used" text
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Formatted relative date string
 */
export const formatLastUsed = (dateString) => {
    if (!dateString) return 'Never used';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Format expiry date for display (MM/YY)
 * @param {string|number} month - Month (1-12)
 * @param {string|number} year - Year (2-digit or 4-digit)
 * @returns {string} Formatted expiry string
 */
export const formatExpiryDate = (month, year) => {
    if (!month || !year) return '';

    const m = String(month).padStart(2, '0');
    let y = String(year);

    // Handle 4-digit year
    if (y.length === 4) {
        y = y.slice(-2);
    }

    return `${m}/${y}`;
};
/**
 * Format a date object or string to locale date string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '';
    const d = new Date(date);
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return d.toLocaleDateString(undefined, { ...defaultOptions, ...options });
};
