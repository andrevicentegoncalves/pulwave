-- Inspect triggers on profiles table
SELECT 
    event_object_table as table_name,
    trigger_name,
    event_manipulation as event,
    action_statement as definition,
    action_timing as timing
FROM information_schema.triggers
WHERE event_object_table = 'profiles';
