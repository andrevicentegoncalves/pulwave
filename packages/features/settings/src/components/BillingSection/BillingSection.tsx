/**
 * BillingSection - Account billing and subscription management
 *
 * @package @pulwave/experience-settings
 */

import { useState, useEffect, type ComponentType } from 'react';
import { Card, Button, Skeleton } from '@pulwave/ui';

// Types
export interface SubscriptionPlan {
    id?: string;
    plan_name: string;
    plan_tier: string;
    monthly_price: string;
    annual_price?: string;
    features?: string[];
}

export interface BillingSectionProps {
    onFetchCurrentPlan: () => Promise<SubscriptionPlan | null>;
    onNavigateToHistory?: () => void;
    onNavigateToMethods?: () => void;
    onShowPlans?: () => void;
    SubscriptionPlansComponent?: ComponentType;
}

type ActiveSection = 'overview' | 'history' | 'methods';

/**
 * Billing section for account settings.
 * Shows current plan, upgrade options, and navigation to billing details.
 */
export const BillingSection = ({
    onFetchCurrentPlan,
    onNavigateToHistory,
    onNavigateToMethods,
    onShowPlans,
    SubscriptionPlansComponent,
}: BillingSectionProps) => {
    const [showPlans, setShowPlans] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<ActiveSection>('overview');

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setLoading(true);
                const plan = await onFetchCurrentPlan();
                setCurrentPlan(plan || {
                    plan_name: 'Free Plan',
                    plan_tier: 'free',
                    monthly_price: '0.00'
                });
            } catch {
                // Silent error - fallback to free plan
                setCurrentPlan({
                    plan_name: 'Free Plan',
                    plan_tier: 'free',
                    monthly_price: '0.00'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [onFetchCurrentPlan]);

    const isFreePlan = currentPlan?.monthly_price === '0.00' || currentPlan?.plan_tier === 'free';

    const handleShowPlans = () => {
        setShowPlans(!showPlans);
        onShowPlans?.();
    };

    const handleNavigateToHistory = () => {
        setActiveSection('history');
        onNavigateToHistory?.();
    };

    const handleNavigateToMethods = () => {
        setActiveSection('methods');
        onNavigateToMethods?.();
    };

    return (
        <div className="account-billing">
            <div className="profile-section__header">
                <h2 className="profile-section__title">Account & Billing</h2>
                <p className="profile-section__subtitle">
                    Manage your subscription and payment methods
                </p>
            </div>

            <div className="profile-section__content">
                {/* Current Subscription Status */}
                <Card>
                    {loading ? (
                        <div>
                            <Skeleton variant="text" width="40%" height={24} />
                            <Skeleton variant="text" width="60%" height={16} />
                        </div>
                    ) : (
                        <div className="account-billing__card-content">
                            <div className="account-billing__plan-info">
                                <h3 className="account-billing__plan-name">
                                    Current Plan: {currentPlan?.plan_name || 'Free'}
                                </h3>
                                {!isFreePlan && (
                                    <p className="account-billing__billing-date">
                                        Your next billing date is{' '}
                                        <span className="account-billing__date-value">
                                            October 24, 2025
                                        </span>
                                    </p>
                                )}
                            </div>
                            <div className="account-billing__actions">
                                <Button
                                    variant="outlined"
                                    size="s"
                                    onClick={handleShowPlans}
                                >
                                    Upgrade
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="s"
                                    onClick={handleNavigateToHistory}
                                >
                                    Billing History
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="s"
                                    onClick={handleNavigateToMethods}
                                >
                                    Payment Methods
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Subscription Plans - Conditional Render */}
                {showPlans && SubscriptionPlansComponent && (
                    <div className="margin-top-6">
                        <SubscriptionPlansComponent />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingSection;
