/**
 * Payment Service
 * Business logic layer for payment method operations.
 * 
 * @package @pulwave/features/settings
 */

export interface PaymentMethod {
    id: string;
    organization_id: string;
    payment_type: string;
    last_four?: string;
    expiry_month?: number;
    expiry_year?: number;
    is_default: boolean;
    verification_status?: string;
    failure_count?: number;
    last_failure_reason?: string | null;
    last_failure_at?: string | null;
    isExpired?: boolean;
    isExpiringSoon?: boolean;
    daysUntilExpiry?: number | null;
    [key: string]: unknown;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    interval: string;
    features: string[];
}

export interface PaymentRepository {
    findSubscriptionPlans(): Promise<SubscriptionPlan[]>;
    findAll(organizationId: string): Promise<PaymentMethod[]>;
    findById(id: string): Promise<PaymentMethod | null>;
    create(data: Partial<PaymentMethod>): Promise<PaymentMethod>;
    update(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod>;
    softDelete(id: string): Promise<void>;
    unsetAllDefaults(organizationId: string): Promise<void>;
    findSubscriptionInvoices(organizationId: string): Promise<unknown[]>;
    getIcons(): Promise<unknown[]>;
}

export interface CardExpiryStatus {
    isExpired: boolean;
    isExpiringSoon: boolean;
    daysRemaining: number | null;
}

export interface PaymentService {
    getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
    getPaymentMethods(organizationId: string): Promise<PaymentMethod[]>;
    getPaymentMethodById(id: string): Promise<PaymentMethod | null>;
    createPaymentMethod(paymentData: Partial<PaymentMethod>): Promise<PaymentMethod>;
    updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod>;
    deletePaymentMethod(id: string): Promise<void>;
    setDefaultPaymentMethod(id: string, organizationId: string): Promise<void>;
    retryVerification(id: string): Promise<PaymentMethod>;
    getBillingHistory(organizationId: string): Promise<unknown[]>;
    getPaymentMethodIcons(): Promise<unknown[]>;
}

/**
 * Factory function to create payment service
 */
export function createPaymentService(
    repository: PaymentRepository,
    getCardExpiryStatus: (month?: number, year?: number) => CardExpiryStatus | null
): PaymentService {
    return {
        async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
            return repository.findSubscriptionPlans();
        },

        async getPaymentMethods(organizationId: string): Promise<PaymentMethod[]> {
            const methods = await repository.findAll(organizationId);

            return methods.map(method => {
                const expiryStatus = getCardExpiryStatus(method.expiry_month, method.expiry_year);
                return {
                    ...method,
                    isExpired: expiryStatus?.isExpired ?? false,
                    isExpiringSoon: expiryStatus?.isExpiringSoon ?? false,
                    daysUntilExpiry: expiryStatus?.daysRemaining ?? null,
                };
            });
        },

        async getPaymentMethodById(id: string): Promise<PaymentMethod | null> {
            return repository.findById(id);
        },

        async createPaymentMethod(paymentData: Partial<PaymentMethod>): Promise<PaymentMethod> {
            return repository.create(paymentData);
        },

        async updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> {
            return repository.update(id, updates);
        },

        async deletePaymentMethod(id: string): Promise<void> {
            return repository.softDelete(id);
        },

        async setDefaultPaymentMethod(id: string, organizationId: string): Promise<void> {
            await repository.unsetAllDefaults(organizationId);
            await repository.update(id, { is_default: true });
        },

        async retryVerification(id: string): Promise<PaymentMethod> {
            return repository.update(id, {
                verification_status: 'pending',
                failure_count: 0,
                last_failure_reason: null,
                last_failure_at: null,
            });
        },

        async getBillingHistory(organizationId: string): Promise<unknown[]> {
            return repository.findSubscriptionInvoices(organizationId);
        },

        async getPaymentMethodIcons(): Promise<unknown[]> {
            return repository.getIcons();
        }
    };
}
