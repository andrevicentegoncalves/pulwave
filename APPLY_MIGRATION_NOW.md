# URGENT: Database Migration Required!

## The Problem
The legal documents features won't work because the `legal_documents` table doesn't exist in your database yet.

## Solution: Apply the Migration

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the ENTIRE contents of `supabase/migrations/34_create_legal_documents.sql`
5. Paste into the SQL editor
6. Click "Run" or press Ctrl+Enter
7. Refresh your app - it should work now!

### Option 2: Local Development (Requires Docker)
1. Start Docker Desktop
2. Run: `npx supabase db reset`
3. Wait for it to complete
4. Refresh your app

## How to Verify It Worked
After running the migration, open your browser console (F12) and check:
- No errors about "relation legal_documents does not exist"
- The modals should show actual content (not just "Loading...")
- Clicking "Accept" should update the UI immediately

## Current Status
- ✅ Migration file created: `supabase/migrations/34_create_legal_documents.sql`
- ✅ Frontend code updated
- ❌ Migration NOT applied to database yet ← **THIS IS THE ISSUE**
