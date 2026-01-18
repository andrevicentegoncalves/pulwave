/**
 * useCardValidation Hook
 * Provides credit card validation utilities for payment forms.
 * 
 * @package @foundation/hooks
 */
import { useState, useCallback, useMemo } from 'react';

export interface CardValidationState {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardType: string | null;
    isValid: boolean;
    errors: {
        cardNumber?: string;
        expiryMonth?: string;
        expiryYear?: string;
        cvv?: string;
    };
}

export interface UseCardValidationReturn {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardType: string | null;
    isValid: boolean;
    errors: CardValidationState['errors'];
    setCardNumber: (value: string) => void;
    setExpiryMonth: (value: string) => void;
    setExpiryYear: (value: string) => void;
    setCvv: (value: string) => void;
    validateCard: () => boolean;
    reset: () => void;
}

const CARD_PATTERNS: Record<string, RegExp> = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
};

const detectCardType = (cardNumber: string): string | null => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    return null;
};

const isValidCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;

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
    return sum % 10 === 0;
};

export const useCardValidation = (): UseCardValidationReturn => {
    const [cardNumber, setCardNumberState] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState<CardValidationState['errors']>({});

    const cardType = useMemo(() => detectCardType(cardNumber), [cardNumber]);

    const setCardNumber = useCallback((value: string) => {
        // Format card number with spaces
        const cleaned = value.replace(/\D/g, '').slice(0, 19);
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        setCardNumberState(formatted);
    }, []);

    const validateCard = useCallback((): boolean => {
        const newErrors: CardValidationState['errors'] = {};
        const cleanedCardNumber = cardNumber.replace(/\s+/g, '');

        if (!cleanedCardNumber) {
            newErrors.cardNumber = 'Card number is required';
        } else if (!isValidCardNumber(cleanedCardNumber)) {
            newErrors.cardNumber = 'Invalid card number';
        }

        if (!expiryMonth || parseInt(expiryMonth, 10) < 1 || parseInt(expiryMonth, 10) > 12) {
            newErrors.expiryMonth = 'Invalid month';
        }

        const currentYear = new Date().getFullYear();
        const yearValue = parseInt(expiryYear, 10);
        if (!expiryYear || yearValue < currentYear || yearValue > currentYear + 20) {
            newErrors.expiryYear = 'Invalid year';
        }

        const cvvLength = cardType === 'amex' ? 4 : 3;
        if (!cvv || cvv.length !== cvvLength) {
            newErrors.cvv = `CVV must be ${cvvLength} digits`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [cardNumber, expiryMonth, expiryYear, cvv, cardType]);

    const reset = useCallback(() => {
        setCardNumberState('');
        setExpiryMonth('');
        setExpiryYear('');
        setCvv('');
        setErrors({});
    }, []);

    const isValid = useMemo(() => {
        const cleanedCardNumber = cardNumber.replace(/\s+/g, '');
        return (
            isValidCardNumber(cleanedCardNumber) &&
            parseInt(expiryMonth, 10) >= 1 &&
            parseInt(expiryMonth, 10) <= 12 &&
            parseInt(expiryYear, 10) >= new Date().getFullYear() &&
            cvv.length >= 3
        );
    }, [cardNumber, expiryMonth, expiryYear, cvv]);

    return {
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        cardType,
        isValid,
        errors,
        setCardNumber,
        setExpiryMonth,
        setExpiryYear,
        setCvv,
        validateCard,
        reset,
    };
};

export default useCardValidation;

