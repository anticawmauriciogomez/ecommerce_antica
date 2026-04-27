-- Update reservations table to include new fields for multi-step form
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS pre_order TEXT,
ADD COLUMN IF NOT EXISTS space_preference TEXT;
