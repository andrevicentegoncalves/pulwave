-- ============================================================================
-- PulWave Profiles System - Backup & Verification Script
-- ============================================================================
-- Version: 3.0.0
-- Date: December 14, 2025
-- 
-- RUN THIS SCRIPT BEFORE profiles_migration_v3.sql
-- ============================================================================

-- ============================================================================
-- PHASE 1: CREATE BACKUP SCHEMA
-- ============================================================================

-- Create backup schema
DROP SCHEMA IF EXISTS backup_profiles_v3 CASCADE;
CREATE SCHEMA backup_profiles_v3;

DO $$ BEGIN RAISE NOTICE 'Created backup schema: backup_profiles_v3'; END $$;

-- ============================================================================
-- PHASE 2: BACKUP ALL AFFECTED TABLES
-- ============================================================================

-- Backup profiles
CREATE TABLE backup_profiles_v3.profiles AS 
SELECT * FROM profiles;

DO $$ BEGIN RAISE NOTICE 'Backed up profiles: % rows', (SELECT COUNT(*) FROM backup_profiles_v3.profiles); END $$;

-- Backup user_preferences
CREATE TABLE backup_profiles_v3.user_preferences AS 
SELECT * FROM user_preferences;

DO $$ BEGIN RAISE NOTICE 'Backed up user_preferences: % rows', (SELECT COUNT(*) FROM backup_profiles_v3.user_preferences); END $$;

-- Backup profile_preferences
CREATE TABLE backup_profiles_v3.profile_preferences AS 
SELECT * FROM profile_preferences;

DO $$ BEGIN RAISE NOTICE 'Backed up profile_preferences: % rows', (SELECT COUNT(*) FROM backup_profiles_v3.profile_preferences); END $$;

-- Backup contacts
CREATE TABLE backup_profiles_v3.contacts AS 
SELECT * FROM contacts;

DO $$ BEGIN RAISE NOTICE 'Backed up contacts: % rows', (SELECT COUNT(*) FROM backup_profiles_v3.contacts); END $$;

-- Backup addresses
CREATE TABLE backup_profiles_v3.addresses AS 
SELECT * FROM addresses;

DO $$ BEGIN RAISE NOTICE 'Backed up addresses: % rows', (SELECT COUNT(*) FROM backup_profiles_v3.addresses); END $$;

-- Backup organization_members
CREATE TABLE backup_profiles_v3.organization_members AS 
SELECT * FROM organization_members;

DO $$ BEGIN RAISE NOTICE 'Backed up organization_members: % rows', (SELECT COUNT(*) FROM backup_profiles_v3.organization_members); END $$;

-- ============================================================================
-- PHASE 3: RECORD PRE-MIGRATION STATE
-- ============================================================================

-- Create state snapshot table
CREATE TABLE backup_profiles_v3._migration_state (
    metric_name TEXT PRIMARY KEY,
    metric_value BIGINT,
    captured_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO backup_profiles_v3._migration_state (metric_name, metric_value) VALUES
    ('profiles_total', (SELECT COUNT(*) FROM profiles)),
    ('profiles_with_phone', (SELECT COUNT(*) FROM profiles WHERE phone_number IS NOT NULL)),
    ('profiles_with_emergency', (SELECT COUNT(*) FROM profiles WHERE emergency_contact_phone IS NOT NULL)),
    ('profiles_with_auth_user', (SELECT COUNT(*) FROM profiles WHERE auth_user_id IS NOT NULL)),
    ('profiles_active', (SELECT COUNT(*) FROM profiles WHERE is_active = true)),
    ('user_preferences_total', (SELECT COUNT(*) FROM user_preferences)),
    ('profile_preferences_total', (SELECT COUNT(*) FROM profile_preferences)),
    ('contacts_total', (SELECT COUNT(*) FROM contacts)),
    ('contacts_phone_types', (SELECT COUNT(*) FROM contacts WHERE contact_type LIKE 'phone%')),
    ('addresses_total', (SELECT COUNT(*) FROM addresses)),
    ('organization_members_total', (SELECT COUNT(*) FROM organization_members));

DO $$ BEGIN RAISE NOTICE 'Recorded pre-migration state metrics'; END $$;

-- ============================================================================
-- PHASE 4: VERIFICATION QUERIES
-- ============================================================================

-- Display current state
SELECT 
    '============================================' as "========================================";
SELECT 'PRE-MIGRATION STATE' as "Status";
SELECT 
    '============================================' as "========================================";

SELECT metric_name, metric_value 
FROM backup_profiles_v3._migration_state 
ORDER BY metric_name;

-- Check for potential issues
SELECT 
    '============================================' as "========================================";
SELECT 'POTENTIAL ISSUES' as "Status";
SELECT 
    '============================================' as "========================================";

-- Orphaned profiles (no auth_user_id)
SELECT 'Orphaned profiles (NULL auth_user_id)' as issue, COUNT(*) as count
FROM profiles WHERE auth_user_id IS NULL

UNION ALL

-- Duplicate preferences
SELECT 'Duplicate user_preferences' as issue, COUNT(*) as count
FROM (
    SELECT profile_id, organization_id
    FROM user_preferences
    GROUP BY profile_id, organization_id
    HAVING COUNT(*) > 1
) dups

UNION ALL

-- Duplicate profile_preferences
SELECT 'Duplicate profile_preferences' as issue, COUNT(*) as count
FROM (
    SELECT profile_id, organization_id
    FROM profile_preferences
    GROUP BY profile_id, organization_id
    HAVING COUNT(*) > 1
) dups

UNION ALL

-- Profiles without organization membership
SELECT 'Profiles without org membership' as issue, COUNT(*) as count
FROM profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM organization_members om WHERE om.profile_id = p.id
);

-- ============================================================================
-- BACKUP COMPLETE
-- ============================================================================

SELECT 
    '============================================' as "========================================";
SELECT 'BACKUP COMPLETE' as "Status";
SELECT 'Ready to run profiles_migration_v3.sql' as "Next Step";
SELECT 
    '============================================' as "========================================";