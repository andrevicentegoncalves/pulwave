/**
 * Settings feature internal types
 * These are implementation details - only export what consumers need
 */

export interface ProfileData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
    address?: AddressData;
}

export interface AddressData {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface SecuritySettings {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
    activeSessions: Session[];
    trustedContacts: TrustedContact[];
}

export interface Session {
    id: string;
    device: string;
    location: string;
    lastActive: Date;
    isCurrent: boolean;
}

export interface TrustedContact {
    id: string;
    name: string;
    email: string;
    relationship: string;
}

export interface Preferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
    notifications: NotificationPreferences;
}

export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
}

export interface PaymentMethod {
    id: string;
    type: 'card' | 'bank' | 'paypal';
    label: string;
    isDefault: boolean;
    lastFour?: string;
    expiryMonth?: number;
    expiryYear?: number;
    brand?: string;
}
