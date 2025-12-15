-- ============================================================================
-- Migration: Add AI Embeddings to Profiles
-- Date: 2024-12-14
-- Description: Add vector embedding column for AI-powered features
--              Requires pgvector extension
-- ============================================================================

BEGIN;

-- ============================================================================
-- ENABLE pgvector EXTENSION (if not already enabled)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- ADD AI COLUMNS TO PROFILES
-- ============================================================================

-- Vector embedding for AI similarity search (1536 = OpenAI embedding dimension)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_profile_embedding VECTOR(1536);

-- Track when profile was last analyzed by AI
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_last_analyzed_at TIMESTAMPTZ;

-- AI-generated summary/insights
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- ============================================================================
-- ADD AI COLUMNS TO USER_PREFERENCES
-- ============================================================================

-- AI personalization preferences (if not already exists from earlier migration)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_preferences' AND column_name = 'ai_content_preferences'
    ) THEN
        ALTER TABLE user_preferences ADD COLUMN ai_content_preferences JSONB DEFAULT '{}'::JSONB;
    END IF;
END $$;

-- AI learning/interaction preferences
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS ai_learning_enabled BOOLEAN DEFAULT true;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS ai_suggestions_enabled BOOLEAN DEFAULT true;

-- ============================================================================
-- INDEXES FOR AI QUERIES
-- ============================================================================

-- Vector similarity search index (using IVFFlat for performance)
-- Note: Uncomment after inserting some initial embeddings
-- CREATE INDEX idx_profiles_ai_embedding ON profiles 
--     USING ivfflat (ai_profile_embedding vector_cosine_ops)
--     WITH (lists = 100);

CREATE INDEX idx_profiles_ai_analyzed ON profiles(ai_last_analyzed_at) 
    WHERE ai_last_analyzed_at IS NOT NULL;

COMMIT;
