/**
 * useCardValidation Hook
 * Wrapper for cardValidation utilities
 * @package @pulwave/features/settings
 */
import * as cardValidation from '../utils/cardValidation';

export function useCardValidation() {
    return {
        detectCardBrand: cardValidation.detectCardBrand,
        formatCardNumber: cardValidation.formatCardNumber,
        formatExpiry: cardValidation.formatExpiry,
        validateCardNumber: cardValidation.validateCardNumber,
        validateExpiry: cardValidation.validateExpiry,
        validateCVV: cardValidation.validateCVV,
        getCardBrandName: cardValidation.getCardBrandName,
        maskCardNumber: cardValidation.maskCardNumber,
    };
}

export default useCardValidation;
