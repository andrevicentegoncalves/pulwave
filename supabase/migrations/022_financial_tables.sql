-- ============================================================================
-- FINANCIAL TABLES - COMPLETE IMPLEMENTATION
-- ============================================================================
-- Migration: 022_financial_tables.sql
-- Description: Implements exchange rates for multi-currency support and
--              fiscal periods for accounting period management
-- Author: Pulwave DBA Team
-- Date: 2025-11-29
-- ============================================================================

-- ============================================================================
-- PART 1: EXCHANGE RATES TABLE
-- ============================================================================
-- Purpose: Stores historical currency exchange rates for multi-currency support
--
-- Use cases:
--   - Convert EUR rent to USD for US-based investors
--   - Display property values in user's preferred currency
--   - Generate financial reports in organization's base currency
--   - Track currency fluctuations over time
--
-- Example:
--   Property in Portugal: rent = 1000 EUR
--   US investor wants: $1,100 USD (using rate 1.10)
-- ============================================================================

CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Currency pair
  from_currency text NOT NULL,              -- Source currency (ISO 4217: EUR, USD, GBP)
  to_currency text NOT NULL,                -- Target currency
  
  -- Exchange rate
  rate numeric(20,10) NOT NULL,             -- High precision (10 decimals)
                                            -- Example: 1 EUR = 1.0956320000 USD
  
  -- Temporal tracking
  effective_date date NOT NULL,             -- Date this rate is valid from
  source text,                              -- Rate source (ECB, XE.com, manual)
  
  -- Audit
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  
  -- Constraints
  CONSTRAINT valid_currency_pair CHECK (from_currency != to_currency),
  CONSTRAINT positive_rate CHECK (rate > 0),
  UNIQUE(from_currency, to_currency, effective_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exchange_rates_pair_date 
  ON exchange_rates(from_currency, to_currency, effective_date DESC);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_date 
  ON exchange_rates(effective_date DESC);

-- Comments
COMMENT ON TABLE exchange_rates IS 
'Historical currency exchange rates for multi-currency financial operations. 
Enables conversion of payments, rent, and property values across currencies.';

COMMENT ON COLUMN exchange_rates.from_currency IS 
'Source currency code (ISO 4217). Examples: EUR, USD, GBP, JPY, BRL, CNY';

COMMENT ON COLUMN exchange_rates.rate IS 
'Exchange rate with 10 decimal precision. Example: 1 EUR = 1.0956320000 USD.
High precision prevents cumulative rounding errors in financial calculations.';

COMMENT ON COLUMN exchange_rates.effective_date IS 
'Date from which this rate is valid. Use most recent rate before transaction date for conversions.';

-- ============================================================================
-- PART 2: FISCAL PERIODS TABLE
-- ============================================================================
-- Purpose: Tracks accounting periods for financial reporting and period closing
--
-- Why needed:
--   - Financial data must be organized by accounting periods
--   - Period closing prevents retroactive changes to finalized records
--   - Required for accurate financial statements and tax reporting
--   - Ensures data integrity and audit compliance
--
-- Example workflow:
--   1. Create period: "Q4 2024" (Oct 1 - Dec 31, 2024)
--   2. Record transactions throughout the quarter
--   3. End of quarter: review all transactions
--   4. Close period: is_closed = true
--   5. Future edits to Q4 2024 transactions are BLOCKED
-- ============================================================================

CREATE TABLE IF NOT EXISTS fiscal_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Period definition
  period_name text NOT NULL,                -- e.g., 'Q4 2024', 'November 2024', 'FY 2024'
  period_type text NOT NULL DEFAULT 'monthly', -- 'monthly', 'quarterly', 'annual', 'custom'
  start_date date NOT NULL,
  end_date date NOT NULL,
  
  -- Closing status
  is_closed boolean DEFAULT false,          -- When true, period is locked
  closed_at timestamptz,
  closed_by uuid REFERENCES profiles(id),
  closing_notes text,
  
  -- Audit trail
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES profiles(id),
  
  -- Constraints
  CONSTRAINT fiscal_period_dates_valid CHECK (start_date < end_date),
  CONSTRAINT valid_period_type CHECK (period_type IN ('monthly', 'quarterly', 'annual', 'custom')),
  UNIQUE(organization_id, period_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fiscal_periods_org_dates 
  ON fiscal_periods(organization_id, start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_fiscal_periods_org_status 
  ON fiscal_periods(organization_id, is_closed);

CREATE INDEX IF NOT EXISTS idx_fiscal_periods_org_type 
  ON fiscal_periods(organization_id, period_type, start_date DESC);

-- Comments
COMMENT ON TABLE fiscal_periods IS 
'Defines accounting periods for financial reporting and period closing. 
Closed periods prevent retroactive changes to financial records, ensuring audit compliance.';

COMMENT ON COLUMN fiscal_periods.is_closed IS 
'When true, all transactions in this period are locked and cannot be edited or deleted. 
This ensures financial data integrity after period close. Only admins can close periods.';

COMMENT ON COLUMN fiscal_periods.period_type IS 
'Type of fiscal period: monthly (Jan 2024), quarterly (Q1 2024), annual (FY 2024), or custom.';

-- ============================================================================
-- PART 3: CURRENCY CONVERSION FUNCTIONS
-- ============================================================================

-- Get latest exchange rate
CREATE OR REPLACE FUNCTION get_exchange_rate(
  p_from_currency text,
  p_to_currency text,
  p_date date DEFAULT CURRENT_DATE
) RETURNS numeric AS $$
DECLARE
  v_rate numeric;
BEGIN
  -- Same currency = 1.0
  IF p_from_currency = p_to_currency THEN
    RETURN 1.0;
  END IF;
  
  -- Get most recent rate before or on the specified date
  SELECT rate INTO v_rate
  FROM exchange_rates
  WHERE from_currency = p_from_currency
    AND to_currency = p_to_currency
    AND effective_date <= p_date
  ORDER BY effective_date DESC
  LIMIT 1;
  
  -- If no rate found, raise exception
  IF v_rate IS NULL THEN
    RAISE EXCEPTION 'No exchange rate found for % to % on or before %', 
      p_from_currency, p_to_currency, p_date;
  END IF;
  
  RETURN v_rate;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_exchange_rate IS 
'Returns the most recent exchange rate for a currency pair on or before a specific date.
Raises exception if no rate is found.';

-- Convert amount between currencies
CREATE OR REPLACE FUNCTION convert_currency(
  p_amount numeric,
  p_from_currency text,
  p_to_currency text,
  p_date date DEFAULT CURRENT_DATE
) RETURNS numeric AS $$
DECLARE
  v_rate numeric;
BEGIN
  v_rate := get_exchange_rate(p_from_currency, p_to_currency, p_date);
  RETURN ROUND(p_amount * v_rate, 2);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION convert_currency IS 
'Converts an amount from one currency to another using the exchange rate on a specific date.
Returns rounded result (2 decimal places).';

-- ============================================================================
-- PART 4: FISCAL PERIOD FUNCTIONS
-- ============================================================================

-- Check if date is in closed period
CREATE OR REPLACE FUNCTION is_date_in_closed_period(
  p_organization_id uuid,
  p_date date
) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM fiscal_periods
    WHERE organization_id = p_organization_id
      AND p_date BETWEEN start_date AND end_date
      AND is_closed = true
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION is_date_in_closed_period IS 
'Returns true if the given date falls within a closed fiscal period. 
Use this in triggers to prevent edits to transactions in closed periods.';

-- Get fiscal period for a date
CREATE OR REPLACE FUNCTION get_fiscal_period(
  p_organization_id uuid,
  p_date date
) RETURNS TABLE(
  period_id uuid,
  period_name text,
  period_type text,
  is_closed boolean,
  start_date date,
  end_date date
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    fiscal_periods.period_name,
    fiscal_periods.period_type,
    fiscal_periods.is_closed,
    fiscal_periods.start_date,
    fiscal_periods.end_date
  FROM fiscal_periods
  WHERE organization_id = p_organization_id
    AND p_date BETWEEN fiscal_periods.start_date AND fiscal_periods.end_date
    AND is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_fiscal_period IS 
'Returns the fiscal period that contains a specific date for an organization.';

-- Close fiscal period
CREATE OR REPLACE FUNCTION close_fiscal_period(
  p_period_id uuid,
  p_closed_by uuid,
  p_closing_notes text DEFAULT NULL
) RETURNS boolean AS $$
BEGIN
  UPDATE fiscal_periods
  SET 
    is_closed = true,
    closed_at = now(),
    closed_by = p_closed_by,
    closing_notes = p_closing_notes,
    updated_at = now(),
    updated_by = p_closed_by
  WHERE id = p_period_id
    AND is_closed = false;
  
  IF FOUND THEN
    RETURN true;
  ELSE
    RAISE EXCEPTION 'Period not found or already closed';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION close_fiscal_period IS 
'Closes a fiscal period, preventing future edits to transactions in that period.
Only unclosed periods can be closed. Returns true on success.';

-- Reopen fiscal period (admin only)
CREATE OR REPLACE FUNCTION reopen_fiscal_period(
  p_period_id uuid,
  p_reopened_by uuid,
  p_reason text
) RETURNS boolean AS $$
BEGIN
  UPDATE fiscal_periods
  SET 
    is_closed = false,
    closing_notes = COALESCE(closing_notes, '') || E'\n\nREOPENED: ' || p_reason,
    updated_at = now(),
    updated_by = p_reopened_by
  WHERE id = p_period_id
    AND is_closed = true;
  
  IF FOUND THEN
    RETURN true;
  ELSE
    RAISE EXCEPTION 'Period not found or not closed';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION reopen_fiscal_period IS 
'Reopens a closed fiscal period (admin emergency function). Logs reason in closing_notes.';

-- ============================================================================
-- PART 5: FISCAL PERIOD ENFORCEMENT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION check_fiscal_period_closed()
RETURNS TRIGGER AS $$
DECLARE
  v_transaction_date date;
  v_organization_id uuid;
  v_period_name text;
BEGIN
  -- Get transaction date and organization from the record
  IF TG_OP = 'DELETE' THEN
    v_transaction_date := OLD.payment_date;
    v_organization_id := OLD.organization_id;
  ELSE
    v_transaction_date := NEW.payment_date;
    v_organization_id := NEW.organization_id;
  END IF;
  
  -- Check if date is in closed period
  IF is_date_in_closed_period(v_organization_id, v_transaction_date) THEN
    -- Get period name for error message
    SELECT period_name INTO v_period_name
    FROM fiscal_periods
    WHERE organization_id = v_organization_id
      AND v_transaction_date BETWEEN start_date AND end_date
      AND is_closed = true
    LIMIT 1;
    
    RAISE EXCEPTION 'Cannot modify transaction in closed fiscal period "%". Date: %. Contact admin to reopen period.', 
      v_period_name, v_transaction_date;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_fiscal_period_closed IS
'Trigger function that prevents modifications to transactions in closed fiscal periods.
Raises exception with helpful error message if attempting to edit/delete records in locked periods.';

-- Apply trigger to payments table
DROP TRIGGER IF EXISTS prevent_closed_period_edits ON payments;
CREATE TRIGGER prevent_closed_period_edits
  BEFORE UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION check_fiscal_period_closed();

-- Apply trigger to transactions table (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions') THEN
    DROP TRIGGER IF EXISTS prevent_closed_period_edits ON transactions;
    CREATE TRIGGER prevent_closed_period_edits
      BEFORE UPDATE OR DELETE ON transactions
      FOR EACH ROW EXECUTE FUNCTION check_fiscal_period_closed();
  END IF;
END $$;

-- ============================================================================
-- PART 6: RLS POLICIES
-- ============================================================================

-- Exchange rates: Public read (for currency conversion)
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exchange_rates_select" ON exchange_rates
  FOR SELECT TO public
  USING (true);

CREATE POLICY "exchange_rates_insert" ON exchange_rates
  FOR INSERT TO public
  WITH CHECK (auth.uid() IS NOT NULL);

-- Fiscal periods: Members can view, admins can modify
ALTER TABLE fiscal_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fiscal_periods_select" ON fiscal_periods
  FOR SELECT TO public
  USING (is_org_member(organization_id));

CREATE POLICY "fiscal_periods_insert" ON fiscal_periods
  FOR INSERT TO public
  WITH CHECK (is_org_admin(organization_id));

CREATE POLICY "fiscal_periods_update" ON fiscal_periods
  FOR UPDATE TO public
  USING (is_org_admin(organization_id))
  WITH CHECK (is_org_admin(organization_id));

CREATE POLICY "fiscal_periods_delete" ON fiscal_periods
  FOR DELETE TO public
  USING (is_org_admin(organization_id));

-- ============================================================================
-- PART 7: SEED DATA - COMMON EXCHANGE RATES
-- ============================================================================
-- Pre-populate with some common currency pairs
-- In production, these should be updated daily via API
-- ============================================================================

INSERT INTO exchange_rates (from_currency, to_currency, rate, effective_date, source)
VALUES 
  -- EUR conversions
  ('EUR', 'USD', 1.0956, CURRENT_DATE, 'manual_seed'),
  ('EUR', 'GBP', 0.8532, CURRENT_DATE, 'manual_seed'),
  ('EUR', 'BRL', 5.3421, CURRENT_DATE, 'manual_seed'),
  
  -- USD conversions
  ('USD', 'EUR', 0.9128, CURRENT_DATE, 'manual_seed'),
  ('USD', 'GBP', 0.7789, CURRENT_DATE, 'manual_seed'),
  ('USD', 'BRL', 4.8756, CURRENT_DATE, 'manual_seed'),
  
  -- GBP conversions
  ('GBP', 'EUR', 1.1721, CURRENT_DATE, 'manual_seed'),
  ('GBP', 'USD', 1.2839, CURRENT_DATE, 'manual_seed'),
  ('GBP', 'BRL', 6.2614, CURRENT_DATE, 'manual_seed')
ON CONFLICT (from_currency, to_currency, effective_date) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Financial tables migration completed successfully';
  RAISE NOTICE '💱 Exchange rates table created with % currency pairs', 
    (SELECT COUNT(DISTINCT from_currency || to_currency) FROM exchange_rates);
  RAISE NOTICE '📅 Fiscal periods table ready for accounting period management';
  RAISE NOTICE '🔒 Period closing triggers applied to payments table';
  RAISE NOTICE '💡 Use get_exchange_rate() and convert_currency() for conversions';
  RAISE NOTICE '💡 Use close_fiscal_period() to lock accounting periods';
END $$;
