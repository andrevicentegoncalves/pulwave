/**
 * useCardValidation Hook
 * 
 * Backward-compatible hook wrapper for cardValidation utilities.
 * This allows existing code to continue working while new code can import utilities directly.
 * 
 * @deprecated Use direct imports from '@/utils/cardValidation' instead for new code.
 */

import * as cardValidation from '../utils/cardValidation';

export const useCardValidation = () => {
    // Return all utility functions as hook return value for backward compatibility
    return {
        detectCardBrand: cardValidation.detectCardBrand,
        formatCardNumber: cardValidation.formatCardNumber,
        formatExpiry: cardValidation.formatExpiry,
        validateCardNumber: cardValidation.validateCardNumber,
        validateExpiry: cardValidation.validateExpiry,
        validateCVV: cardValidation.validateCVV,
        validateName: cardValidation.validateName,
        getCVVLength: cardValidation.getCVVLength,
        getCardBrandName: cardValidation.getCardBrandName,
        getMaxCardLength: cardValidation.getMaxCardLength,
        maskCardNumber: cardValidation.maskCardNumber,
        getSupportedBrands: cardValidation.getSupportedBrands,
    };
};

export default useCardValidation;