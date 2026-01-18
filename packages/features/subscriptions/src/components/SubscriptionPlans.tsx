/**
 * SubscriptionPlans Component
 * @package @pulwave/experience/subscription
 */
import { useState, useEffect, type ComponentType, type ReactNode } from 'react';

interface Plan {
    id: string;
    plan_name: string;
    plan_tier: string;
    monthly_price: string | number;
    description?: string;
    features?: Record<string, boolean>;
}

interface PaymentService {
    getSubscriptionPlans(): Promise<Plan[]>;
}

interface SubscriptionPlansProps {
    paymentService: PaymentService;
    CardComponent: ComponentType<{ className?: string; children: ReactNode }>;
    ButtonComponent: ComponentType<{
        variant?: string;
        fullWidth?: boolean;
        className?: string;
        children: ReactNode;
    }>;
    SkeletonComponent?: ComponentType<{
        variant?: string;
        width?: string | number;
        height?: number;
        className?: string;
    }>;
}

const FEATURE_MAP: Record<string, string> = {
    mobile_app: 'Mobile app access',
    tenant_portal: 'Tenant portal',
    owner_portal: 'Owner portal',
    email_support: 'Email support',
    phone_support: 'Phone support',
    priority_support: 'Priority support',
    basic_reporting: 'Basic reporting',
    advanced_reporting: 'Advanced analytics',
    maintenance_tracking: 'Maintenance tracking',
    online_payments: 'Online payments',
    api_access: 'API access',
};

export const SubscriptionPlans = ({
    paymentService,
    CardComponent,
    ButtonComponent,
    SkeletonComponent,
}: SubscriptionPlansProps) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const data = await paymentService.getSubscriptionPlans();
                setPlans(data || []);
            } catch (err) {
                setError('Failed to load subscription plans');
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, [paymentService]);

    const getFeaturesList = (features?: Record<string, boolean>) => {
        if (!features) return [];
        return Object.entries(features)
            .filter(([, value]) => value === true)
            .map(([key]) => FEATURE_MAP[key] || key.replace(/_/g, ' '))
            .slice(0, 6);
    };

    if (loading && SkeletonComponent) {
        return (
            <div className="subscription-plans">
                <SkeletonComponent variant="rectangular" height={400} width="100%" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="subscription-plans">
                <p className="color-text-error" role="alert">{error}</p>
            </div>
        );
    }

    return (
        <div className="subscription-plans">
            <div className="subscription-plans__header">
                <h3>Subscription Plans</h3>
                <p className="color-text-secondary">Choose the plan that fits your needs</p>
            </div>
            <div className="subscription-plans__grid">
                {plans.map(plan => {
                    const features = getFeaturesList(plan.features);
                    const isHighlighted = plan.plan_tier === 'professional';
                    const isFree = parseFloat(String(plan.monthly_price)) === 0;

                    return (
                        <CardComponent key={plan.id} className={`plan-card ${isHighlighted ? 'plan-card--highlight' : ''}`}>
                            <div className="plan-card__header">
                                <h4>{plan.plan_name}</h4>
                                <div className="plan-card__price">
                                    {isFree ? 'Free' : `$${parseFloat(String(plan.monthly_price)).toFixed(0)}/mo`}
                                </div>
                                {plan.description && <p>{plan.description}</p>}
                            </div>
                            <div className="plan-card__features">
                                {features.map((feature, i) => (
                                    <div key={i} className="feature-item"><span aria-hidden="true">✓</span> {feature}</div>
                                ))}
                            </div>
                            <div className="plan-card__footer">
                                <ButtonComponent variant={isHighlighted ? 'primary' : 'outline'} fullWidth>
                                    {isFree ? 'Current Plan' : 'Upgrade'}
                                </ButtonComponent>
                            </div>
                        </CardComponent>
                    );
                })}
            </div>
        </div>
    );
};

export default SubscriptionPlans;
