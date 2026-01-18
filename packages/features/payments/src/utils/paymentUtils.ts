/**
 * Payment Logic Utilities
 * Pure formatting and validation helpers for payment methods
 * 
 * @package @foundation/utils
 */

/**
 * Format card number for display (masked)
 */
export const formatCardDisplay = (lastFour?: string): string => {
    if (!lastFour) return '••••';
    return `•••• ${lastFour}`;
};

/**
 * Format bank account for display (masked)
 */
export const formatBankAccountDisplay = (lastFour?: string): string => {
    if (!lastFour) return '••••';
    return `••••${lastFour}`;
};
