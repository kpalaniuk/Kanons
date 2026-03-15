-- Add structured income detail fields to pph_clients
-- Stores income sub-fields as JSONB, keyed by income type

ALTER TABLE pph_clients
  ADD COLUMN IF NOT EXISTS b1_income_details jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS b2_income_details jsonb DEFAULT '{}'::jsonb;
