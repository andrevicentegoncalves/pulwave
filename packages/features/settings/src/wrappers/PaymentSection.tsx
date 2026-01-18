import React from 'react';
/**
 * PaymentSection Feature Wrapper
 * 
 * Manages payment methods - add, edit, remove, set default.
 */
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { Card, Spinner, Alert } from '@pulwave/ui';

export interface PaymentSectionProps {
    userId: string;
    onSave?: () => void;
    onError?: (error: Error) => void;
}

export const PaymentSection = ({
    userId,
    onSave,
    onError,
}: PaymentSectionProps) => {
    const { paymentMethods, isLoading, error } = usePaymentMethods(userId);

    if (isLoading) {
        return (
            <Card>
                <Spinner size="l" />
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <Alert variant="subtle" status="error">{error.message}</Alert>
            </Card>
        );
    }

    return (
        <Card className="payment-section">
            {/* Payment methods list */}
            {/* Add payment method button */}
            <p>Payment methods implementation</p>
        </Card>
    );
};

PaymentSection.displayName = 'PaymentSection';
