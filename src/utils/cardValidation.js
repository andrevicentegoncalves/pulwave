/**
 * Card Validation Utilities
 * 
 * Comprehensive credit card validation, formatting, and brand detection.
 * Supports: Visa, Mastercard, Amex, Discover, JCB, UnionPay, Diners Club, Maestro, Elo, Hipercard, Mir
 * 
 * Migrated from useCardValidation hook - these are pure utility functions with no React state.
 */

// Card brand patterns with BIN ranges
const CARD_PATTERNS = {
    // Visa - starts with 4
    visa: /^4/,
    // Mastercard - 51-55 or 2221-2720
    mastercard: /^(5[1-5]|2[2-7])/,
    // American Express - 34 or 37
    amex: /^3[47]/,
    // Discover - 6011, 622126-622925, 644-649, 65
    discover: /^(6011|65|64[4-9]|622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9[0-1]\d|92[0-5]))/,
    // JCB - 3528-3589
    jcb: /^35(2[89]|[3-8]\d)/,
    // UnionPay - 62
    unionpay: /^62/,
    // Diners Club - 300-305, 309, 36, 38-39
    diners: /^(30[0-5]|309|36|3[89])/,
    // Maestro - 5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763
    maestro: /^(5018|5020|5038|5893|6304|6759|676[1-3])/,
    // Elo (Brazilian) - various ranges
    elo: /^(4011|4312|4389|4514|4573|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/,
    // Hipercard (Brazilian)
    hipercard: /^(3841|606282)/,
    // Mir (Russian) - 2200-2204
    mir: /^220[0-4]/,
};

// Card number lengths by brand
const CARD_LENGTHS = {
    visa: [13, 16, 19],
    mastercard: [16],
    amex: [15],
    discover: [16, 19],
    jcb: [16, 17, 18, 19],
    unionpay: [16, 17, 18, 19],
    diners: [14, 16, 19],
    maestro: [12, 13, 14, 15, 16, 17, 18, 19],
    elo: [16],
    hipercard: [16],
    mir: [16, 17, 18, 19],
    default: [16],
};

// CVV lengths by brand
const CVV_LENGTHS = {
    amex: 4,
    default: 3,
};

// Card brand display names
const CARD_NAMES = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    jcb: 'JCB',
    unionpay: 'UnionPay',
    diners: 'Diners Club',
    maestro: 'Maestro',
    elo: 'Elo',
    hipercard: 'Hipercard',
    mir: 'Mir',
};

// Card formatting patterns
const CARD_FORMATS = {
    amex: [4, 6, 5], // 4-6-5 grouping
    diners: [4, 6, 4], // 4-6-4 grouping (for 14-digit)
    default: [4, 4, 4, 4, 3], // 4-4-4-4-3 grouping (for 16-19 digit)
};

/**
 * Detect card brand from card number
 * @param {string} number - Card number (can include spaces)
 * @returns {string|null} Card brand identifier or null
 */
export const detectCardBrand = (number) => {
    const cleaned = (number || '').replace(/\s/g, '');

    if (!cleaned) return null;

    // Check patterns in order of specificity
    const brandOrder = [
        'elo', 'hipercard', // Brazilian cards first (specific ranges)
        'mir', // Russian
        'maestro', // Maestro before Mastercard
        'amex', 'diners', 'jcb', 'discover', // Specific prefixes
        'unionpay', // 62 prefix
        'mastercard', // 51-55 or 2221-2720
        'visa', // Most common, 4 prefix
    ];

    for (const brand of brandOrder) {
        if (CARD_PATTERNS[brand]?.test(cleaned)) {
            return brand;
        }
    }

    return null;
};

/**
 * Format card number with spaces based on brand
 * @param {string} value - Raw card number input
 * @returns {string} Formatted card number
 */
export const formatCardNumber = (value) => {
    const cleaned = (value || '').replace(/\D/g, '');
    const brand = detectCardBrand(cleaned);

    if (!cleaned) return '';

    // Get format pattern
    let format;
    if (brand === 'amex') {
        format = CARD_FORMATS.amex;
    } else if (brand === 'diners' && cleaned.length <= 14) {
        format = CARD_FORMATS.diners;
    } else {
        format = CARD_FORMATS.default;
    }

    // Apply formatting
    let result = '';
    let position = 0;

    for (const groupLength of format) {
        if (position >= cleaned.length) break;

        if (result) result += ' ';
        result += cleaned.slice(position, position + groupLength);
        position += groupLength;
    }

    return result;
};

/**
 * Format expiry date as MM/YY
 * @param {string} value - Raw expiry input
 * @returns {string} Formatted expiry date
 */
export const formatExpiry = (value) => {
    const cleaned = (value || '').replace(/\D/g, '');

    if (cleaned.length === 0) return '';
    if (cleaned.length === 1) {
        // Auto-prefix with 0 if first digit > 1
        return parseInt(cleaned) > 1 ? `0${cleaned}/` : cleaned;
    }
    if (cleaned.length === 2) {
        const month = parseInt(cleaned);
        if (month > 12) {
            // Invalid month, treat as MM
            return `0${cleaned[0]}/${cleaned[1]}`;
        }
        return cleaned;
    }

    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
};

/**
 * Validate card number using Luhn algorithm
 * @param {string} number - Card number
 * @returns {Object} Validation result with valid, error, and brand
 */
