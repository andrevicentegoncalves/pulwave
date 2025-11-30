-- ============================================================================
-- PARTITIONING IMPLEMENTATION
-- ============================================================================
-- Migration: 025_partition_activity_log.sql
-- Description: Converts activity_log into a partitioned table by month
-- Author: Pulwave DBA Team
-- Date: 2025-11-29
-- ============================================================================

-- 1. Rename existing table to backup
ALTER TABLE activity_log RENAME TO activity_log_legacy;

-- 1b. Rename constraints and indexes to free up names
ALTER TABLE activity_log_legacy RENAME CONSTRAINT activity_log_pkey TO activity_log_legacy_pkey;
ALTER INDEX IF EXISTS idx_activity_log_org_created RENAME TO idx_activity_log_legacy_org_created;
ALTER INDEX IF EXISTS idx_activity_log_entity RENAME TO idx_activity_log_legacy_entity;
ALTER INDEX IF EXISTS idx_activity_log_action RENAME TO idx_activity_log_legacy_action;
ALTER INDEX IF EXISTS idx_activity_log_user RENAME TO idx_activity_log_legacy_user;

-- 2. Create the new PARTITIONED table
-- Note: Must include the partition key (created_at) in the primary key
CREATE TABLE activity_log (
    id uuid DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL,
    user_id uuid,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    description text,
    old_values jsonb,
    new_values jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    is_active boolean DEFAULT true NOT NULL,
    
    -- Primary key must include the partition key
    CONSTRAINT activity_log_pkey PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- 3. Re-create Indexes (applied to all partitions automatically)
CREATE INDEX idx_activity_log_org_created ON activity_log(organization_id, created_at DESC);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_action ON activity_log(action);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);

-- 4. Create Partitions
-- Default partition (for bad dates or future dates not yet created)
CREATE TABLE activity_log_default PARTITION OF activity_log DEFAULT;

-- Current and next month partitions
CREATE TABLE activity_log_2024_11 PARTITION OF activity_log 
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

CREATE TABLE activity_log_2024_12 PARTITION OF activity_log 
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

CREATE TABLE activity_log_2025_01 PARTITION OF activity_log 
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 5. Migrate Data
-- Move data from legacy table to new partitioned table
INSERT INTO activity_log (
    id, organization_id, user_id, action, entity_type, entity_id, 
    description, old_values, new_values, ip_address, user_agent, 
    created_at, updated_at, created_by, updated_by, is_active
)
SELECT 
    id, organization_id, user_id, action, entity_type, entity_id, 
    description, old_values, new_values, ip_address, user_agent, 
    created_at, updated_at, created_by, updated_by, is_active
FROM activity_log_legacy;

-- 6. Cleanup
-- Once verified, you can drop the legacy table
-- DROP TABLE activity_log_legacy;

-- ============================================================================
-- PARTITION MANAGEMENT FUNCTION
-- ============================================================================
-- Function to automatically create next month's partition
-- Can be called by pg_cron or a scheduled job

CREATE OR REPLACE FUNCTION create_next_month_partition(p_table_name text)
RETURNS void AS $$
DECLARE
  v_next_month date;
  v_partition_name text;
  v_start_date text;
  v_end_date text;
BEGIN
  -- Calculate next month
  v_next_month := date_trunc('month', NOW() + INTERVAL '1 month');
  
  -- Construct partition name: table_YYYY_MM
  v_partition_name := p_table_name || '_' || to_char(v_next_month, 'YYYY_MM');
  
  -- Define range
  v_start_date := to_char(v_next_month, 'YYYY-MM-DD');
  v_end_date := to_char(v_next_month + INTERVAL '1 month', 'YYYY-MM-DD');
  
  -- Create partition if it doesn't exist
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
    v_partition_name, p_table_name, v_start_date, v_end_date
  );
  
  RAISE NOTICE 'Created partition %', v_partition_name;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION create_next_month_partition IS
'Creates a new partition for the specified table for the upcoming month.';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Activity Log partitioning applied successfully';
  RAISE NOTICE '📊 Data migrated from legacy table';
  RAISE NOTICE '📅 Partitions created for Nov 2024, Dec 2024, Jan 2025';
  RAISE NOTICE '🛠 Use create_next_month_partition(''activity_log'') to maintain partitions';
END $$;
