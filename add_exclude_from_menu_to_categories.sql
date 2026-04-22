-- Add exclude_from_menu field to categories table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS exclude_from_menu BOOLEAN DEFAULT FALSE;

-- Update existing categories to have exclude_from_menu = false if null
UPDATE public.categories SET exclude_from_menu = FALSE WHERE exclude_from_menu IS NULL;