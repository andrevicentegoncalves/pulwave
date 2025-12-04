-- Migration: Create subscription_plans table
-- Description: Stores subscription plan information including pricing, features, and metadata

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    price_yearly DECIMAL(10, 2),
    features JSONB DEFAULT '[]'::jsonb,
    max_properties INTEGER,
    max_users INTEGER,
    is_popular BOOLEAN DEFAULT false,
    is_recommended BOOLEAN DEFAULT false,
    cta_text VARCHAR(50) DEFAULT 'Select Plan',
    stripe_price_id VARCHAR(255),
    stripe_product_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read subscription plans (public data)
CREATE POLICY "Subscription plans are viewable by everyone"
    ON public.subscription_plans
    FOR SELECT
    USING (is_active = true);

-- Only admins can modify subscription plans
CREATE POLICY "Only admins can modify subscription plans"
    ON public.subscription_plans
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON public.subscription_plans(is_active, display_order);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, max_properties, max_users, is_popular, is_recommended, cta_text, display_order)
VALUES
    (
        'Starter',
        'Perfect for individuals getting started.',
        0,
        0,
        '["Basic profile management", "Up to 5 properties", "Standard support", "Basic analytics"]'::jsonb,
        5,
        1,
        false,
        false,
        'Current Plan',
        1
    ),
    (
        'Pro',
        'For growing property managers.',
        29,
        290,
        '["Unlimited properties", "Advanced analytics", "Priority support", "Team collaboration", "Custom branding", "API access"]'::jsonb,
        NULL,
        10,
        true,
        true,
        'Upgrade to Pro',
        2
    ),
    (
        'Enterprise',
        'For large organizations and agencies.',
        NULL,
        NULL,
        '["Dedicated account manager", "SLA support", "Custom integrations", "Advanced security", "Audit logs", "Unlimited team members"]'::jsonb,
        NULL,
        NULL,
        false,
        false,
        'Contact Sales',
        3
    )
ON CONFLICT DO NOTHING;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_subscription_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscription_plans_updated_at
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_plans_updated_at();
