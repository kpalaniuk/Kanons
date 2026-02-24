-- Run this once in your Supabase SQL editor
-- Dashboard: https://supabase.com/dashboard/project/mqxmvwbzghbzqmeamqtu/sql

CREATE TABLE IF NOT EXISTS public_pages (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  title       text        NOT NULL,
  href        text        NOT NULL,
  enabled     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- No RLS needed — this is a simple admin-controlled list, not user data
ALTER TABLE public_pages DISABLE ROW LEVEL SECURITY;

-- Allow anon key to read (so the public view can check without service role)
GRANT SELECT ON public_pages TO anon;
GRANT ALL ON public_pages TO service_role;
