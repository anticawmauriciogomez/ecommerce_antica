
-- Add status column to reservations table
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Update RLS policies to ensure authenticated users can update status
-- (Already covered by the 'ALL TO authenticated' policy in previous script, 
-- but good to keep in mind)
