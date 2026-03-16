-- Migration: Add structured referral fields to pph_clients
-- Extends the existing referral_source text column with name, date, and type

ALTER TABLE pph_clients
  ADD COLUMN IF NOT EXISTS referral_name text,
  ADD COLUMN IF NOT EXISTS referral_date date,
  ADD COLUMN IF NOT EXISTS referral_type text;
