-- Add liabilities JSONB column to pph_clients
-- Stores structured monthly debts: auto, student, credit cards, other installments

ALTER TABLE pph_clients
  ADD COLUMN IF NOT EXISTS liabilities jsonb DEFAULT '[]'::jsonb;
