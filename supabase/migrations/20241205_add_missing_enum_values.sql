-- =============================================================================
-- Migration: Add Missing Enum Values
-- Date: 2024-12-05
-- Purpose: Synchronize database enums with frontend application requirements
-- =============================================================================

-- PostgreSQL allows adding values to existing enums with ALTER TYPE ... ADD VALUE
-- Note: Cannot remove values from enums in PostgreSQL without recreating the type

-- =============================================================================
-- USER TYPE ENUM
-- Current DB values: homeowner, tenant, landlord, property-manager, condominium-admin, real-estate-agent, vendor, admin
-- Missing values needed by UI: contractor, broker, investor, developer, manager, designer
-- =============================================================================

DO $$ 
BEGIN
    -- Add missing user_type values
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'contractor' AND enumtypid = 'user_type'::regtype) THEN
        ALTER TYPE user_type ADD VALUE 'contractor';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'broker' AND enumtypid = 'user_type'::regtype) THEN
        ALTER TYPE user_type ADD VALUE 'broker';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'investor' AND enumtypid = 'user_type'::regtype) THEN
        ALTER TYPE user_type ADD VALUE 'investor';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'developer' AND enumtypid = 'user_type'::regtype) THEN
        ALTER TYPE user_type ADD VALUE 'developer';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'manager' AND enumtypid = 'user_type'::regtype) THEN
        ALTER TYPE user_type ADD VALUE 'manager';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'designer' AND enumtypid = 'user_type'::regtype) THEN
        ALTER TYPE user_type ADD VALUE 'designer';
    END IF;
END $$;

-- =============================================================================
-- THEME PREFERENCE ENUM
-- Current DB values: light, dark, auto, system
-- All values present - no changes needed
-- =============================================================================

-- =============================================================================
-- PAYMENT METHOD TYPE ENUM  
-- Current DB values: card, bank_account, paypal, stripe, other
-- Adding additional wallet/crypto types
-- =============================================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'apple_pay' AND enumtypid = 'payment_method_type'::regtype) THEN
        ALTER TYPE payment_method_type ADD VALUE 'apple_pay';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'google_pay' AND enumtypid = 'payment_method_type'::regtype) THEN
        ALTER TYPE payment_method_type ADD VALUE 'google_pay';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'crypto' AND enumtypid = 'payment_method_type'::regtype) THEN
        ALTER TYPE payment_method_type ADD VALUE 'crypto';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'mbway' AND enumtypid = 'payment_method_type'::regtype) THEN
        ALTER TYPE payment_method_type ADD VALUE 'mbway';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'multibanco' AND enumtypid = 'payment_method_type'::regtype) THEN
        ALTER TYPE payment_method_type ADD VALUE 'multibanco';
    END IF;
END $$;

-- =============================================================================
-- VERIFICATION - View current enum values
-- =============================================================================

-- To verify the enum values after migration, run:
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'user_type'::regtype ORDER BY enumsortorder;
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'theme_preference'::regtype ORDER BY enumsortorder;
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'payment_method_type'::regtype ORDER BY enumsortorder;

COMMENT ON TYPE user_type IS 'User types: homeowner, tenant, landlord, property-manager, condominium-admin, real-estate-agent, vendor, admin, contractor, broker, investor, developer, manager, designer';
