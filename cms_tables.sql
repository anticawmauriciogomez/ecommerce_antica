-- cms_tables.sql

-- 1. Create table for holding flexible CMS content
CREATE TABLE IF NOT EXISTS public.storefront_content (
    id TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Setup Row Level Security (RLS)
ALTER TABLE public.storefront_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access (Storefront will query this)
CREATE POLICY "Public read access for storefront_content"
    ON public.storefront_content FOR SELECT
    USING (true);

-- Allow authenticated users to insert/update/delete (Admin Panel)
CREATE POLICY "Auth all access for storefront_content"
    ON public.storefront_content FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Pre-insert the two generic records we will use (optional but safe)
INSERT INTO public.storefront_content (id, content) VALUES
    ('translations', '{}'::jsonb),
    ('media_registry', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
