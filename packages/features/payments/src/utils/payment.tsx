/**
 * Payment UI Utilities
 * Components and icons for payment methods
 * 
 * @package @pulwave/ui-utils
 */
import React from 'react';
import {
    CreditCard,
    Building2,
    Wallet,
    Bitcoin,
    Smartphone,
    Globe,
    type IconComponent as LucideIcon
} from '@pulwave/ui';

/**
 * Icon mapping for payment method types
 */
const METHOD_TYPE_ICONS: Record<string, LucideIcon> = {
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
 */
export const getMethodTypeIcon = (methodType: string, size: number = 20): React.ReactElement => {
    const IconComponent = METHOD_TYPE_ICONS[methodType] || METHOD_TYPE_ICONS.default;
    return <IconComponent size={size} />;
};

/**
 * Get the raw icon component class for a payment method type
 */
export const getMethodTypeIconComponent = (methodType: string): LucideIcon => {
    return METHOD_TYPE_ICONS[methodType] || METHOD_TYPE_ICONS.default;
};
