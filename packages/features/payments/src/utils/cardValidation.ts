/**
 * Card Validation Utilities
 * Credit card validation, formatting, and brand detection
 * 
 * @package @foundation/shared
 */

export interface ValidationResult {
    valid: boolean;
    error: string | null;
    warning?: string;
    brand?: string;
    month?: number;
    year?: number;
}

const CARD_PATTERNS: Record<string, RegExp> = {
    visa: /^4/,
    mastercard: /^(5[1-5]|2[2-7])/,
    amex: /^3[47]/,
    discover: /^(6011|65|64[4-9]|622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9[0-1]\d|92[0-5]))/,
    jcb: /^35(2[89]|[3-8]\d)/,
    unionpay: /^62/,
    diners: /^(30[0-5]|309|36|3[89])/,
    maestro: /^(5018|5020|5038|5893|6304|6759|676[1-3])/,
};

const CARD_LENGTHS: Record<string, number[]> = {
    visa: [13, 16, 19],
    mastercard: [16],
    amex: [15],
    discover: [16, 19],
    jcb: [16, 17, 18, 19],
    unionpay: [16, 17, 18, 19],
    diners: [14, 16, 19],
    maestro: [12, 13, 14, 15, 16, 17, 18, 19],
    default: [16],
};

const CARD_NAMES: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    jcb: 'JCB',
    unionpay: 'UnionPay',
    diners: 'Diners Club',
    maestro: 'Maestro',
};

export function detectCardBrand(number: string): string | null {
    const cleaned = (number || '').replace(/\s/g, '');
    if (!cleaned) return null;

    const brandOrder = ['maestro', 'amex', 'diners', 'jcb', 'discover', 'unionpay', 'mastercard', 'visa'];
    for (const brand of brandOrder) {
        if (CARD_PATTERNS[brand]?.test(cleaned)) {
            return brand;
        }
    }
    return null;
}

export function formatCardNumber(value: string): string {
    const cleaned = (value || '').replace(/\D/g, '');
    if (!cleaned) return '';

    const brand = detectCardBrand(cleaned);
    const format = brand === 'amex' ? [4, 6, 5] : [4, 4, 4, 4, 3];

    let result = '';
    let position = 0;
    for (const groupLength of format) {
        if (position >= cleaned.length) break;
        if (result) result += ' ';
        result += cleaned.slice(position, position + groupLength);
        position += groupLength;
    }
    return result;
}

export function formatExpiry(value: string): string {
    const cleaned = (value || '').replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
}

export function validateCardNumber(number: string): ValidationResult {
    const cleaned = (number || '').replace(/\s/g, '');
    if (!cleaned) return { valid: false, error: 'Card number is required' };
    if (!/^\d+$/.test(cleaned)) return { valid: false, error: 'Card number must contain only digits' };

    const brand = detectCardBrand(cleaned);
    const validLengths = brand ? CARD_LENGTHS[brand] : CARD_LENGTHS.default;

    if (!validLengths.includes(cleaned.length)) {
        return { valid: false, error: `Invalid card number length`, brand: brand || undefined };
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }

    const valid = sum % 10 === 0;
    return { valid, error: valid ? null : 'Invalid card number', brand: brand || undefined };
}

export function validateExpiry(expiry: string): ValidationResult {
    const cleaned = (expiry || '').replace(/\D/g, '');
    if (!cleaned) return { valid: false, error: 'Expiry date is required' };
    if (cleaned.length !== 4) return { valid: false, error: 'Expiry must be MM/YY format' };

    const month = parseInt(cleaned.slice(0, 2), 10);
    const year = parseInt(cleaned.slice(2, 4), 10);

    if (month < 1 || month > 12) return { valid: false, error: 'Invalid month (01-12)' };

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return { valid: false, error: 'Card has expired' };
    }

    return { valid: true, error: null, month, year };
}

export function validateCVV(cvv: string, cardBrand?: string): ValidationResult {
    if (!cvv) return { valid: false, error: 'CVV is required' };
    if (!/^\d+$/.test(cvv)) return { valid: false, error: 'CVV must contain only digits' };

    const expectedLength = cardBrand === 'amex' ? 4 : 3;
    if (cvv.length !== expectedLength) {
        return { valid: false, error: `CVV must be ${expectedLength} digits` };
    }
    return { valid: true, error: null };
}

export function getCardBrandName(brand: string): string {
    return CARD_NAMES[brand] || 'Unknown Card';
}

export function maskCardNumber(number: string): string {
    const cleaned = (number || '').replace(/\s/g, '');
    if (!cleaned || cleaned.length < 4) return cleaned;
    const last4 = cleaned.slice(-4);
    const masked = '•'.repeat(cleaned.length - 4);
    return formatCardNumber(masked + last4);
}

export function validateName(name: string): ValidationResult {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: 'Name on card is required' };
    }
    if (name.trim().length < 2) {
        return { valid: false, error: 'Name is too short' };
    }
    // Basic regex for names (letters, spaces, dots, hyphens)
    if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
        return { valid: false, error: 'Name contains invalid characters' };
    }
    return { valid: true, error: null };
}

export function getCVVLength(cardBrand?: string): number {
    return cardBrand === 'amex' ? 4 : 3;
}

export function getMaxCardLength(cardBrand?: string): number {
    if (cardBrand && CARD_LENGTHS[cardBrand]) {
        return Math.max(...CARD_LENGTHS[cardBrand]);
    }
    return Math.max(...CARD_LENGTHS.default);
}

export function getSupportedBrands(): string[] {
    return Object.keys(CARD_PATTERNS);
}
