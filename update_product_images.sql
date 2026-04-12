-- update_product_images.sql

-- 1. Add image_gallery as an array of texts. 
-- Products can now have multiple images. We keep image_url as the "primary" or thumbnail, 
-- and image_gallery as the collection of images.
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS image_gallery TEXT[] DEFAULT '{}';

-- 2. Ensure descriptions are stored as JSONB for i18n
ALTER TABLE public.products
-- If description is TEXT, modify it to JSONB (requires recreating column or cast).
-- Assuming it is currently TEXT or not created, let's safely add it:
ADD COLUMN IF NOT EXISTS description JSONB DEFAULT '{}'::jsonb;

-- 3. Create a Supabase Storage Bucket for Products
-- Usually it's better to do this through the Supabase Dashboard UI > Storage > New Bucket,
-- But this is the SQL equivalent:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for Storage (Allow public read, authenticated insert/update/delete)
-- Allow public access to read files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to upload files
CREATE POLICY "Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product-images' );

-- Allow authenticated users to update files
CREATE POLICY "Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to delete files
CREATE POLICY "Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'product-images' );
