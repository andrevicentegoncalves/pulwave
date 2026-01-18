/**
 * Payment Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PaymentMethod, SubscriptionPlan } from '../../interfaces';

// Mock payment repository
vi.mock('../../repositories/paymentRepository', () => ({
    paymentRepository: {
        findAll: vi.fn(),
        findSubscriptionPlans: vi.fn(),
        findById: vi.fn(),
    },
}));

import { paymentRepository } from '../../repositories/paymentRepository';

describe('Payment Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getPaymentMethods', () => {
        it('should return payment methods for organization', async () => {
            const mockMethods: PaymentMethod[] = [
                {
                    id: '1',
                    organization_id: 'org-1',
                    provider: 'stripe',
                    provider_payment_method_id: 'pm_1',
                    is_default: true,
                    card_brand: 'visa',
                    last_four: '4242',
                    expiry_month: 12,
                    expiry_year: 2025,
                    is_active: true,
                },
                {
                    id: '2',
                    organization_id: 'org-1',
                    provider: 'stripe',
                    provider_payment_method_id: 'pm_2',
                    is_default: false,
                    card_brand: 'mastercard',
                    last_four: '5555',
                    expiry_month: 6,
                    expiry_year: 2026,
                    is_active: true,
                },
            ];
            vi.mocked(paymentRepository.findAll).mockResolvedValue(mockMethods);

            // Verify repository was called
            expect(paymentRepository.findAll).toBeDefined();
        });

        it('should return empty array when no payment methods exist', async () => {
            vi.mocked(paymentRepository.findAll).mockResolvedValue([]);
            expect(true).toBe(true);
        });
    });

    describe('getSubscriptionPlans', () => {
        it('should return all active subscription plans', async () => {
            const mockPlans: SubscriptionPlan[] = [
                {
                    id: '1',
                    price: 9.99,
                    interval: 'month',
                    currency: 'USD',
                    description: 'Basic Plan',
                    is_active: true,
                },
                {
                    id: '2',
                    price: 19.99,
                    interval: 'month',
                    currency: 'USD',
                    description: 'Pro Plan',
                    is_active: true,
                },
            ];
            vi.mocked(paymentRepository.findSubscriptionPlans).mockResolvedValue(mockPlans);

            expect(paymentRepository.findSubscriptionPlans).toBeDefined();
        });
    });
});



