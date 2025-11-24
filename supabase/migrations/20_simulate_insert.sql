-- ============================================================================
-- SIMULATE PROFILE INSERTION (DEBUGGING)
-- ============================================================================
-- This script attempts to insert a profile exactly like the trigger does.
-- This allows us to see the specific error message if it fails.

DO $$
DECLARE
    fake_user_id UUID := gen_random_uuid();
    fake_email TEXT := 'debug_test_' || floor(random() * 1000)::text || '@example.com';
BEGIN
    RAISE NOTICE 'Attempting to insert profile for user % (%s)...', fake_user_id, fake_email;

    -- 1. Try the INSERT exactly as the trigger does
    INSERT INTO public.profiles (auth_user_id, first_name, last_name, email)
    VALUES (
        fake_user_id, 
        'Debug', 
        'User', 
        fake_email
    );

    RAISE NOTICE '✅ SUCCESS: Profile inserted successfully.';
    
    -- Cleanup (optional, to keep DB clean)
    -- DELETE FROM public.profiles WHERE auth_user_id = fake_user_id;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ FAILURE: %', SQLERRM;
    RAISE NOTICE '   Detail: %', SQLSTATE;
END $$;