export const validateCardNumber = (number) => {
    const cleaned = (number || '').replace(/\s/g, '');

    if (!cleaned) {
        return { valid: false, error: 'Card number is required' };
    }

    if (!/^\d+$/.test(cleaned)) {
        return { valid: false, error: 'Card number must contain only digits' };
    }

    const brand = detectCardBrand(cleaned);
    const validLengths = brand ? CARD_LENGTHS[brand] : CARD_LENGTHS.default;

    if (!validLengths.includes(cleaned.length)) {
        return {
            valid: false,
            error: `${brand ? CARD_NAMES[brand] : 'Card'} number must be ${validLengths.join(' or ')} digits`,
            brand
        };
    }

    // Skip Luhn for UnionPay (some cards don't follow Luhn)
    if (brand === 'unionpay') {
        return { valid: true, error: null, brand };
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    const valid = sum % 10 === 0;
    return {
        valid,
        error: valid ? null : 'Invalid card number',
        brand,
    };
};

/**
 * Validate expiry date
 * @param {string} expiry - Expiry in MM/YY or MMYY format
 * @returns {Object} Validation result
 */
export const validateExpiry = (expiry) => {
    const cleaned = (expiry || '').replace(/\D/g, '');

    if (!cleaned) {
        return { valid: false, error: 'Expiry date is required' };
    }

    if (cleaned.length !== 4) {
        return { valid: false, error: 'Expiry must be MM/YY format' };
    }

    const month = parseInt(cleaned.slice(0, 2), 10);
    const year = parseInt(cleaned.slice(2, 4), 10);

    if (month < 1 || month > 12) {
        return { valid: false, error: 'Invalid month (01-12)' };
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    // Card is valid through the last day of expiry month
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return { valid: false, error: 'Card has expired' };
    }

    // Check for unreasonably far future (more than 20 years)
    if (year > currentYear + 20) {
        return { valid: false, error: 'Invalid expiry year' };
    }

    return { valid: true, error: null, month, year };
};

/**
 * Validate CVV/CVC
 * @param {string} cvv - CVV/CVC code
 * @param {string} cardBrand - Card brand for length validation
 * @returns {Object} Validation result
 */
export const validateCVV = (cvv, cardBrand) => {
    if (!cvv) {
        return { valid: false, error: 'CVV is required' };
    }

    if (!/^\d+$/.test(cvv)) {
        return { valid: false, error: 'CVV must contain only digits' };
    }

    const expectedLength = cardBrand === 'amex' ? CVV_LENGTHS.amex : CVV_LENGTHS.default;

    if (cvv.length !== expectedLength) {
        return {
            valid: false,
            error: `CVV must be ${expectedLength} digits${cardBrand === 'amex' ? ' for American Express' : ''}`
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate cardholder name
 * @param {string} name - Cardholder name
 * @returns {Object} Validation result
 */
export const validateName = (name) => {
    const trimmed = name?.trim() || '';

    if (!trimmed) {
        return { valid: false, error: 'Cardholder name is required' };
    }

    if (trimmed.length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters' };
    }

    if (trimmed.length > 100) {
        return { valid: false, error: 'Name is too long' };
    }

    // Allow letters, spaces, hyphens, apostrophes, and periods (for initials)
    if (!/^[a-zA-Z\s\-'.]+$/.test(trimmed)) {
        return { valid: false, error: 'Name contains invalid characters' };
    }

    // Should contain at least 2 words (first and last name) - soft validation
    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 2) {
        // This is a warning, not an error
        return { valid: true, error: null, warning: 'Consider entering full name' };
    }

    return { valid: true, error: null };
};

/**
 * Get CVV length for a card brand
 * @param {string} cardBrand - Card brand identifier
 * @returns {number} Expected CVV length
 */
export const getCVVLength = (cardBrand) => {
    return cardBrand === 'amex' ? CVV_LENGTHS.amex : CVV_LENGTHS.default;
};

/**
 * Get display name for a card brand
 * @param {string} brand - Card brand identifier
 * @returns {string} Human-readable brand name
 */
export const getCardBrandName = (brand) => {
    return CARD_NAMES[brand] || 'Unknown Card';
};

/**
 * Get max card number length for a brand
 * @param {string} cardBrand - Card brand identifier
 * @returns {number} Maximum card number length
 */
export const getMaxCardLength = (cardBrand) => {
    const lengths = cardBrand ? CARD_LENGTHS[cardBrand] : CARD_LENGTHS.default;
    return Math.max(...lengths);
};

/**
 * Mask card number for display
 * @param {string} number - Full or partial card number
 * @param {boolean} showLast4 - Whether to show last 4 digits
 * @returns {string} Masked card number
 */
export const maskCardNumber = (number, showLast4 = true) => {
    const cleaned = (number || '').replace(/\s/g, '');
    if (!cleaned) return '';

    if (showLast4 && cleaned.length >= 4) {
        const last4 = cleaned.slice(-4);
        const masked = '•'.repeat(cleaned.length - 4);
        return formatCardNumber(masked + last4);
    }

    return '•'.repeat(cleaned.length);
};

/**
 * Get all supported card brands
 * @returns {Array} Array of brand objects
 */
export const getSupportedBrands = () => {
    return Object.keys(CARD_NAMES).map(brand => ({
        id: brand,
        name: CARD_NAMES[brand],
        lengths: CARD_LENGTHS[brand],
        cvvLength: getCVVLength(brand),
    }));
};

// Default export with all functions for convenience
export default {
    detectCardBrand,
    formatCardNumber,
    formatExpiry,
    validateCardNumber,
    validateExpiry,
    validateCVV,
    validateName,
    getCVVLength,
    getCardBrandName,
    getMaxCardLength,
    maskCardNumber,
    getSupportedBrands,
};
