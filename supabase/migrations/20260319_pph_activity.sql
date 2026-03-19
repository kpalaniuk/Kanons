-- PPH Activity Log table
-- Run this in the Supabase dashboard for project mqxmvwbzghbzqmeamqtu
-- URL: https://supabase.com/dashboard/project/mqxmvwbzghbzqmeamqtu/editor

CREATE TABLE IF NOT EXISTS pph_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  client_name text NOT NULL DEFAULT '',
  field text NOT NULL,
  old_value text,
  new_value text,
  changed_by text NOT NULL DEFAULT '',
  ts timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pph_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON pph_activity
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_pph_activity_client
  ON pph_activity (client_id, ts DESC);
