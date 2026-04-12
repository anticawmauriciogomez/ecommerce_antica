-- init_admin_tables.sql

-- 1. Create the `orders` (pedidos) table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We might want order_items, but keeping it simple for now, assuming orders is what user expects.

-- Enable Row Level Security (RLS) on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow completely public inserts to orders (like a checkout from storefront)
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) to read/update all orders
CREATE POLICY "Allow authenticated read access on orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update on orders" ON public.orders FOR UPDATE TO authenticated USING (true);


-- 2. Create the `admin_config` table
CREATE TABLE IF NOT EXISTS public.admin_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on admin_config
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admins) can access/modify config
CREATE POLICY "Allow authenticated full access on admin_config" ON public.admin_config AS PERMISSIVE FOR ALL TO authenticated USING (true);

-- Insert dummy default settings
INSERT INTO public.admin_config (key, value, description)
VALUES 
    ('store_settings', '{"currency": "USD", "maintenance_mode": false}', 'General store settings');

