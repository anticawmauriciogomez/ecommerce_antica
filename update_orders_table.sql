
-- Add checkout fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_address TEXT,
ADD COLUMN IF NOT EXISTS customer_document_type TEXT,
ADD COLUMN IF NOT EXISTS customer_document_id TEXT;
