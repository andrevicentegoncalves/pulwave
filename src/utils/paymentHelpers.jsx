// src/utils/paymentHelpers.js
import React from 'react';
import {
    CreditCard,
    Building2,
    Wallet,
    Bitcoin,
    Smartphone,
    Globe
} from 'lucide-react';

/**
 * Payment Method Utilities
 * Shared helpers for payment method components
 */

/**
 * Icon mapping for payment method types
 */
const METHOD_TYPE_ICONS = {
    card: CreditCard,
    bank_account: Building2,
    paypal: Wallet,
    digital_wallet: Smartphone,
    crypto: Bitcoin,
    regional: Globe,
    default: Globe
};

/**
 * Get the icon component for a payment method type
 * @param {string} methodType - The type of payment method
 * @param {number} size - Icon size in pixels (default: 20)
 * @returns {JSX.Element} The icon component
 */
export const getMethodTypeIcon = (methodType, size = 20) => {
    const IconComponent = METHOD_TYPE_ICONS[methodType] || METHOD_TYPE_ICONS.default;
    return <IconComponent size={size} />;
};

/**
 * Get the raw icon component class for a payment method type
 * Useful when you need to render the icon yourself
 * @param {string} methodType - The type of payment method
 * @returns {React.ComponentType} The icon component class
 */
export const getMethodTypeIconComponent = (methodType) => {
    return METHOD_TYPE_ICONS[methodType] || METHOD_TYPE_ICONS.default;
};

/**
 * Format card number for display (masked)
 * @param {string} lastFour - Last 4 digits of card
 * @returns {string} Formatted display string
 */
export const formatCardDisplay = (lastFour) => {
    if (!lastFour) return '••••';
    return `•••• ${lastFour}`;
};

/**
 * Format bank account for display (masked)
 * @param {string} lastFour - Last 4 digits of account
 * @returns {string} Formatted display string
 */
export const formatBankAccountDisplay = (lastFour) => {
    if (!lastFour) return '••••';
    return `••••${lastFour}`;
};
