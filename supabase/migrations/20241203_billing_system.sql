-- ============================================================================
-- BILLING SYSTEM MIGRATION
-- Created: 2024-12-03
-- Description: Complete billing system with invoices and payment methods
-- ============================================================================

-- Create enum for invoice status
DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM (
        'draft',
        'sent',
        'viewed',
        'partial',
        'paid',
        'overdue',
        'cancelled',
        'void'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for payment method type
DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM (
        'card',
        'bank_account',
        'paypal',
        'stripe',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- SUBSCRIPTION_INVOICES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscription_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES organization_subscriptions(id) ON DELETE SET NULL,
    
    -- Invoice details
    invoice_number TEXT NOT NULL UNIQUE,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    paid_date DATE,
    
    -- Financial
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status invoice_status NOT NULL DEFAULT 'draft',
    
    -- Description and metadata
    description TEXT,
    line_items JSONB DEFAULT '[]'::jsonb,
    
    -- Files and external references
    invoice_url TEXT,
    invoice_pdf_url TEXT,
    stripe_invoice_id TEXT,
    
    -- Payment tracking
    payment_method_id UUID,
    payment_reference TEXT,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Metadata
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (
        (due_date IS NULL OR due_date >= invoice_date) AND
        (paid_date IS NULL OR paid_date >= invoice_date)
    ),
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Indexes for subscription_invoices
CREATE INDEX IF NOT EXISTS idx_invoices_organization ON subscription_invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription ON subscription_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON subscription_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON subscription_invoices(invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON subscription_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe ON subscription_invoices(stripe_invoice_id) WHERE stripe_invoice_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_invoices_active ON subscription_invoices(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_invoices_org_date ON subscription_invoices(organization_id, invoice_date DESC);

-- ============================================================================
-- PAYMENT_METHODS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Payment method details
    payment_type payment_method_type NOT NULL DEFAULT 'card',
    
    -- Card details
    card_brand TEXT, -- visa, mastercard, amex, discover, etc
    last_four TEXT,
    expiry_month TEXT,
    expiry_year TEXT,
    cardholder_name TEXT,
    
    -- Bank account details
    bank_name TEXT,
    account_type TEXT, -- checking, savings
    routing_number_last_four TEXT,
    
    -- External payment processor
    stripe_payment_method_id TEXT,
    stripe_customer_id TEXT,
    paypal_email TEXT,
    
    -- Settings
    is_default BOOLEAN NOT NULL DEFAULT false,
    billing_address_id UUID REFERENCES addresses(id),
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Metadata
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT valid_card_expiry CHECK (
        (payment_type != 'card') OR 
        (expiry_month IS NOT NULL AND expiry_year IS NOT NULL)
    ),
    CONSTRAINT valid_last_four CHECK (
        last_four IS NULL OR length(last_four) = 4
    )
);

-- Indexes for payment_methods
CREATE INDEX IF NOT EXISTS idx_payment_methods_organization ON payment_methods(organization_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_profile ON payment_methods(profile_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(payment_type);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe ON payment_methods(stripe_payment_method_id) WHERE stripe_payment_method_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_payment_methods_org_default ON payment_methods(organization_id, is_default DESC);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE subscription_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- subscription_invoices policies
CREATE POLICY invoices_select ON subscription_invoices
    FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY invoices_insert ON subscription_invoices
    FOR INSERT
    WITH CHECK (is_org_admin(organization_id));

CREATE POLICY invoices_update ON subscription_invoices
    FOR UPDATE
    USING (is_org_admin(organization_id))
    WITH CHECK (is_org_admin(organization_id));

CREATE POLICY invoices_delete ON subscription_invoices
    FOR DELETE
    USING (is_org_admin(organization_id));

-- payment_methods policies
CREATE POLICY payment_methods_select ON payment_methods
    FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY payment_methods_insert ON payment_methods
    FOR INSERT
    WITH CHECK (is_org_admin(organization_id));

CREATE POLICY payment_methods_update ON payment_methods
    FOR UPDATE
    USING (is_org_admin(organization_id))
    WITH CHECK (is_org_admin(organization_id));

CREATE POLICY payment_methods_delete ON payment_methods
    FOR DELETE
    USING (is_org_admin(organization_id));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_invoices_updated_at
    BEFORE UPDATE ON subscription_invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one default payment method per organization
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        UPDATE payment_methods
        SET is_default = false
        WHERE organization_id = NEW.organization_id
          AND id != NEW.id
          AND is_default = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_default_payment_method
    BEFORE INSERT OR UPDATE ON payment_methods
    FOR EACH ROW
    WHEN (NEW.is_default = true)
    EXECUTE FUNCTION ensure_single_default_payment_method();
