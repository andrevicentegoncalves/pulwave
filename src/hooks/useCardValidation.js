/**
 * Card Validation Hook
 * Provides utilities for credit card validation, formatting, and brand detection
 */

// Card brand patterns
const CARD_PATTERNS = {
    visa: /^4/,
    mastercard: /^(5[1-5]|2[2-7])/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
};

// Card lengths
const CARD_LENGTHS = {
    visa: 16,
    mastercard: 16,
    amex: 15,
    discover: 16,
    default: 16,
};

// CVV lengths
const CVV_LENGTHS = {
    amex: 4,
    default: 3,
};

export const useCardValidation = () => {
    /**
     * Detect card brand from number
     */
    const detectCardBrand = (number) => {
        const cleaned = number.replace(/\s/g, '');

        for (const [brand, pattern] of Object.entries(CARD_PATTERNS)) {
            if (pattern.test(cleaned)) {
                return brand;
            }
        }

        return null;
    };

    /**
     * Format card number with spaces (4-digit groups)
     */
    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, '');
        const brand = detectCardBrand(cleaned);

        // Amex uses 4-6-5 format
        if (brand === 'amex') {
            return cleaned
                .replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3')
                .trim();
        }

        // Others use 4-4-4-4 format
        return cleaned
            .replace(/(\d{4})/g, '$1 ')
            .trim();
    };

    /**
     * Format expiry date as MM/YY
     */
    const formatExpiry = (value) => {
        const cleaned = value.replace(/\D/g, '');

        if (cleaned.length >= 2) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }

        return cleaned;
    };

    /**
     * Validate card number using Luhn algorithm
     */
    const validateCardNumber = (number) => {
        const cleaned = number.replace(/\s/g, '');

        if (!/^\d+$/.test(cleaned)) {
            return { valid: false, error: 'Card number must contain only digits' };
        }

        const brand = detectCardBrand(cleaned);
        const expectedLength = brand ? CARD_LENGTHS[brand] : CARD_LENGTHS.default;

        if (cleaned.length !== expectedLength) {
            return { valid: false, error: `Card number must be ${expectedLength} digits` };
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
     */
    const validateExpiry = (expiry) => {
        const cleaned = expiry.replace(/\D/g, '');

        if (cleaned.length !== 4) {
            return { valid: false, error: 'Expiry must be MM/YY format' };
        }

        const month = parseInt(cleaned.slice(0, 2), 10);
        const year = parseInt(cleaned.slice(2, 4), 10);

        if (month < 1 || month > 12) {
            return { valid: false, error: 'Invalid month' };
        }

        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return { valid: false, error: 'Card has expired' };
        }

        return { valid: true, error: null };
    };

    /**
     * Validate CVV
     */
    const validateCVV = (cvv, cardBrand) => {
        const expectedLength = cardBrand === 'amex' ? CVV_LENGTHS.amex : CVV_LENGTHS.default;

        if (!/^\d+$/.test(cvv)) {
            return { valid: false, error: 'CVV must contain only digits' };
        }

        if (cvv.length !== expectedLength) {
            return { valid: false, error: `CVV must be ${expectedLength} digits` };
        }

        return { valid: true, error: null };
    };

    /**
     * Validate cardholder name
     */
    const validateName = (name) => {
        const trimmed = name.trim();

        if (trimmed.length < 2) {
            return { valid: false, error: 'Name must be at least 2 characters' };
        }

        if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
            return { valid: false, error: 'Name contains invalid characters' };
        }

        return { valid: true, error: null };
    };

    /**
     * Get CVV length for card brand
     */
    const getCVVLength = (cardBrand) => {
        return cardBrand === 'amex' ? CVV_LENGTHS.amex : CVV_LENGTHS.default;
    };

    /**
     * Get card brand display name
     */
    const getCardBrandName = (brand) => {
        const names = {
            visa: 'Visa',
            mastercard: 'Mastercard',
            amex: 'American Express',
            discover: 'Discover',
        };
        return names[brand] || 'Unknown';
    };

    return {
        detectCardBrand,
        formatCardNumber,
        formatExpiry,
        validateCardNumber,
        validateExpiry,
        validateCVV,
        validateName,
        getCVVLength,
        getCardBrandName,
    };
};
