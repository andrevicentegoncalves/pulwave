import React, { useState, useEffect } from 'react';
import { Button, Card, CardGrid, Skeleton, Check } from '../ui';
import { paymentService } from '../../services';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getSubscriptionPlans();
        setPlans(data || []);
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
        setError('Failed to load subscription plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Convert features object to array of feature descriptions
  const getFeaturesList = (features) => {
    if (!features || typeof features !== 'object') return [];

    const featureMap = {
      mobile_app: 'Mobile app access',
      tenant_portal: 'Tenant portal',
      owner_portal: 'Owner portal',
      email_support: 'Email support',
      phone_support: 'Phone support',
      priority_support: 'Priority support',
      dedicated_support: 'Dedicated support',
      basic_reporting: 'Basic reporting',
      advanced_reporting: 'Advanced analytics',
      maintenance_tracking: 'Maintenance tracking',
      online_payments: 'Online payments',
      accounting_integration: 'Accounting integration',
      api_access: 'API access',
      bulk_operations: 'Bulk operations',
      custom_branding: 'Custom branding',
      custom_integrations: 'Custom integrations',
      white_label: 'White label',
      sso: 'Single Sign-On (SSO)',
      sla_99_9: '99.9% SLA',
      dedicated_account_manager: 'Dedicated account manager',
      custom_contracts: 'Custom contracts'
    };

    return Object.entries(features)
      .filter(([_, value]) => value === true)
      .map(([key]) => featureMap[key] || key.replace(/_/g, ' '))
      .slice(0, 6); // Show max 6 features
  };

  if (loading) {
    return (
      <div className="subscription-plans">
        <div className="subscription-plans__header">
          <Skeleton variant="text" width="40%" height={32} className="margin-bottom-2 margin-x-auto" />
          <Skeleton variant="text" width="60%" height={20} className="margin-x-auto" />
        </div>
        <CardGrid className="card-grid--3-col" gap="var(--spacing-6)">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton variant="rectangular" height={400} width="100%" />
            </Card>
          ))}
        </CardGrid>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscription-plans">
        <div className="subscription-plans__header">
          <h3>Subscription Plans</h3>
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-plans">
      <div className="subscription-plans__header">
        <h3>Subscription Plans</h3>
        <p className="text-secondary">Choose the plan that fits your needs</p>
      </div>

      <CardGrid className="card-grid--3-col" gap="var(--spacing-6)">
        {plans.map((plan) => {
          const features = getFeaturesList(plan.features);
          const isHighlighted = plan.plan_tier === 'professional' || plan.plan_tier === 'starter';
          const isFree = parseFloat(plan.monthly_price) === 0;
          const isCustomPricing = plan.plan_tier === 'enterprise_plus';

          return (
            <Card
              key={plan.id}
              className={`plan-card ${isHighlighted ? 'plan-card--highlight' : ''}`}
            >
              {isHighlighted && (
                <div className="plan-card__badge">
                  {plan.plan_tier === 'professional' ? 'Popular' : 'Recommended'}
                </div>
              )}

              <div className="plan-card__header">
                <h4 className="plan-card__title">{plan.plan_name}</h4>
                <div className="plan-card__price">
                  <span className="amount">
                    {isFree ? 'Free' : isCustomPricing ? 'Custom' : `$${parseFloat(plan.monthly_price).toFixed(0)}`}
                  </span>
                  {!isFree && !isCustomPricing && <span className="period">/month</span>}
                </div>
                <p className="plan-card__description">{plan.description}</p>
              </div>

              <div className="plan-card__features">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <Check size={16} className="feature-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="plan-card__footer">
                <Button
                  variant={isHighlighted ? 'primary' : 'outline'}
                  fullWidth
                  className={isHighlighted ? 'button--glow border-primary' : ''}
                >
                  {isFree ? 'Current Plan' : isCustomPricing ? 'Contact Sales' : 'Upgrade'}
                </Button>
              </div>
            </Card>
          );
        })}
      </CardGrid>
    </div>
  );
};

export default SubscriptionPlans;
