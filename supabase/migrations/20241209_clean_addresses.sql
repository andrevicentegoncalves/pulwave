-- Clean up all addresses to start fresh
TRUNCATE TABLE public.addresses RESTART IDENTITY CASCADE;

-- Ensure profiles address links are reset (though not strictly needed if we don't rely on them, but good for consistency)
UPDATE public.profiles 
SET address_id = NULL, billing_address_id = NULL;
