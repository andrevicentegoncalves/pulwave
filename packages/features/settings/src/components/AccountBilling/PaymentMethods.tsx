/**
 * PaymentMethods Sub-Section
 * 
 * Manages payment methods.
 * Re-exports from existing PaymentMethods implementation or provides placeholder.
 * 
 * @package @pulwave/experience-settings
 */
import { useState, useEffect } from 'react';
import { Card, Button, SectionHeader, Skeleton, EmptyState } from '@pulwave/ui';
import { ArrowLeft, CreditCard, Plus } from '@pulwave/ui';

interface PaymentMethod {
    id: string;
    type: 'card' | 'bank' | 'paypal';
    last_four: string;
    brand?: string;
    is_default: boolean;
    expires?: string;
}

export interface PaymentMethodsProps {
    onBack?: () => void;
}

/**
 * PaymentMethods - Manages payment methods
 */
export const PaymentMethods = ({ onBack }: PaymentMethodsProps) => {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMethods = async () => {
            try {
                setLoading(true);
                // TODO: Implement actual payment method fetching
                await new Promise(resolve => setTimeout(resolve, 500));
                setMethods([]);
            } catch {
                // Silent error - component will show empty state
            } finally {
                setLoading(false);
            }
        };

        fetchMethods();
    }, []);

    return (
        <div className="profile-section">
            <div className="profile-section__header--with-back">
                {onBack && (
                    <Button variant="ghost" size="s" onClick={onBack}>
                        <ArrowLeft size={16} className="margin-right-2" aria-hidden="true" />
                        Back to Billing
                    </Button>
                )}
                <SectionHeader icon={CreditCard} title="Payment Methods" />
            </div>
            <div className="profile-section__cards">
                <Card>
                    {loading ? (
                        <div className="payment-methods__loading">
                            <Skeleton variant="rectangular" height={80} />
                            <Skeleton variant="rectangular" height={80} />
                        </div>
                    ) : methods.length === 0 ? (
                        <EmptyState
                            icon={<CreditCard size={48} aria-hidden="true" />}
                            title="No payment methods"
                            description="Add a payment method to subscribe to paid plans or make payments."
                            action={
                                <Button variant="outlined">
                                    <Plus size={16} className="margin-right-2" aria-hidden="true" />
                                    Add Payment Method
                                </Button>
                            }
                        />
                    ) : (
                        <div className="payment-methods__list">
                            {methods.map(method => (
                                <div key={method.id} className="payment-methods__item">
                                    <div className="payment-methods__item-info">
                                        <CreditCard size={24} aria-hidden="true" />
                                        <div className="payment-methods__details">
                                            <span className="payment-methods__brand">
                                                {method.brand} •••• {method.last_four}
                                            </span>
                                            {method.expires && (
                                                <span className="payment-methods__expires">
                                                    Expires {method.expires}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {method.is_default && (
                                        <span className="payment-methods__default-badge">Default</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

PaymentMethods.displayName = 'PaymentMethods';

export default PaymentMethods;
