
-- Script to ensure reservations table exists and has correct RLS policies
-- Run this in the Supabase SQL Editor

-- 1. Create the `reservations` table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INTEGER NOT NULL DEFAULT 1,
    pre_order TEXT,
    space_preference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add columns if they were missing (from previous updates)
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS pre_order TEXT;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS space_preference TEXT;

-- 3. Enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public insert to reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow authenticated read access on reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow authenticated update on reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow authenticated full access on reservations" ON public.reservations;

-- 5. Create policies
-- Allow public inserts (needed for the storefront form to work)
CREATE POLICY "Allow public insert to reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users (admins) to see all reservations
CREATE POLICY "Allow authenticated read access on reservations" 
ON public.reservations 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users (admins) to update/delete reservations
CREATE POLICY "Allow authenticated full access on reservations" 
ON public.reservations 
FOR ALL 
TO authenticated 
USING (true);
