CREATE TABLE IF NOT EXISTS pipeline_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_client_id text NOT NULL,
  client_name text NOT NULL DEFAULT '',
  text text NOT NULL DEFAULT '',
  ts timestamptz DEFAULT now()
);

ALTER TABLE pipeline_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Service role full access" ON pipeline_activity_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_pipeline_activity_client
  ON pipeline_activity_logs (notion_client_id, ts DESC);
