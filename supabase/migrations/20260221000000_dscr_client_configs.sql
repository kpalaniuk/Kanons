-- DSCR Client Configurations
-- Stores client-specific rate sheets and LO information for dynamic DSCR calculators

CREATE TABLE IF NOT EXISTS public.dscr_client_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Client info
  client_name TEXT NOT NULL,
  client_slug TEXT UNIQUE NOT NULL, -- URL-friendly (e.g., 'pamela', 'john-smith')
  client_fico INTEGER,
  
  -- Rate sheet data (parsed CSV/JSON)
  rate_sheet_data JSONB DEFAULT '{}'::jsonb,
  -- Expected structure:
  -- {
  --   "rates": [
  --     { "ltv_min": 0, "ltv_max": 70, "fico_min": 720, "fico_max": 739, "standard_rate": 7.25, "io_adjustment": 0.125 },
  --     ...
  --   ]
  -- }
  
  -- Loan Officer info
  lo_name TEXT NOT NULL DEFAULT 'Kyle Palaniuk',
  lo_nmls TEXT NOT NULL DEFAULT '984138',
  lo_phone TEXT NOT NULL DEFAULT '619-777-5700',
  lo_email TEXT NOT NULL DEFAULT 'kyle@planpreparehome.com',
  
  -- Meta
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.dscr_client_configs ENABLE ROW LEVEL SECURITY;

-- Public read access for active configs (calculator needs to fetch)
CREATE POLICY "dscr_configs_public_read" ON public.dscr_client_configs
  FOR SELECT USING (active = TRUE);

-- Authenticated users can manage configs
CREATE POLICY "dscr_configs_auth_all" ON public.dscr_client_configs
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Service role bypass
CREATE POLICY "dscr_configs_service_role" ON public.dscr_client_configs
  FOR ALL USING (auth.role() = 'service_role');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_dscr_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dscr_configs_updated_at
  BEFORE UPDATE ON public.dscr_client_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_dscr_configs_updated_at();

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_dscr_client_configs_slug ON public.dscr_client_configs(client_slug);

-- Seed Pamela's config
INSERT INTO public.dscr_client_configs (client_name, client_slug, client_fico, lo_name, lo_nmls, lo_phone, lo_email, rate_sheet_data)
VALUES (
  'Pamela Moore',
  'pamela',
  726,
  'Kyle Palaniuk',
  '984138',
  '619-777-5700',
  'kyle@planpreparehome.com',
  '{
    "rates": [
      {"ltv_min": 0, "ltv_max": 70, "fico_min": 720, "fico_max": 739, "standard_rate": 7.125, "io_adjustment": 0.125},
      {"ltv_min": 70, "ltv_max": 75, "fico_min": 720, "fico_max": 739, "standard_rate": 7.25, "io_adjustment": 0.125},
      {"ltv_min": 75, "ltv_max": 80, "fico_min": 720, "fico_max": 739, "standard_rate": 7.375, "io_adjustment": 0.125},
      {"ltv_min": 80, "ltv_max": 85, "fico_min": 720, "fico_max": 739, "standard_rate": 7.5, "io_adjustment": 0.125},
      {"ltv_min": 85, "ltv_max": 100, "fico_min": 720, "fico_max": 739, "standard_rate": 7.625, "io_adjustment": 0.125}
    ]
  }'::jsonb
)
ON CONFLICT (client_slug) DO NOTHING;
