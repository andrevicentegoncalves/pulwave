-- ==============================================================================
-- FIX BUCKET AND POLICIES
-- Run this script in your Supabase SQL Editor to fix the "Bucket not found" error.
-- ==============================================================================

-- 1. ENSURE BUCKET EXISTS AND IS PUBLIC
-- This will create the bucket if it doesn't exist, OR update it to be public if it does.
insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do update set public = true;

-- 2. STORAGE POLICIES (Drop existing to avoid conflicts, then recreate)
drop policy if exists "Allow authenticated uploads" on storage.objects;
drop policy if exists "Allow public view" on storage.objects;
drop policy if exists "Allow individual update delete" on storage.objects;
drop policy if exists "Allow individual delete" on storage.objects;

-- Allow authenticated users to upload files to 'profile-images' bucket
create policy "Allow authenticated uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'profile-images' );

-- Allow public to view files in 'profile-images' bucket
create policy "Allow public view"
on storage.objects for select
to public
using ( bucket_id = 'profile-images' );

-- Allow users to update/delete their own files
create policy "Allow individual update delete"
on storage.objects for update
to authenticated
using ( bucket_id = 'profile-images' and auth.uid() = owner );

create policy "Allow individual delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'profile-images' and auth.uid() = owner );

-- 3. ADDRESSES TABLE POLICIES
-- Ensure RLS is enabled
alter table public.addresses enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Allow authenticated insert addresses" on public.addresses;
drop policy if exists "Allow authenticated select addresses" on public.addresses;
drop policy if exists "Allow authenticated update addresses" on public.addresses;

-- Recreate policies
create policy "Allow authenticated insert addresses"
on public.addresses for insert
to authenticated
with check (true);

create policy "Allow authenticated select addresses"
on public.addresses for select
to authenticated
using (true);

create policy "Allow authenticated update addresses"
on public.addresses for update
to authenticated
using (true);
