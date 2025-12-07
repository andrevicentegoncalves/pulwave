-- =============================================================================
-- Migration: Rename emergency_relationship enum to relationship
-- Date: 2024-12-05
-- Purpose: Make the relationship enum generic (not just for emergencies)
-- =============================================================================

-- Note: PostgreSQL doesn't support directly renaming enum types easily.
-- We need to create a new type and migrate the data.

-- Step 1: Create the new enum type with same values
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relationship') THEN
        CREATE TYPE relationship AS ENUM (
            'spouse',
            'partner', 
            'parent',
            'child',
            'sibling',
            'grandparent',
            'grandchild',
            'aunt-uncle',
            'niece-nephew',
            'cousin',
            'friend',
            'colleague',
            'neighbor',
            'caregiver',
            'legal-guardian',
            'other'
        );
    END IF;
END $$;

-- Step 2: Find and update all columns using emergency_relationship
-- This is done in a separate transaction for safety

-- For emergency_contacts table (if it exists)
DO $$
DECLARE
    col_exists boolean;
BEGIN
    -- Check if emergency_contacts table has a relationship column using emergency_relationship
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'emergency_contacts' 
        AND column_name = 'relationship'
        AND table_schema = 'public'
    ) INTO col_exists;

    IF col_exists THEN
        -- Add a new column with the new type
        ALTER TABLE emergency_contacts 
        ADD COLUMN IF NOT EXISTS relationship_new relationship;
        
        -- Copy data (casting through text)
        UPDATE emergency_contacts 
        SET relationship_new = relationship::text::relationship
        WHERE relationship IS NOT NULL;
        
        -- Drop the old column and rename the new one
        ALTER TABLE emergency_contacts DROP COLUMN IF EXISTS relationship;
        ALTER TABLE emergency_contacts RENAME COLUMN relationship_new TO relationship;
    END IF;
END $$;

-- Step 3: Drop the old enum type if no longer in use
-- Only do this after verifying no columns use it
DO $$
DECLARE
    usage_count integer;
BEGIN
    -- Count columns still using emergency_relationship
    SELECT COUNT(*) INTO usage_count
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_type t ON a.atttypid = t.oid
    WHERE t.typname = 'emergency_relationship'
    AND c.relkind = 'r';
    
    IF usage_count = 0 THEN
        DROP TYPE IF EXISTS emergency_relationship;
    END IF;
END $$;

-- Add comment documenting the enum
COMMENT ON TYPE relationship IS 'Generic relationship types for contacts (spouse, parent, friend, etc.)';
