import React, { useState, useEffect } from 'react';
import SubscriptionPlans from '../../../../components/shared/SubscriptionPlans';
import { BillingHistory, PaymentMethods } from './payment';
import { Card, Button, Skeleton } from '../../../../components/ui';
import { CreditCard, Clock, ArrowUpCircle } from 'lucide-react';
import { supabase } from '../../../../lib/supabaseClient';

const AccountBilling = () => {
    const [showPlans, setShowPlans] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'history', 'methods'

    useEffect(() => {
        const fetchCurrentPlan = async () => {
            try {
                setLoading(true);
                // Get current user
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // Fetch user's profile to get their subscription plan
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('subscription_plan_id')
                        .eq('id', user.id)
                        .single();

                    if (profile?.subscription_plan_id) {
                        // Fetch the plan details
                        const { data: plan } = await supabase
                            .from('subscription_plans')
                            .select('*')
                            .eq('id', profile.subscription_plan_id)
                            .single();

                        setCurrentPlan(plan);
                    } else {
                        // Default to free plan if no subscription
                        const { data: freePlan } = await supabase
                            .from('subscription_plans')
                            .select('*')
                            .eq('plan_tier', 'free')
                            .single();

                        setCurrentPlan(freePlan);
                    }
                }
            } catch (error) {
                console.error('Error fetching subscription plan:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentPlan();
    }, []);

    const isFreePlan = currentPlan?.monthly_price === '0.00' || currentPlan?.plan_tier === 'free';

    // Render different sections based on activeSection
    if (activeSection === 'history') {
        return <BillingHistory onBack={() => setActiveSection('overview')} />;
    }

    if (activeSection === 'methods') {
        return <PaymentMethods onBack={() => setActiveSection('overview')} />;
    }

    return (
        <div className="account-billing">
            <div className="profile-section__header">
                <h2 className="profile-section__title">Account & Billing</h2>
                <p className="profile-section__subtitle">Manage your subscription and payment methods</p>
            </div>

            <div className="profile-section__content">
                {/* Current Subscription Status */}
                <Card>
                    {loading ? (
                        <div>
                            <Skeleton variant="text" width="40%" height={24} className="margin-bottom-2" />
                            <Skeleton variant="text" width="60%" height={16} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-1">
                                    Current Plan: {currentPlan?.plan_name || 'Solo Landlord'}
                                </h3>
                                {!isFreePlan && (
                                    <p className="text-secondary text-sm">
                                        Your next billing date is <span className="font-medium text-primary">October 24, 2025</span>
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => setShowPlans(!showPlans)}
                                >
                                    <ArrowUpCircle size={16} className="mr-2" />
                                    Upgrade
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveSection('history')}
                                >
                                    <Clock size={16} className="mr-2" />
                                    Billing History
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveSection('methods')}
                                >
                                    <CreditCard size={16} className="mr-2" />
                                    Payment Methods
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Subscription Plans - Conditional Render */}
                {
                    showPlans && (
                        <div className="margin-top-6">
                            <SubscriptionPlans />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default AccountBilling;
