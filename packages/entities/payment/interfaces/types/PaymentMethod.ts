/**
 * Payment Types
 */
export interface PaymentMethod {
    id: string;
    organization_id: string;
    provider: string;
    provider_payment_method_id: string;
    is_default: boolean;
    card_brand?: string;
    last_four?: string;
    expiry_month: number | string;
    expiry_year: number | string;
    is_active: boolean;
    verification_status?: string;
    failure_count?: number;
    last_failure_reason?: string | null;
    last_failure_at?: string | null;
    [key: string]: unknown;
}

export interface PaymentMethodIcon {
    id: string;
    brand: string;
    icon_url: string;
    [key: string]: unknown;
}

