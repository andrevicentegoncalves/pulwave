/**
 * AccountBilling Section
 * 
 * Billing and subscription management.
 * Shows current plan, upgrade options, billing history, and payment methods.
 * 
 * @package @pulwave/experience-settings
 */
import { useState, useEffect } from 'react';
import { Card, Button, SectionHeader, Skeleton } from '@pulwave/ui';
import { CreditCard, Clock, ArrowUpCircle, ArrowLeft } from '@pulwave/ui';
import { subscriptionService, type ISubscriptionPlan } from '@pulwave/entity-subscription';
import { BillingHistory } from './BillingHistory';
import { PaymentMethods } from './PaymentMethods';

export interface AccountBillingProps {
    loading?: boolean;
}

/**
 * AccountBilling - Billing and subscription section
 */
export const AccountBilling = ({
    loading: externalLoading = false,
}: AccountBillingProps) => {
    const [showPlans, setShowPlans] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<ISubscriptionPlan | null>(null);
    const [internalLoading, setInternalLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'methods'>('overview');

    useEffect(() => {
        const fetchCurrentPlan = async () => {
            try {
                setInternalLoading(true);

                // Fetch plans via service
                const plans = await subscriptionService.getPlans();
                const freePlans = plans.filter(p => p.plan_tier === 'free' && p.is_active);

                if (freePlans.length > 0) {
                    setCurrentPlan(freePlans[0]);
                } else {
                    // Fallback plan if no plans exist in DB
                    setCurrentPlan({
                        id: 'free-default',
                        plan_name: 'Free Plan',
                        plan_tier: 'free',
                        monthly_price: '0.00',
                        is_active: true
                    });
                }
            } catch {
                // Silent error handling - fall back to default plan
                setCurrentPlan({
                    id: 'free-default',
                    plan_name: 'Free Plan',
                    plan_tier: 'free',
                    monthly_price: '0.00',
                    is_active: true
                });
            } finally {
                setInternalLoading(false);
            }
        };

        fetchCurrentPlan();
    }, []);

    const isLoading = externalLoading || internalLoading;
    const isFreePlan = currentPlan?.monthly_price === '0.00' || currentPlan?.plan_tier === 'free';

    // Render sub-sections
    if (activeSection === 'history') {
        return <BillingHistory onBack={() => setActiveSection('overview')} />;
    }

    if (activeSection === 'methods') {
        return <PaymentMethods onBack={() => setActiveSection('overview')} />;
    }

    return (
        <div className="profile-section">
            <SectionHeader icon={CreditCard} title="Account & Billing" />
            <div className="profile-section__cards">
                {/* Current Subscription Card */}
                <Card>
                    {isLoading ? (
                        <div className="account-billing__loading">
                            <Skeleton variant="text" width="40%" height={24} />
                            <Skeleton variant="text" width="60%" height={16} />
                        </div>
                    ) : (
                        <div className="account-billing__card-content">
                            <div className="account-billing__plan-info">
                                <h3 className="account-billing__plan-name">
                                    Current Plan: {currentPlan?.plan_name || 'Free Plan'}
                                </h3>
                                {!isFreePlan && (
                                    <p className="account-billing__billing-date">
                                        Your next billing date is <span className="account-billing__date-value">--</span>
                                    </p>
                                )}
                            </div>
                            <div className="account-billing__actions">
                                <Button
                                    variant="outlined"
                                    size="s"
                                    onClick={() => setShowPlans(!showPlans)}
                                >
                                    <ArrowUpCircle size={16} className="margin-right-2" aria-hidden="true" />
                                    {showPlans ? 'Hide Plans' : 'Upgrade'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="s"
                                    onClick={() => setActiveSection('history')}
                                >
                                    <Clock size={16} className="margin-right-2" aria-hidden="true" />
                                    Billing History
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="s"
                                    onClick={() => setActiveSection('methods')}
                                >
                                    <CreditCard size={16} className="margin-right-2" aria-hidden="true" />
                                    Payment Methods
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Subscription Plans - Conditional */}
                {showPlans && (
                    <div className="margin-top-6">
                        <Card>
                            <div className="card-header">
                                <h3>Available Plans</h3>
                            </div>
                            <p className="text-muted">Subscription plans are loading from @pulwave/experience-subscription...</p>
                            <p className="text-muted margin-top-2">
                                Contact support to upgrade your plan.
                            </p>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

AccountBilling.displayName = 'AccountBilling';

export default AccountBilling;
