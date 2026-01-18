/**
 * Payment Methods Service
 * Management of payment methods.
 */
import { paymentRepository } from '../../repositories/paymentRepository';
import { getCardExpiryStatus } from '@pulwave/utils';
import {
    PaymentMethod as IBasePaymentMethod,
    PaymentMethodIcon,
} from '../../interfaces/types/PaymentMethod';

export interface EnrichedPaymentMethod extends IBasePaymentMethod {
    isExpired: boolean;
    isExpiringSoon: boolean;
    daysUntilExpiry: number | null;
}

export const paymentMethodService = {
    async getPaymentMethods(organizationId: string): Promise<EnrichedPaymentMethod[]> {
        const methods = await paymentRepository.findAll(organizationId);

        return methods.map((method): EnrichedPaymentMethod => {
            const expiryStatus = getCardExpiryStatus(method.expiry_month, method.expiry_year);
            return {
                ...method,
                isExpired: expiryStatus?.isExpired ?? false,
                isExpiringSoon: expiryStatus?.isExpiringSoon ?? false,
                daysUntilExpiry: expiryStatus?.daysRemaining ?? null,
            };
        });
    },

    async getPaymentMethodById(id: string): Promise<IBasePaymentMethod | null> {
        return paymentRepository.findById(id);
    },

    async createPaymentMethod(
        paymentData: Partial<IBasePaymentMethod>
    ): Promise<IBasePaymentMethod> {
        return paymentRepository.create(paymentData);
    },

    async updatePaymentMethod(
        id: string,
        updates: Partial<IBasePaymentMethod>
    ): Promise<IBasePaymentMethod> {
        return paymentRepository.update(id, updates);
    },

    async deletePaymentMethod(id: string): Promise<void> {
        return paymentRepository.softDelete(id);
    },

    async setDefaultPaymentMethod(id: string, organizationId: string): Promise<void> {
        await paymentRepository.unsetAllDefaults(organizationId);
        await paymentRepository.update(id, { is_default: true });
    },

    async retryVerification(id: string): Promise<IBasePaymentMethod> {
        return paymentRepository.update(id, {
            verification_status: 'pending',
            failure_count: 0,
            last_failure_reason: null,
            last_failure_at: null,
        });
    },

    async getPaymentMethodIcons(): Promise<PaymentMethodIcon[]> {
        return paymentRepository.getIcons();
    },
};



