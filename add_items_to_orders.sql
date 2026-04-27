
-- Add items JSONB column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
